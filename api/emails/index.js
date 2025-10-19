const es = require('../_lib/esClient');

module.exports = async function (req, res) {
  try {
    if (req.method === 'GET') {
      await es.indices.refresh({ index: 'emails' }).catch(() => {});
      const { q, account, folder, limit = 20, offset = 0 } = req.query || {};
      const must = [];
      if (q) must.push({ multi_match: { query: q, fields: ['subject', 'body', 'from'] } });
      if (account) must.push({ term: { account } });
      if (folder) must.push({ term: { folder } });
      const result = await es.search({
        index: 'emails',
        from: parseInt(offset, 10) || 0,
        size: parseInt(limit, 10) || 20,
        query: must.length ? { bool: { must } } : { match_all: {} }
      });
      const hits = result.hits.hits.map(h => ({ id: h._id, ...(h._source || {}) }));
      const total = typeof result.hits.total === 'number' ? result.hits.total : result.hits.total?.value || 0;
      return res.status(200).json({ total, emails: hits });
    }

    if (req.method === 'POST') {
      const body = req.body || {};
      const { subject, from, body: bodyText, account, folder, label, date } = body;
      if (!subject || !from || !bodyText || !account || !folder || !date) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      const doc = { subject, from, body: bodyText, account, folder, label, date };
      const r = await es.index({ index: 'emails', document: doc, refresh: 'wait_for' });
      return res.status(201).json({ id: r._id, ...doc });
    }

    res.setHeader('Allow', 'GET,POST');
    return res.status(405).end('Method Not Allowed');
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error', details: err.message || err });
  }
};
