'use client';

// ==========================================================
// ARCHIVO: src/context/LanguageContext.tsx
// Credi Marketplace
//
// SISTEMA DE INTERNACIONALIZACIÓN — NIVEL PREMIUM
//
// RESPONSABILIDADES:
// - Gestionar el idioma global de la aplicación.
// - Mantener tipado estricto de locales y traducciones.
// - Persistir la preferencia lingüística.
// - Restaurar el idioma después de recargar.
// - Evitar errores de hidratación.
// - Exponer una API de traducción estable.
// - Permitir extensiones futuras del sistema i18n.
//
// NO RESPONSABILIDADES:
// - Routing internacional.
// - Autenticación.
// - Supabase.
// - Geolocalización.
// - Traducción automática.
//
// FUENTE ÚNICA DE LOCALES:
// src/i18n/config.ts
//
// PRINCIPIO ARQUITECTÓNICO:
// El idioma es estado global de presentación.
// La lógica de negocio nunca debe depender directamente
// de textos visibles.
// ==========================================================

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import {
  defaultLocale,
  locales,
  type Locale,
} from '@/i18n/config';

// ==========================================================
// 1. CONFIGURACIÓN
// ==========================================================

/**
 * Clave utilizada para persistir el idioma.
 *
 * Se versiona para permitir futuras migraciones sin
 * romper preferencias almacenadas por versiones anteriores.
 */
const LANGUAGE_STORAGE_KEY =
  'credi-marketplace:language:v1';

/**
 * Idioma utilizado durante la primera renderización.
 *
 * Es importante mantenerlo sincronizado con defaultLocale
 * para evitar inconsistencias de hidratación.
 */
const INITIAL_LOCALE = defaultLocale;

// ==========================================================
// 2. TIPOS
// ==========================================================

/**
 * Claves de traducción globales.
 *
 * Este catálogo debe crecer de forma controlada.
 *
 * IMPORTANTE:
 * Cada clave debe existir en TODOS los idiomas soportados.
 */
export type TranslationKey =
  // --------------------------------------------------------
  // Identidad / Header
  // --------------------------------------------------------
  | 'subtitle'
  | 'subText'

  // --------------------------------------------------------
  // Hero / Banner
  // --------------------------------------------------------
  | 'bannerTag'
  | 'bannerTitle'
  | 'bannerDesc'

  // --------------------------------------------------------
  // Catálogo
  // --------------------------------------------------------
  | 'catalogTitle'
  | 'updated'
  | 'searchPlaceholder'

  // --------------------------------------------------------
  // Navegación / Sistema
  // --------------------------------------------------------
  | 'support'
  | 'rights'
  | 'terms'
  | 'privacy'
  | 'officialLink'

  // --------------------------------------------------------
  // Marketplace
  // --------------------------------------------------------
  | 'marketplace'
  | 'products'
  | 'categories'
  | 'offers'
  | 'featured'
  | 'viewProduct'
  | 'viewAll'
  | 'noResults'

  // --------------------------------------------------------
  // Usuario
  // --------------------------------------------------------
  | 'account'
  | 'profile'
  | 'settings'
  | 'logout'
  | 'login'
  | 'register'

  // --------------------------------------------------------
  // Estados
  // --------------------------------------------------------
  | 'loading'
  | 'error'
  | 'success'
  | 'cancel'
  | 'confirm'
  | 'close'

  // --------------------------------------------------------
  // Seguridad
  // --------------------------------------------------------
  | 'securePlatform'
  | 'verifiedUsers'
  | 'securePayments';

/**
 * Diccionario de traducción.
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

  readonly isReady: boolean;
}

// ==========================================================
// 3. TRADUCCIONES
// ==========================================================

/**
 * ESPAÑOL
 */
const es: TranslationDictionary = {
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

  marketplace:
    'Marketplace',

  products:
    'Productos',

  categories:
    'Categorías',

  offers:
    'Ofertas',

  featured:
    'Destacados',

  viewProduct:
    'Ver producto',

  viewAll:
    'Ver todos',

  noResults:
    'No se encontraron resultados.',

  account:
    'Cuenta',

  profile:
    'Perfil',

  settings:
    'Configuración',

  logout:
    'Cerrar sesión',

  login:
    'Iniciar sesión',

  register:
    'Crear cuenta',

  loading:
    'Cargando...',

  error:
    'Ha ocurrido un error.',

  success:
    'Operación realizada correctamente.',

  cancel:
    'Cancelar',

  confirm:
    'Confirmar',

  close:
    'Cerrar',

  securePlatform:
    'Plataforma segura',

  verifiedUsers:
    'Usuarios verificados',

  securePayments:
    'Pagos seguros',
};

/**
 * INGLÉS
 */
const en: TranslationDictionary = {
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

  marketplace:
    'Marketplace',

  products:
    'Products',

  categories:
    'Categories',

  offers:
    'Offers',

  featured:
    'Featured',

  viewProduct:
    'View product',

  viewAll:
    'View all',

  noResults:
    'No results found.',

  account:
    'Account',

  profile:
    'Profile',

  settings:
    'Settings',

  logout:
    'Log out',

  login:
    'Sign in',

  register:
    'Create account',

  loading:
    'Loading...',

  error:
    'An error occurred.',

  success:
    'Operation completed successfully.',

  cancel:
    'Cancel',

  confirm:
    'Confirm',

  close:
    'Close',

  securePlatform:
    'Secure platform',

  verifiedUsers:
    'Verified users',

  securePayments:
    'Secure payments',
};

/**
 * PORTUGUÉS
 */
const pt: TranslationDictionary = {
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

  marketplace:
    'Marketplace',

  products:
    'Produtos',

  categories:
    'Categorias',

  offers:
    'Ofertas',

  featured:
    'Destaques',

  viewProduct:
    'Ver produto',

  viewAll:
    'Ver todos',

  noResults:
    'Nenhum resultado encontrado.',

  account:
    'Conta',

  profile:
    'Perfil',

  settings:
    'Configurações',

  logout:
    'Sair',

  login:
    'Entrar',

  register:
    'Criar conta',

  loading:
    'Carregando...',

  error:
    'Ocorreu um erro.',

  success:
    'Operação realizada com sucesso.',

  cancel:
    'Cancelar',

  confirm:
    'Confirmar',

  close:
    'Fechar',

  securePlatform:
    'Plataforma segura',

  verifiedUsers:
    'Usuários verificados',

  securePayments:
    'Pagamentos seguros',
};

/**
 * FRANCÉS
 */
const fr: TranslationDictionary = {
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

  marketplace:
    'Marketplace',

  products:
    'Produits',

  categories:
    'Catégories',

  offers:
    'Offres',

  featured:
    'En vedette',

  viewProduct:
    'Voir le produit',

  viewAll:
    'Voir tout',

  noResults:
    'Aucun résultat trouvé.',

  account:
    'Compte',

  profile:
    'Profil',

  settings:
    'Paramètres',

  logout:
    'Se déconnecter',

  login:
    'Se connecter',

  register:
    'Créer un compte',

  loading:
    'Chargement...',

  error:
    'Une erreur est survenue.',

  success:
    'Opération effectuée avec succès.',

  cancel:
    'Annuler',

  confirm:
    'Confirmer',

  close:
    'Fermer',

  securePlatform:
    'Plateforme sécurisée',

  verifiedUsers:
    'Utilisateurs vérifiés',

  securePayments:
    'Paiements sécurisés',
};

// ==========================================================
// 4. DICCIONARIO CENTRAL
// ==========================================================

export const translations: Record<
  Locale,
  TranslationDictionary
> = {
  es,
  en,
  pt,
  fr,
};

// ==========================================================
// 5. VALIDACIÓN INTERNA
// ==========================================================

/**
 * Verifica si un valor pertenece realmente a los locales
 * soportados por la aplicación.
 *
 * Esto evita confiar directamente en valores provenientes
 * de localStorage u otras fuentes externas.
 */
function isSupportedLocale(
  value: unknown,
): value is Locale {
  return (
    typeof value === 'string' &&
    locales.includes(value as Locale)
  );
}

// ==========================================================
// 6. CONTEXTO
// ==========================================================

const LanguageContext =
  createContext<LanguageContextType | undefined>(
    undefined,
  );

// ==========================================================
// 7. PROVIDER
// ==========================================================

export interface LanguageProviderProps {
  children: ReactNode;
}

/**
 * Proveedor global de internacionalización.
 *
 * Arquitectura:
 *
 * 1. Render inicial determinista.
 * 2. Hidratación segura.
 * 3. Restauración desde localStorage.
 * 4. Persistencia automática.
 * 5. API tipada.
 */
export function LanguageProvider({
  children,
}: LanguageProviderProps) {
  const [lang, setLangState] =
    useState<Locale>(INITIAL_LOCALE);

  const [isReady, setIsReady] =
    useState(false);

  // ========================================================
  // RESTAURAR PREFERENCIA
  // ========================================================

  useEffect(() => {
    try {
      const storedLanguage =
        window.localStorage.getItem(
          LANGUAGE_STORAGE_KEY,
        );

      if (isSupportedLocale(storedLanguage)) {
        setLangState(storedLanguage);
      }
    } catch (error) {
      console.warn(
        '[LanguageContext] No fue posible restaurar el idioma:',
        error,
      );
    } finally {
      setIsReady(true);
    }
  }, []);

  // ========================================================
  // CAMBIAR IDIOMA
  // ========================================================

  const setLang = useCallback(
    (nextLocale: Locale) => {
      if (!isSupportedLocale(nextLocale)) {
        console.warn(
          `[LanguageContext] Locale no soportado: ${String(
            nextLocale,
          )}`,
        );

        return;
      }

      setLangState(nextLocale);

      try {
        window.localStorage.setItem(
          LANGUAGE_STORAGE_KEY,
          nextLocale,
        );
      } catch (error) {
        console.warn(
          '[LanguageContext] No fue posible persistir el idioma:',
          error,
        );
      }
    },
    [],
  );

  // ========================================================
  // TRADUCCIÓN
  // ========================================================

  const t = useCallback(
    (key: TranslationKey): string => {
      const dictionary =
        translations[lang];

      const value = dictionary[key];

      /**
       * Este fallback evita que una interfaz quede
       * completamente vacía si en el futuro aparece una
       * inconsistencia de traducción.
       */
      if (
        typeof value !== 'string' ||
        value.length === 0
      ) {
        console.warn(
          `[LanguageContext] Traducción inexistente: ${key} (${lang})`,
        );

        return key;
      }

      return value;
    },
    [lang],
  );

  // ========================================================
  // VALOR DEL CONTEXTO
  // ========================================================

  const contextValue =
    useMemo<LanguageContextType>(
      () => ({
        lang,
        setLang,
        t,
        isReady,
      }),
      [
        lang,
        setLang,
        t,
        isReady,
      ],
    );

  // ========================================================
  // RENDER
  // ========================================================

  return (
    <LanguageContext.Provider
      value={contextValue}
    >
      {children}
    </LanguageContext.Provider>
  );
}

// ==========================================================
// 8. HOOK PRINCIPAL
// ==========================================================

/**
 * Hook global de internacionalización.
 *
 * Uso:
 *
 * const { lang, setLang, t } = useLanguage();
 *
 * t('marketplace')
 */
export function useLanguage(): LanguageContextType {
  const context =
    useContext(LanguageContext);

  if (context === undefined) {
    throw new Error(
      'useLanguage debe utilizarse dentro de un LanguageProvider.',
    );
  }

  return context;
}