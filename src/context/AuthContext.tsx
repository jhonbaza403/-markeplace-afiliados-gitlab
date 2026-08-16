"use client";

// ==========================================================
// ARCHIVO: src/context/AuthContext.tsx
// Credi Marketplace
//
// Contexto global de autenticación
//
// Next.js App Router
// TypeScript
// Supabase Auth
// ==========================================================

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type {
  Session,
  User,
} from "@supabase/supabase-js";

import {
  supabaseClient,
} from "@/lib/supabase/client";


// ==========================================================
// TIPOS
// ==========================================================

export type UserRole =
  | "admin"
  | "seller"
  | "affiliate"
  | "customer"
  | "user";


export interface AuthUser extends User {
  role?: UserRole;
}


export interface AuthContextValue {

  user: AuthUser | null;

  session: Session | null;

  loading: boolean;

  isAuthenticated: boolean;

  role: UserRole | null;

  signIn(
    email: string,
    password: string,
  ): Promise<{
    error: Error | null;
  }>;

  signUp(
    email: string,
    password: string,
  ): Promise<{
    error: Error | null;
  }>;

  signOut(): Promise<void>;

  refreshSession(): Promise<void>;
}


// ==========================================================
// CONTEXT
// ==========================================================

const AuthContext =
  createContext<AuthContextValue | undefined>(
    undefined,
  );


// ==========================================================
// PROVIDER
// ==========================================================

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {

  const [
    session,
    setSession,
  ] = useState<Session | null>(null);


  const [
    user,
    setUser,
  ] = useState<AuthUser | null>(null);


  const [
    loading,
    setLoading,
  ] = useState(true);



  // --------------------------------------------------------
  // Inicialización sesión
  // --------------------------------------------------------

  useEffect(() => {

    let mounted = true;


    async function loadSession() {

      const {
        data,
        error,
      } =
        await supabaseClient.auth.getSession();


      if (!mounted) return;


      if (error) {

        setSession(null);
        setUser(null);

      } else {

        const currentSession =
          data.session;


        setSession(
          currentSession,
        );


        setUser(
          currentSession?.user
            ? currentSession.user as AuthUser
            : null,
        );

      }


      setLoading(false);

    }


    loadSession();



    const {
      data:
      {
        subscription,
      },
    } =
      supabaseClient.auth.onAuthStateChange(
        (
          _event,
          currentSession,
        ) => {


          setSession(
            currentSession,
          );


          setUser(
            currentSession?.user
              ? currentSession.user as AuthUser
              : null,
          );

        },
      );



    return () => {

      mounted = false;

      subscription.unsubscribe();

    };


  }, []);





  // --------------------------------------------------------
  // Login
  // --------------------------------------------------------

  async function signIn(
    email: string,
    password: string,
  ) {

    const {
      error,
    } =
      await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });


    return {
      error: error
        ? new Error(error.message)
        : null,
    };

  }





  // --------------------------------------------------------
  // Registro
  // --------------------------------------------------------

  async function signUp(
    email: string,
    password: string,
  ) {

    const {
      error,
    } =
      await supabaseClient.auth.signUp({
        email,
        password,
      });


    return {
      error: error
        ? new Error(error.message)
        : null,
    };

  }





  // --------------------------------------------------------
  // Logout
  // --------------------------------------------------------

  async function signOut() {

    await supabaseClient.auth.signOut();

    setSession(null);

    setUser(null);

  }





  // --------------------------------------------------------
  // Refresh sesión
  // --------------------------------------------------------

  async function refreshSession() {

    const {
      data,
    } =
      await supabaseClient.auth.refreshSession();


    setSession(
      data.session,
    );


    setUser(
      data.session?.user
        ? data.session.user as AuthUser
        : null,
    );

  }





  const role =
    (user?.role ?? null) as UserRole | null;



  const value =
    useMemo<AuthContextValue>(
      () => ({

        user,

        session,

        loading,

        isAuthenticated:
          Boolean(user),


        role,


        signIn,

        signUp,

        signOut,

        refreshSession,

      }),

      [
        user,
        session,
        loading,
        role,
      ],
    );



  return (

    <AuthContext.Provider
      value={value}
    >

      {children}

    </AuthContext.Provider>

  );

}


// ==========================================================
// HOOK
// ==========================================================

export function useAuth() {

  const context =
    useContext(
      AuthContext,
    );


  if (!context) {

    throw new Error(
      "useAuth debe utilizarse dentro de AuthProvider",
    );

  }


  return context;

}
