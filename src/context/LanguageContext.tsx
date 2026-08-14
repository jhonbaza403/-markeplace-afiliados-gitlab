'use client';

// ==========================================================
// ARCHIVO: src/context/LanguageContext.tsx
// Credi Marketplace
//
// Contexto global de internacionalización.
//
// RESPONSABILIDADES:
// - Mantener el idioma seleccionado.
// - Exponer la función de traducción.
// - Garantizar que solamente se utilicen locales soportados.
// - Servir como API de acceso a i18n para Client Components.
//
// FUENTE ÚNICA DE LOCALES:
// - src/i18n/config.ts
//
// NOTA:
// Este contexto no redefine los locales.
// ==========================================================

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import {
  defaultLocale,
  type Locale,
} from '@/i18n/config';

// ==========================================================
// 1. TIPOS
// ==========================================================

/**
 * Claves disponibles actualmente en el sistema de traducción.
 *
 * Si se agrega una nueva clave aquí, debe existir en todos
 * los diccionarios de traducción.
 */
export type TranslationKey =
  | 'subtitle'
  | 'subText'
  | 'bannerTag'
  | 'bannerTitle'
  | 'bannerDesc'
  | 'catalogTitle'
  | 'updated'
  | 'searchPlaceholder'
  | 'support'
  | 'rights'
  | 'terms'
  | 'privacy'
  | 'officialLink';

/**
 * Diccionario de traducción para un idioma.
 */
export type TranslationDictionary = Record<
  TranslationKey,
  string
>;

/**
 * Contrato público del contexto.
 */
export interface LanguageContextType {
  readonly lang: Locale;

  readonly setLang: (lang: Locale) => void;

  readonly t: (key: TranslationKey) => string;
}

// ==========================================================
// 2. TRADUCCIONES
// ==========================================================

export const translations: Record<
  Locale,
  TranslationDictionary
> = {
  // --------------------------------------------------------
  // ESPAÑOL
  // --------------------------------------------------------

  es: {
    subtitle: 'Cobertura Mundial',

    subText:
      'Envíos globales y enlaces oficiales verificados',

    bannerTag:
      'Aliado Oficial Global',

    bannerTitle:
      'Las mejores ofertas del planeta a un solo clic',

    bannerDesc:
      'Acceso directo y seguro a los gigantes del comercio electrónico mundial con optimización de precios en tiempo real.',

    catalogTitle:
      'Plataformas y Ofertas Destacadas',

    updated:
      'Actualizado 2026',

    searchPlaceholder:
      'Buscar productos en Amazon, Shein, AliExpress, Alibaba...',

    support:
      'Soporte',

    rights:
      '© 2026 Credi Marketplace. Todos los derechos reservados.',

    terms:
      'Términos de Servicio',

    privacy:
      'Privacidad',

    officialLink:
      'Enlace Oficial',
  },

  // --------------------------------------------------------
  // INGLÉS
  // --------------------------------------------------------

  en: {
    subtitle:
      'Worldwide Coverage',

    subText:
      'Global shipping and verified official links',

    bannerTag:
      'Global Official Partner',

    bannerTitle:
      'The best deals on the planet with a single click',

    bannerDesc:
      'Direct and secure access to global e-commerce platforms with real-time price optimization.',

    catalogTitle:
      'Featured Platforms & Deals',

    updated:
      'Updated 2026',

    searchPlaceholder:
      'Search products on Amazon, Shein, AliExpress, Alibaba...',

    support:
      'Support',

    rights:
      '© 2026 Credi Marketplace. All rights reserved.',

    terms:
      'Terms of Service',

    privacy:
      'Privacy',

    officialLink:
      'Official Link',
  },

  // --------------------------------------------------------
  // PORTUGUÉS
  // --------------------------------------------------------

  pt: {
    subtitle:
      'Cobertura Mundial',

    subText:
      'Envios globais e links oficiais verificados',

    bannerTag:
      'Parceiro Oficial Global',

    bannerTitle:
      'As melhores ofertas do planeta a um clique',

    bannerDesc:
      'Acesso direto e seguro às principais plataformas globais de comércio eletrônico com otimização de preços em tempo real.',

    catalogTitle:
      'Plataformas e Ofertas em Destaque',

    updated:
      'Atualizado 2026',

    searchPlaceholder:
      'Buscar produtos na Amazon, Shein, AliExpress, Alibaba...',

    support:
      'Suporte',

    rights:
      '© 2026 Credi Marketplace. Todos os direitos reservados.',

    terms:
      'Termos de Serviço',

    privacy:
      'Privacidade',

    officialLink:
      'Link Oficial',
  },

  // --------------------------------------------------------
  // FRANCÉS
  // --------------------------------------------------------

  fr: {
    subtitle:
      'Couverture Mondiale',

    subText:
      'Expédition mondiale et liens officiels vérifiés',

    bannerTag:
      'Partenaire Officiel Mondial',

    bannerTitle:
      'Les meilleures offres de la planète en un seul clic',

    bannerDesc:
      'Accès direct et sécurisé aux principales plateformes mondiales de commerce électronique avec optimisation des prix en temps réel.',

    catalogTitle:
      'Plateformes et Offres en Vedette',

    updated:
      'Mis à jour 2026',

    searchPlaceholder:
      'Rechercher des produits sur Amazon, Shein, AliExpress, Alibaba...',

    support:
      'Support',

    rights:
      '© 2026 Credi Marketplace. Tous droits réservés.',

    terms:
      "Conditions d'utilisation",

    privacy:
      'Confidentialité',

    officialLink:
      'Lien Officiel',
  },
};

// ==========================================================
// 3. CONTEXTO
// ==========================================================

const LanguageContext =
  createContext<LanguageContextType | undefined>(undefined);

// ==========================================================
// 4. PROVIDER
// ==========================================================

export interface LanguageProviderProps {
  children: ReactNode;
}

/**
 * Proveedor global de idioma.
 */
export function LanguageProvider({
  children,
}: LanguageProviderProps) {
  const [lang, setLangState] =
    useState<Locale>(defaultLocale);

  /**
   * Cambia el idioma activo.
   */
  const setLang = useCallback(
    (nextLocale: Locale) => {
      setLangState(nextLocale);
    },
    [],
  );

  /**
   * Traduce una clave.
   *
   * Al estar TranslationKey tipado, TypeScript impedirá
   * utilizar claves inexistentes.
   */
  const t = useCallback(
    (key: TranslationKey): string => {
      return translations[lang][key];
    },
    [lang],
  );

  /**
   * Evita recreaciones innecesarias del objeto
   * proporcionado por el contexto.
   */
  const contextValue = useMemo<LanguageContextType>(
    () => ({
      lang,
      setLang,
      t,
    }),
    [lang, setLang, t],
  );

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

// ==========================================================
// 5. HOOK
// ==========================================================

/**
 * Hook global para acceder al sistema de idioma.
 */
export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);

  if (context === undefined) {
    throw new Error(
      'useLanguage debe utilizarse dentro de un LanguageProvider.',
    );
  }

  return context;
}