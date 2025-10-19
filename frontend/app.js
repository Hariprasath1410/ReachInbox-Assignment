// Use localhost backend during development, otherwise use relative API path so deployment can proxy to a backend
const API = (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
  ? 'http://localhost:3001/api/emails'
  : '/api/emails';

async function fetchEmails() {
  try {
    const res = await fetch(API);
    const data = await res.json();
    const emailsDiv = document.getElementById('emails');
    emailsDiv.innerHTML = '';
    if (!data.emails || data.emails.length === 0) {
      emailsDiv.innerHTML = '<div class="empty">No emails found</div>';
      return;
    }
    data.emails.forEach(email => {
      const div = document.createElement('div');
      div.className = 'email-item';
      div.innerHTML = `
        <div>
          <div class="title">${escapeHtml(email.subject || '(no subject)')}</div>
          <div class="meta">${escapeHtml(email.from || '')} • ${escapeHtml(email.date || '')}</div>
        </div>
        <div class="email-actions">
          <button onclick="viewEmail('${email.id}')">View</button>
          <button onclick="deleteEmail('${email.id}')">Delete</button>
        </div>`;
      emailsDiv.appendChild(div);
    });
  } catch (err) {
    console.error(err);
    document.getElementById('emails').innerHTML = '<div class="empty">Failed to load emails</div>';
  }
}

async function viewEmail(id) {
  try {
    const res = await fetch(`${API}/${id}`);
    if (!res.ok) return alert('Email not found');
    const email = await res.json();
    const details = document.getElementById('emailDetails');
    details.style.display = 'block';
    details.innerHTML = `
      <h3>${escapeHtml(email.subject || '(no subject)')}</h3>
      <p><b>From:</b> ${escapeHtml(email.from || '')}<br>
      <b>Account:</b> ${escapeHtml(email.account || '')}<br>
      <b>Folder:</b> ${escapeHtml(email.folder || '')}<br>
      <b>Label:</b> ${escapeHtml(email.label || '')}<br>
      <b>Date:</b> ${escapeHtml(email.date || '')}</p>
      <div style="white-space:pre-wrap">${escapeHtml(email.body || '')}</div>
      <div style="margin-top:8px"><button class="btn secondary" onclick="document.getElementById('emailDetails').style.display='none'">Close</button></div>`;
  } catch (err) {
    console.error(err);
    alert('Failed to load email');
  }
}

async function deleteEmail(id) {
  if (!confirm('Delete this email?')) return;
  try {
    const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      console.error('Delete failed:', res.status, res.statusText, text);
      return alert('Delete failed: ' + (text || res.statusText));
    }
    // Successful delete: refresh list and hide details
    await fetchEmails();
    document.getElementById('emailDetails').style.display = 'none';
  } catch (err) {
    console.error(err);
    alert('Delete failed: ' + (err.message || err));
  }
}

document.getElementById('addEmailForm').onsubmit = async function(e) {
  e.preventDefault();
  const form = e.target;
  const data = Object.fromEntries(new FormData(form).entries());
  data.date = new Date(data.date).toISOString();
  try {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      console.error('Add email failed:', res.status, res.statusText, text);
      throw new Error(text || 'Add failed');
    }
    form.reset();
    fetchEmails();
  } catch (err) {
    console.error(err);
    alert('Failed to add email: ' + (err.message || err));
  }
};

document.getElementById('refreshBtn').onclick = fetchEmails;

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

fetchEmails();
