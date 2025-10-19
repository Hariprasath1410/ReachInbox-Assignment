const { Client } = require('@elastic/elasticsearch');

const node = process.env.ELASTIC_URL || 'http://localhost:9200';
const es = new Client({ node });

module.exports = es;
