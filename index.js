//@ts-check
/// <reference path="./libraries/cpTools.js" />

cp.scripts.define(async () => {
  var put = cp.put;
  const readyBasic = new cp.events.Signal(false);

  cp.styles.add(`
    .master-parent {
      min-height: 19em;
    }
    .main-button{
      width: 100%;
      padding: 1.5em;
    }
    .main-date{
      font-size:1.5rem;
    }
    div.list-of-days-of-the-week>label{
      margin: 0.25rem;
      border: 0.1px solid #00000010;
      border-radius: 0.3rem;
    }
  `);

  const getNGrams = (str, n) => {
    const out = [];
    for (let i = 0; i <= str.length - n; i++) {
      let nGram = str.slice(i, i + n);
      out.push(nGram);
    }
    return out;
  }

  let n = 4;
  const nGrams = await (async () => {
    let nGrams = {};
    let mapping = await cp.scripts.cacheLoad('./mapping.js');
    for (let [out, name] of mapping) {
      for (let m = 1; m <= n; m++) {
        for (let nGram of getNGrams(name, m)) {
          nGrams[nGram] = nGrams[nGram] || [];
          nGrams[nGram].push(out);
        }
      }
    }
    return nGrams;
  })();

  let topResult = null;
  const searchBarSignal = new cp.events.Signal('');
  const searchingSignal = new cp.events.Signal(false);
  const searchingElem = put('span $', 'Loading...');
  const searchBarElem = put('input[type=$][autofocus]', 'text');
  put(searchBarElem, '@input', (elem) => {
    searchBarSignal.emit(elem.value);
  });
  put(searchBarElem, '@keypress', (elem, event) => {
    if (event.key == "Enter") copyToClipboard(topResult);
  });
  const resultsParent = put('div');

  const main = cp.html`
<h3>
  ${put('img[src=$] @', './favicon.png', (self) => self.style.width = '1em')}
  ${'Symbols'}
</h3>
<hr>
${searchBarElem}${searchingElem}
${resultsParent}
${cp.ui.vspace('1em')}
Carlos Pinzón. 2023.
  `;

  searchBarSignal.subscribe({ fire: true, minDuration: 10 }, async (str) => {
    searchingSignal.emit(true);
    try {
      await search(str);
    } finally {
      searchingSignal.emit(false);
    }
  });
  searchingSignal.subscribe(async (value) => {
    cp.toggle(searchingElem, 'cpHidden', !value);
  });

  // let previous = { pattern: '**' };
  async function search(pattern) {
    let out = [];
    for (let m = Math.min(n, pattern.length); m > 0 && out.length == 0; m--) {
      for (let nGram of getNGrams(pattern, m)) {
        out.push(...(nGrams[nGram] || []));
      }
    }
    out = [...new Set(out)];
    topResult = out.length ? out[0] : null;
    resultsParent.replaceChildren(...out.map(text => {
      const elem = put('div $ @click', text, () => copyToClipboard(text));
      return elem;
    }));
  }
  console.log(nGrams);
  async function copyToClipboard(text) {
    if (!text) return;
    await navigator.clipboard.writeText(text);
  }


  const mainWrapper = put(`div.${cp.styles.add((uid) => `
    .${uid}{
      padding-top: 0.2em;
      padding-bottom: 0.2em;
    }
  `)}`,
    put(`div.${cp.styles.add((uid) => `
    .${uid}{
      padding: 1% 2% 3% 2%; max-width: 45em; margin: auto;
    }
  `)}`,
      main,
    ));

  cp.styles.add(`
    button{cursor: pointer;}
    html{
      font-family: Latin Modern Roman;
      font-size: 1.2em;
    }
  `);
  document.body.append(mainWrapper);

  (async () => {
    await readyBasic.untilTrue();
    cp.styles.add(`
      body {
        background: no-repeat url(./libraries/paper-transparent.png) 0 0;
        background-color: white;
        background-repeat: repeat;
        margin: 0;
      }
    `);
    //cp.styles.load('./fonts/font-lmroman.css');
    cp.styles.add(await cp.scripts.cacheLoad('./fonts/font-lmroman.js'));
  })();
})
