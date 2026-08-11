import B2BMarketplace from '@/components/marketplace/B2BMarketplace'

export const metadata = {
  title: 'Mercado B2B & Mayoristas | Markeplace Afiliados',
  description: 'Compra al mayor directo de proveedores e importadores con pagos en Binance Pay (USDT) y transferencias.',
}

export default function B2BPage() {
  return (
    <main className="min-h-screen bg-background text-foreground py-6">
      <B2BMarketplace />
    </main>
  )
}