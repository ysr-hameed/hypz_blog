import express from "express";
import { GoogleGenAI } from "@google/genai";
import config from "../config/config.js"


const generateBlogRouter = express.Router();

const GEMINI_API_KEY = config.gemini_api; // better: use env variable
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

async function geminiFun(prompt) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    return response.output_text; // safer access
  } catch (err) {
    console.error("Gemini API Error:", err);
    throw new Error("Failed to generate content");
  }
}

generateBlogRouter.get("/test", async (req, res) => {
  try {
    const aiResponse = await geminiFun("Explain how AI works in a few words");
    return res.status(200).json({
      success: true,
      message: "tested",
      response: aiResponse,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

export { generateBlogRouter };