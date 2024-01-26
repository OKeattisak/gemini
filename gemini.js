const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const fileToGenerativePart = (imageData, mimeType) => {
  return {
    inlineData: {
      data: imageData,
      mimeType,
    },
  };
};

const chatPrompt = async (prompt) => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  return text;
};

const imageChat = async (prompt, imageData, mimeType) => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
  const imageParts = [fileToGenerativePart(imageData, mimeType)];
  const result = await model.generateContent([prompt, ...imageParts]);
  const response = await result.response;
  const text = response.text();
  return text;
};

const chatHistoryPrompt = async (prompt, history) => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const chat = model.startChat({
    history,
  });
  const result = await chat.sendMessage(prompt);
  const response = await result.response;
  const text = response.text();
  return text;
};

module.exports = {
  chatPrompt,
  imageChat,
  chatHistoryPrompt,
};
