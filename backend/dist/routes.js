"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const esClient_1 = require("./esClient");
const router = express_1.default.Router();
// GET /emails/:id - Get a single email by ID
router.get('/emails/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await esClient_1.es.get({ index: 'emails', id });
        if (!result.found) {
            return res.status(404).json({ error: 'Email not found' });
        }
        res.json(Object.assign({ id: result._id }, result._source));
    }
    catch (err) {
        if (err.meta && err.meta.statusCode === 404) {
            return res.status(404).json({ error: 'Email not found' });
        }
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch email', details: err.message });
    }
});
// DELETE /emails/:id - Delete an email by ID
router.delete('/emails/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await esClient_1.es.delete({ index: 'emails', id });
        res.json({ success: true });
    }
    catch (err) {
        if (err.meta && err.meta.statusCode === 404) {
            return res.status(404).json({ error: 'Email not found' });
        }
        console.error(err);
        res.status(500).json({ error: 'Failed to delete email', details: err.message });
    }
});
router.get('/emails', async (req, res) => {
    try {
        const { q, account, folder, limit = 20, offset = 0 } = req.query;
        const must = [];
        if (q)
            must.push({ multi_match: { query: q, fields: ['subject', 'body', 'from'] } });
        if (account)
            must.push({ term: { account } });
        if (folder)
            must.push({ term: { folder } });
        const result = await esClient_1.es.search({
            index: 'emails',
            from: parseInt(offset),
            size: parseInt(limit),
            query: must.length ? { bool: { must } } : { match_all: {} }
        });
        const hits = result.hits.hits.map(hit => ({
            id: hit._id,
            ...hit._source
        }));
        let total = 0;
        if (result.hits.total) {
            total = typeof result.hits.total === 'number' ? result.hits.total : result.hits.total.value;
        }
        res.json({ total, emails: hits });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Search failed', details: err.message });
    }
});
// POST /emails - Add a new email document
router.post('/emails', async (req, res) => {
    try {
        const { subject, from, body, account, folder, label, date } = req.body;
        if (!subject || !from || !body || !account || !folder || !date) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const doc = { subject, from, body, account, folder, label, date };
        const result = await esClient_1.es.index({
            index: 'emails',
            document: doc
        });
        res.status(201).json({ id: result._id, ...doc });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to add email', details: err.message });
    }
});
exports.default = router;
