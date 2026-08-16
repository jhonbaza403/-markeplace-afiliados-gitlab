"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FormEvent,
  useState,
  useTransition,
} from "react";
import { createClient } from "@/lib/supabase/client";

type PublicRole = "customer" | "vendor";

interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  role?: string;
}

const MIN_PASSWORD_LENGTH = 8;

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [role, setRole] =
    useState<PublicRole>("customer");

  const [errors, setErrors] =
    useState<FormErrors>({});

  const [serverError, setServerError] =
    useState<string | null>(null);

  const [isPending, startTransition] =
    useTransition();

  const validate = (): FormErrors => {
    const nextErrors: FormErrors = {};

    const normalizedName = fullName.trim();
    const normalizedEmail =
      email.trim().toLowerCase();

    if (normalizedName.length < 2) {
      nextErrors.fullName =
        "Introduce tu nombre completo.";
    }

    if (!validateEmail(normalizedEmail)) {
      nextErrors.email =
        "Introduce un correo electrónico válido.";
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      nextErrors.password =
        `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`;
    }

    if (password !== confirmPassword) {
      nextErrors.confirmPassword =
        "Las contraseñas no coinciden.";
    }

    if (
      role !== "customer" &&
      role !== "vendor"
    ) {
      nextErrors.role =
        "Selecciona un tipo de cuenta válido.";
    }

    return nextErrors;
  };

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setServerError(null);

    const validationErrors = validate();

    setErrors(validationErrors);

    if (
      Object.keys(validationErrors).length > 0
    ) {
      return;
    }

    startTransition(async () => {
      try {
        const supabase = createClient();

        const normalizedName =
          fullName.trim();

        const normalizedEmail =
          email.trim().toLowerCase();

        const {
          data,
          error,
        } = await supabase.auth.signUp({
          email: normalizedEmail,
          password,
          options: {
            data: {
              full_name: normalizedName,
              requested_role: role,
            },
          },
        });

        if (error) {
          const message =
            error.message.toLowerCase();

          if (
            message.includes(
              "already registered"
            )
          ) {
            setServerError(
              "Este correo electrónico ya está registrado. Intenta iniciar sesión o recuperar tu contraseña."
            );
          } else if (
            message.includes("password")
          ) {
            setServerError(
              "La contraseña no cumple los requisitos de seguridad."
            );
          } else if (
            message.includes("email")
          ) {
            setServerError(
              "No fue posible utilizar ese correo electrónico."
            );
          } else {
            setServerError(
              "No fue posible crear la cuenta. Inténtalo nuevamente."
            );
          }

          return;
        }

        if (
          data.user &&
          !data.session
        ) {
          const query =
            new URLSearchParams();

          query.set(
            "email",
            normalizedEmail
          );

          router.push(
            `/auth/verify-email?${query.toString()}`
          );

          return;
        }

        router.push("/dashboard");
        router.refresh();

      } catch (error: unknown) {
        console.error(
          "Registration error:",
          error
        );

        setServerError(
          "Ocurrió un error inesperado. Inténtalo nuevamente."
        );
      }
    });
  };

  const inputClassName =
    "w-full rounded-2xl border border-border bg-background px-4 py-3.5 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60";
