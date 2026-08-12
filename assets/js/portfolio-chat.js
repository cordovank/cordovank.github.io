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
    // TODO - remove after worker update
//   const messages = [
//     { role: 'system', content: PORTFOLIO_KNOWLEDGE },
//     ...conversationHistory,
//   ];

  const response = await fetch(WORKER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      provider: PROVIDER,
    // TODO - remove after worker update; uncomment the following lines
    //   messages,
      message: conversationHistory[conversationHistory.length - 1].content,
      history: conversationHistory.slice(0, -1),   // everything except the latest user message
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

// ─── WIDGET MARKUP ────────────────────────────────────────────────────────────
// The widget lives in one partial instead of being copy-pasted into every page.
// Same approach main.js uses for project-detail fragments: fetch, then inject.
// #pchat-root is position:fixed, so appending to <body> is equivalent to
// inlining it anywhere in the page.
const PCHAT_PARTIAL = 'assets/partials/chat-widget.html';

async function renderPchatWidget() {
  // A page may still hand-author the markup; don't duplicate it if so.
  if (document.getElementById('pchat-root')) return true;

  try {
    const res = await fetch(PCHAT_PARTIAL);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    const holder = document.createElement('div');
    holder.innerHTML = (await res.text()).trim();
    const root = holder.querySelector('#pchat-root');
    if (!root) throw new Error('#pchat-root missing from partial');
    document.body.appendChild(root);
    return true;
  } catch (err) {
    // Relative fetch fails on file://; serve the site to develop the widget.
    console.error('Portfolio chat: could not load widget partial:', err);
    return false;
  }
}

// ─── PANEL OPEN / CLOSE ───────────────────────────────────────────────────────
// The panel is role="dialog", so while it is open it owns the keyboard: Tab
// cycles inside it, Escape closes it, and focus returns to the toggle. The
// keydown listener is stored so close() can remove it again.
const PCHAT_FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), ' +
  'select:not([disabled]), [tabindex]:not([tabindex="-1"])';

let _pchatKeyHandler = null;

function isPchatOpen() {
  return !!document.getElementById('pchat-panel')?.classList.contains('pchat-panel--open');
}

function openPchat() {
  const panel = document.getElementById('pchat-panel');
  if (!panel || isPchatOpen()) return;

  panel.classList.add('pchat-panel--open');
  document.getElementById('pchat-toggle')?.setAttribute('aria-expanded', 'true');

  // Greeting copy lives with the rest of the chat copy, in the partial.
  const greeting = panel.dataset.greeting;
  if (conversationHistory.length === 0 && greeting) {
    conversationHistory.push({ role: 'assistant', content: greeting });
    renderMessages();
  }

  // Panel transitions in; focus the input once it is actually visible.
  setTimeout(() => document.getElementById('pchat-input')?.focus(), 300);

  _pchatKeyHandler = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      closePchat();
      return;
    }
    if (e.key !== 'Tab') return;

    // offsetParent filters out anything hidden (e.g. suggestions once dismissed).
    const items = Array.from(panel.querySelectorAll(PCHAT_FOCUSABLE))
      .filter(el => el.offsetParent !== null);
    if (!items.length) return;

    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };
  document.addEventListener('keydown', _pchatKeyHandler);
}

function closePchat() {
  const panel = document.getElementById('pchat-panel');
  if (!panel) return;

  panel.classList.remove('pchat-panel--open');
  const toggle = document.getElementById('pchat-toggle');
  toggle?.setAttribute('aria-expanded', 'false');

  if (_pchatKeyHandler) {
    document.removeEventListener('keydown', _pchatKeyHandler);
    _pchatKeyHandler = null;
  }

  // Focus would otherwise be left on a now-hidden element inside the panel.
  toggle?.focus();
}

// ─── EVENT WIRING ─────────────────────────────────────────────────────────────
// Runs only after the partial is in the DOM — the elements do not exist before.
document.addEventListener('DOMContentLoaded', async () => {
  if (!(await renderPchatWidget())) return;

  document.getElementById('pchat-toggle')?.addEventListener('click', () => {
    if (isPchatOpen()) closePchat();
    else openPchat();
  });

  document.getElementById('pchat-close')?.addEventListener('click', closePchat);

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
      if (!isPchatOpen()) openPchat();
      sendPortfolioMessage(btn.textContent.trim());
    });
  });
});
