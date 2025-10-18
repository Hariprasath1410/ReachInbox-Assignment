import { Client } from '@elastic/elasticsearch';
import dotenv from 'dotenv';
dotenv.config();

export const es = new Client({ node: process.env.ELASTIC_URL || 'http://localhost:9200' });

export async function ensureIndex() {
  const exists = await es.indices.exists({ index: 'emails' });

  if (!exists) {
    await es.indices.create({
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
      } as any // <-- fix TypeScript typing issue
    });

    console.log('Index "emails" created');
  } else {
    console.log('Index "emails" already exists');
  }
}
