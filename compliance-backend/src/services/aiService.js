const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

async function generateExplanation(complianceReport) {
  try {
    const prompt = `
      You are a Senior Compliance Officer reviewing a product compliance report.
      Standard: ${complianceReport.standard || "Unknown"}
      
      REPORT DATA:
      ${JSON.stringify(complianceReport, null, 2)}

      YOUR TASK:
      1. Summarize the compliance status in 1 sentence.
      2. If NON-COMPLIANT, explain the specific violations (chemical names and limits).
      3. If BORDERLINE, warn which values are close to limits.
      4. Provide 1-2 specific recommendations to fix issues.
      5. Note any "Unknown Ingredients" that need manual review.
      
      Keep the tone professional but clear. Max 150 words.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("AI Service Error:", error);
    return "AI Explanation unavailable at this time (Service Error).";
  }
}

module.exports = { generateExplanation };
