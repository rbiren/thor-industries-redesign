import { search, type SearchRecord } from './search';

const menu = document.querySelector<HTMLDialogElement>('#mobile-menu')!;
const searchDialog = document.querySelector<HTMLDialogElement>('#site-search')!;
const input = document.querySelector<HTMLInputElement>('#search-query')!;
const status = document.querySelector<HTMLParagraphElement>('#search-status')!;
const results = document.querySelector<HTMLUListElement>('#search-results')!;
const groups = [...document.querySelectorAll<HTMLDetailsElement>('.nav-group')];
let records: SearchRecord[] | undefined;
let loading: Promise<void> | undefined;

function syncScroll() {
  document.documentElement.classList.toggle('dialog-open', menu.open || searchDialog.open);
}
function closeNav() { groups.forEach(group => { group.open = false; }); }
function renderResults() {
  if (!records) return;
  const query = input.value.trim();
  const matches = search(records, query);
  results.replaceChildren();
  status.textContent = query ? `${matches.length} ${matches.length === 1 ? 'page' : 'pages'} found${matches.length ? '.' : '. Try “RV”, “careers”, or “report”.'}` : 'Explore these pages, or type to search all 23.';
  const fragment = document.createDocumentFragment();
  for (const record of matches) {
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.href = record.url;
    const label = document.createElement('span');
    label.className = 'eyebrow';
    label.textContent = record.label;
    const title = document.createElement('h3');
    title.textContent = record.title;
    const text = document.createElement('p');
    text.textContent = record.description;
    link.append(label, title, text);
    li.append(link);
    fragment.append(li);
  }
  results.append(fragment);
}
async function loadIndex() {
  if (records) { renderResults(); return; }
  if (loading) return loading;
  loading = (async () => {
    status.textContent = 'Loading the page index…';
    try {
      const response = await fetch(searchDialog.dataset.indexUrl!);
      if (!response.ok) throw new Error('Search index unavailable');
      records = await response.json();
      renderResults();
    } catch {
      status.textContent = 'Search could not load. Please try again, or use the navigation to explore this site.';
    } finally {
      loading = undefined;
    }
  })();
  return loading;
}
document.querySelectorAll<HTMLButtonElement>('[data-menu-open]').forEach(button => {
  button.hidden = false;
  button.addEventListener('click', () => { closeNav(); menu.showModal(); syncScroll(); });
});
document.querySelector('[data-menu-close]')?.addEventListener('click', () => menu.close());
document.querySelectorAll<HTMLButtonElement>('[data-search-open]').forEach(button => {
  button.hidden = false;
  button.addEventListener('click', () => {
    closeNav();
    menu.close();
    searchDialog.showModal();
    syncScroll();
    input.focus();
    void loadIndex();
  });
});
document.querySelector('[data-search-close]')?.addEventListener('click', () => searchDialog.close());
for (const dialog of [menu, searchDialog]) {
  dialog.addEventListener('close', syncScroll);
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
}
document.querySelector('#search-form')?.addEventListener('submit', event => { event.preventDefault(); void loadIndex(); });
input.addEventListener('input', renderResults);
groups.forEach(group => {
  group.addEventListener('toggle', () => {
    if (group.open) groups.forEach(other => { if (other !== group) other.open = false; });
  });
});
document.addEventListener('click', event => {
  if (event.target instanceof Element && !event.target.closest('.nav-group')) closeNav();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    const active = groups.find(group => group.open);
    closeNav();
    active?.querySelector('summary')?.focus();
  }
});
