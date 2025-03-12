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
          { role: "user", content: question },
        ],
        max_tokens: 100,
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
