// Starter IMAP worker
import { ImapFlow } from 'imapflow';

export async function startImapWorker(account: { user: string; password: string; host: string }) {
  const client = new ImapFlow({
    host: account.host,
    port: 993,
    secure: true,
    auth: {
      user: account.user,
      pass: account.password
    }
  });

  client.on('exists', async (mailbox) => {
    console.log('New email detected in', mailbox);
  });

  await client.connect();
}
