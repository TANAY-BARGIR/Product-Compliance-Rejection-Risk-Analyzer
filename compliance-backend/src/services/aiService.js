// src/services/aiService.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

/**
 * Generates a human-readable explanation for a compliance report.
 * @param {Object} complianceReport - The full JSON report from Rule Engine
 * @returns {Promise<string>} - The AI's explanation
 */
async function generateExplanation(complianceReport) {
  try {
    // 1. Construct the Prompt
    const prompt = `
      You are a Senior Compliance Officer for the Bureau of Indian Standards (BIS).
      Analyze the following product compliance report for a Soap Product (IS 2888:2004).
      
      REPORT DATA:
      ${JSON.stringify(complianceReport, null, 2)}

      YOUR TASK:
      1. Summarize the status (PASS/FAIL) in 1 sentence.
      2. If FAILED, explain the specific reasons clearly (mention the chemical names and limits).
      3. Provide 1-2 specific recommendations to fix the issues.
      4. Note any "Unknown Ingredients" that need manual review.
      
      Keep the tone professional but clear. Max 150 words.
    `;

    // 2. Call the API
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("AI Service Error:", error);
    return "AI Explanation unavailable at this time (Service Error).";
  }
}

module.exports = { generateExplanation };
