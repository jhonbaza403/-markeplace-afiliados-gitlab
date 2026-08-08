import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { items, customerId, region, totalAmount } = body

    // 1. Calcular tu comisión global (ej. 5% para mantenimiento de la plataforma)
    const platformCommissionRate = 0.05
    const commissionAmount = totalAmount * platformCommissionRate
    const sellerAmount = totalAmount - commissionAmount

    // Cuenta comercial configurada para recibir todas las comisiones de la plataforma
    const adminPayPalAccount = 'Redicentralpnb@gmail.com'

    // 2. Registrar la orden preliminar en Supabase
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          customer_id: customerId,
          total_amount: totalAmount,
          region: region,
          status: 'pending',
          admin_commission: commissionAmount,
          admin_paypal_email: adminPayPalAccount,
        },
      ])
      .select()
      .single()

    if (orderError) throw orderError

    return NextResponse.json(
      {
        success: true,
        message: 'Orden creada y comisión calculada exitosamente.',
        orderId: order.id,
        commissionRoutedTo: adminPayPalAccount,
        commissionAmount,
        sellerAmount,
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error en el proceso de checkout:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Error interno del servidor' },
      { status: 500 }
    )
  }
}