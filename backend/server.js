const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const cors = require("cors");
const axios = require("axios"); // To call OpenAI API
require("dotenv").config(); // Load API key from .env file

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let questions = []; // Store questions with responses

// Function to get a response from ChatGPT
const getChatGPTResponse = async (question) => {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo", // Use latest available GPT model
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          {
            role: "user",
            content: `You are an AI assistant responding to live audience queries in a panel discussion on AI and Technology. Your response will be displayed as-is, without modification or filtering. Your goal is to provide a direct, fact-based, and technically informed answer to each query. For each audience question, craft a response that: 1. Relies solely on factual information, technical knowledge, and established AI or technological principles. 2. Avoids personal opinions, subjective reasoning, or political bias. 3. Presents the most logical, unfiltered, and direct answer based on available knowledge. Maintain a neutral and professional tone while ensuring your answer is clear, concise, and informative. Please keep your maximum response length to 3 short sentences. Now, respond to the following audience query: ${question}`,
          },
        ],
        max_tokens: 200,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Raw ChatGPT API Response:", response.data); // ✅ Debug full API response

    return response.data.choices[0].message.content.trim();
  } catch (err) {
    console.error("Error fetching response from ChatGPT:", err);
    return "I'm sorry, but I couldn't process your question at the moment.";
  }
};

// WebSocket connection handler
wss.on("connection", (ws) => {
  console.log("New client connected");

  // Send existing questions to the new client
  ws.send(JSON.stringify(questions));

  ws.on("message", async (message) => {
    try {
      const userQuestion = JSON.parse(message).text;
      console.log("User question received:", userQuestion); // ✅ Debug log
      // Get response from ChatGPT
      const chatGPTResponse = await getChatGPTResponse(userQuestion);
      console.log("ChatGPT Response:", chatGPTResponse); // ✅ Debug log
      // Store question with response
      const formattedQuestion = {
        text: userQuestion,
        response: chatGPTResponse, // Store AI response
      };

      questions.push(formattedQuestion);

      // Broadcast new question + response to all clients
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(formattedQuestion));
          console.log("Sent ", formattedQuestion, " to client");
        }
      });
    } catch (err) {
      console.error("Error processing message:", err);
    }
  });

  ws.on("close", () => console.log("Client disconnected"));
});

// REST API to retrieve persisted questions
app.get("/questions", (req, res) => {
  res.json(questions);
});

// Start server
server.listen(8080, () => {
  console.log("Server running on http://localhost:8080");
});
