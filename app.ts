import express, { Express } from 'express';
import routes from "./app/routes";
require('dotenv').config();

// Setup
const app: Express = express();

// Routes
app.use('/', routes);

// Listen
const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Listening on ${port}`);
});

// Export the Express API
export default app;
