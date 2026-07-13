"use server";

import { GoogleGenAI } from "@google/genai";
import { auth } from "@/auth";

export async function enhanceScopeOfWork(currentText: string, projectName: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `You are an expert, highly professional Project Manager and Business Analyst. 
I am creating a project named "${projectName}". 
I have the following rough notes for the Scope of Work.
Your task is to take these notes and rewrite them into a perfectly structured, comprehensive, and clear Scope of Work using Markdown formatting.
If the notes are completely empty, generate a comprehensive boilerplate Scope of Work template tailored for "${projectName}" (or a generic software/design project if the name is generic).
Include sections like Project Overview, Objectives, Deliverables, Timeline, and Out of Scope (if applicable).
Keep it concise but highly professional. Do not add conversational filler like "Here is the scope". Just return the Markdown text.

Rough Notes:
${currentText || "(No notes provided, generate a template)"}
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
    });
    
    return response.text;
  } catch (error: any) {
    console.error("AI Enhance Error:", error);
    throw new Error(error.message || "Failed to enhance scope of work.");
  }
}
