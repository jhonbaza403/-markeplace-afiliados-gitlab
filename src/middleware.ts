import {
  NextResponse,
  type NextRequest,
} from "next/server";


import {
  createServerClient,
} from "@supabase/ssr";




// ==========================================================
// TIPOS
// ==========================================================


type UserRole =
  | "admin"
  | "vendor"
  | "customer";




// ==========================================================
// ACTUALIZAR SESIÓN
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



          setAll(
            cookiesToSet,
          ){


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

  } =
    await supabase.auth.getUser();





  return {

    supabase,

    user,

    response,

  };


}







// ==========================================================
// OBTENER ROL
// ==========================================================


async function getUserRole(
  supabase:any,
  userId:string,
):Promise<UserRole|null>{


  const {
    data,
    error,

  } =
    await supabase

      .from("profiles")

      .select(
        "role",
      )

      .eq(
        "id",
        userId,
      )

      .maybeSingle();




  if(error){

    console.error(
      "Error obteniendo rol:",
      error,
    );


    return null;

  }




  return data?.role ?? null;


}








// ==========================================================
// MIDDLEWARE
// ==========================================================


export async function middleware(
  request: NextRequest,
){



  const {

    supabase,

    user,

    response,

  } =
    await updateSession(
      request,
    );





  const pathname =
    request.nextUrl.pathname;







  // ========================================================
  // RUTAS PROTEGIDAS
  // ========================================================


  const isAdminRoute =
    pathname.startsWith(
      "/dashboard/admin",
    );


  const isVendorRoute =
    pathname.startsWith(
      "/dashboard/vendor",
    );


  const isCustomerRoute =
    pathname.startsWith(
      "/dashboard/customer",
    );




  const requiresAuth =
    isAdminRoute ||
    isVendorRoute ||
    isCustomerRoute;







  // ========================================================
  // SIN LOGIN
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
  // CONTROL DE ROLES
  // ========================================================


  if(
    requiresAuth
    &&
    user
  ){


    const role =
      await getUserRole(
        supabase,
        user.id,
      );





    // ------------------------------------------------------
    // ADMIN
    // ------------------------------------------------------


    if(
      isAdminRoute
      &&
      role !== "admin"
    ){


      const url =
        request.nextUrl.clone();


      url.pathname =
        "/dashboard";


      return NextResponse.redirect(
        url,
      );


    }





    // ------------------------------------------------------
    // VENDOR
    // ------------------------------------------------------


    if(
      isVendorRoute
      &&
      role !== "vendor"
    ){


      const url =
        request.nextUrl.clone();


      url.pathname =
        "/dashboard";


      return NextResponse.redirect(
        url,
      );


    }





    // ------------------------------------------------------
    // CUSTOMER
    // ------------------------------------------------------


    if(
      isCustomerRoute
      &&
      role !== "customer"
    ){


      const url =
        request.nextUrl.clone();


      url.pathname =
        "/dashboard";


      return NextResponse.redirect(
        url,
      );


    }



  }






  return response;


}








// ==========================================================
// CONFIGURACIÓN
// ==========================================================


export const config = {


  matcher:[


    "/dashboard/:path*",


    "/login",


  ],


};
