"use client";

import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react";
import { ethers } from "ethers";
import { createFhevmInstance, FhevmAbortError } from "./internal/fhevm";
import { FhevmInstance } from "./fhevmTypes";
import { useMetaMask } from "@/hooks/metamask/useMetaMaskProvider";

type FhevmRelayerStatusType =
  | "sdk-loading"
  | "sdk-loaded"
  | "sdk-initializing"
  | "sdk-initialized"
  | "creating";

interface UseFhevmState {
  instance: FhevmInstance | undefined;
  status: FhevmRelayerStatusType | undefined;
  error: Error | undefined;
}

const FhevmContext = createContext<UseFhevmState | undefined>(undefined);

export const FhevmProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { provider, chainId } = useMetaMask();
  const [instance, setInstance] = useState<FhevmInstance | undefined>();
  const [status, setStatus] = useState<FhevmRelayerStatusType | undefined>();
  const [error, setError] = useState<Error | undefined>();

  const abortControllerRef = useRef<AbortController | null>(null as AbortController | null);

  const createInstance = useCallback(async () => {
    console.log("[useFhevm] createInstance called, provider:", !!provider, "chainId:", chainId);
    // Allow creation even without provider for mock mode

    // Cancel previous instance creation
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      setError(undefined);

      console.log("[useFhevm] Creating FHEVM instance with provider:", provider || "http://localhost:8545");

      const newInstance = await createFhevmInstance({
        provider: provider || "http://localhost:8545", // Fallback for mock mode
        signal: abortController.signal,
        onStatusChange: (status) => {
          setStatus(status);
        },
      });

      console.log("[useFhevm] FHEVM instance created successfully:", !!newInstance);

      if (!abortController.signal.aborted) {
        setInstance(newInstance);
      }
    } catch (err) {
      if (err instanceof FhevmAbortError) {
        console.log("[useFhevm] Aborted:", err);
        return;
      }
      console.error("[useFhevm] Error creating instance:", err);
      setError(err as Error);
      setInstance(undefined);
    }
  }, [provider, chainId]);

  useEffect(() => {
    createInstance();
  }, [createInstance]);

  // Reset when chain changes
  useEffect(() => {
    setInstance(undefined);
    setStatus(undefined);
    setError(undefined);
  }, [chainId]);

  console.log("[useFhevm] Returning instance:", !!instance, "status:", status, "error:", error);

  return (
    <FhevmContext.Provider
      value={{
        instance,
        status,
        error,
      }}
    >
      {children}
    </FhevmContext.Provider>
  );
};

export function useFhevm() {
  const context = useContext(FhevmContext);
  if (context === undefined) {
    throw new Error("useFhevm must be used within a FhevmProvider");
  }
  return context;
}
