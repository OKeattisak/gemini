const express = require("express");
const multer = require("multer");
const { imageChat, chatPrompt, chatHistoryPrompt } = require("./gemini");
const app = express();
require("dotenv").config();
app.use(express.json());
const upload = multer({ storage: multer.memoryStorage() });

app.post("/api/chat", async (req, res) => {
  const { chat } = req.body;
  const result = await chatPrompt(chat);
  res.json({ message: result });
});

app.post("/api/upload", upload.single("file"), async (req, res) => {
  const file = req.file;
  const { chat } = req.body;
  if (!file) {
    return res.status(400).send("No file uploaded.");
  }
  if (!chat) {
    return res.status(400).send("No chat.");
  }
  const fileData = file.buffer.toString("base64");
  const fileMimetype = file.mimetype;
  const result = await imageChat(chat, fileData, fileMimetype);
  res.json({ message: result });
});

app.post("/api/history", async (req, res) => {
  const { chat, history } = req.body;
  const result = await chatHistoryPrompt(chat, history);
  res.json({ message: result });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
