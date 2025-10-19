import { Client } from '@elastic/elasticsearch';
import dotenv from 'dotenv';
dotenv.config();

export const es = new Client({ node: process.env.ELASTIC_URL || 'http://localhost:9200' });

export async function ensureIndex() {
  const existsResp = await es.indices.exists({ index: 'emails' });

  // es.indices.exists returns an object { body: boolean } in v8 client
  const exists = (existsResp as any).body === true;

  if (!exists) {
    try {
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
    } catch (e: any) {
      // ignore if index already exists (race condition)
      if (e?.meta?.body?.error?.type === 'resource_already_exists_exception') {
        console.log('Index already exists (race), continuing');
      } else {
        throw e;
      }
    }
  } else {
    console.log('Index "emails" already exists');
  }
}
