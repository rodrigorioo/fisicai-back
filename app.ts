import express, { Express } from 'express';
require('dotenv').config();

// Setup
const app: Express = express();

// Listen
const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Listening on ${port}`);
});

// Export the Express API
export default app;
