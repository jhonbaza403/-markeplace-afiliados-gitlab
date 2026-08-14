import 'server-only'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import {
  hasPermission,
  type Permission,
} from './permissions'
import {
  isRole,
  type Role,
} from './roles'

export type AuthenticatedUser = {
  id: string
  email: string | null
  role: Role
  fullName: string | null
}

export async function getAuthenticatedUser(): Promise<AuthenticatedUser | null> {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return null
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, email, full_name, role, is_active')
    .eq('id', user.id)
    .maybeSingle()

  if (profile?.is_active === false) {
    return null
  }

  const metadataRole =
    user.app_metadata?.role ??
    profile?.role ??
    user.user_metadata?.role

  const role: Role = isRole(metadataRole)
    ? metadataRole
    : 'customer'

  return {
    id: user.id,
    email: user.email ?? null,
    role,
    fullName:
      profile?.full_name ??
      user.user_metadata?.full_name ??
      null,
  }
}

export async function requireUser(): Promise<AuthenticatedUser> {
  const user = await getAuthenticatedUser()

  if (!user) {
    redirect('/auth/login')
  }

  return user
}

export async function requireRole(
  allowedRoles: readonly Role[],
): Promise<AuthenticatedUser> {
  const user = await requireUser()

  if (!allowedRoles.includes(user.role)) {
    redirect('/auth/error?code=forbidden')
  }

  return user
}

export async function requirePermission(
  permission: Permission,
): Promise<AuthenticatedUser> {
  const user = await requireUser()

  if (!hasPermission(user.role, permission)) {
    redirect('/auth/error?code=forbidden')
  }

  return user
}

export async function requireAdmin(): Promise<AuthenticatedUser> {
  return requireRole(['admin'])
}