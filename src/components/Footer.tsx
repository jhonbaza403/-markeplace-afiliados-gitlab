'use client'

import { useLanguage } from '@/context/LanguageContext'
import Link from 'next/link'

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer id="contacto" className="bg-card text-card-foreground border-t border-border mt-16 py-12 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div>
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">
            Markeplace Afiliados
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Tu plataforma integral de comercio electrónico, revistas científicas, bolsa de empleo y marketing de referidos.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">
            Explorar
          </h4>
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li><Link href="/products" className="hover:text-primary transition">Productos</Link></li>
            <li><Link href="/magazines" className="hover:text-primary transition">Revistas Científicas</Link></li>
            <li><Link href="/jobs" className="hover:text-primary transition">Bolsa de Empleo</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">
            Afiliados y Socios
          </h4>
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li><Link href="/dashboard/affiliate" className="hover:text-primary transition">Panel de Afiliado</Link></li>
            <li><Link href="/dashboard/seller" className="hover:text-primary transition">Portal de Vendedores</Link></li>
            <li><Link href="/auth/register" className="hover:text-primary transition">Registrarme</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">
            Soporte
          </h4>
          <p className="text-xs text-muted-foreground mb-2">¿Tienes dudas o necesitas ayuda con tus comisiones?</p>
          <a href="mailto:soporte@marketplace.com" className="text-xs font-semibold text-primary hover:underline">
            soporte@marketplace.com
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
        <p>{t('rights') || '© 2026 Markeplace Afiliados. Todos los derechos reservados.'}</p>
        <div className="flex gap-6">
          <Link href="/terms" className="hover:text-foreground transition cursor-pointer">
            {t('terms') || 'Términos y Condiciones'}
          </Link>
          <Link href="/privacy" className="hover:text-foreground transition cursor-pointer">
            {t('privacy') || 'Política de Privacidad'}
          </Link>
        </div>
      </div>
    </footer>
  )
}