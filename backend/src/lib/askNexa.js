import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });

export async function askNexa(message, userName = "User") {
  try {
    const prompt = `
You are Nexa, a helpful AI assistant whose sole purpose is to help users learn new languages — such as vocabulary, grammar, sentence structure, translation, pronunciation tips, and language practice.
❗You must politely decline to answer questions that are NOT related to language learning.

Examples of things you should help with:
- "How do I say 'thank you' in Japanese?"
- "What's the difference between 'ser' and 'estar' in Spanish?"
- "Can you help me practice French conversation?"

Examples of things you should NOT answer:
- "Who is the father of SRK?"
- "What's the capital of France?"
- "Tell me a joke."

Always respond clearly, encouragingly, and stay strictly within the scope of language learning.

${userName}: ${message}
`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    return text.trim();
  } catch (error) {
    console.error("Error from Gemini:", error);
    return "Sorry, I'm having trouble responding right now.";
  }
}
