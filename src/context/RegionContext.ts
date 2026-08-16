"use client";

// ==========================================================
// ARCHIVO: src/context/RegionContext.tsx
// Credi Marketplace
//
// Contexto global de región
//
// Gestión de:
// - País
// - Región
// - Moneda
// - Mercado B2B
//
// Next.js App Router
// TypeScript
// ==========================================================

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";


// ==========================================================
// TIPOS
// ==========================================================

export interface Region {

  code: string;

  name: string;

  currency: string;

  symbol: string;

  locale: string;

}


export interface RegionContextValue {

  region: Region;

  availableRegions: Region[];

  currency: string;

  setRegion(
    region: Region,
  ): void;


  changeRegion(
    code: string,
  ): void;


  formatCurrency(
    value: number,
  ): string;

}


// ==========================================================
// REGIONES DISPONIBLES
// ==========================================================

export const regions: Region[] = [

  {
    code: "VE",
    name: "Venezuela",
    currency: "VES",
    symbol: "Bs.",
    locale: "es-VE",
  },


  {
    code: "US",
    name: "United States",
    currency: "USD",
    symbol: "$",
    locale: "en-US",
  },


  {
    code: "CO",
    name: "Colombia",
    currency: "COP",
    symbol: "$",
    locale: "es-CO",
  },


  {
    code: "MX",
    name: "México",
    currency: "MXN",
    symbol: "$",
    locale: "es-MX",
  },


];


// ==========================================================
// CONSTANTE
// ==========================================================

const REGION_STORAGE_KEY =
  "credi-marketplace-region";


// ==========================================================
// DEFAULT
// ==========================================================

const defaultRegion =
  regions[0];


// ==========================================================
// CONTEXT
// ==========================================================

const RegionContext =
  createContext<
    RegionContextValue | undefined
  >(undefined);


// ==========================================================
// PROVIDER
// ==========================================================

export function RegionProvider({
  children,
}: {
  children: ReactNode;
}) {


  const [
    region,
    setRegionState,
  ] =
    useState<Region>(
      defaultRegion,
    );





  // --------------------------------------------------------
  // Recuperar región
  // --------------------------------------------------------

  useEffect(() => {

    try {

      const stored =
        localStorage.getItem(
          REGION_STORAGE_KEY,
        );


      if (stored) {

        const found =
          regions.find(
            item =>
              item.code === stored,
          );


        if (found) {

          setRegionState(
            found,
          );

        }

      }

    } catch {

      setRegionState(
        defaultRegion,
      );

    }

  }, []);





  // --------------------------------------------------------
  // Cambiar región
  // --------------------------------------------------------

  function setRegion(
    newRegion: Region,
  ) {


    setRegionState(
      newRegion,
    );


    try {

      localStorage.setItem(
        REGION_STORAGE_KEY,
        newRegion.code,
      );


      document.documentElement.dataset.region =
        newRegion.code;


    } catch {

      // Seguridad SSR

    }

  }





  function changeRegion(
    code: string,
  ) {

    const selected =
      regions.find(
        item =>
          item.code === code,
      );


    if (selected) {

      setRegion(
        selected,
      );

    }

  }





  // --------------------------------------------------------
  // Formatear moneda
  // --------------------------------------------------------

  function formatCurrency(
    value: number,
  ) {

    return new Intl.NumberFormat(
      region.locale,
      {
        style: "currency",
        currency:
          region.currency,
      },
    ).format(
      value,
    );

  }





  const value =
    useMemo<RegionContextValue>(
      () => ({

        region,

        availableRegions:
          regions,

        currency:
          region.currency,


        setRegion,

        changeRegion,

        formatCurrency,

      }),

      [
        region,
      ],
    );





  return (

    <RegionContext.Provider
      value={value}
    >

      {children}

    </RegionContext.Provider>

  );

}


// ==========================================================
// HOOK
// ==========================================================

export function useRegion() {

  const context =
    useContext(
      RegionContext,
    );


  if (!context) {

    throw new Error(
      "useRegion debe utilizarse dentro de RegionProvider",
    );

  }


  return context;

}
