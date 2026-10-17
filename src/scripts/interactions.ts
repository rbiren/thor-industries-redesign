import { search, type SearchRecord } from './search';

const dropdowns = Array.from(document.querySelectorAll<HTMLDetailsElement>('[data-nav-dropdown]'));
dropdowns.forEach((dropdown) => {
  const summary = dropdown.querySelector<HTMLElement>('summary');
  summary?.setAttribute('aria-expanded', String(dropdown.open));
  dropdown.addEventListener('toggle', () => {
    summary?.setAttribute('aria-expanded', String(dropdown.open));
    if (dropdown.open) {
      dropdowns.forEach((other) => {
        if (other !== dropdown && other.open) {
          other.open = false;
          other.querySelector<HTMLElement>('summary')?.setAttribute('aria-expanded', 'false');
        }
      });
    }
  });
});

const mobileGroups = Array.from(document.querySelectorAll<HTMLDetailsElement>('[data-mobile-group]'));
mobileGroups.forEach((group) => {
  const summary = group.querySelector<HTMLElement>('summary');
  summary?.setAttribute('aria-expanded', String(group.open));
  group.addEventListener('toggle', () => {
    summary?.setAttribute('aria-expanded', String(group.open));
  });
});

document.addEventListener('click', (event) => {
  const target = event.target as Node | null;
  if (!target) return;
  dropdowns.forEach((dropdown) => {
    if (dropdown.open && !dropdown.contains(target)) {
      dropdown.open = false;
      dropdown.querySelector<HTMLElement>('summary')?.setAttribute('aria-expanded', 'false');
    }
  });
});

const searchDialog = document.querySelector<HTMLDialogElement>('#site-search');
const menuDialog = document.querySelector<HTMLDialogElement>('#mobile-menu');
const videoDialog = document.querySelector<HTMLDialogElement>('#video-dialog');
const newsDialog = document.querySelector<HTMLDialogElement>('#news-preview-dialog');
const allDialogs = [searchDialog, menuDialog, videoDialog, newsDialog];

const syncScrollLock = () => {
  const anyOpen = allDialogs.some((d) => Boolean(d?.open));
  document.documentElement.style.overflow = anyOpen ? 'hidden' : '';
  document.body.style.overflow = anyOpen ? 'hidden' : '';
};

const dialogClosers = new Map<HTMLDialogElement, () => void>();

const bindDialog = (
  dialog: HTMLDialogElement | null,
  openSelector: string,
  closeSelector: string,
  onOpen?: (trigger: HTMLElement | null) => void,
  onClose?: () => void,
) => {
  if (!dialog) return;
  let lastTrigger: HTMLElement | null = null;
  const triggers = Array.from(document.querySelectorAll<HTMLElement>(openSelector));

  const setExpanded = (expanded: boolean) => {
    triggers.forEach((btn) => btn.setAttribute('aria-expanded', String(expanded)));
  };

  const finalizeClose = () => {
    if (dialog.open) dialog.close();
    setExpanded(false);
    syncScrollLock();
    onClose?.();
    lastTrigger?.focus();
  };

  dialogClosers.set(dialog, finalizeClose);

  triggers.forEach((button) => {
    button.addEventListener('click', () => {
      lastTrigger = button;
      dropdowns.forEach((dropdown) => {
        dropdown.open = false;
        dropdown.querySelector<HTMLElement>('summary')?.setAttribute('aria-expanded', 'false');
      });
      if (!dialog.open) dialog.showModal();
      setExpanded(true);
      syncScrollLock();
      onOpen?.(button);
    });
  });

  dialog.querySelectorAll<HTMLElement>(closeSelector).forEach((button) => {
    button.addEventListener('click', () => {
      finalizeClose();
    });
  });

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) {
      finalizeClose();
    }
  });

  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    finalizeClose();
  });

  dialog.addEventListener('close', () => {
    finalizeClose();
  });
};

const searchInput = document.querySelector<HTMLInputElement>('[data-search-input]');
const searchClearBtn = document.querySelector<HTMLButtonElement>('[data-search-clear]');
const searchResults = document.querySelector<HTMLElement>('[data-search-results]');
const searchStatus = document.querySelector<HTMLElement>('[data-search-status]');
const searchEmpty = document.querySelector<HTMLElement>('[data-search-empty]');
const searchNoResults = document.querySelector<HTMLElement>('[data-search-no-results]');
const searchNoResultsText = document.querySelector<HTMLElement>('[data-search-no-results-text]');
const searchForm = document.querySelector<HTMLFormElement>('[data-search-form]');
const searchScript = document.querySelector<HTMLScriptElement>('[data-search-index]');
const videoContainer = document.querySelector<HTMLElement>('[data-video-container]');
const newsDialogMeta = document.querySelector<HTMLElement>('[data-news-dialog-meta]');
const newsDialogTitle = document.querySelector<HTMLElement>('[data-news-dialog-title]');
const newsDialogBody = document.querySelector<HTMLElement>('[data-news-dialog-body]');
const newsDialogLink = document.querySelector<HTMLAnchorElement>('[data-news-dialog-link]');

let records: SearchRecord[] = [];
if (searchScript?.textContent) {
  try {
    records = JSON.parse(searchScript.textContent) as SearchRecord[];
  } catch {
    records = [];
  }
}

let indexFetchPromise: Promise<void> | null = null;
const ensureSearchIndexLoaded = () => {
  if (indexFetchPromise) return indexFetchPromise;
  const url = searchDialog?.getAttribute('data-search-index-url');
  if (!url) return Promise.resolve();
  indexFetchPromise = fetch(url)
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        records = data as SearchRecord[];
        if (searchDialog?.open) {
          renderResults(searchInput?.value ?? '');
        }
      }
    })
    .catch(() => {
      // Fallback to inline search index already parsed in `records`
    });
  return indexFetchPromise;
};

const renderResults = (rawQuery: string) => {
  if (!searchResults || !searchStatus) return;
  const trimmed = rawQuery.trim();

  if (!trimmed) {
    searchResults.replaceChildren();
    if (searchEmpty) searchEmpty.hidden = false;
    if (searchNoResults) searchNoResults.hidden = true;
    searchStatus.textContent = 'Enter a keyword or phrase to search all 23 THOR Industries pages.';
    return;
  }

  const matches = search(records, trimmed);

  if (searchEmpty) searchEmpty.hidden = true;

  if (matches.length === 0) {
    searchResults.replaceChildren();
    if (searchNoResults) searchNoResults.hidden = false;
    if (searchNoResultsText) {
      searchNoResultsText.textContent = `No matching pages found for "${trimmed}". Try searching for RV types, THOR companies, stories, innovation, or sustainability.`;
    }
    searchStatus.textContent = `0 results for "${trimmed}"`;
    return;
  }

  if (searchNoResults) searchNoResults.hidden = true;
  searchStatus.textContent = `${matches.length} ${matches.length === 1 ? 'result' : 'results'} for "${trimmed}"`;

  searchResults.replaceChildren(
    ...matches.map((record) => {
      const link = document.createElement('a');
      link.className = 'search-result';
      link.href = record.url;

      const meta = document.createElement('span');
      meta.className = 'eyebrow';
      meta.textContent = record.group ? `${record.group} · ${record.label}` : record.label;

      const title = document.createElement('strong');
      title.textContent = record.title;

      const desc = document.createElement('span');
      desc.className = 'search-result-desc';
      desc.textContent = record.description;

      link.append(meta, title, desc);
      return link;
    }),
  );
};

bindDialog(searchDialog, '[data-search-open]', '[data-search-close]', () => {
  void ensureSearchIndexLoaded();
  if (searchInput) {
    searchInput.value = '';
  }
  renderResults('');
  searchInput?.focus();
});

bindDialog(menuDialog, '[data-menu-open]', '[data-menu-close]', () => {
  menuDialog?.querySelector<HTMLElement>('[data-menu-close]')?.focus();
});

bindDialog(
  videoDialog,
  '[data-video-open]',
  '[data-video-close]',
  (trigger) => {
    if (videoContainer) {
      const embedUrl =
        trigger?.getAttribute('data-video-embed') ||
        'https://www.youtube.com/embed/HlXl0gFApyQ?autoplay=1&rel=0';
      const iframe = document.createElement('iframe');
      iframe.src = embedUrl;
      iframe.title = '2025 THOR Industries Board Video';
      iframe.allow =
        'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.allowFullscreen = true;
      iframe.loading = 'eager';
      videoContainer.replaceChildren(iframe);
    }
    videoDialog?.querySelector<HTMLElement>('[data-video-close]')?.focus();
  },
  () => {
    videoContainer?.replaceChildren();
  },
);

bindDialog(
  newsDialog,
  '[data-news-open]',
  '[data-news-close]',
  (trigger) => {
    if (!trigger) return;
    const title = trigger.getAttribute('data-news-title') || 'Article Preview';
    const date = trigger.getAttribute('data-news-date') || '';
    const source = trigger.getAttribute('data-news-source') || 'THOR News';
    const href =
      trigger.getAttribute('data-news-href') ||
      'https://www.thorindustries.com/news-events/thor-industries-harbinger-world-changing-ideas-award';
    const rawParagraphs = trigger.getAttribute('data-news-paragraphs') || '[]';
    let paragraphs: string[] = [];
    try {
      paragraphs = JSON.parse(rawParagraphs);
    } catch {
      paragraphs = [];
    }

    if (newsDialogMeta) {
      newsDialogMeta.textContent = [date, source].filter(Boolean).join(' · ');
    }
    if (newsDialogTitle) {
      newsDialogTitle.textContent = title;
    }
    if (newsDialogBody) {
      newsDialogBody.replaceChildren(
        ...paragraphs.map((text) => {
          const p = document.createElement('p');
          p.textContent = text;
          return p;
        }),
      );
    }
    if (newsDialogLink) {
      newsDialogLink.href = href;
    }
    newsDialog?.querySelector<HTMLElement>('[data-news-close]')?.focus();
  },
);

document.addEventListener(
  'keydown',
  (event) => {
    if (event.key === 'Escape') {
      const openDialog = allDialogs.find((d) => d?.open);
      if (openDialog) {
        event.preventDefault();
        event.stopPropagation();
        const closer = dialogClosers.get(openDialog);
        if (closer) {
          closer();
        } else {
          openDialog.close();
          syncScrollLock();
        }
        return;
      }
      const openDropdown = dropdowns.find((dropdown) => dropdown.open);
      if (openDropdown) {
        event.preventDefault();
        openDropdown.open = false;
        const summary = openDropdown.querySelector<HTMLElement>('summary');
        summary?.setAttribute('aria-expanded', 'false');
        summary?.focus();
      }
    }
  },
  true,
);

searchInput?.addEventListener('input', () => renderResults(searchInput.value));
searchClearBtn?.addEventListener('click', () => {
  if (searchInput) {
    searchInput.value = '';
    renderResults('');
    searchInput.focus();
  }
});
searchForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  renderResults(searchInput?.value ?? '');
  const first = searchResults?.querySelector<HTMLAnchorElement>('a');
  if (first && searchInput?.value.trim()) window.location.href = first.href;
});

// Story category tag filters
const filterBars = Array.from(document.querySelectorAll<HTMLElement>('[data-story-filters]'));
filterBars.forEach((bar) => {
  const section = bar.closest('.content-section');
  if (!section) return;
  const chips = Array.from(bar.querySelectorAll<HTMLButtonElement>('[data-tag-filter]'));
  const resetBtn = bar.querySelector<HTMLButtonElement>('[data-tag-reset]');
  const statusEl = bar.querySelector<HTMLElement>('[data-filter-status]');
  const cards = Array.from(section.querySelectorAll<HTMLElement>('[data-story-card]'));

  const updateFilter = () => {
    const activeTags = chips
      .filter((chip) => chip.getAttribute('aria-pressed') === 'true')
      .map((chip) => chip.getAttribute('data-tag-filter') || '')
      .filter(Boolean);

    let visibleCount = 0;
    cards.forEach((card) => {
      const cardTags = (card.getAttribute('data-story-tags') || '')
        .split('|')
        .map((t) => t.trim())
        .filter(Boolean);
      const matches =
        activeTags.length === 0 || activeTags.some((tag) => cardTags.includes(tag));
      card.hidden = !matches;
      if (matches) visibleCount += 1;
    });

    if (resetBtn) {
      resetBtn.setAttribute('aria-pressed', String(activeTags.length === 0));
    }
    if (statusEl) {
      if (activeTags.length > 0) {
        statusEl.hidden = false;
        statusEl.textContent = `Showing ${visibleCount} of ${cards.length} stories matching ${activeTags.join(', ')}`;
      } else {
        statusEl.hidden = true;
        statusEl.textContent = '';
      }
    }
  };

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const pressed = chip.getAttribute('aria-pressed') === 'true';
      chip.setAttribute('aria-pressed', String(!pressed));
      updateFilter();
    });
  });

  resetBtn?.addEventListener('click', () => {
    chips.forEach((chip) => chip.setAttribute('aria-pressed', 'false'));
    updateFilter();
  });
});

// Travel region filter cards
const travelRegionsSection = document.querySelector<HTMLElement>('[data-travel-regions]');
if (travelRegionsSection) {
  const regionButtons = Array.from(
    travelRegionsSection.querySelectorAll<HTMLButtonElement>('[data-region-filter]'),
  );
  const resetButton = travelRegionsSection.querySelector<HTMLButtonElement>('[data-region-reset]');
  const regionStatus = travelRegionsSection.querySelector<HTMLElement>('[data-region-status]');
  const guidesSection = document.querySelector<HTMLElement>('#category-stories, [data-story-listing]');
  const guideCards = guidesSection
    ? Array.from(guidesSection.querySelectorAll<HTMLElement>('[data-story-card]'))
    : [];

  const applyRegion = (region: string | null) => {
    regionButtons.forEach((btn) => {
      const isMatch = region !== null && btn.getAttribute('data-region-filter') === region;
      btn.setAttribute('aria-pressed', String(isMatch));
    });

    let count = 0;
    guideCards.forEach((card) => {
      const cardTags = (card.getAttribute('data-story-tags') || '')
        .split('|')
        .map((t) => t.trim());
      const matches = !region || cardTags.includes(region);
      card.hidden = !matches;
      if (matches) count += 1;
    });

    if (regionStatus) {
      if (region) {
        regionStatus.hidden = false;
        regionStatus.textContent = `Showing ${count} trip guide${count === 1 ? '' : 's'} for ${region}`;
      } else {
        regionStatus.hidden = false;
        regionStatus.textContent = `Showing all ${guideCards.length} trip guides`;
      }
    }
  };

  regionButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const region = btn.getAttribute('data-region-filter');
      const currentlyPressed = btn.getAttribute('aria-pressed') === 'true';
      applyRegion(currentlyPressed ? null : region);
      guidesSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  resetButton?.addEventListener('click', () => {
    applyRegion(null);
    guidesSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

// Load More Stories buttons
const loadMoreButtons = Array.from(
  document.querySelectorAll<HTMLButtonElement>('[data-load-more-stories]'),
);
loadMoreButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const section = btn.closest('.content-section');
    if (section) {
      section
        .querySelectorAll<HTMLElement>('[data-story-card]')
        .forEach((card) => (card.hidden = false));
    }
    btn.textContent = 'ALL STORIES LOADED';
    btn.disabled = true;
  });
});

// FAQ Expand All / Collapse All controls
const faqList = document.querySelector<HTMLElement>('[data-faq-list], .faq-list');
if (faqList) {
  const faqItems = Array.from(faqList.querySelectorAll<HTMLDetailsElement>('.faq-item'));
  const expandAllBtn = document.querySelector<HTMLButtonElement>('[data-faq-expand-all]');
  const collapseAllBtn = document.querySelector<HTMLButtonElement>('[data-faq-collapse-all]');

  expandAllBtn?.addEventListener('click', () => {
    faqItems.forEach((item) => {
      item.open = true;
    });
  });

  collapseAllBtn?.addEventListener('click', () => {
    faqItems.forEach((item) => {
      item.open = false;
    });
  });
}

// THOR Companies directory tag filters
const companyDirectory = document.querySelector<HTMLElement>('[data-company-directory]');
if (companyDirectory) {
  const filterBtns = Array.from(
    companyDirectory.querySelectorAll<HTMLButtonElement>('[data-company-filter]'),
  );
  const companySections = Array.from(
    companyDirectory.querySelectorAll<HTMLElement>('[data-company-section]'),
  );

  const applyCompanyFilter = (filterValue: string) => {
    filterBtns.forEach((btn) => {
      const active = btn.getAttribute('data-company-filter') === filterValue;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', String(active));
    });

    companySections.forEach((section) => {
      const cards = Array.from(section.querySelectorAll<HTMLElement>('[data-company-card]'));
      let visibleInSection = 0;
      cards.forEach((card) => {
        const tags = (card.getAttribute('data-company-tags') || '')
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean);
        const matches = filterValue === 'all' || tags.includes(filterValue);
        card.hidden = !matches;
        if (matches) visibleInSection += 1;
      });
      section.hidden = visibleInSection === 0;
    });
  };

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const val = btn.getAttribute('data-company-filter') || 'all';
      applyCompanyFilter(val);
    });
  });
}


