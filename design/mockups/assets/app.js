/* Shared shell (sidebar + topbar) injected on every mockup page.
   Usage: <body data-active="apis"> ... <script src="assets/app.js"></script>

   Icons: Google Material Symbols (Rounded). The `ico` field below is a
   Material Symbol ligature name, rendered as <span class="mi">name</span>.
   Browse names at https://fonts.google.com/icons (style: Rounded).

   Theming: the topbar toggle flips <html data-theme="light|dark">, persisted
   to localStorage. Add more themes in atlas.css and extend THEMES below. */

const THEMES = ['light', 'dark']; // extend with custom themes defined in atlas.css

/* Atlas logomark — flat, geometric globe/meridian (cartography identity).
   Inherits color from its container (currentColor). Reuse anywhere with:
   <div class="brand-mark">…this svg…</div>  (see design-system.html → Brand). */
const ATLAS_LOGO = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-label="Atlas"><circle cx="12" cy="12" r="9"/><path d="M3.2 12h17.6"/><ellipse cx="12" cy="12" rx="4.2" ry="9"/><circle cx="12" cy="12" r="1.7" fill="currentColor" stroke="none"/></svg>`;

const NAV = [
  { label: null, items: [
    { id: 'dashboard', ico: 'dashboard', text: 'Dashboard', href: 'dashboard.html' },
  ]},
  { label: 'Catalog', items: [
    { id: 'apis', ico: 'api', text: 'APIs', href: 'apis-list.html', count: 128 },
    { id: 'components', ico: 'widgets', text: 'Components', href: 'components-list.html', count: 342 },
    { id: 'resources', ico: 'database', text: 'Resources', href: 'resources-list.html', count: 57 },
    { id: 'links', ico: 'link', text: 'Links', href: 'links-list.html' },
  ]},
  { label: 'Architecture', items: [
    { id: 'systems', ico: 'hub', text: 'Systems', href: 'systems-list.html', count: 24 },
    { id: 'domains', ico: 'domain', text: 'Business Domains', href: 'domains-list.html' },
    { id: 'capabilities', ico: 'extension', text: 'Capabilities', href: 'capabilities-list.html' },
    { id: 'entities', ico: 'table', text: 'Entities', href: 'entities-list.html' },
  ]},
  { label: 'Infrastructure', items: [
    { id: 'clusters', ico: 'lan', text: 'Clusters', href: 'clusters-list.html', count: 8 },
    { id: 'nodes', ico: 'dns', text: 'Nodes', href: 'nodes-list.html' },
    { id: 'environments', ico: 'cached', text: 'Environments', href: 'environments-list.html' },
    { id: 'deployments', ico: 'rocket_launch', text: 'Deployments', href: 'deployments-list.html' },
  ]},
  { label: 'CI / CD', items: [
    { id: 'releases', ico: 'new_releases', text: 'Releases', href: 'releases-list.html' },
    { id: 'workflows', ico: 'account_tree', text: 'Workflows', href: 'workflows-list.html' },
    { id: 'ci-servers', ico: 'memory', text: 'CI Servers', href: 'ci-servers-list.html' },
  ]},
  { label: 'Governance', items: [
    { id: 'compliance', ico: 'verified', text: 'Compliance', href: 'compliance.html' },
    { id: 'security', ico: 'shield', text: 'Security', href: 'security.html' },
    { id: 'metrics', ico: 'monitoring', text: 'Metrics', href: 'metrics.html' },
  ]},
  { label: 'Organization', items: [
    { id: 'groups', ico: 'groups', text: 'Groups', href: 'groups-list.html' },
    { id: 'users', ico: 'person', text: 'Users', href: 'users-list.html', count: 86 },
    { id: 'settings', ico: 'settings', text: 'Settings', href: 'settings.html' },
  ]},
];

/* ---- theme bootstrap (runs before render to avoid a flash) ---- */
(function () {
  const saved = localStorage.getItem('atlas-theme');
  if (saved && THEMES.includes(saved)) document.documentElement.dataset.theme = saved;
  else document.documentElement.dataset.theme = 'light';
})();

(function () {
  const active = document.body.dataset.active || '';
  const groups = NAV.map(g => `
    ${g.label ? `<div class="nav-group-label">${g.label}</div>` : ''}
    ${g.items.map(i => `
      <a class="nav-item ${i.id === active ? 'active' : ''}" href="${i.href}">
        <span class="mi">${i.ico}</span>${i.text}
        ${i.count ? `<span class="count">${i.count}</span>` : ''}
      </a>`).join('')}
  `).join('');

  const sidebar = `
    <aside class="sidebar">
      <a class="brand" href="index.html">
        <div class="brand-mark">${ATLAS_LOGO}</div>
        <div class="brand-name">Atlas<small>Service Catalog</small></div>
      </a>
      <nav>${groups}</nav>
    </aside>`;

  const topbar = `
    <header class="topbar">
      <div class="search"><span class="mi sm">search</span> &nbsp;Search APIs, components, systems… <kbd>⌘K</kbd></div>
      <div class="topbar-actions">
        <button class="icon-btn" id="theme-toggle" title="Toggle theme"><span class="mi">dark_mode</span></button>
        <button class="icon-btn" title="Notifications"><span class="mi">notifications</span></button>
        <button class="icon-btn" title="Help"><span class="mi">help</span></button>
        <div class="avatar">CA</div>
      </div>
    </header>`;

  const content = document.body.innerHTML;
  document.body.innerHTML = `
    <div class="app">
      ${sidebar}
      <div class="main">
        ${topbar}
        <div class="content">${content}</div>
      </div>
    </div>`;

  /* ---- theme toggle ---- */
  const setIcon = () => {
    const el = document.querySelector('#theme-toggle .mi');
    if (el) el.textContent = document.documentElement.dataset.theme === 'dark' ? 'light_mode' : 'dark_mode';
  };
  setIcon();
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    localStorage.setItem('atlas-theme', next);
    setIcon();
  });
})();
