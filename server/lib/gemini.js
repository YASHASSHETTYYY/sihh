import { GoogleGenerativeAI } from "@google/generative-ai";

const SUPPORT_SYSTEM_PROMPT = `
You are EchoWell, an empathetic mental wellness companion.
Respond in a calm, encouraging tone.
Give practical, short suggestions.
Never claim to be a therapist or diagnose conditions.
If the user shows signs of immediate self-harm risk, advise them to contact local emergency services and trusted people immediately.
`;

function fallbackReply(message) {
  const lower = String(message || "").toLowerCase();

  if (lower.includes("panic") || lower.includes("anxious") || lower.includes("anxiety")) {
    return "I hear you. Let us ground together: inhale for 4 counts, hold for 4, exhale for 6, and repeat 5 times. If you want, I can also help you break down what triggered this feeling.";
  }

  if (lower.includes("sad") || lower.includes("down") || lower.includes("depressed")) {
    return "Thank you for sharing that. A gentle next step is to do one small action right now, like drinking water, stepping outside, or texting someone you trust. Small actions can create momentum.";
  }

  return "Thanks for sharing. I am here with you. A helpful reset is 60 seconds of slow breathing, then writing one thing you can control in the next hour. Want to do that together?";
}

export async function generateSupportReply({ message, history = [], user }) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return {
      reply: fallbackReply(message),
      source: "fallback",
    };
  }

  try {
    const client = new GoogleGenerativeAI(apiKey);
    const model = client.getGenerativeModel({
      model: process.env.GEMINI_MODEL || "gemini-1.5-flash",
    });

    const historyText = history
      .slice(-8)
      .map((entry) => `${entry.role === "assistant" ? "Assistant" : "User"}: ${entry.content}`)
      .join("\n");

    const prompt = `${SUPPORT_SYSTEM_PROMPT}\nUser profile: ${JSON.stringify({
      name: user?.name,
      concerns: user?.issues || [],
    })}\n\nConversation:\n${historyText}\nUser: ${message}\nAssistant:`;

    const result = await model.generateContent(prompt);
    const text = result.response.text()?.trim();

    if (!text) {
      return {
        reply: fallbackReply(message),
        source: "fallback",
      };
    }

    return {
      reply: text,
      source: "gemini",
    };
  } catch (error) {
    console.error("Gemini request failed:", error.message);
    return {
      reply: fallbackReply(message),
      source: "fallback",
    };
  }
}
