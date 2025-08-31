import { MMKV } from 'react-native-mmkv';

export const mmkv = new MMKV({ id: 'max-flow-storage' });

export type MMKVValue = string | number | boolean | Uint8Array;

export const mmkvStorageAdapter = {
  getItem: (name: string): string | null => {
    try {
      const value = mmkv.getString(name);
      return value ?? null;
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: string): void => {
    mmkv.set(name, value);
  },
  removeItem: (name: string): void => {
    mmkv.delete(name);
  },
};
