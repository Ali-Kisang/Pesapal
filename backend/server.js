const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:5174",
    credentials: true,
  })
);
const PORT = process.env.PORT || 4000;
const PESAPAL_CONSUMER_KEY = process.env.consumer_key;
const PESAPAL_CONSUMER_SECRET = process.env.consumer_secret;

// Ensure Pesapal API keys are loaded
if (!PESAPAL_CONSUMER_KEY || !PESAPAL_CONSUMER_SECRET) {
  console.error("Pesapal API keys are missing. Please check your .env file.");
  process.exit(1);
}

// Route to fetch OAuth token from Pesapal
app.get("/api/get-token", async (req, res) => {
  try {
    const response = await axios.post(
      "https://cybqa.pesapal.com/pesapalv3/api/Auth/RequestToken",
      {
        consumer_key: PESAPAL_CONSUMER_KEY,
        consumer_secret: PESAPAL_CONSUMER_SECRET,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    const { token } = response.data;
    res.json({ token });
  } catch (error) {
    console.error(
      "Error fetching token:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({
      message: "Error fetching token",
      error: error.response ? error.response.data : error.message,
    });
  }
});

// Route to process payment
app.post("/api/payment", async (req, res) => {
  const { amount, description, email, phoneNumber } = req.body;
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header

  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }

  const paymentData = {
    amount,
    description,
    email,
    phone_number: phoneNumber,
  };

  try {
    const response = await axios.post(
      "https://cybqa.pesapal.com/pesapalv3/api/Transactions/SubmitOrderRequest",
      paymentData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error(
      "Error processing payment:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({
      message: "Error processing payment",
      error: error.response ? error.response.data : error.message,
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
