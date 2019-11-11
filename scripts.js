const API_URL = 'https://apis.is/company?name=';

/**
 * Leit að fyrirtækjum á Íslandi gegnum apis.is
 */
const program = (() => {
  let input;
  let results;

  // Fengið úr helper sýnidæmi úr fyrirlestri 10
  function el(name, ...children) {
    const element = document.createElement(name);
    for (const child of children) { /* eslint-disable-line */
      if (typeof child === 'string') {
        element.appendChild(document.createTextNode(child));
      } else {
        element.appendChild(child);
      }
    }
    return element;
  }

  // Fengið úr xhl sýnidæmi úr fyrirlestri 11
  function empty(element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  function displayMsg(text) {
    empty(results);
    results.appendChild(el('p', text));
  }

  function loading() {
    empty(results);
    const img = document.createElement('img');
    img.setAttribute('src', 'loading.gif');
    img.setAttribute('alt', 'Loading gif');
    const gif = el('div', img, 'Leita að fyrirtækjum...');
    gif.classList.add('loading');
    results.appendChild(gif);
  }

  function show(data) {
    if (data.results.length === 0) {
      displayMsg('Ekkert fyrirtæki fannst fyrir leitarstreng');
      return;
    }

    empty(results);
    for (const item of data.results) { /* eslint-disable-line */
      let div;
      if (item.active === 0) {
        div = el('div',
          el('dl',
            el('dt', 'Lén'),
            el('dd', item.name),
            el('dt', 'Kennitala'),
            el('dd', item.sn)));
        div.classList.add('company', 'company--inactive');
      } else {
        div = el('div',
          el('dl',
            el('dt', 'Lén'),
            el('dd', item.name),
            el('dt', 'Kennitala'),
            el('dd', item.sn),
            el('dt', 'Heimilisfang'),
            el('dd', item.address)));
        div.classList.add('company', 'company--active');
      }
      results.appendChild(div);
    }
  }

  function getData(e) {
    e.preventDefault();
    const company = input.value;
    if (company === '') {
      displayMsg('Lén verður að vera strengur');
    } else {
      loading();
      fetch(`${API_URL}${company}`)
        .then((result) => {
          if (!result.ok) {
            throw new Error('Non 200 status');
          }
          return result.json();
        })
        .then((data) => {
          show(data);
        })
        .catch((error) => {
          displayMsg('Villa við að sækja gögn');
          console.error('Villa við að sækja gögn', error);
        });
    }
  }

  function init(companies) {
    const form = companies.querySelector('form');
    form.addEventListener('submit', getData);
    input = form.querySelector('input');
    results = companies.querySelector('.results');
  }

  return {
    init,
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  const companies = document.querySelector('.companies');
  program.init(companies);
});
