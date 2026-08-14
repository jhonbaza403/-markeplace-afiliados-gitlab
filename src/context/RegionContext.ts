'use client';

// ==========================================================
// ARCHIVO: src/context/RegionContext.tsx
// Credi Marketplace
//
// SISTEMA GLOBAL DE REGIONES — NIVEL PREMIUM
//
// RESPONSABILIDADES:
// - Gestionar la región comercial seleccionada.
// - Mantener un catálogo único de regiones.
// - Persistir la preferencia regional.
// - Restaurar la región al recargar.
// - Validar valores recuperados desde almacenamiento.
// - Exponer metadatos regionales.
// - Preparar la plataforma para expansión internacional.
//
// NO RESPONSABILIDADES:
// - Autenticación.
// - Supabase.
// - Geolocalización automática.
// - Procesamiento de pagos.
// - Cálculo definitivo de impuestos.
// - Traducciones.
//
// PRINCIPIO:
// La región determina el contexto comercial.
// El idioma determina la presentación lingüística.
//
// Ambos sistemas son independientes.
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

// ==========================================================
// 1. CONFIGURACIÓN
// ==========================================================

/**
 * Clave versionada para persistencia.
 *
 * El versionado permite realizar migraciones futuras sin
 * romper preferencias almacenadas por versiones anteriores.
 */
const REGION_STORAGE_KEY =
  'credi-marketplace:region:v1';

/**
 * Código de región utilizado inicialmente durante SSR
 * y la primera renderización.
 */
const DEFAULT_REGION_CODE = 'GLOBAL';

// ==========================================================
// 2. TIPOS
// ==========================================================

/**
 * Región comercial de la plataforma.
 *
 * Los campos adicionales permiten evolucionar el sistema
 * sin tener que modificar nuevamente la arquitectura base.
 */
export interface Region {
  readonly id: string;

  /**
   * Nombre visible de la región.
   */
  readonly name: string;

  /**
   * Código interno estable.
   *
   * Debe utilizarse para lógica, nunca el nombre visible.
   */
  readonly code: string;

  /**
   * Código ISO principal cuando corresponda.
   *
   * Para regiones compuestas puede ser undefined.
   */
  readonly countryCode?: string;

  /**
   * Moneda principal utilizada como referencia comercial.
   */
  readonly currency: string;

  /**
   * Símbolo de la moneda.
   */
  readonly currencySymbol: string;

  /**
   * Zona geográfica / comercial.
   */
  readonly market: string;

  /**
   * Indica si la región se encuentra disponible.
   */
  readonly active: boolean;

  /**
   * Orden de presentación.
   */
  readonly priority: number;
}

/**
 * Contrato público del contexto.
 */
export interface RegionContextType {
  /**
   * Región actualmente seleccionada.
   */
  readonly selectedRegion: Region;

  /**
   * Cambiar región mediante un objeto Region.
   */
  readonly setSelectedRegion: (
    region: Region,
  ) => void;

  /**
   * Cambiar región utilizando únicamente su código.
   *
   * Esta es la función recomendada para componentes UI.
   */
  readonly setRegionByCode: (
    code: string,
  ) => void;

  /**
   * Catálogo completo de regiones activas.
   */
  readonly availableRegions: readonly Region[];

  /**
   * Indica si la preferencia persistida ya fue restaurada.
   */
  readonly isReady: boolean;
}

// ==========================================================
// 3. CATÁLOGO CENTRAL DE REGIONES
// ==========================================================
//
// IMPORTANTE:
//
// El contexto no debe generar regiones dinámicamente.
// Este catálogo funciona como fuente central de verdad.
//
// En una siguiente evolución puede trasladarse a:
// src/config/regions.ts
//
// ==========================================================

export const DEFAULT_REGIONS: readonly Region[] = [
  {
    id: 'region-global',
    name: 'Global',
    code: 'GLOBAL',
    currency: 'USD',
    currencySymbol: '$',
    market: 'GLOBAL',
    active: true,
    priority: 1,
  },

  {
    id: 'region-latam',
    name: 'América Latina',
    code: 'LATAM',
    currency: 'USD',
    currencySymbol: '$',
    market: 'LATAM',
    active: true,
    priority: 2,
  },

  {
    id: 'region-north-america',
    name: 'Norteamérica',
    code: 'NA',
    currency: 'USD',
    currencySymbol: '$',
    market: 'NORTH_AMERICA',
    active: true,
    priority: 3,
  },

  {
    id: 'region-europe',
    name: 'Europa',
    code: 'EU',
    currency: 'EUR',
    currencySymbol: '€',
    market: 'EUROPE',
    active: true,
    priority: 4,
  },
] as const;

// ==========================================================
// 4. UTILIDADES DE VALIDACIÓN
// ==========================================================

/**
 * Verifica que un valor tenga estructura básica de Region.
 *
 * Nunca debemos confiar directamente en datos provenientes
 * de localStorage, URL, cookies o cualquier otra fuente
 * controlada externamente.
 */
function isValidRegion(
  value: unknown,
): value is Region {
  if (
    typeof value !== 'object' ||
    value === null
  ) {
    return false;
  }

  const candidate =
    value as Partial<Region>;

  return (
    typeof candidate.id === 'string' &&
    typeof candidate.name === 'string' &&
    typeof candidate.code === 'string' &&
    typeof candidate.currency === 'string' &&
    typeof candidate.currencySymbol === 'string' &&
    typeof candidate.market === 'string' &&
    typeof candidate.active === 'boolean' &&
    typeof candidate.priority === 'number'
  );
}

/**
 * Busca una región exclusivamente dentro del catálogo
 * oficial.
 *
 * Nunca devuelve directamente un objeto externo.
 */
function findRegionByCode(
  code: string,
): Region {
  const normalizedCode =
    code.trim().toUpperCase();

  const region =
    DEFAULT_REGIONS.find(
      (item) =>
        item.code === normalizedCode &&
        item.active,
    );

  return (
    region ??
    DEFAULT_REGIONS.find(
      (item) =>
        item.code === DEFAULT_REGION_CODE,
    ) ??
    DEFAULT_REGIONS[0]
  );
}

/**
 * Verifica si un código pertenece al catálogo.
 */
function isSupportedRegionCode(
  value: unknown,
): value is string {
  if (typeof value !== 'string') {
    return false;
  }

  const normalized =
    value.trim().toUpperCase();

  return DEFAULT_REGIONS.some(
    (region) =>
      region.active &&
      region.code === normalized,
  );
}

// ==========================================================
// 5. CONTEXTO
// ==========================================================

const RegionContext =
  createContext<
    RegionContextType | undefined
  >(undefined);

// ==========================================================
// 6. PROVIDER
// ==========================================================

export interface RegionProviderProps {
  children: ReactNode;
}

/**
 * Proveedor global de región comercial.
 */
export function RegionProvider({
  children,
}: RegionProviderProps) {
  // --------------------------------------------------------
  // Estado inicial determinista
  // --------------------------------------------------------

  const [selectedRegion, setSelectedRegionState] =
    useState<Region>(() =>
      findRegionByCode(
        DEFAULT_REGION_CODE,
      ),
    );

  const [isReady, setIsReady] =
    useState(false);

  // ========================================================
  // RESTAURAR REGIÓN
  // ========================================================

  useEffect(() => {
    try {
      const storedRegion =
        window.localStorage.getItem(
          REGION_STORAGE_KEY,
        );

      /**
       * Guardamos únicamente el código, pero también
       * soportamos temporalmente un objeto serializado
       * para facilitar migraciones futuras.
       */
      if (
        storedRegion &&
        isSupportedRegionCode(storedRegion)
      ) {
        setSelectedRegionState(
          findRegionByCode(storedRegion),
        );

        return;
      }

      /**
       * Compatibilidad defensiva con una posible versión
       * anterior que haya almacenado el objeto completo.
       */
      if (storedRegion) {
        try {
          const parsed =
            JSON.parse(storedRegion);

          if (
            isValidRegion(parsed) &&
            isSupportedRegionCode(parsed.code)
          ) {
            setSelectedRegionState(
              findRegionByCode(parsed.code),
            );
          }
        } catch {
          // El valor no era JSON válido.
        }
      }
    } catch (error) {
      console.warn(
        '[RegionContext] No fue posible restaurar la región:',
        error,
      );
    } finally {
      setIsReady(true);
    }
  }, []);

  // ========================================================
  // CAMBIAR REGIÓN
  // ========================================================

  const setSelectedRegion =
    useCallback((region: Region) => {
      if (
        !isValidRegion(region) ||
        !isSupportedRegionCode(region.code)
      ) {
        console.warn(
          '[RegionContext] Se intentó establecer una región no válida.',
        );

        return;
      }

      /**
       * Nunca almacenamos directamente el objeto recibido.
       *
       * Recuperamos la versión oficial del catálogo.
       */
      const officialRegion =
        findRegionByCode(region.code);

      setSelectedRegionState(
        officialRegion,
      );

      try {
        /**
         * Persistimos solamente el código estable.
         */
        window.localStorage.setItem(
          REGION_STORAGE_KEY,
          officialRegion.code,
        );
      } catch (error) {
        console.warn(
          '[RegionContext] No fue posible persistir la región:',
          error,
        );
      }
    }, []);

  // ========================================================
  // CAMBIAR POR CÓDIGO
  // ========================================================

  const setRegionByCode =
    useCallback((code: string) => {
      if (
        !isSupportedRegionCode(code)
      ) {
        console.warn(
          `[RegionContext] Código de región no soportado: ${code}`,
        );

        return;
      }

      const region =
        findRegionByCode(code);

      setSelectedRegionState(region);

      try {
        window.localStorage.setItem(
          REGION_STORAGE_KEY,
          region.code,
        );
      } catch (error) {
        console.warn(
          '[RegionContext] No fue posible persistir la región:',
          error,
        );
      }
    }, []);

  // ========================================================
  // CATÁLOGO DE REGIONES ACTIVAS
  // ========================================================

  const availableRegions =
    useMemo(
      () =>
        DEFAULT_REGIONS
          .filter(
            (region) =>
              region.active,
          )
          .sort(
            (a, b) =>
              a.priority - b.priority,
          ),
      [],
    );

  // ========================================================
  // VALOR DEL CONTEXTO
  // ========================================================

  const contextValue =
    useMemo<RegionContextType>(
      () => ({
        selectedRegion,
        setSelectedRegion,
        setRegionByCode,
        availableRegions,
        isReady,
      }),
      [
        selectedRegion,
        setSelectedRegion,
        setRegionByCode,
        availableRegions,
        isReady,
      ],
    );

  // ========================================================
  // RENDER
  // ========================================================

  return (
    <RegionContext.Provider
      value={contextValue}
    >
      {children}
    </RegionContext.Provider>
  );
}

// ==========================================================
// 7. HOOK
// ==========================================================

/**
 * Hook global de región.
 *
 * Uso recomendado:
 *
 * const {
 *   selectedRegion,
 *   availableRegions,
 *   setRegionByCode,
 *   isReady,
 * } = useRegion();
 */
export function useRegion(): RegionContextType {
  const context =
    useContext(RegionContext);

  if (context === undefined) {
    throw new Error(
      'useRegion debe utilizarse dentro de un RegionProvider.',
    );
  }

  return context;
}