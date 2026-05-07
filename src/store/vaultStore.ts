import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

interface VaultState {
  isUnlocked: boolean;
  unlockVault: (pin: string) => Promise<boolean>;
  lockVault: () => void;
  setPin: (pin: string) => Promise<void>;
  hasPin: () => Promise<boolean>;
}

const PIN_KEY = 'noteva_vault_pin';

export const useVaultStore = create<VaultState>((set) => ({
  isUnlocked: false,
  unlockVault: async (pin: string) => {
    const storedPin = await SecureStore.getItemAsync(PIN_KEY);
    if (storedPin === pin) {
      set({ isUnlocked: true });
      return true;
    }
    return false;
  },
  lockVault: () => set({ isUnlocked: false }),
  setPin: async (pin: string) => {
    await SecureStore.setItemAsync(PIN_KEY, pin);
  },
  hasPin: async () => {
    const pin = await SecureStore.getItemAsync(PIN_KEY);
    return !!pin;
  },
}));
