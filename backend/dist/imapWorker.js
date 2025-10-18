"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startImapWorker = startImapWorker;
// Starter IMAP worker
const imapflow_1 = require("imapflow");
async function startImapWorker(account) {
    const client = new imapflow_1.ImapFlow({
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
