"use client";

// ==========================================================
// ARCHIVO:
// src/app/dashboard/admin/page.tsx
//
// Credi Marketplace
//
// Dashboard Administrativo
//
// RESPONSABILIDADES:
// - Control administrativo.
// - Gestión de tiendas.
// - Aprobación de vendedores.
// - Métricas básicas.
// - Protección por sesión.
//
// Supabase:
// - Cliente Browser.
// - Seguridad mediante RLS.
// ==========================================================


import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";


import {
  useAuth,
} from "@/context/AuthContext";


import {
  supabaseClient,
} from "@/lib/supabase/client";




// ==========================================================
// TIPOS
// ==========================================================

interface Store {

  id: string;

  name: string;

  vendor_id: string;

  is_approved: boolean;

  created_at?: string;

}



type FilterType =
  | "all"
  | "approved"
  | "pending";





// ==========================================================
// COMPONENTE
// ==========================================================

export default function AdminDashboardPage() {


  const {
    user,
    loading: authLoading,
  } =
  useAuth();



  const [
    stores,
    setStores,
  ] =
  useState<Store[]>([]);



  const [
    loading,
    setLoading,
  ] =
  useState(true);



  const [
    updating,
    setUpdating,
  ] =
  useState<string | null>(null);



  const [
    filter,
    setFilter,
  ] =
  useState<FilterType>(
    "all",
  );



  const [
    search,
    setSearch,
  ] =
  useState("");



  const [
    error,
    setError,
  ] =
  useState<string | null>(
    null,
  );





  // ========================================================
  // CARGAR TIENDAS
  // ========================================================


  const loadStores =
    useCallback(
      async () => {


        if (!user) {

          setLoading(false);

          return;

        }



        setLoading(true);



        try {


          const {
            data,
            error,
          } =
          await supabaseClient
            .from("stores")
            .select(
              `
              id,
              name,
              vendor_id,
              is_approved,
              created_at
              `,
            )
            .order(
              "created_at",
              {
                ascending:false,
              },
            );



          if (error) {

            throw error;

          }



          setStores(
            data ?? [],
          );



        } catch (err) {


          console.error(
            err,
          );


          setError(
            "No fue posible cargar las tiendas.",
          );


        } finally {


          setLoading(false);


        }


      },

      [
        user,
      ],

    );





  useEffect(
    () => {

      loadStores();

    },

    [
      loadStores,
    ],

  );





  // ========================================================
  // APROBAR / REVOCAR
  // ========================================================


  async function toggleApproval(
    store: Store,
  ) {


    if (updating) {

      return;

    }



    setUpdating(
      store.id,
    );



    try {


      const {
        error,
      } =
      await supabaseClient
        .from("stores")
        .update({

          is_approved:
            !store.is_approved,

        })
        .eq(
          "id",
          store.id,
        );



      if (error) {

        throw error;

      }



      setStores(
        current =>
          current.map(
            item =>

              item.id === store.id

              ?

              {
                ...item,

                is_approved:
                  !store.is_approved,

              }

              :

              item,
          ),
      );


    } catch (err) {


      console.error(
        err,
      );


      setError(
        "No se pudo actualizar la tienda.",
      );


    } finally {


      setUpdating(null);


    }


  }





  // ========================================================
  // FILTRO
  // ========================================================


  const filteredStores =
    useMemo(
      () => {


        const text =
          search
            .trim()
            .toLowerCase();



        return stores.filter(
          store => {


            const matchesText =
              !text ||

              store.name
                .toLowerCase()
                .includes(text)

              ||

              store.vendor_id
                .toLowerCase()
                .includes(text);



            const matchesFilter =

              filter === "all"

              ||

              (
                filter === "approved"
                &&
                store.is_approved
              )

              ||

              (
                filter === "pending"
                &&
                !store.is_approved
              );



            return (
              matchesText
              &&
              matchesFilter
            );


          },
        );


      },

      [
        stores,
        filter,
        search,
      ],

    );





  // ========================================================
  // ESTADOS
  // ========================================================


  if (
    authLoading
    ||
    loading
  ) {

    return (

      <main
        className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-background
        "
      >

        <p className="font-semibold">

          Cargando panel administrativo...

        </p>

      </main>

    );

  }





  if (!user) {


    return (

      <main
        className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-background
        "
      >

        <div
          className="
          rounded-2xl
          border
          p-8
          text-center
          "
        >

          <h1
            className="
            text-2xl
            font-black
            "
          >

            Acceso restringido

          </h1>


          <p
            className="
            mt-3
            text-muted-foreground
            "
          >

            Debes iniciar sesión.

          </p>


        </div>


      </main>

    );

  }





  // ========================================================
  // DASHBOARD
  // ========================================================


  return (

    <main
      className="
      min-h-screen
      bg-background
      "
    >

      <div
        className="
        mx-auto
        max-w-7xl
        px-4
        py-10
        "
      >


        <header
          className="mb-8"
        >

          <h1
            className="
            text-4xl
            font-black
            "
          >

            Dashboard Administrativo

          </h1>


          <p
            className="
            mt-2
            text-muted-foreground
            "
          >

            Gestión de vendedores y tiendas B2B.

          </p>


        </header>





        {error && (

          <div
            className="
            mb-6
            rounded-xl
            bg-red-500/10
            p-4
            text-red-600
            "
          >

            {error}

          </div>

        )}






        <section
          className="
          mb-6
          flex
          flex-col
          gap-4
          sm:flex-row
          "
        >


          <input

            value={search}

            onChange={
              e =>
                setSearch(
                  e.target.value,
                )
            }

            placeholder="Buscar tienda..."

            className="
            rounded-xl
            border
            px-4
            py-3
            "

          />



          <select

            value={filter}

            onChange={
              e =>
                setFilter(
                  e.target.value as FilterType,
                )
            }

            className="
            rounded-xl
            border
            px-4
            py-3
            "

          >

            <option value="all">
              Todas
            </option>


            <option value="approved">
              Aprobadas
            </option>


            <option value="pending">
              Pendientes
            </option>


          </select>


        </section>





        <section
          className="
          overflow-hidden
          rounded-3xl
          border
          "
        >


          {
            filteredStores.map(
              store => (

                <div

                  key={
                    store.id
                  }

                  className="
                  flex
                  items-center
                  justify-between
                  border-b
                  p-5
                  "

                >


                  <div>

                    <h2
                      className="
                      font-bold
                      "
                    >

                      {
                        store.name
                      }

                    </h2>


                    <p
                      className="
                      text-sm
                      text-muted-foreground
                      "
                    >

                      {
                        store.vendor_id
                      }

                    </p>


                  </div>




                  <button

                    type="button"

                    disabled={
                      updating === store.id
                    }

                    onClick={() =>
                      toggleApproval(
                        store,
                      )
                    }

                    className="
                    rounded-xl
                    bg-primary
                    px-4
                    py-2
                    text-sm
                    font-bold
                    text-white
                    "

                  >

                    {
                      updating === store.id

                      ?

                      "Actualizando..."

                      :

                      store.is_approved

                      ?

                      "Revocar"

                      :

                      "Aprobar"
                    }


                  </button>


                </div>

              )

            )
          }


        </section>


      </div>


    </main>

  );

}
