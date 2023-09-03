"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require('dotenv').config();
// Setup
const app = (0, express_1.default)();
// Listen
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Listening on ${port}`);
});
// Export the Express API
exports.default = app;
