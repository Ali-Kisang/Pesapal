# Pesapal Integration with React and Express

This documentation provides a step-by-step guide to set up a payment integration with Pesapal using a React frontend and an Express backend.

## Prerequisites

- [Node.js and npm](https://nodejs.org/)
- Pesapal API credentials (Consumer Key and Consumer Secret)
- Basic understanding of JavaScript, React, and Express

## Project Structure


## Backend Setup (Express)

### 1. Create the Backend

Navigate to the `backend` folder and initialize a Node.js project:

```bash
mkdir backend
cd backend
npm init -y

```bash
npm install express axios body-parser dotenv

```bash
PORT=4000
PESAPAL_CONSUMER_KEY=your_pesapal_consumer_key
PESAPAL_CONSUMER_SECRET=your_pesapal_consumer_secret
