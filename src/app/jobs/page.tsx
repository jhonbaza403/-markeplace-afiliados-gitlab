Archivo: `src/app/jobs/page.tsx`

Reemplazar el botón de "Ver oportunidad" por:

```tsx
<button
  type="button"
  onClick={() => {
    const jobUrl = `/jobs/${encodeURIComponent(job.id)}`;
    router.push(jobUrl);
  }}
  className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-90 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
>
  Ver oportunidad
  <span className="ml-2">
    →
  </span>
</button>
```

También verifica que el cierre del `map` permanezca exactamente así:

```tsx
            ))}
          </section>
        )}
```

y que el final del archivo conserve:

```tsx
      </div>
    </main>
  );
}
```

Esta corrección elimina cualquier problema de interpretación del template literal en Turbopack.
