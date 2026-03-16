
(function() {
  'use strict';

  if (window.__accessiVoiceLoaded) return;
  window.__accessiVoiceLoaded = true;

  // ── Shadow DOM UI ──────────────────────────────────────────────
  const host = document.createElement('div');
  host.id = 'accessivoice-host';
  Object.assign(host.style, {
    position: 'fixed', bottom: '24px', right: '24px',
    zIndex: '2147483647', fontFamily: 'system-ui, sans-serif'
  });
  document.body.appendChild(host);

  const shadow = host.attachShadow({ mode: 'open' });
  shadow.innerHTML = `
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      #panel {
        background: #0a0a0f;
        border: 1px solid #2a2a3a;
        border-radius: 16px;
        padding: 16px;
        width: 280px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.6);
        transition: opacity 0.3s;
      }
      #panel.hidden { opacity: 0; pointer-events: none; }
      .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
      .title { font-size: 14px; font-weight: 700; color: #00b4d8; }
      .close-btn {
        background: none; border: none; color: #666; cursor: pointer;
        font-size: 18px; line-height: 1; padding: 2px 6px; border-radius: 4px;
      }
      .close-btn:hover { color: #aaa; background: #1a1a2a; }
      .mic-area { text-align: center; margin-bottom: 12px; }
      .mic-btn {
        width: 56px; height: 56px; border-radius: 50%;
        background: linear-gradient(135deg, #00b4d8, #0077b6);
        border: none; cursor: pointer; font-size: 24px;
        display: inline-flex; align-items: center; justify-content: center;
        transition: transform 0.2s, box-shadow 0.2s;
      }
      .mic-btn.listening {
        background: linear-gradient(135deg, #00e5a0, #00b4d8);
        box-shadow: 0 0 20px rgba(0,229,160,0.5);
        animation: pulse 1.5s infinite;
      }
      .mic-btn.sleeping { background: #2a2a3a; }
      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.08); }
      }
      .status {
        font-size: 12px; color: #888; margin-top: 8px;
        min-height: 18px; text-align: center;
      }
      .status .wake { color: #00b4d8; font-weight: 600; }
      .status .active { color: #00e5a0; font-weight: 600; }
      .transcript {
        background: #12121a; border: 1px solid #2a2a3a; border-radius: 8px;
        padding: 8px 10px; font-size: 12px; color: #ccc;
        min-height: 36px; margin-bottom: 10px; line-height: 1.5;
      }
      .stop-btn {
        width: 100%; padding: 8px; border-radius: 8px;
        background: #1a1a2a; border: 1px solid #3a3a4a;
        color: #e8e0d0; font-size: 12px; cursor: pointer;
        transition: background 0.2s;
      }
      .stop-btn:hover { background: #2a2a3a; }
    </style>
    <div id="panel" class="hidden">
      <div class="header">
        <span class="title">🎙️ AccessiVoice</span>
        <button class="close-btn" id="closeBtn">×</button>
      </div>
      <div class="mic-area">
        <button class="mic-btn sleeping" id="micBtn">🎙️</button>
        <div class="status" id="statusText">
          Say <span class="wake">"Hey Vision"</span> to activate
        </div>
      </div>
      <div class="transcript" id="transcript">Waiting for wake word...</div>
      <button class="stop-btn" id="stopBtn">⏹ Stop Speaking</button>
    </div>
  `;

  const panel = shadow.getElementById('panel');
  const micBtn = shadow.getElementById('micBtn');
  const statusText = shadow.getElementById('statusText');
  const transcript = shadow.getElementById('transcript');
  const stopBtn = shadow.getElementById('stopBtn');
  const closeBtn = shadow.getElementById('closeBtn');

  let isActive = false;
  let recognition = null;
  let isSpeaking = false;

  // Show panel
  panel.classList.remove('hidden');

  closeBtn.addEventListener('click', () => panel.classList.add('hidden'));
  stopBtn.addEventListener('click', () => { window.speechSynthesis.cancel(); isSpeaking = false; });

  function setStatus(html) { statusText.innerHTML = html; }
  function setTranscript(text) { transcript.textContent = text; }

  function speak(text) {
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.rate = 1.0; utt.pitch = 1.0; utt.volume = 1.0;
    isSpeaking = true;
    utt.onend = () => { isSpeaking = false; };
    window.speechSynthesis.speak(utt);
  }

  function enterSleepMode() {
    isActive = false;
    micBtn.className = 'mic-btn sleeping';
    setStatus('Say <span class="wake">\"Hey Vision\"</span> to activate');
    setTranscript('Waiting for wake word...');
  }

  function enterActiveMode() {
    isActive = true;
    micBtn.className = 'mic-btn listening';
    setStatus('<span class="active">● Listening for commands</span>');
    setTranscript('Ready — speak a command...');
    speak('AccessiVoice activated. How can I help?');
  }

  // ── Wake word patterns ─────────────────────────────────────────
  const WAKE_PATTERNS = [
    /hey\s*vi+si+on/i, /hey\s*vision/i, /a+y\s*vision/i,
    /hey\s*vis/i, /activate/i, /wake up/i
  ];

  function isWakeWord(text) {
    return WAKE_PATTERNS.some(p => p.test(text));
  }

  // ── Command processing ─────────────────────────────────────────
  const COMMANDS = [
    { patterns: [/scroll\s*down/i, /go\s*down/i, /page\s*down/i], action: () => { window.scrollBy(0, 400); speak('Scrolled down'); } },
    { patterns: [/scroll\s*up/i, /go\s*up/i, /page\s*up/i], action: () => { window.scrollBy(0, -400); speak('Scrolled up'); } },
    { patterns: [/scroll\s*top/i, /go\s*to\s*top/i, /top\s*of\s*page/i], action: () => { window.scrollTo(0, 0); speak('Scrolled to top'); } },
    { patterns: [/scroll\s*bottom/i, /go\s*to\s*bottom/i, /bottom\s*of\s*page/i], action: () => { window.scrollTo(0, document.body.scrollHeight); speak('Scrolled to bottom'); } },
    { patterns: [/go\s*back/i, /navigate\s*back/i, /previous\s*page/i], action: () => { history.back(); speak('Going back'); } },
    { patterns: [/go\s*forward/i, /navigate\s*forward/i], action: () => { history.forward(); speak('Going forward'); } },
    { patterns: [/reload/i, /refresh/i], action: () => { speak('Reloading page'); setTimeout(() => location.reload(), 1000); } },
    { patterns: [/zoom\s*in/i, /increase\s*zoom/i], action: () => { document.body.style.zoom = (parseFloat(document.body.style.zoom || '1') + 0.1).toString(); speak('Zoomed in'); } },
    { patterns: [/zoom\s*out/i, /decrease\s*zoom/i], action: () => { document.body.style.zoom = (parseFloat(document.body.style.zoom || '1') - 0.1).toString(); speak('Zoomed out'); } },
    { patterns: [/reset\s*zoom/i, /normal\s*zoom/i], action: () => { document.body.style.zoom = '1'; speak('Zoom reset'); } },
    {
      patterns: [/read\s*(page|aloud|this)/i, /read\s*content/i],
      action: () => {
        const text = document.body.innerText.slice(0, 2000);
        speak(text || 'No readable content found');
      }
    },
    {
      patterns: [/summarize/i, /summary/i, /give\s*me\s*a\s*summary/i],
      action: () => {
        const paras = Array.from(document.querySelectorAll('p')).map(p => p.innerText).filter(t => t.length > 50).slice(0, 3).join(' ');
        speak(paras || 'Could not summarize this page');
      }
    },
    {
      patterns: [/describe\s*(image|images|picture|pictures)/i],
      action: () => {
        const imgs = document.querySelectorAll('img[alt]');
        if (imgs.length === 0) { speak('No images with descriptions found'); return; }
        const alts = Array.from(imgs).slice(0, 3).map(img => img.alt).filter(Boolean).join('. ');
        speak(alts || 'Images found but no descriptions available');
      }
    },
    {
      patterns: [/find\s+(.+)/i, /search\s+for\s+(.+)/i],
      action: (match) => {
        const term = match[1];
        if (window.find) { window.find(term); speak('Searching for ' + term); }
        else { speak('Search not supported on this page'); }
      }
    },
    { patterns: [/open\s*new\s*tab/i, /new\s*tab/i], action: () => { window.open('about:newtab', '_blank'); speak('Opening new tab'); } },
    { patterns: [/close\s*tab/i], action: () => { speak('Cannot close tab from content script'); } },
    { patterns: [/stop/i, /cancel/i, /never\s*mind/i], action: () => { window.speechSynthesis.cancel(); speak('Stopped'); } },
    { patterns: [/sleep/i, /deactivate/i, /go\s*to\s*sleep/i], action: () => { speak('Going to sleep'); setTimeout(enterSleepMode, 1000); } },
    {
      patterns: [/help/i, /what\s*can\s*you\s*do/i, /commands/i],
      action: () => {
        speak('I can scroll, navigate, read the page, summarize content, describe images, zoom in or out, and more. Just say a command.');
      }
    },
  ];

  function processCommand(text) {
    setTranscript('"' + text + '"');
    for (const cmd of COMMANDS) {
      for (const pattern of cmd.patterns) {
        const match = text.match(pattern);
        if (match) { cmd.action(match); return; }
      }
    }
    speak('Command not recognized. Say help for a list of commands.');
  }

  // ── Speech Recognition ─────────────────────────────────────────
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    setStatus('Speech recognition not supported');
    return;
  }

  function startRecognition() {
    if (recognition) { try { recognition.abort(); } catch(e) {} }
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript.trim();
      if (!isActive) {
        if (isWakeWord(text)) { enterActiveMode(); }
      } else {
        processCommand(text);
      }
    };

    recognition.onend = () => { setTimeout(startRecognition, 300); };
    recognition.onerror = (e) => {
      if (e.error !== 'no-speech' && e.error !== 'aborted') {
        console.warn('AccessiVoice recognition error:', e.error);
      }
      setTimeout(startRecognition, 500);
    };

    try { recognition.start(); } catch(e) { setTimeout(startRecognition, 1000); }
  }

  micBtn.addEventListener('click', () => {
    if (!isActive) { enterActiveMode(); }
    else { enterSleepMode(); }
  });

  // Start listening
  startRecognition();

})();
