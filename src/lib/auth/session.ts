// ==========================================================
// CREDI MARKETPLACE
// Authentication Session Helpers
// Next.js 16.3 · Supabase
// ==========================================================


import { createServerClient }
from '@/lib/supabase/server';



// ==========================================================
// CURRENT USER
// ==========================================================


export async function getCurrentUser(){


 const supabase =
 await createServerClient();


 const {
  data,
  error
 }
 =
 await supabase.auth.getUser();



 if(error){

  return null;

 }


 return data.user;

}







// ==========================================================
// REQUIRE AUTH
// ==========================================================


export async function requireUser(){


 const user =
 await getCurrentUser();



 if(!user){

  throw new Error(
   'Authentication required'
  );

 }



 return user;

}
