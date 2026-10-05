/* Presentation only: tidies labels and portraits on the compatibility page after
   the original updateCompat() / diagCompat() have run. The reading itself is untouched. */
(() => {
  'use strict';
  const byId = id => document.getElementById(id);
  const emoji = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]\s*/gu;
  const portrait = num => `assets/oracle/home/characters/${String(num).padStart(2, '0')}.webp`;

  function cleanLabels() {
    ['ct', 'cp1', 'cp2', 'cdiag-btn', 'cr-label'].forEach(id => {
      const el = byId(id);
      if (el) el.textContent = el.textContent.replace(emoji, '').trim();
    });
  }

  // Swap the small result thumbnails for the official cut-out portraits.
  function dressResult() {
    [['cr-name1', 'cr-img1'], ['cr-name2', 'cr-img2']].forEach(([nameId, imgId]) => {
      const name = byId(nameId), holder = byId(imgId);
      if (!name || !holder) return;
      const label = name.textContent.trim();
      const c = CHARS.find(x => x.n === label || x.e === label);
      if (c) holder.innerHTML = `<img src="${portrait(c.num)}" alt="">`;
    });
  }

  const wrap = (fn, after) => {
    const original = window[fn];
    if (typeof original !== 'function') return;
    window[fn] = function (...args) {
      const result = original.apply(this, args);
      try { after(); } catch (error) { console.warn('Oracle compat dressing failed.', error); }
      return result;
    };
  };
  wrap('updateCompat', cleanLabels);
  wrap('diagCompat', () => { cleanLabels(); dressResult(); });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', cleanLabels, { once: true });
  else cleanLabels();
})();
