// ==========================================================
// ARCHIVO: src/lib/auth/guards.ts
// Credi Marketplace
//
// Route Guards / Authorization Layer
//
// RBAC Security
//
// Next.js App Router
// ==========================================================


import {
  redirect,
} from "next/navigation";


import {
  getCurrentUser,
} from "./session";


import {
  hasPermission,
  type Permission,
} from "./permissions";


import {
  isValidRole,
  type UserRole,
} from "./roles";




// ==========================================================
// REQUIRE AUTHENTICATED USER
// ==========================================================

export async function requireAuth() {


  const user =
    await getCurrentUser();



  if (!user) {

    redirect(
      "/login",
    );

  }



  return user;

}




// ==========================================================
// REQUIRE ROLE
// ==========================================================

export async function requireRole(

  requiredRole: UserRole,

) {


  const user =
    await requireAuth();



  const role =
    user.role;



  if (
    !isValidRole(role)
  ) {

    redirect(
      "/unauthorized",
    );

  }



  if (
    role !== requiredRole &&
    role !== "admin"
  ) {

    redirect(
      "/unauthorized",
    );

  }



  return user;

}




// ==========================================================
// REQUIRE PERMISSION
// ==========================================================

export async function requirePermission(

  permission: Permission,

) {


  const user =
    await requireAuth();



  const role =
    user.role;



  if (
    !isValidRole(role)
  ) {

    redirect(
      "/unauthorized",
    );

  }



  if (
    !hasPermission(
      role,
      permission,
    )
  ) {

    redirect(
      "/unauthorized",
    );

  }



  return user;

}




// ==========================================================
// CHECK AUTH (SIN REDIRECT)
// ==========================================================

export async function checkAuth() {


  const user =
    await getCurrentUser();


  return Boolean(
    user,
  );

}
