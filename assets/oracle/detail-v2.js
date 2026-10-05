/* Presentation only: re-dresses the archetype detail page after the original
   showDetail() has run. CHARS, DETAIL, routing and diagnosis stay untouched. */
(() => {
  'use strict';
  if (typeof window.showDetail !== 'function') return;

  const A = 'assets/oracle/home/';
  const portrait = num => `${A}characters/${String(num).padStart(2, '0')}.webp`;
  const img = (cls, file) => `<img class="ox-l ${cls}" src="${A}${file}.webp" alt="" loading="lazy" decoding="async">`;
  const list = items => items.map(s => `<li>${s}</li>`).join('');
  // Headings may only break before a bracketed part: 注意ポイント / （闇のかたち）.
  const title = text => text.split(/(?=[（(])/).map(part => `<span>${part}</span>`).join('');

  function render(num, fromDiag) {
    const c = CHARS.find(x => x.num === num);
    const d = DETAIL[num];
    const host = document.getElementById('detail-content');
    const shell = document.querySelector('#pg-detail .pastel-body');
    if (!c || !d || !host || !shell) return;
    const en = lang === 'en';
    const pick = key => (en ? (d[key + 'e'] || d[key]) : d[key]);
    const name = en ? c.e : c.n;
    // A long name may only break between its two halves (ノンストップ / うんこ), never mid-word.
    const nameHtml = en
      ? name.split(' ').map(w => `<span>${w}</span>`).join(' ')
      : `<span>${name.replace(/(うんこ)$/, '</span><span>$1')}</span>`;

    const shareText = en
      ? `My poop character is "${c.e}"!\n${c.de}\nCheck yours at unkouranai.com 💩`
      : `私のうんこキャラは「${c.n}」！\n${c.d}\nあなたも診断してみよう → unkouranai.com 💩`;
    const xUrl = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(shareText)
      + '&hashtags=' + encodeURIComponent(en ? 'UnkoOracle,UnkoFortune' : 'うんこ占い,便器界');

    const at = CHARS.findIndex(x => x.num === num);
    const others = [1, 2, 3].map(step => CHARS[(at + step) % CHARS.length]);

    shell.classList.add('oracle-detail');
    host.innerHTML = `
<div class="ox">
  <section class="ox-hero">
    <div class="ox-art ox-art-l" aria-hidden="true">
      ${img('hl-orbit', 'line-orbit')}
      ${img('hl-pink', 'pink-torn-a')}
      ${img('hl-moon', 'moon-crescent')}
      ${img('hl-crystal', 'crystal-point')}
      ${img('hl-bust', 'bust-crowned')}
      ${img('hl-star', 'star-eight')}
    </div>
    <div class="ox-art ox-art-r" aria-hidden="true">
      ${img('hr-orbit', 'gold-orbit-moon')}
      ${img('hr-moon', 'moon-full')}
      ${img('hr-hand', 'hand-open')}
      ${img('hr-crystal', 'crystal')}
      ${img('hr-star', 'star-four')}
    </div>
    <blockquote class="ox-quote">
      <p>${pick('quote')}</p>
      <cite>— UNKO ORACLE</cite>
    </blockquote>
    <div class="ox-center">
      <p class="ox-kicker">${fromDiag ? 'YOUR RESULT' : 'ARCHETYPE'}</p>
      <h1 class="ox-name">${nameHtml}</h1>
      <p class="ox-tagline">${pick('tagline')}</p>
      <div class="ox-shrine">
        ${img('ox-arch', 'arch-night')}
        <img class="ox-char" src="${portrait(c.num)}" alt="${name}">
      </div>
      <div class="ox-plaque">
        <span class="ox-plaque-name">${en ? c.n : c.e}</span>
        <span class="ox-plaque-role">${en ? c.te : c.t}</span>
      </div>
    </div>
  </section>

  <section class="ox-body">
    <aside class="ox-card ox-card-strength">
      <p class="ox-label">STRENGTHS</p>
      <h2 class="ox-card-title">${en ? 'Strengths' : '強み'}</h2>
      <img class="ox-card-char" src="${portrait(c.num)}" alt="">
      <ul class="ox-stars">${list(pick('strength'))}</ul>
      <p class="ox-card-foot">UNKO ORACLE</p>
    </aside>

    <div class="ox-main">
      <p class="ox-label">ABOUT</p>
      <span class="ox-chip">${en ? c.te : c.t}</span>
      <p class="ox-desc">${pick('desc')}</p>
      <div class="ox-actions">
        <button class="ox-pill" type="button" onclick="window.open('${xUrl}','_blank')">
          <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.26 5.632L18.245 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          ${en ? 'Share this result' : 'この結果をシェアする'}
        </button>
        <button class="ox-pill is-line" type="button" onclick="downloadCard(${c.num})">${en ? 'Save card' : 'カードを保存'}</button>
      </div>
      <div class="ox-advice">
        <p class="ox-label ox-label-rule">ADVICE</p>
        <h2 class="ox-advice-title">${title(en ? 'Daily Action' : '行動指針（今日の合言葉）')}</h2>
        <ul>${list(pick('action'))}</ul>
      </div>
    </div>

    <aside class="ox-card ox-card-shadow">
      <p class="ox-label">SHADOW</p>
      <h2 class="ox-card-title">${title(en ? 'Shadow Side' : '注意ポイント（闇のかたち）')}</h2>
      <p class="ox-card-text">${pick('shadow')}</p>
      ${img('sh-crystal', 'crystal')}
    </aside>
  </section>

  <section class="ox-trio">
    <article class="ox-tile">
      <p class="ox-label">TODAY'S FLOW</p>
      <h2 class="ox-card-title">${en ? "Today's Flow" : '今日の流れのつかみ方'}</h2>
      <div class="ox-tile-art" aria-hidden="true">${img('t1-book', 'book-open')}${img('t1-lily', 'lily')}</div>
      <p class="ox-card-text">${pick('today')}</p>
    </article>
    <article class="ox-tile">
      <p class="ox-label">LOVE</p>
      <h2 class="ox-card-title">${en ? 'Love' : '恋愛'}</h2>
      <div class="ox-tile-art" aria-hidden="true">${img('t2-pink', 'pink-scraps')}${img('t2-hands', 'hands-reaching')}${img('t2-heart', 'heart-gem')}</div>
      <p class="ox-card-text">${pick('love')}</p>
    </article>
    <article class="ox-tile">
      <p class="ox-label">WORK</p>
      <h2 class="ox-card-title">${en ? 'Work & Calling' : '仕事・適性'}</h2>
      <div class="ox-tile-art" aria-hidden="true">${img('t3-column', 'column')}${img('t3-key', 'key')}${img('t3-crystal', 'crystal-point')}</div>
      <p class="ox-card-text">${pick('work')}</p>
    </article>
  </section>

  <section class="ox-more">
    <div class="ox-more-list">
      <div class="ox-more-head">
        <p class="ox-label">OTHER ARCHETYPES</p>
        <h2 class="ox-card-title">${en ? 'Meet the others' : 'ほかのうんこたち'}</h2>
      </div>
      ${others.map(o => `
      <button class="ox-other" type="button" onclick="showDetail(${o.num})">
        <img src="${portrait(o.num)}" alt="">
        <strong>${en ? o.e : o.n}</strong>
      </button>`).join('')}
    </div>
    <div class="ox-more-cta">
      ${img('mc-moon', 'moon-full')}${img('mc-hand', 'hand-reaching')}${img('mc-star', 'star-eight')}
      <p>${en ? 'A journey through the twelve archetypes' : '12の原型をめぐる旅へ'}</p>
      <button class="ox-pill" type="button" onclick="go('zukan')">${en ? 'Character index' : 'キャラクター図鑑へ'} <span aria-hidden="true">→</span></button>
      <button class="ox-pill is-line" type="button" onclick="go('diag')">${fromDiag ? (en ? 'Try again' : 'もう一度診断する') : (en ? 'Start diagnosis' : '生年月日で診断する')} <span aria-hidden="true">→</span></button>
    </div>
  </section>

  <p class="ox-links">
    <a href="https://lin.ee/WhhLB2R" target="_blank" rel="noopener noreferrer">${en ? 'Follow on LINE' : 'LINEで友だち追加'} →</a>
    <a href="https://www.instagram.com/unkouranai" target="_blank" rel="noopener noreferrer">${en ? 'Follow on Instagram' : 'Instagramをフォロー'} →</a>
  </p>
</div>`;
  }

  let cameFromDiag = false;
  const original = window.showDetail;
  window.showDetail = function (num) {
    // Moving between archetypes inside the detail page must not make "back" point at itself.
    const chained = curPage === 'detail';
    const returnTo = prevPage;
    const fromDiag = chained ? cameFromDiag : curPage === 'diag';
    cameFromDiag = fromDiag;
    original(num);
    if (chained) prevPage = returnTo;
    try { render(num, fromDiag); } catch (error) {
      // The original markup is already on the page, so a failure here only loses the new dress.
      console.warn('Oracle detail could not be rendered.', error);
    }
  };
})();
