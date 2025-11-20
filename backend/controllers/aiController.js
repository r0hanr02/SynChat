import { generateResponse } from "../services/aiService.js";

export const getResultController = async (req, res) => {
  try {
    const { prompt } = req.query;

    if (!prompt || prompt.trim() === "") {
      return res.status(400).json({ message: "Prompt is required" });
    }

    const result = await generateResponse(prompt);

    res.send(result);
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).send({ message: error.message });
  }
};
