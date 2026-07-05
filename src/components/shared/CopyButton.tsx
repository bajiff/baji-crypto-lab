import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { NeoButton } from './NeoButton';

interface CopyButtonProps {
  textToCopy: string;
  className?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({ textToCopy, className = '' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!textToCopy) return;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <NeoButton
      onClick={handleCopy}
      variant={copied ? 'success' : 'secondary'}
      size="sm"
      disabled={!textToCopy}
      className={className}
      title="Salin ke clipboard"
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 stroke-[3]" />
          <span>Copied!</span>
        </>
      ) : (
        <>
          <Copy className="w-4 h-4 stroke-[2.5]" />
          <span>Copy</span>
        </>
      )}
    </NeoButton>
  );
};
