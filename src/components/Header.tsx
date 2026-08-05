"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function Header() {
  const { lang, setLang, t } = useLanguage();

  return (
    <header className="bg-slate-900 text-white text-xs py-2 px-4 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 font-semibold text-emerald-400">
            <i className="fa-solid fa-earth-americas"></i> {t("subtitle")}
          </span>
          <span className="hidden md:inline text-slate-400">|</span>
          <span className="hidden md:inline text-slate-300">{t("subText")}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700">
            <i className="fa-solid fa-globe text-emerald-400 mr-2"></i>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as "es" | "en" | "pt" | "fr")}
              className="bg-transparent text-white focus:outline-none cursor-pointer"
            >
              <option value="es" className="bg-slate-800">Español</option>
              <option value="en" className="bg-slate-800">English</option>
              <option value="pt" className="bg-slate-800">Português</option>
              <option value="fr" className="bg-slate-800">Français</option>
            </select>
          </div>
        </div>
      </div>
    </header>
  );
}