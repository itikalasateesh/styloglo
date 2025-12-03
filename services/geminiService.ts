import { GoogleGenAI, Type } from "@google/genai";
import { stripBase64Prefix, getMimeTypeFromBase64 } from "../utils/imageUtils";
import { StyleProfile, WeeklyPlanDay } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Models
const MODEL_TEXT_ANALYSIS = 'gemini-2.5-flash';
const MODEL_IMAGE_EDIT = 'gemini-2.5-flash-image';

export const analyzeImageStyle = async (base64Image: string): Promise<StyleProfile> => {
  const mimeType = getMimeTypeFromBase64(base64Image);
  const data = stripBase64Prefix(base64Image);

  const response = await ai.models.generateContent({
    model: MODEL_TEXT_ANALYSIS,
    contents: {
      parts: [
        {
          inlineData: {
            mimeType,
            data,
          },
        },
        {
          text: `Analyze this person's face shape, skin tone, and gender.
                 Create a style profile with exactly 5 recommendations for each category based on their features.
                 
                 If Male:
                 - Hair: 5 trendy hairstyles suitable for their face shape.
                 - Beard: 5 beard styles (or clean shaven options) matching their jawline.
                 - Sunglasses: 5 specific sunglasses shapes/styles.
                 - Colors: 5 outfit color palettes or specific clothing styles suitable for their skin tone.
                 - Tattoos: 5 tattoo concepts including the body part (e.g. "Tribal design on forearm").
                 
                 If Female:
                 - Hair: 5 trendy hairstyles suitable for their face shape.
                 - Sunglasses: 5 specific sunglasses shapes/styles.
                 - Colors: 5 outfit color palettes or specific clothing styles.
                 - Earrings: 5 earring styles (e.g. "Gold Hoops", "Diamond Studs").
                 - Makeup: 5 lipstick shades or makeup looks (e.g. "Matte Red Lipstick", "Nude Gloss & Peach Blush").
                 - Eyebrows: 5 eyebrow shapes (e.g. "Soft Arch", "Thick Natural").
                 - Eyelashes: 5 eyelash styles (e.g. "Cat Eye Wispy", "Natural Volume").
                 - Stickers: 5 face stickers or bindis styles.
                 - Tattoos: 5 tattoo concepts including the body part.
                 
                 Ensure 'gender' is strictly 'Male' or 'Female'.`
        },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          faceShape: { type: Type.STRING },
          skinTone: { type: Type.STRING },
          gender: { type: Type.STRING, enum: ["Male", "Female", "Unspecified"] },
          undertone: { type: Type.STRING, enum: ["Warm", "Cool", "Neutral"] },
          recommendations: {
            type: Type.OBJECT,
            properties: {
              hair: { type: Type.ARRAY, items: { type: Type.STRING } },
              colors: { type: Type.ARRAY, items: { type: Type.STRING } },
              sunglasses: { type: Type.ARRAY, items: { type: Type.STRING } },
              tattoos: { type: Type.ARRAY, items: { type: Type.STRING } },
              beard: { type: Type.ARRAY, items: { type: Type.STRING } },
              makeup: { type: Type.ARRAY, items: { type: Type.STRING } },
              earrings: { type: Type.ARRAY, items: { type: Type.STRING } },
              stickers: { type: Type.ARRAY, items: { type: Type.STRING } },
              eyelashes: { type: Type.ARRAY, items: { type: Type.STRING } },
              eyebrows: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
          },
        },
      },
    },
  });

  const text = response.text || "{}";
  return JSON.parse(text) as StyleProfile;
};

export const generateWeeklyStylePlan = async (profile: StyleProfile): Promise<WeeklyPlanDay[]> => {
  const prompt = `Based on a ${profile.gender} with ${profile.skinTone} skin (${profile.undertone} undertone) and a ${profile.faceShape} face shape, create a 7-day style calendar.
                  Include a mix of Casual, Office, and Traditional/Party styles. Suggest outfit colors that match their skin tone.`;

  const response = await ai.models.generateContent({
    model: MODEL_TEXT_ANALYSIS,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            day: { type: Type.STRING },
            occasion: { type: Type.STRING },
            outfit: { type: Type.STRING },
          },
        },
      },
    },
  });

  const text = response.text || "[]";
  return JSON.parse(text) as WeeklyPlanDay[];
};

export const editUserImage = async (base64Image: string, prompt: string): Promise<string> => {
  const mimeType = getMimeTypeFromBase64(base64Image);
  const data = stripBase64Prefix(base64Image);

  const response = await ai.models.generateContent({
    model: MODEL_IMAGE_EDIT,
    contents: {
      parts: [
        {
          inlineData: {
            mimeType,
            data,
          },
        },
        {
          text: prompt,
        },
      ],
    },
  });

  if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData && part.inlineData.data) {
        return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
      }
    }
  }
  
  throw new Error("No image generated by the model.");
};