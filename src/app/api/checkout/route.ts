import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Definición estricta de tipos para la petición
interface CheckoutItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  sellerId?: string;
}

interface CheckoutRequestBody {
  items: CheckoutItem[];
  customerId: string;
  region?: string;
  totalAmount: number;
}

export async function POST(req: NextRequest) {
  try {
    const body: CheckoutRequestBody = await req.json();
    const { items, customerId, region = "GLOBAL", totalAmount } = body;

    // Validación básica del cuerpo de la petición
    if (!customerId || !totalAmount || totalAmount <= 0) {
      return NextResponse.json(
        { success: false, error: "Datos de orden o cliente no válidos." },
        { status: 400 }
      );
    }

    // 1. Obtener comisión y correo admin desde variables de entorno con respaldos seguros
    const platformCommissionRate = parseFloat(
      process.env.PLATFORM_COMMISSION_RATE || "0.05"
    );
    const adminPayPalAccount =
      process.env.ADMIN_PAYPAL_EMAIL || "Redicentralpnb@gmail.com";

    // Manejo preciso de decimales para importes financieros
    const rawCommission = totalAmount * platformCommissionRate;
    const commissionAmount = Math.round(rawCommission * 100) / 100;
    const sellerAmount = Math.round((totalAmount - commissionAmount) * 100) / 100;

    // 2. Registrar la orden en Supabase
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          customer_id: customerId,
          total_amount: totalAmount,
          region: region,
          status: "pending",
          admin_commission: commissionAmount,
          admin_paypal_email: adminPayPalAccount,
          items_summary: items ? JSON.stringify(items) : null,
        },
      ])
      .select()
      .single();

    if (orderError) throw orderError;

    return NextResponse.json(
      {
        success: true,
        message: "Orden creada y comisión calculada exitosamente.",
        orderId: order.id,
        commissionRoutedTo: adminPayPalAccount,
        commissionAmount,
        sellerAmount,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Error interno del servidor";

    console.error("Error en el proceso de checkout:", error);

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}