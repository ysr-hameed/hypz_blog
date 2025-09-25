// generateBlogRouter.js
import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import config from "../config/config.js";

const generateBlogRouter = express.Router();
console.log("Loading generateBlogRouter...");

// Gemini client init
const GEMINI_API_KEY = config.gemini_api;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// Helper to clean AI response
function cleanAIResponse(text) {
  if (!text) return text;
  // Remove stray backticks or extra whitespace
  return text.replace(/(^```|```$)/g, "").trim();
}

// Main function to generate blog
const generateBlogJSON = async (title) => {
  try {
    const contents = [
      {
        parts: [
          {
            text: `
You are an expert content writer, SEO specialist, web strategist, and multimedia content generator with experience in creating professional, student-friendly blogs optimized for SEO, readability, and human-like natural flow.

TASK: Generate a detailed blog in JSON format based solely on the given title. The blog should be comprehensive, engaging, humanized, and ready to save in a database.

INSTRUCTIONS:

1. INPUT:
   - Title : "${title}"

2. OUTPUT FORMAT:
   - Respond ONLY in JSON format as per the structure below.
   - Minimum word count: 800, Maximum: 1500.
   - Include headings, subheadings, examples, code snippets (if relevant), multimedia suggestions, FAQs, SEO keywords, hashtags, and internal links.

3. LANGUAGE & TONE:
   - Hinglish or English depending on the topic and target audience.
   - Tone: professional, student-friendly, clear, readable, and human-like.
   - Use mild informal phrasing, contractions, curiosity hooks, rhetorical questions, and analogies.

4. READABILITY RULES:
   - Sentence length: max 15-20 words.
   - Paragraph length: 3-5 lines.
   - Avoid jargon; explain technical terms simply.

5. WRITING STYLE:
   - Mix short and long sentences, active voice preferred.
   - Use storytelling, real-life examples, mini case studies, step-by-step explanations.
   - Include transitional phrases for natural flow.
   - No any New hard words who human never hear use daily speaking english words.
   - Avoid repetitive AI-like patterns.
  
6. SEO & CONTENT RULES:
   - Integrate SEO keywords naturally in headings, paragraphs, FAQs.
   - Use synonyms and contextually relevant words.
   - Enhance the given title into a catchy, SEO-friendly headline while keeping the original meaning.
   - Include realistic examples, scenarios, and statistics wherever relevant.

7. FORMAT & STRUCTURE:

{
  "version": "1.0.0",
  "last_updated": "YYYY-MM-DD",
  "author": "AI-generated",
  "title": "Enhanced, catchy version of the given title",
  "meta_description": "SEO-friendly meta description summarizing the blog in 150-160 characters",
  "word_count": integer,
  "introduction": "Engaging introduction explaining the topic, value, and storytelling, no external links here",
  "sections": [
    {
      "heading": "Main subtopic with curiosity hook",
      "points": [
        {
          "text": "Key point explained in natural human tone",
          "example": "Optional real-life example or scenario",
          "code_block": {
            "language": "Optional programming language",
            "code": "Optional code snippet"
          }
        }
      ],
      "subsections": [
        {
          "subheading": "Optional subtopic with curiosity hook",
          "content": "Detailed paragraph explaining subtopic, human-like flow, examples, optional <a href=\"URL\">links</a>",
          "references": ["Array of relevant links"],
          "media": [
            {
              "type": "image/video/chart",
              "description": "Brief description enhancing understanding",
              "generator": "Gemini AI or source URL",
              "position": "top/inline/bottom"
            }
          ]
        }
      ]
    }
  ],
  "conclusion": "Summary highlighting key takeaways, actionable tips, optional media, humanized and reader-friendly.",
  "faq": [
    {
      "category": "Relevant topic (SEO, Content, AI, etc.)",
      "question": "FAQ question",
      "answer": "Concise, human-like answer, can include <a href=\"URL\">links</a>"
    }
  ],
  "seo_keywords": ["Array of SEO keywords naturally embedded"],
  "hashtags": ["Array of hashtags for social media promotion"],
  "internal_links": ["Array of suggested internal links"]
}

8. CONDITIONS:
   - Do NOT include emojis.
   - No external links in introduction.
   - Include links in sections or FAQ only if relevant.
   - All <a href> links must use double quotes.
   - Include images, videos, or charts only if they enhance understanding; prefer Gemini AI for images.
   - Generate 3-5 FAQs only if the topic requires.
   - Avoid profanity, misleading content, or unreliable sources.

9. NOTES:
   - Mimic human editor review: natural flow, clarity, readability.
   - Ensure the JSON is perfectly formatted, valid, and ready to save.
   - The prompt should work for ANY topic without further modifications.
`
          }
        ]
      }
    ];

    const generationConfig = {
      temperature: 0.7,
      maxOutputTokens: 4000
    };

    // Use Promise.race() to implement timeout
    const result = await Promise.race([
      model.generateContent({ contents, generationConfig }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request to Gemini API timed out (2 min)")), 120000)
      )
    ]);

    console.log("Full Gemini result:", JSON.stringify(result, null, 2));

    let text = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      console.error("No text found in Gemini response:", result);
      throw new Error("Gemini response did not return any text");
    }

    text = cleanAIResponse(text);

    try {
      return JSON.parse(text); // return structured object
    } catch (jsonErr) {
      console.error("JSON parse error:", jsonErr, "\nRaw AI text:", text);
      // fallback: return raw text so route doesn’t fail
      return { rawText: text };
    }
  } catch (err) {
    console.error("Gemini API Error:", err);
    throw new Error("Failed to generate content: " + (err.message || ""));
  }
};

// POST /api/blog/generate
generateBlogRouter.post("/generate", async (req, res) => {
  try {
    const title = req.body.title || "Write a short blog explaining AI in simple words.";
    console.log("Received title:", title);

    const blogJSON = await generateBlogJSON(title);

    res.status(200).json({
      success: true,
      message: "Blog generated successfully",
      blog: blogJSON
    });
  } catch (err) {
    console.error("Error in /generate route:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export { generateBlogRouter };