import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

/* ==========================================================
   TIPOS
========================================================== */

interface Product {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  price: number | string;
  stock: number | null;
  images: string[] | null;
  is_active: boolean;
  created_at: string;
}

interface ProductDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

interface ProductImageProps {
  src: string;
  alt: string;
}

/* ==========================================================
   CONFIGURACIÓN
========================================================== */

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1200&auto=format&fit=crop";

/* ==========================================================
   UTILIDADES
========================================================== */

function normalizeSlug(value: string): string {
  return decodeURIComponent(value)
    .trim()
    .toLowerCase();
}

function normalizePrice(value: number | string): number {
  const price =
    typeof value === "number"
      ? value
      : Number(value);

  return Number.isFinite(price) && price >= 0
    ? price
    : 0;
}

function formatPrice(
  value: number | string
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(normalizePrice(value));
}

function getProductImage(
  product: Product
): ProductImageProps {
  const image =
    Array.isArray(product.images) &&
    product.images.length > 0 &&
    product.images[0]
      ? product.images[0]
      : FALLBACK_IMAGE;

  return {
    src: image,
    alt: `Imagen de ${String(product.title)}`,
  };
}

/* ==========================================================
   CONSULTA SUPABASE
========================================================== */

async function getProductBySlug(
  slug: string
): Promise<Product | null> {
  const supabase = await createClient();

  const normalizedSlug =
    normalizeSlug(slug);

  const { data, error } = await supabase
    .from("products")
    .select(
      `
        id,
        slug,
        title,
        description,
        price,
        stock,
        images,
        is_active,
        created_at
      `
    )
    .eq("slug", normalizedSlug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    console.error(
      "[ProductDetail] Error:",
      error.message
    );

    return null;
  }

  return data as Product | null;
}

/* ==========================================================
   METADATA SEO
========================================================== */

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;

  const product =
    await getProductBySlug(slug);

  if (!product) {
    return {
      title:
        "Producto no encontrado | Credi Marketplace",
      description:
        "El producto solicitado no está disponible.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const description =
    product.description?.trim() ||
    `Descubre ${product.title} en Credi Marketplace.`;

  return {
    title:
      `${product.title} | Credi Marketplace`,

    description:
      description.slice(0, 160),

    openGraph: {
      title:
        `${product.title} | Credi Marketplace`,

      description:
        description.slice(0, 160),

      type: "website",

      images:
        product.images &&
        product.images.length > 0
          ? [
              {
                url: product.images[0],
                alt: product.title,
              },
            ]
          : [
              {
                url: FALLBACK_IMAGE,
                alt: product.title,
              },
            ],
    },

    twitter: {
      card:
        "summary_large_image",

      title:
        `${product.title} | Credi Marketplace`,

      description:
        description.slice(0, 160),

      images:
        product.images &&
        product.images.length > 0
          ? [product.images[0]]
          : [FALLBACK_IMAGE],
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

/* ==========================================================
   PÁGINA
========================================================== */

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params;

  const product =
    await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const productImage =
    getProductImage(product);

  const price =
    normalizePrice(product.price);

  const available =
    Number(product.stock ?? 0) > 0;

  const formattedPrice =
    formatPrice(price);
