import { useState, useEffect } from 'react';

export interface PlantDraft {
  name: string;
  species?: string;
  description?: string;
  location?: string;
  isPublic: boolean;
  imageData?: string; // base64 encoded
  timestamp: number;
}

const DRAFT_KEY = 'greengrow_plant_draft';

export const useOfflineDraft = () => {
  const [draft, setDraft] = useState<PlantDraft | null>(null);
  const [hasDraft, setHasDraft] = useState(false);

  useEffect(() => {
    // Load draft from localStorage on mount
    const savedDraft = localStorage.getItem(DRAFT_KEY);
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        setDraft(parsed);
        setHasDraft(true);
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    }
  }, []);

  const saveDraft = (draftData: PlantDraft) => {
    try {
      const draftWithTimestamp = {
        ...draftData,
        timestamp: Date.now(),
      };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draftWithTimestamp));
      setDraft(draftWithTimestamp);
      setHasDraft(true);
    } catch (error) {
      console.error('Error saving draft:', error);
    }
  };

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setDraft(null);
    setHasDraft(false);
  };

  const loadDraft = (): PlantDraft | null => {
    return draft;
  };

  return {
    draft,
    hasDraft,
    saveDraft,
    clearDraft,
    loadDraft,
  };
};