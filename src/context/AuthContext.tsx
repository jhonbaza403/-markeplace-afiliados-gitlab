// ==========================================================
// ARCHIVO: src/context/AuthContext.tsx
// Credi Marketplace
//
// Global Authentication Context
//
// Supabase Auth
// React Context API
// ==========================================================


"use client";


import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";


import type {
  User,
} from "@supabase/supabase-js";


import {
  supabase,
} from "@/lib/supabase/client";




// ==========================================================
// TIPOS
// ==========================================================

interface AuthContextType {

  user: User | null;

  loading: boolean;

  logout: () => Promise<void>;

}




// ==========================================================
// CONTEXT
// ==========================================================

const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined,
  );





// ==========================================================
// PROVIDER
// ==========================================================

export function AuthProvider({

  children,

}: {

  children: React.ReactNode;

}) {


  const [
    user,
    setUser,
  ] =
    useState<User | null>(null);



  const [
    loading,
    setLoading,
  ] =
    useState(true);




  useEffect(() => {


    async function loadSession() {


      const {
        data,
      } =
      await supabase.auth.getUser();



      setUser(
        data.user ?? null,
      );


      setLoading(false);


    }



    loadSession();




    const {

      data: {
        subscription,

      },

    } =
    supabase.auth.onAuthStateChange(

      (
        _event,

        session,

      ) => {


        setUser(

          session?.user
          ??
          null,

        );


      },

    );



    return () => {


      subscription.unsubscribe();


    };


  }, []);





  async function logout() {


    await supabase.auth.signOut();


    setUser(null);


  }





  return (

    <AuthContext.Provider

      value={{

        user,

        loading,

        logout,

      }}

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


  return context;

}
