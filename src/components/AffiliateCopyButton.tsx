'use client'

import { useState } from 'react';

export default function AffiliateCopyButton({ affiliateUrl }: { affiliateUrl: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(affiliateUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        readOnly
        value={affiliateUrl}
        className="w-full bg-muted border border-border rounded-lg px-2.5 py-1 text-[11px] text-muted-foreground select-all focus:outline-none"
      />
      <button
        type="button"
        onClick={handleCopy}
        className="rounded-lg bg-primary text-primary-foreground px-3 py-1 text-[11px] font-semibold hover:opacity-90 transition-opacity shrink-0 cursor-pointer"
      >
        {copied ? '¡Copiado!' : 'Copiar'}
      </button>
    </div>
  );
}