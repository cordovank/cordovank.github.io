// assets/js/portfolio-chat.js
// Chat widget script

// ─── CONFIGURATION ────────────────────────────────────────────────────────────
const PROVIDER = 'openai'; // 'openai', 'anthropic', etc.
const WORKER_URL = 'https://portfolio-chat-worker.cordovan-edu.workers.dev';

// ─── STATE ────────────────────────────────────────────────────────────────────
let conversationHistory = [];
let isLoading = false;

// ─── SEND MESSAGE ─────────────────────────────────────────────────────────────
async function sendPortfolioMessage(userText) {
  if (!userText.trim() || isLoading) return;

  isLoading = true;
  conversationHistory.push({ role: 'user', content: userText });
  renderMessages();
  setInputEnabled(false);
  showTypingIndicator();

  try {
    const assistantText = await callPortfolioAPI();
    conversationHistory.push({ role: 'assistant', content: assistantText });
  } catch (err) {
    conversationHistory.push({
      role: 'assistant',
      content: "Sorry, I couldn't reach the AI right now. Try again in a moment."
    });
    console.error('Portfolio chat error:', err);
  } finally {
    hideTypingIndicator();
    isLoading = false;
    setInputEnabled(true);
    renderMessages();
  }
}

// ─── WORKER API CALL ──────────────────────────────────────────────────────────
async function callPortfolioAPI() {
  const messages = [
    { role: 'system', content: PORTFOLIO_KNOWLEDGE },
    ...conversationHistory,
  ];

  const response = await fetch(WORKER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      provider: PROVIDER,
      messages,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Worker ${response.status}: ${errText}`);
  }

  const data = await response.json();
  return data.answer;
}

// ─── UI HELPERS ───────────────────────────────────────────────────────────────
function renderMessages() {
  const container = document.getElementById('pchat-messages');
  if (!container) return;

  container.innerHTML = conversationHistory.map(msg => `
    <div class="pchat-msg pchat-msg--${msg.role}">
      <span class="pchat-bubble">${escapeHtml(msg.content)}</span>
    </div>
  `).join('');

  container.scrollTop = container.scrollHeight;
}

function showTypingIndicator() {
  const container = document.getElementById('pchat-messages');
  if (!container) return;

  const el = document.createElement('div');
  el.id = 'pchat-typing';
  el.className = 'pchat-msg pchat-msg--assistant';
  el.innerHTML = '<span class="pchat-bubble pchat-bubble--typing"><span></span><span></span><span></span></span>';
  container.appendChild(el);
  container.scrollTop = container.scrollHeight;
}

function hideTypingIndicator() {
  document.getElementById('pchat-typing')?.remove();
}

function setInputEnabled(enabled) {
  const input = document.getElementById('pchat-input');
  const btn = document.getElementById('pchat-send');

  if (input) input.disabled = !enabled;
  if (btn) btn.disabled = !enabled;
  if (enabled && input) input.focus();
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\n/g, '<br>');
}

// ─── EVENT WIRING (runs after DOM is ready) ───────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('pchat-toggle')?.addEventListener('click', () => {
    const panel = document.getElementById('pchat-panel');
    const isOpen = panel.classList.toggle('pchat-panel--open');
    document.getElementById('pchat-toggle')?.setAttribute('aria-expanded', String(isOpen));

    if (isOpen && conversationHistory.length === 0) {
      conversationHistory.push({
        role: 'assistant',
        content: "Hi! Ask me anything about Nellie's projects, skills, or background."
      });
      renderMessages();
    }

    if (isOpen) {
      setTimeout(() => document.getElementById('pchat-input')?.focus(), 300);
    }
  });

  document.getElementById('pchat-close')?.addEventListener('click', () => {
    document.getElementById('pchat-panel')?.classList.remove('pchat-panel--open');
    document.getElementById('pchat-toggle')?.setAttribute('aria-expanded', 'false');
  });

  document.getElementById('pchat-send')?.addEventListener('click', () => {
    const input = document.getElementById('pchat-input');
    const text = input?.value.trim();
    if (!text) return;
    input.value = '';
    sendPortfolioMessage(text);
  });

  document.getElementById('pchat-input')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      document.getElementById('pchat-send')?.click();
    }
  });

  document.querySelectorAll('.pchat-suggestion').forEach(btn => {
    btn.addEventListener('click', () => {
      const panel = document.getElementById('pchat-panel');
      if (!panel?.classList.contains('pchat-panel--open')) {
        document.getElementById('pchat-toggle')?.click();
      }
      sendPortfolioMessage(btn.textContent.trim());
    });
  });
});
