// ==========================================================
// ARCHIVO: src/lib/supabase/server.ts
// Credi Marketplace
//
// Supabase Server Client
//
// Next.js 16
// App Router
// SSR Authentication
// ==========================================================


import {
  createServerClient,
} from "@supabase/ssr";


import type {
  SupabaseClient,
} from "@supabase/supabase-js";


import {
  cookies,
} from "next/headers";





function getSupabaseUrl(): string {


const url =
process.env.NEXT_PUBLIC_SUPABASE_URL;



if(!url){


throw new Error(
"Falta NEXT_PUBLIC_SUPABASE_URL"
);


}



return url;


}







function getSupabaseKey(): string {


const key =

process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

??

process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;



if(!key){


throw new Error(

"Falta NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"

);


}



return key;


}









export async function createClient()
: Promise<SupabaseClient> {


const cookieStore =
await cookies();




return createServerClient(


getSupabaseUrl(),


getSupabaseKey(),



{


cookies:{



getAll(){


return cookieStore.getAll();


},




setAll(cookiesToSet){



try{


cookiesToSet.forEach(

({

name,

value,

options,

})=>{


cookieStore.set(

name,

value,

options

);


})

);


}


catch{


}


},



},



}


);



}
