const es = require('../_lib/esClient');

module.exports = async function (req, res) {
  const { id } = req.query;
  try {
    if (req.method === 'GET') {
      const r = await es.get({ index: 'emails', id }).catch(e => { throw e; });
      if (!r.found) return res.status(404).json({ error: 'Email not found' });
      return res.status(200).json(Object.assign({ id: r._id }, r._source));
    }

    if (req.method === 'DELETE') {
      await es.delete({ index: 'emails', id, refresh: 'wait_for' });
      await es.deleteByQuery({ index: 'emails', query: { term: { _id: id } }, refresh: true }).catch(() => {});
      await es.indices.refresh({ index: 'emails' }).catch(() => {});
      return res.status(200).json({ success: true });
    }

    res.setHeader('Allow', 'GET,DELETE');
    return res.status(405).end('Method Not Allowed');
  } catch (err) {
    if (err?.meta?.statusCode === 404) return res.status(404).json({ error: 'Email not found' });
    console.error(err);
    return res.status(500).json({ error: 'Server error', details: err.message || err });
  }
};
