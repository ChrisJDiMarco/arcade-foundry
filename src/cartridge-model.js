'use strict';

const MAX_HTML_BYTES = 90_000;
const blocked = [
  /https?:\/\//i, /\bfetch\s*\(/i, /xmlhttprequest/i, /websocket/i, /eventsource/i,
  /<\s*iframe/i, /<\s*(form|script[^>]+src)/i, /\b(window\.)?(top|parent)\s*(?:[.\[])/i,
  /\b(electron|require\s*\(|process\.|localstorage|sessionstorage|indexeddb|navigator\.clipboard)\b/i,
  /\b(window\.)?open\s*\(/i, /\bsrc\s*=/i
];

function cleanText(value, max) {
  return String(value || '').replace(/[\u0000-\u001f<>]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);
}

function validateCartridge(value) {
  if (!value || typeof value !== 'object') throw new Error('Cartridge data is missing.');
  const title = cleanText(value.title, 42);
  const tagline = cleanText(value.tagline, 130);
  const changeSummary = cleanText(value.changeSummary, 220);
  const html = String(value.html || '').trim();
  if (!title || !tagline || !html) throw new Error('A cartridge needs a title, short brief, and game code.');
  if (!/<!doctype html>/i.test(html) || !/<canvas/i.test(html)) throw new Error('Game code must be a self-contained HTML canvas cartridge.');
  if (Buffer.byteLength(html, 'utf8') > MAX_HTML_BYTES) throw new Error('Game code exceeds the 90 KB cartridge limit.');
  if (blocked.some((pattern) => pattern.test(html))) throw new Error('Game code contains a blocked network, storage, popup, parent-frame, or privileged API.');
  const controls = Array.isArray(value.controls) ? value.controls.slice(0, 8).map((item) => ({
    input: cleanText(item && item.input, 36), action: cleanText(item && item.action, 60)
  })).filter((item) => item.input && item.action) : [];
  if (controls.length < 1) throw new Error('Include at least one control legend.');
  return { title, tagline, controls, html, changeSummary: changeSummary || 'Cartridge updated.' };
}

function injectCartridgeCsp(html) {
  const csp = `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data: blob:; font-src data:; connect-src 'none'; media-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-src 'none'">`;
  return /<head[^>]*>/i.test(html) ? html.replace(/<head[^>]*>/i, (head) => `${head}${csp}`) : `${csp}${html}`;
}

function cloneRequest(prompt) {
  return /\b(clone|copy|recreate|exact replica|identical to)\b/i.test(String(prompt || ''));
}

module.exports = { validateCartridge, injectCartridgeCsp, cloneRequest, MAX_HTML_BYTES };
