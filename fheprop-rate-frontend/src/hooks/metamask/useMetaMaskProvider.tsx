"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { ethers } from "ethers";

export interface UseMetaMaskState {
  provider: ethers.Eip1193Provider | undefined;
  chainId: number | undefined;
  accounts: string[] | undefined;
  isConnected: boolean;
  error: Error | undefined;
  connect: () => Promise<void>;
}

const MetaMaskContext = createContext<UseMetaMaskState | undefined>(undefined);

export const MetaMaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [provider, setProvider] = useState<ethers.Eip1193Provider | undefined>();
  const [chainId, setChainId] = useState<number | undefined>();
  const [accounts, setAccounts] = useState<string[] | undefined>();
  const [error, setError] = useState<Error | undefined>();

  const isConnected = Boolean(provider && accounts && accounts.length > 0 && chainId);

  const connect = async () => {
    if (!window.ethereum) {
      setError(new Error("MetaMask not found"));
      return;
    }

    try {
      console.log("[useMetaMaskProvider] Connecting to MetaMask...");

      // Request accounts
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      console.log("[useMetaMaskProvider] Accounts received:", accounts);

      // Get chain ID
      const chainIdHex = await window.ethereum.request({ method: "eth_chainId" });
      const chainId = Number.parseInt(chainIdHex, 16);
      console.log("[useMetaMaskProvider] Chain ID received:", chainId);

      setProvider(window.ethereum);
      setAccounts(accounts);
      setChainId(chainId);

      setError(undefined);
    } catch (err) {
      console.error("[useMetaMaskProvider] Connection failed:", err);
      setError(err as Error);
    }
  };

  // Auto-connect logic
  useEffect(() => {
    const forceMockMode = localStorage.getItem('forceMockMode') === 'true';

    const autoConnect = async () => {
      if (forceMockMode) {
        console.log("[useMetaMaskProvider] User requested mock mode");
        setChainId(31337);
        setAccounts(["0x84caCcbde1B2fa965B44B6F2F12F7402fBEEfCCC"]);
        setProvider(undefined);
        return;
      }

      if (window.ethereum) {
        try {
          // Always try to connect to MetaMask first, even on localhost
          console.log("[useMetaMaskProvider] MetaMask detected, attempting connection...");
          const accounts = await window.ethereum.request({ method: "eth_accounts" });
          const chainIdHex = await window.ethereum.request({ method: "eth_chainId" });
          const currentChainId = Number.parseInt(chainIdHex, 16);

          console.log("[useMetaMaskProvider] MetaMask chainId:", currentChainId, "accounts:", accounts?.length);

          if (accounts && accounts.length > 0) {
            // Connected to MetaMask - use it regardless of chainId
            setProvider(window.ethereum);
            setAccounts(accounts);
            setChainId(currentChainId);
            console.log("[useMetaMaskProvider] Connected to MetaMask, chainId:", currentChainId);
          } else {
            // MetaMask available but not connected - prompt user to connect
            console.log("[useMetaMaskProvider] MetaMask available but not connected");
            setProvider(window.ethereum); // Still set provider so connect() can work
            setAccounts(undefined);
            setChainId(undefined);
          }
        } catch (err) {
          // Error with MetaMask - fallback to mock mode
          console.error("[useMetaMaskProvider] Error with MetaMask, falling back to mock:", err);
          setChainId(31337);
          setAccounts(["0x84caCcbde1B2fa965B44B6F2F12F7402fBEEfCCC"]);
          setProvider(undefined);
          setError(err as Error);
        }
      } else {
        // No MetaMask - use mock mode
        console.log("[useMetaMaskProvider] No ethereum provider found, using mock mode");
        setChainId(31337);
        setAccounts(["0x84caCcbde1B2fa965B44B6F2F12F7402fBEEfCCC"]);
        setProvider(undefined);
      }
    };

    autoConnect();
  }, []);

  return (
    <MetaMaskContext.Provider
      value={{
        provider,
        chainId,
        accounts,
        isConnected,
        error,
        connect,
      }}
    >
      {children}
    </MetaMaskContext.Provider>
  );
};

export function useMetaMask() {
  const context = useContext(MetaMaskContext);
  if (context === undefined) {
    throw new Error("useMetaMask must be used within a MetaMaskProvider");
  }
  return context;
}
