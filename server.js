"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: './config.env' });
app_1.app.listen(process.env.PORT || 5000, () => {
    console.log(`listening to port ${process.env.PORT} `);
});
