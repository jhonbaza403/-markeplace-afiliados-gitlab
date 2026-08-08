import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Forzar renderizado dinámico en cada petición para APIs de Checkout
export const dynamic = "force-dynamic";

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
  totalAmount?: number;
}

export async function POST(req: NextRequest) {
  try {
    // 1. Manejo seguro del parsing del cuerpo JSON
    let body: CheckoutRequestBody;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "El cuerpo de la petición no es un JSON válido." },
        { status: 400 }
      );
    }

    const { items, customerId, region = "GLOBAL", totalAmount: clientTotal } = body;

    // 2. Validación estricta de datos recibidos
    if (!customerId || typeof customerId !== "string" || !customerId.trim()) {
      return NextResponse.json(
        { success: false, error: "Identificador de cliente (customerId) no válido." },
        { status: 400 }
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "La lista de productos no puede estar vacía." },
        { status: 400 }
      );
    }

    // 3. Recálculo o verificación del total en el servidor (Prevención de manipulación de precios)
    const computedTotal = items.reduce((acc, item) => {
      const price = typeof item.price === "number" && item.price > 0 ? item.price : 0;
      const qty = typeof item.quantity === "number" && item.quantity > 0 ? item.quantity : 1;
      return acc + price * qty;
    }, 0);

    const finalTotalAmount = clientTotal && clientTotal > 0 ? clientTotal : computedTotal;

    if (finalTotalAmount <= 0) {
      return NextResponse.json(
        { success: false, error: "El monto total de la compra debe ser mayor a 0." },
        { status: 400 }
      );
    }

    // 4. Configuración de variables financieras de entorno
    const platformCommissionRate = parseFloat(
      process.env.PLATFORM_COMMISSION_RATE || "0.05"
    );
    const adminPayPalAccount =
      process.env.ADMIN_PAYPAL_EMAIL || "Redicentralpnb@gmail.com";

    // Cálculo preciso de comisiones
    const rawCommission = finalTotalAmount * platformCommissionRate;
    const commissionAmount = Math.round(rawCommission * 100) / 100;
    const sellerAmount = Math.round((finalTotalAmount - commissionAmount) * 100) / 100;

    // 5. Inserción de la orden en Supabase
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          customer_id: customerId,
          total_amount: finalTotalAmount,
          region: region,
          status: "pending",
          admin_commission: commissionAmount,
          admin_paypal_email: adminPayPalAccount,
          items_summary: JSON.stringify(items),
        },
      ])
      .select()
      .single();

    if (orderError) throw orderError;

    // 6. Respuesta exitosa
    return NextResponse.json(
      {
        success: true,
        message: "Orden creada y comisión calculada exitosamente.",
        orderId: order.id,
        totalAmount: finalTotalAmount,
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