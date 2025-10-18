"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.es = void 0;
exports.ensureIndex = ensureIndex;
const elasticsearch_1 = require("@elastic/elasticsearch");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.es = new elasticsearch_1.Client({ node: process.env.ELASTIC_URL || 'http://localhost:9200' });
async function ensureIndex() {
    const exists = await exports.es.indices.exists({ index: 'emails' });
    if (!exists) {
        await exports.es.indices.create({
            index: 'emails',
            body: {
                mappings: {
                    properties: {
                        subject: { type: 'text' },
                        from: { type: 'text' },
                        body: { type: 'text' },
                        account: { type: 'keyword' },
                        folder: { type: 'keyword' },
                        label: { type: 'keyword' },
                        date: { type: 'date' }
                    }
                }
            } // <-- fix TypeScript typing issue
        });
        console.log('Index "emails" created');
    }
    else {
        console.log('Index "emails" already exists');
    }
}
