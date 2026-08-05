'tsx'
"use client";

import React, { createContext, useContext, useState } from 'react';

type Lang = 'es' | 'en' | 'pt' | 'fr';

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
}

const translations: Record<Lang, Record<string, string>> = {
  es: {
    subtitle: "Cobertura Mundial",
    subText: "Envíos globales y enlaces oficiales verificados",
    bannerTag: "Aliado Oficial Global",
    bannerTitle: "Las mejores ofertas del planeta a un solo clic",
    bannerDesc: "Acceso directo y seguro a los gigantes del comercio electrónico mundial con optimización de precios en tiempo real.",
    catalogTitle: "Plataformas y Ofertas Destacadas",
    updated: "Actualizado 2026",
    searchPlaceholder: "Buscar productos en Amazon, Shein, AliExpress, Alibaba...",
    support: "Soporte",
    rights: "© 2026 Global Market Express. Todos los derechos reservados.",
    terms: "Términos de Servicio",
    privacy: "Privacidad Global",
    officialLink: "Enlace Oficial"
  },
  en: {
    subtitle: "Worldwide Coverage",
    subText: "Global shipping and verified official links",
    bannerTag: "Global Official Partner",
    bannerTitle: "The best deals on the planet with a single click",
    bannerDesc: "Direct and secure access to global e-commerce giants with real-time price optimization.",
    catalogTitle: "Featured Platforms & Deals",
    updated: "Updated 2026",
    searchPlaceholder: "Search products in Amazon, Shein, AliExpress, Alibaba...",
    support: "Support",
    rights: "© 2026 Global Market Express. All rights reserved.",
    terms: "Terms of Service",
    privacy: "Global Privacy",
    officialLink: "Official Link"
  },
  pt: {
    subtitle: "Cobertura Mundial",
    subText: "Envios globais e links oficiais verificados",
    bannerTag: "Parceiro Oficial Global",
    bannerTitle: "As melhores ofertas do planeta a um clique",
    bannerDesc: "Acesso direto e seguro aos gigantes do e-commerce global com otimização de preços em tempo real.",
    catalogTitle: "Plataformas e Ofertas em Destaque",
    updated: "Atualizado 2026",
    searchPlaceholder: "Buscar produtos na Amazon, Shein, AliExpress, Alibaba...",
    support: "Suporte",
    rights: "© 2026 Global Market Express. Todos os direitos reservados.",
    terms: "Termos de Serviço",
    privacy: "Privacidade Global",
    officialLink: "Link Oficial"
  },
  fr: {
    subtitle: "Couverture Mondiale",
    subText: "Expédition mondiale et liens officiels vérifiés",
    bannerTag: "Partenaire Officiel Mondial",
    bannerTitle: "Les meilleures offres de la planète en un seul clic",
    bannerDesc: "Accès direct et sécurisé aux géants du e-commerce mondial avec optimisation des prix en temps réel.",
    catalogTitle: "Plateformes et Offres en Vedette",
    updated: "Mis à jour 2026",
    searchPlaceholder: "Rechercher des produits sur Amazon, Shein, AliExpress, Alibaba...",
    support: "Support",
    rights: "© 2026 Global Market Express. Tous droits réservés.",
    terms: "Conditions d'utilisation",
    privacy: "Confidentialité",
    officialLink: "Lien Officiel"
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLang] = useState<Lang>('es');

  const t = (key: string) => {
    return translations[lang][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};