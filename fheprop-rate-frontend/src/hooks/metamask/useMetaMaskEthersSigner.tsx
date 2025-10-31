"use client";

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";
import { useMetaMask } from "./useMetaMaskProvider";

export interface UseMetaMaskEthersSignerState {
  ethersSigner: ethers.JsonRpcSigner | undefined;
  ethersReadonlyProvider: ethers.ContractRunner | undefined;
}

const MetaMaskEthersSignerContext = createContext<UseMetaMaskEthersSignerState | undefined>(undefined);

export const MetaMaskEthersSignerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { provider, accounts, chainId } = useMetaMask();
  const [ethersSigner, setEthersSigner] = useState<ethers.JsonRpcSigner | undefined>();

  const ethersReadonlyProvider = useMemo(() => {
    if (provider) {
      return new ethers.BrowserProvider(provider);
    } else {
      // Mock mode: use local provider
      console.log("[useMetaMaskEthersSigner] Using local provider for mock mode");
      return new ethers.JsonRpcProvider("http://localhost:8545");
    }
  }, [provider]);

  const fallbackToLocalSigner = async () => {
    try {
      const localProvider = new ethers.JsonRpcProvider("http://localhost:8545");
      const signer = new ethers.JsonRpcSigner(localProvider, accounts?.[0] || "0x84caCcbde1B2fa965B44B6F2F12F7402fBEEfCCC");
      console.log("[useMetaMaskEthersSigner] Local signer created as fallback");
      setEthersSigner(signer);
    } catch (error) {
      console.error("Failed to create local signer:", error);
      setEthersSigner(undefined);
    }
  };

  useEffect(() => {
    const getSigner = async () => {
      // Always try to use MetaMask/Browser wallet first if available
      if (provider && accounts && accounts.length > 0) {
        console.log("[useMetaMaskEthersSigner] Using browser wallet provider");
        try {
          const ethersProvider = new ethers.BrowserProvider(provider);
          const signer = await ethersProvider.getSigner();
          setEthersSigner(signer as ethers.JsonRpcSigner);
          console.log("[useMetaMaskEthersSigner] Browser signer created");
        } catch (error) {
          console.error("Failed to get browser signer:", error);
          // Fallback to local provider if browser wallet fails
          fallbackToLocalSigner();
        }
      } else if (provider && chainId !== 31337) {
        // Try browser wallet even without accounts (might be connecting)
        console.log("[useMetaMaskEthersSigner] Browser provider available, trying to get signer");
        try {
          const ethersProvider = new ethers.BrowserProvider(provider);
          const signer = await ethersProvider.getSigner();
          setEthersSigner(signer as ethers.JsonRpcSigner);
          console.log("[useMetaMaskEthersSigner] Browser signer created");
        } catch (error) {
          console.error("Failed to get browser signer:", error);
          fallbackToLocalSigner();
        }
      } else {
        // No browser wallet available, use local provider
        console.log("[useMetaMaskEthersSigner] No browser wallet, using local provider");
        fallbackToLocalSigner();
      }
    };

    getSigner();
  }, [provider, accounts, chainId]);

  return (
    <MetaMaskEthersSignerContext.Provider
      value={{
        ethersSigner,
        ethersReadonlyProvider,
      }}
    >
      {children}
    </MetaMaskEthersSignerContext.Provider>
  );
};

export function useMetaMaskEthersSigner() {
  const context = useContext(MetaMaskEthersSignerContext);
  if (context === undefined) {
    throw new Error("useMetaMaskEthersSigner must be used within a MetaMaskEthersSignerProvider");
  }
  return context;
}
