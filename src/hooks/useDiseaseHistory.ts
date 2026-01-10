import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DiagnosisData {
  userId: string;
  plantName: string;
  diseaseName?: string;
  symptoms?: string;
  diagnosis: string;
  severity?: string;
  treatment?: string;
  imageUrl?: string;
}

export const useDiseaseHistory = () => {
  const saveDiagnosis = async (data: DiagnosisData) => {
    try {
      const { error } = await supabase
        .from("disease_diagnoses")
        .insert({
          user_id: data.userId,
          plant_name: data.plantName,
          disease_name: data.diseaseName || null,
          symptoms: data.symptoms || null,
          diagnosis: data.diagnosis,
          severity: data.severity || "mild",
          treatment: data.treatment || null,
          image_url: data.imageUrl || null,
        });

      if (error) throw error;
      
      return { success: true };
    } catch (error) {
      console.error("Error saving diagnosis:", error);
      return { success: false, error };
    }
  };

  const extractDiseaseInfo = (aiResponse: string) => {
    // Try to extract structured information from AI response
    const lines = aiResponse.split('\n');
    let diseaseName = "";
    let symptoms = "";
    let treatment = "";
    let severity = "mild";

    for (const line of lines) {
      const lowerLine = line.toLowerCase();
      
      // Extract disease name
      if (lowerLine.includes("disease:") || lowerLine.includes("identified:") || lowerLine.includes("diagnosis:")) {
        diseaseName = line.split(/[:]/)[1]?.trim() || "";
      }
      
      // Extract symptoms
      if (lowerLine.includes("symptoms:") || lowerLine.includes("signs:")) {
        symptoms = line.split(/[:]/)[1]?.trim() || "";
      }
      
      // Extract treatment
      if (lowerLine.includes("treatment:") || lowerLine.includes("remedy:") || lowerLine.includes("solution:")) {
        treatment = line.split(/[:]/)[1]?.trim() || "";
      }
      
      // Determine severity
      if (lowerLine.includes("severe") || lowerLine.includes("critical") || lowerLine.includes("urgent")) {
        severity = "severe";
      } else if (lowerLine.includes("moderate") || lowerLine.includes("medium")) {
        severity = "moderate";
      }
    }

    return { diseaseName, symptoms, treatment, severity };
  };

  return { saveDiagnosis, extractDiseaseInfo };
};
