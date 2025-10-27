import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  };

  return [storedValue, setValue] as const;
}

export interface UserProgress {
  treesPlanted: number;
  co2Reduced: number;
  oxygenGenerated: number;
  wildlifeSheltered: number;
  waterSaved: number;
  greenAreaExpanded: number;
  energySaved: number;
  badges: string[];
  plantedTrees: Array<{
    id: string;
    name: string;
    plantedDate: string;
    stage: number;
  }>;
  weeklyProgress: Array<{
    week: string;
    trees: number;
    co2: number;
  }>;
}

export const useUserProgress = () => {
  return useLocalStorage<UserProgress>('greenGrowProgress', {
    treesPlanted: 0,
    co2Reduced: 0,
    oxygenGenerated: 0,
    wildlifeSheltered: 0,
    waterSaved: 0,
    greenAreaExpanded: 0,
    energySaved: 0,
    badges: [],
    plantedTrees: [],
    weeklyProgress: []
  });
};
