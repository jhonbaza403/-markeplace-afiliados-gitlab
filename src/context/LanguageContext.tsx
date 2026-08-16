"use client";

// ==========================================================
// ARCHIVO: src/context/LanguageContext.tsx
// Credi Marketplace
//
// Contexto global de idioma
//
// Next.js App Router
// TypeScript
// i18n
// ==========================================================

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  locales,
  defaultLocale,
  isLocale,
  type Locale,
  getLocaleConfig,
  type LocaleConfig,
} from "@/i18n/config";


// ==========================================================
// TIPOS
// ==========================================================

export interface LanguageContextValue {

  locale: Locale;

  localeConfig: LocaleConfig;

  availableLocales: readonly Locale[];

  setLocale(
    locale: Locale,
  ): void;


  changeLanguage(
    locale: Locale,
  ): void;

}


// ==========================================================
// CONSTANTES
// ==========================================================

const LANGUAGE_STORAGE_KEY =
  "credi-marketplace-locale";


// ==========================================================
// CONTEXT
// ==========================================================

const LanguageContext =
  createContext<
    LanguageContextValue | undefined
  >(undefined);


// ==========================================================
// PROVIDER
// ==========================================================

export function LanguageProvider({
  children,
}: {
  children: ReactNode;
}) {


  const [
    locale,
    setLocaleState,
  ] =
    useState<Locale>(
      defaultLocale,
    );





  // --------------------------------------------------------
  // Cargar idioma guardado
  // --------------------------------------------------------

  useEffect(() => {

    try {

      const stored =
        localStorage.getItem(
          LANGUAGE_STORAGE_KEY,
        );


      if (
        stored &&
        isLocale(stored)
      ) {

        setLocaleState(
          stored,
        );

      }

    } catch {

      setLocaleState(
        defaultLocale,
      );

    }

  }, []);





  // --------------------------------------------------------
  // Cambiar idioma
  // --------------------------------------------------------

  function setLocale(
    newLocale: Locale,
  ) {


    setLocaleState(
      newLocale,
    );


    try {

      localStorage.setItem(
        LANGUAGE_STORAGE_KEY,
        newLocale,
      );


      document.documentElement.lang =
        newLocale;


    } catch {

      // Evita errores SSR/browser

    }

  }





  function changeLanguage(
    newLocale: Locale,
  ) {

    setLocale(
      newLocale,
    );

  }





  const localeConfig =
    useMemo(
      () =>
        getLocaleConfig(
          locale,
        ),

      [locale],
    );





  const value =
    useMemo<LanguageContextValue>(
      () => ({

        locale,

        localeConfig,

        availableLocales:
          locales,

        setLocale,

        changeLanguage,

      }),

      [
        locale,
        localeConfig,
      ],
    );





  return (

    <LanguageContext.Provider
      value={value}
    >

      {children}

    </LanguageContext.Provider>

  );

}


// ==========================================================
// HOOK
// ==========================================================

export function useLanguage() {

  const context =
    useContext(
      LanguageContext,
    );


  if (!context) {

    throw new Error(
      "useLanguage debe utilizarse dentro de LanguageProvider",
    );

  }


  return context;

}
