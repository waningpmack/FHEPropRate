"use client";

import { ReactNode } from "react";
import { MetaMaskProvider } from "@/hooks/metamask/useMetaMaskProvider";
import { MetaMaskEthersSignerProvider } from "@/hooks/metamask/useMetaMaskEthersSigner";
import { FhevmProvider } from "@/fhevm/useFhevm";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <MetaMaskProvider>
      <MetaMaskEthersSignerProvider>
        <FhevmProvider>
          {children}
        </FhevmProvider>
      </MetaMaskEthersSignerProvider>
    </MetaMaskProvider>
  );
}

