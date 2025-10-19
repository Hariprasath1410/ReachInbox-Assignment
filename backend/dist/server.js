"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const esClient_1 = require("./esClient");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Enable CORS so the frontend (served on another port) can call the API
app.use((0, cors_1.default)());
app.use('/api', routes_1.default);
// Use PORT from env (backend/.env sets 3001). Default to 3001 to match frontend API URL.
const PORT = parseInt(process.env.PORT || '3001', 10);
(async () => {
    await (0, esClient_1.ensureIndex)();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})();
