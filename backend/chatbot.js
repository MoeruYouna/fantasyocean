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

const getChatFilePath = (userId) => path.join(__dirname, 'chats', `${userId}.json`);

const readChatHistory = (filePath) => {
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
  }
  return []; // Return an empty array if no chat history exists
};

const saveChatHistory = (filePath, history) => {
  fs.writeFileSync(filePath, JSON.stringify(history, null, 2));
};

app.post('/chat', async (req, res) => {
  const { userId, message } = req.body; 
  const filePath = getChatFilePath(userId);

  try {
    // Fetch fish data
    const fishDataResponse = await axios.get('http://localhost:5000/fishs');
    const fishData = fishDataResponse.data;

    // Fetch item data
    const itemDataResponse = await axios.get('http://localhost:5000/items');
    const itemData = itemDataResponse.data;

    // Tạo danh sách HTML cho cá và vật phẩm
    const fishList = fishData.map(fish => `<li>${fish.name} - Price: ${fish.price} VNĐ</li>`).join('');
    const itemList = itemData.map(item => `<li>${item.name} - Price: ${item.price} VNĐ</li>`).join('');

    // Read chat history
    const chatHistory = readChatHistory(filePath);

    const messages = chatHistory.map((chat) => ({
      role: chat.role,
      content: chat.message,
    }));

    messages.push({ role: 'user', content: message });

    // Combine fish and item data in the system message
    const systemMessage = {
      role: 'system',
      content: `You are a helpful assistant on my website. Here is the current list of fish and items available for sale: 
      <h3>Fish List:</h3>
      <ul>${fishList}</ul>
      <h3>Item List:</h3>
      <ul>${itemList}</ul>
      Based on this data, recommend what the customer should buy.`,
    };

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

    // Update chat history with the user's message and assistant's response
    chatHistory.push({ role: 'user', message: message, timestamp: new Date() });
    chatHistory.push({ role: 'assistant', message: aiResponse, timestamp: new Date() });

    // Save updated chat history
    saveChatHistory(filePath, chatHistory);

    res.json({ reply: aiResponse });
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    res.status(500).send('Error communicating with AI');
  }
});

if (!fs.existsSync(path.join(__dirname, 'chats'))) {
  fs.mkdirSync(path.join(__dirname, 'chats'));
}

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
