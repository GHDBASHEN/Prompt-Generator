import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Initialize the Gemini AI model
// Make sure to set GEMINI_API_KEY in your .env.local file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro-preview-03-25" }); // Using Flash for speed

export async function POST(req) {
  try {
    // 1. Get the user's inputs
    const body = await req.json();
    const {
      subject, // This is the new field
      cloth,
      clothColor,
      hasCar,
      carModel,
      location,
      vibe,
      customOptions,
    } = body;

    // 2. Create the system prompt
    const systemPrompt = `
      You are an expert prompt creator for AI image generators (like Midjourney or DALL-E).
      Your goal is to take a list of user inputs and combine them into a single, detailed,
      vivid, and highly effective image prompt.

      **Rules:**
      - Combine all elements naturally into a scene description.
      - Be descriptive. Instead of "a person wearing a red shirt", say "A person is styled in a vibrant red t-shirt...".
      - The prompt should be a single paragraph.
      - Add details about lighting, camera angle, and style (e.g., "photorealistic", "cinematic lighting", "wide-angle shot", "4K", "masterpiece", "ultra-detailed").
      - Enhance the "vibe" by translating it into descriptive artistic terms.

      **User Inputs to use:**
      - Main Subject: ${subject}.
      - Location: The scene is set at a ${location}.
      - Vibe/Mood: The overall vibe should be ${vibe}.
      
      **Optional Details (include if provided):**
      - Clothing: The subject is wearing a ${clothColor} ${cloth}.
      ${
        hasCar
          ? `- Vehicle: Include a ${carModel} nearby.`
          : ""
      }
      ${
        customOptions
          ? `- Custom Details: Also include the following: ${customOptions}`
          : ""
      }

      Now, generate the perfect image prompt based on those inputs.
    `;

    // 3. Call the Gemini API
    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const generatedPrompt = response.text();

    // 4. Send the generated prompt back to the frontend
    return NextResponse.json({
      prompt: generatedPrompt,
    });
  } catch (error) {
    console.error("Error in API route:", error);
    // Provide a more specific error message if possible
    let errorMessage = "Failed to generate prompt";
    if (error.message.includes('API key')) {
        errorMessage = "Invalid or missing API key. Please check your .env.local file."
    }
    
    return NextResponse.json(
      { error: errorMessage, details: error.message },
      { status: 500 }
    );
  }
}