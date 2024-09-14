const express = require('express');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Function to get the file path for storing chat history
const getChatFilePath = (userId) => path.join(__dirname, 'chats', `${userId}.json`);

// Function to read chat history from a JSON file
const readChatHistory = (filePath) => {
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
  }
  return []; // Return an empty array if no chat history exists
};

// Function to save chat history to a JSON file
const saveChatHistory = (filePath, history) => {
  fs.writeFileSync(filePath, JSON.stringify(history, null, 2));
};

// Endpoint to handle chat with AI
app.post('/chat', async (req, res) => {
  const { userId, message } = req.body; // Assume userId is sent from client
  const filePath = getChatFilePath(userId);

  try {
    // Fetch data from the local fish endpoint
    const fishDataResponse = await axios.get('http://localhost:5000/fishs');
    const fishData = fishDataResponse.data;

    // Read existing chat history
    const chatHistory = readChatHistory(filePath);

    // Prepare messages to be sent to the AI, including the past history
    const messages = chatHistory.map((chat) => ({
      role: chat.role,
      content: chat.message,
    }));

    // Add the new user message to the conversation
    messages.push({ role: 'user', content: message });

    // Prepare system message with fish data
    const systemMessage = {
      role: 'system',
      content: `You are a helpful assistant on my website. Here is the current list of fish and their details: ${JSON.stringify(
        fishData
      )}. Based on this data, recommend what the customer should buy.`,
    };

    // Call the OpenAI API to get a response from GPT-4
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [systemMessage, { role: 'user', content: message }],
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    const aiResponse = response.data.choices[0].message.content.trim();

    // Append new messages to the chat history
    chatHistory.push({ role: 'user', message: message, timestamp: new Date() });
    chatHistory.push({ role: 'assistant', message: aiResponse, timestamp: new Date() });

    // Save updated chat history back to the JSON file
    saveChatHistory(filePath, chatHistory);

    res.json({ reply: aiResponse });
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    res.status(500).send('Error communicating with AI');
  }
});

// Ensure the 'chats' directory exists
if (!fs.existsSync(path.join(__dirname, 'chats'))) {
  fs.mkdirSync(path.join(__dirname, 'chats'));
}

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
