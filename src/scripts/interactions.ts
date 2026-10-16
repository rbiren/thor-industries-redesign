type SearchEntry = {
  title: string;
  category: string;
  text: string;
  href: string;
  external?: boolean;
};

const dropdowns = Array.from(document.querySelectorAll<HTMLDetailsElement>('[data-nav-dropdown]'));
dropdowns.forEach((dropdown) => {
  const summary = dropdown.querySelector<HTMLElement>('summary');
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

  triggers.forEach((button) => {
    button.addEventListener('click', () => {
      lastTrigger = button;
      dropdowns.forEach((dropdown) => {
        dropdown.open = false;
        dropdown.querySelector<HTMLElement>('summary')?.setAttribute('aria-expanded', 'false');
      });
      if (!dialog.open) dialog.showModal();
      setExpanded(true);
      onOpen?.(button);
    });
  });

  dialog.querySelectorAll<HTMLElement>(closeSelector).forEach((button) => {
    button.addEventListener('click', () => dialog.close());
  });

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });

  dialog.addEventListener('close', () => {
    setExpanded(false);
    onClose?.();
    lastTrigger?.focus();
  });
};

const searchDialog = document.querySelector<HTMLDialogElement>('#site-search');
const menuDialog = document.querySelector<HTMLDialogElement>('#mobile-menu');
const videoDialog = document.querySelector<HTMLDialogElement>('#video-dialog');
const searchInput = document.querySelector<HTMLInputElement>('[data-search-input]');
const searchResults = document.querySelector<HTMLElement>('[data-search-results]');
const searchStatus = document.querySelector<HTMLElement>('[data-search-status]');
const searchForm = document.querySelector<HTMLFormElement>('[data-search-form]');
const searchScript = document.querySelector<HTMLScriptElement>('[data-search-index]');
const videoContainer = document.querySelector<HTMLElement>('[data-video-container]');
const entries: SearchEntry[] = searchScript?.textContent ? JSON.parse(searchScript.textContent) : [];

const renderResults = (query: string) => {
  if (!searchResults || !searchStatus) return;
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const matches = terms.length
    ? entries
        .map((entry) => {
          const hay = `${entry.title} ${entry.category} ${entry.text}`.toLowerCase();
          const score = terms.reduce(
            (sum, term) =>
              sum +
              (entry.title.toLowerCase().includes(term) ? 4 : 0) +
              (hay.includes(term) ? 1 : -10),
            0,
          );
          return { entry, score };
        })
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 10)
        .map((item) => item.entry)
    : entries.slice(0, 8);

  searchStatus.textContent = terms.length
    ? `${matches.length} result${matches.length === 1 ? '' : 's'} for "${query.trim()}"`
    : 'Popular destinations across THOR Industries';

  searchResults.replaceChildren(
    ...matches.map((item) => {
      const link = document.createElement('a');
      link.className = 'search-result';
      link.href = item.href;
      const meta = document.createElement('span');
      meta.className = 'eyebrow';
      meta.textContent = item.category;
      const title = document.createElement('strong');
      title.textContent = item.title + (item.external ? ' ↗' : '');
      link.append(meta, title);
      return link;
    }),
  );
};

bindDialog(searchDialog, '[data-search-open]', '[data-search-close]', () => {
  renderResults(searchInput?.value ?? '');
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

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    const openDialog = [searchDialog, menuDialog, videoDialog].find((d) => d?.open);
    if (openDialog) {
      event.preventDefault();
      openDialog.close();
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
});

searchInput?.addEventListener('input', () => renderResults(searchInput.value));
searchForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  renderResults(searchInput?.value ?? '');
  const first = searchResults?.querySelector<HTMLAnchorElement>('a');
  if (first && searchInput?.value.trim()) window.location.href = first.href;
});
