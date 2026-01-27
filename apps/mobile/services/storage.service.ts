/**
 * Storage Service
 * Wrapper around AsyncStorage for key-value storage
 */

import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Get value from storage
 */
export async function getItem<T>(key: string): Promise<T | null> {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error(`Failed to get item: ${key}`, error);
    return null;
  }
}

/**
 * Set value in storage
 */
export async function setItem<T>(key: string, value: T): Promise<boolean> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Failed to set item: ${key}`, error);
    return false;
  }
}

/**
 * Remove value from storage
 */
export async function removeItem(key: string): Promise<boolean> {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Failed to remove item: ${key}`, error);
    return false;
  }
}

/**
 * Clear all storage
 */
export async function clear(): Promise<boolean> {
  try {
    await AsyncStorage.clear();
    return true;
  } catch (error) {
    console.error("Failed to clear storage", error);
    return false;
  }
}
