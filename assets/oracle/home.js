/* Presentation only: CHARS, showDetail, routing and diagnosis stay untouched. */
(() => {
  'use strict';

  const assetBase = new URL('assets/oracle/', document.baseURI);
  const officialPortraits = {
    1: '01_ノンストップうんこ.png',
    2: '02_癒しうんこ.png',
    3: '03_カラフルうんこ.png',
    4: '04_カチカチうんこ.png',
    5: '05_アメーバうんこ.png',
    6: '06_おかんうんこ.png',
    7: '07_孤高の一本うんこ.png',
    8: '08_サバイバルうんこ.png',
    9: '09_悟りうんこ.png',
    11: '11_第六感うんこ.png',
    22: '22_建築家うんこ.png',
    33: '33_芸術家うんこ.png'
  };

  function renderArchive(archive) {
    const english = archive.dataset.oracleCharacters === 'en';
    const fragment = document.createDocumentFragment();
    CHARS.forEach(character => {
      const entry = document.createElement('li');
      entry.className = 'oracle-archive-entry';
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'oracle-specimen-link';
      button.dataset.characterId = String(character.num);
      button.setAttribute('aria-label', english ? `View ${character.e}` : `${character.n}の記録を見る`);

      const label = document.createElement('span');
      label.className = 'oracle-specimen-label';
      label.textContent = `ARCHETYPE ${String(character.num).padStart(2, '0')}`;
      const portrait = document.createElement('img');
      portrait.className = 'oracle-specimen-image';
      // Light cut-out copies of the same official portraits (the 1024px PNGs are not deployed).
      portrait.src = new URL(`home/characters/${String(character.num).padStart(2, '0')}.webp`, assetBase).href;
      portrait.alt = english ? character.e : character.n;
      portrait.loading = 'lazy';
      portrait.decoding = 'async';

      const plate = document.createElement('span');
      plate.className = 'oracle-specimen-plate';
      plate.append(portrait);

      const title = document.createElement('span');
      title.className = 'oracle-specimen-title';
      title.textContent = english ? character.e : character.n;
      const nativeName = document.createElement('span');
      nativeName.className = 'oracle-specimen-native';
      nativeName.textContent = english ? character.n : character.e;
      const classification = document.createElement('span');
      classification.className = 'oracle-specimen-class';
      const role = document.createElement('span');
      role.textContent = english ? character.te : character.t;
      const arrow = document.createElement('span');
      arrow.textContent = '↗';
      arrow.setAttribute('aria-hidden', 'true');
      classification.append(role, arrow);
      button.append(label, english ? portrait : plate, title, nativeName, classification);
      button.addEventListener('click', () => showDetail(character.num));
      entry.append(button);
      fragment.append(entry);
    });
    archive.replaceChildren(fragment);
  }

  async function loadDecorations() {
    // Resolve each reusable asset through the library's single manifest.
    const base = assetBase;
    try {
      const response = await fetch(new URL('manifest.json', base));
      if (!response.ok) throw new Error(`Manifest HTTP ${response.status}`);
      const manifest = await response.json();
      const assets = new Map(manifest.assets.map(asset => [asset.id, asset]));
      document.querySelectorAll('.oracle-home [data-oracle-asset]').forEach(image => {
        const asset = assets.get(image.dataset.oracleAsset);
        if (!asset || asset.role === 'reference-only-composition-study') return;
        image.addEventListener('error', () => { image.hidden = true; }, { once: true });
        image.src = new URL(asset.file, base).href;
      });
    } catch (error) {
      // Decorative assets must never block character links or diagnosis.
      console.warn('Oracle HOME decorations could not be loaded.', error);
    }
  }

  function initHome() {
    document.querySelectorAll('.oracle-home [data-oracle-characters]').forEach(renderArchive);
    loadDecorations();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initHome, { once: true });
  else initHome();
})();
