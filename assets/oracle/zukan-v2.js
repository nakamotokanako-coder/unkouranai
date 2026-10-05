/* Presentation only: draws the Oracle archive grid on the character index page.
   The original #zg grid, setView() and updateZukan() keep working underneath. */
(() => {
  'use strict';
  if (typeof window.updateZukan !== 'function') return;

  const portrait = num => `assets/oracle/home/characters/${String(num).padStart(2, '0')}.webp`;
  // A long name may only break between its two halves (ノンストップ / うんこ).
  const nameHtml = (c, en) => en
    ? c.e
    : `<span>${c.n.replace(/(うんこ)$/, '</span><span>$1')}</span>`;

  function render() {
    const host = document.getElementById('oz-grid');
    if (!host) return;
    const en = lang === 'en';
    host.innerHTML = CHARS.map(c => {
      const d = DETAIL[c.num] || {};
      const tagline = en ? (d.taglinee || d.tagline || '') : (d.tagline || '');
      return `
      <li>
        <button type="button" onclick="showDetail(${c.num})">
          <span class="oz-frame"><img src="${portrait(c.num)}" alt="" loading="lazy" decoding="async"></span>
          <strong class="oz-name">${nameHtml(c, en)}</strong>
          <span class="oz-role">${en ? c.te : c.t}</span>
          <span class="oz-tagline">${tagline}</span>
          <span class="oz-more">${en ? 'Read' : '記録を読む'} <i aria-hidden="true">→</i></span>
        </button>
      </li>`;
    }).join('');
    const cta = document.getElementById('oz-cta-text');
    if (cta) cta.textContent = en ? 'Which one lives in you?' : 'あなたの中にいるのは、どのうんこ？';
    const btn = document.getElementById('oz-cta-btn');
    if (btn) btn.firstChild.textContent = en ? 'Start the free reading ' : '無料で診断をはじめる ';
  }

  const original = window.updateZukan;
  window.updateZukan = function () {
    original();
    try { render(); } catch (error) {
      console.warn('Oracle archive could not be rendered.', error);
    }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render, { once: true });
  else render();
})();
