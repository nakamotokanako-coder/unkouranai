/* Presentation only: after the original openUnsei() has drawn the twelve cards,
   swap the round thumbnails for the official cut-out portraits and name the
   month's theme each text is talking about. The fortune texts are untouched. */
(() => {
  'use strict';
  if (typeof window.openUnsei !== 'function') return;

  const portrait = num => `assets/oracle/home/characters/${String(num).padStart(2, '0')}.webp`;
  // Words the texts themselves use for each monthly theme number (see unko_diagnosis_logic.md, 月数テーマ).
  const THEME = { 1: '開始', 2: '調和', 3: 'ユーモア', 4: '安定', 5: '自由', 6: '愛', 7: '内省', 8: '成果', 9: '手放し', 11: '直感', 22: '大きな構想', 33: '愛と創造' };

  function dress() {
    const cards = document.querySelectorAll('#unsei-list .unsei-card');
    const shown = CHARS.filter(c => unseiFor(c.num));
    cards.forEach((card, i) => {
      const c = shown[i];
      if (!c) return;
      const holder = card.querySelector('.unsei-card-img');
      if (holder) holder.innerHTML = `<img src="${portrait(c.num)}" alt="">`;
      const theme = THEME[unseiFor(c.num).theme];
      const name = card.querySelector('.unsei-card-name');
      if (theme && name && !card.querySelector('.unsei-theme')) {
        name.insertAdjacentHTML('afterend', `<div class="unsei-theme"><span>今月のテーマ</span>${theme}</div>`);
      }
    });
  }

  const original = window.openUnsei;
  window.openUnsei = function () {
    original();
    try { dress(); } catch (error) {
      console.warn('Oracle monthly dressing failed.', error);
    }
  };
})();
