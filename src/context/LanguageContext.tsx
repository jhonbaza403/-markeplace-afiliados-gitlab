'use client';

// ==========================================================
// ARCHIVO: src/context/LanguageContext.tsx
// Credi Marketplace
//
// Contexto global de idioma.
//
// RESPONSABILIDADES:
// - Mantener el idioma seleccionado por el usuario.
// - Exponer la función de traducción.
// - Proporcionar el idioma actual a los Client Components.
//
// FUENTE ÚNICA DE IDIOMAS:
// - src/i18n/config.ts
//
// IMPORTANTE:
// - Este contexto NO debe definir nuevamente los idiomas.
// - La persistencia del idioma podrá incorporarse posteriormente
//   mediante cookie, URL o preferencias del usuario.
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
// 1. TIPOS DE TRADUCCIÓN
// ==========================================================

/**
 * Claves disponibles en el catálogo de traducciones.
 *
 * Mantener las claves tipadas evita errores como:
 *
 * t('catalogTtile')
 *
 * en lugar de:
 *
 * t('catalogTitle')
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
 * Catálogo completo de traducciones.
 */
export type TranslationDictionary = Record<
  TranslationKey,
  string
>;

/**
 * Contrato público del contexto.
 */
export interface LanguageContextType {
  /**
   * Idioma actualmente seleccionado.
   */
  readonly lang: Locale;

  /**
   * Cambia el idioma activo.
   */
  readonly setLang: (lang: Locale) => void;

  /**
   * Traduce una clave.
   */
  readonly t: (key: TranslationKey) => string;
}

// ==========================================================
// 2. TRADUCCIONES
// ==========================================================

/**
 * Diccionario de traducciones de Credi Marketplace.
 *
 * IMPORTANTE:
 * Todas las traducciones deben contener exactamente las mismas
 * claves para evitar inconsistencias entre idiomas.
 */
export const translations: Record<
  Locale,
  TranslationDictionary
> = {
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

  en: {
    subtitle: 'Worldwide Coverage',

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
  createContext<LanguageContextType | null>(null);

// ==========================================================
// 4. PROVIDER
// ==========================================================

export interface LanguageProviderProps {
  children: ReactNode;
}

/**
 * Proveedor global del idioma.
 */
export function LanguageProvider({
  children,
}: LanguageProviderProps) {
  const [lang, setLangState] =
    useState<Locale>(defaultLocale);

  /**
   * Cambia el idioma activo.
   */
  const setLang = useCallback((nextLocale: Locale) => {
    setLangState(nextLocale);
  }, []);

  /**
   * Traduce una clave utilizando el idioma activo.
   */
  const t = useCallback(
    (key: TranslationKey): string => {
      return translations[lang][key];
    },
    [lang],
  );

  /**
   * Valor estable del contexto.
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
 * Hook para acceder al contexto de idioma.
 */
export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);

  if (context === null) {
    throw new Error(
      'useLanguage debe utilizarse dentro de un LanguageProvider.',
    );
  }

  return context;
}