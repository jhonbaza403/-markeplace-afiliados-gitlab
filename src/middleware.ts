// ==========================================================
// ARCHIVO:
// src/middleware.ts
//
// Credi Marketplace
//
// Middleware global de autenticación
//
// Next.js 16
// Supabase SSR
//
// Responsabilidades:
// - Renovar sesión.
// - Proteger dashboards.
// - Controlar acceso por roles.
// ==========================================================


import {
  NextResponse,
  type NextRequest,
} from "next/server";


import {
  createServerClient,
} from "@supabase/ssr";





// ==========================================================
// ACTUALIZAR SESIÓN SUPABASE
// ==========================================================


async function updateSession(
  request: NextRequest,
) {


let response =
NextResponse.next({
  request,
});




const supabase =
createServerClient(


process.env
.NEXT_PUBLIC_SUPABASE_URL!,


process.env
.NEXT_PUBLIC_SUPABASE_ANON_KEY!,


{


cookies:{


getAll(){


return request.cookies.getAll();


},



setAll(cookiesToSet){


cookiesToSet.forEach(
({
name,
value,
options,
})=>{


request.cookies.set(
name,
value,
);


response.cookies.set(
name,
value,
options,
);


},

);


},


},


},

);






const {

data:{
user,

},

}

=
await supabase.auth.getUser();





return {

supabase,

user,

response,

};


}







// ==========================================================
// MIDDLEWARE
// ==========================================================


export async function middleware(
request: NextRequest,
){



const {

user,

response,

}

=
await updateSession(
request,
);




const pathname =
request.nextUrl.pathname;






// ========================================================
// RUTAS PROTEGIDAS
// ========================================================


const protectedRoutes = [

"/dashboard/admin",

"/dashboard/vendor",

"/dashboard/customer",

];





const requiresAuth =
protectedRoutes.some(
(route)=>
pathname.startsWith(route),
);






// ========================================================
// SIN SESIÓN
// ========================================================


if(
requiresAuth
&&
!user
){


const url =
request.nextUrl.clone();


url.pathname =
"/login";


return NextResponse.redirect(
url,
);


}







// ========================================================
// CONTINUAR
// ========================================================


return response;


}







// ==========================================================
// CONFIGURACIÓN
// ==========================================================


export const config = {


matcher:[


/*
 Protección de dashboard.
 Evita ejecutar middleware
 en archivos estáticos.
*/


"/dashboard/:path*",



"/login",


],


};
