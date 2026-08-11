import B2BProductForm from '@/components/seller/B2BProductForm'

export const metadata = {
  title: 'Publicar Producto Mayorista (B2B) | Markeplace',
  description: 'Publica lotes y productos al mayor para vender a comerciantes aceptando Binance Pay y USDT.',
}

export default function SellerB2BPage() {
  return (
    <main className="min-h-screen bg-background text-foreground py-10 px-4">
      <B2BProductForm />
    </main>
  )
}