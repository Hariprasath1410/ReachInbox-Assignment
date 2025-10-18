// Stub for indexing emails
import { es } from './esClient';

export async function indexEmail(email: any) {
  await es.index({
    index: 'emails',
    document: email
  });
}
