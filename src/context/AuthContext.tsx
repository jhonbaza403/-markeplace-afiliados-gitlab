// ==========================================================
// ARCHIVO: src/context/AuthContext.tsx
// Credi Marketplace
//
// Global Authentication Context
//
// Supabase Auth
// React Context API
// Next.js 16
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
  createClient,
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


  const [user,setUser] =
    useState<User | null>(null);



  const [loading,setLoading] =
    useState<boolean>(true);



  useEffect(()=>{


    const supabase =
      createClient();



    let mounted = true;



    async function loadSession(){


      try {


        const {
          data,
        } =
        await supabase.auth.getUser();



        if(mounted){

          setUser(
            data.user ?? null,
          );

        }


      }


      catch(error){


        console.error(
          "Error cargando usuario:",
          error,
        );


        if(mounted){

          setUser(null);

        }


      }


      finally{


        if(mounted){

          setLoading(false);

        }


      }


    }



    loadSession();





    const {

      data:{
        subscription,

      },

    } =
    supabase.auth.onAuthStateChange(

      (
        _event,

        session,

      )=>{


        if(mounted){

          setUser(
            session?.user ?? null,
          );

        }


      },

    );





    return ()=>{


      mounted=false;


      subscription.unsubscribe();


    };


  },[]);







  async function logout(){


    const supabase =
      createClient();



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

export function useAuth(){


  const context =
    useContext(AuthContext);



  if(!context){


    throw new Error(

      "useAuth debe utilizarse dentro de AuthProvider",

    );


  }



  return context;


}
