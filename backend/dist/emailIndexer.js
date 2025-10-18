"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.indexEmail = indexEmail;
// Stub for indexing emails
const esClient_1 = require("./esClient");
async function indexEmail(email) {
    await esClient_1.es.index({
        index: 'emails',
        document: email
    });
}
