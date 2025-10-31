"use client";

import { GenericStringInMemoryStorage } from "@/fhevm/GenericStringStorage";

export function useInMemoryStorage() {
  return new GenericStringInMemoryStorage();
}
