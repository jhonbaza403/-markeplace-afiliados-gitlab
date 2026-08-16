// ==========================================================
// ARCHIVO: src/components/ui/Card.tsx
// Credi Marketplace
//
// Componente tarjeta reutilizable global
//
// Next.js 16.3 · React 19.2 · TypeScript
// ==========================================================

import type {
  ReactNode,
} from 'react';


interface CardProps {

  children: ReactNode;

  title?: string;

  description?: string;

  footer?: ReactNode;

  className?: string;

  hover?: boolean;
}


export default function Card({
  children,
  title,
  description,
  footer,
  className = '',
  hover = true,
}: CardProps) {


  return (
    <section
      className={`
        rounded-xl
        border
        border-gray-200
        bg-white
        shadow-sm
        p-6

        transition

        ${
          hover
            ? `
              hover:shadow-lg
              hover:-translate-y-1
            `
            : ''
        }

        ${className}
      `}
    >

      {
        title && (
          <h3
            className="
              mb-2
              text-lg
              font-semibold
              text-gray-900
            "
          >
            {title}
          </h3>
        )
      }


      {
        description && (
          <p
            className="
              mb-4
              text-sm
              text-gray-600
            "
          >
            {description}
          </p>
        )
      }


      <div>
        {children}
      </div>


      {
        footer && (
          <footer
            className="
              mt-6
              border-t
              border-gray-100
              pt-4
            "
          >
            {footer}
          </footer>
        )
      }

    </section>
  );
}
