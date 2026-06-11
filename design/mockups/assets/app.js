/* Shared shell (sidebar + topbar) injected on every mockup page.
   Usage: <body data-active="apis"> ... <script src="assets/app.js"></script> */

const NAV = [
  { label: null, items: [
    { id: 'dashboard', ico: '◧', text: 'Dashboard', href: 'dashboard.html' },
  ]},
  { label: 'Catalog', items: [
    { id: 'apis', ico: '⬡', text: 'APIs', href: 'apis-list.html', count: 128 },
    { id: 'components', ico: '◳', text: 'Components', href: 'components-list.html', count: 342 },
    { id: 'resources', ico: '▤', text: 'Resources', href: '#', count: 57 },
    { id: 'links', ico: '⎘', text: 'Links', href: '#' },
  ]},
  { label: 'Architecture', items: [
    { id: 'systems', ico: '⬢', text: 'Systems', href: 'systems-list.html', count: 24 },
    { id: 'domains', ico: '◰', text: 'Business Domains', href: '#' },
    { id: 'capabilities', ico: '◷', text: 'Capabilities', href: '#' },
    { id: 'entities', ico: '⊞', text: 'Entities', href: '#' },
  ]},
  { label: 'Infrastructure', items: [
    { id: 'clusters', ico: '⏣', text: 'Clusters', href: 'clusters-list.html', count: 8 },
    { id: 'nodes', ico: '▣', text: 'Nodes', href: '#' },
    { id: 'environments', ico: '♺', text: 'Environments', href: '#' },
    { id: 'deployments', ico: '⇪', text: 'Deployments', href: '#' },
  ]},
  { label: 'CI / CD', items: [
    { id: 'releases', ico: '⊕', text: 'Releases', href: '#' },
    { id: 'workflows', ico: '⚙', text: 'Workflows', href: '#' },
    { id: 'ci-servers', ico: '🖧', text: 'CI Servers', href: '#' },
  ]},
  { label: 'Governance', items: [
    { id: 'compliance', ico: '✓', text: 'Compliance', href: '#' },
    { id: 'security', ico: '🛡', text: 'Security', href: '#' },
    { id: 'metrics', ico: '∿', text: 'Metrics', href: '#' },
  ]},
  { label: 'Organization', items: [
    { id: 'groups', ico: '⚇', text: 'Groups', href: '#' },
    { id: 'users', ico: '◉', text: 'Users', href: 'users-list.html', count: 86 },
    { id: 'settings', ico: '✦', text: 'Settings', href: 'settings.html' },
  ]},
];

(function () {
  const active = document.body.dataset.active || '';
  const groups = NAV.map(g => `
    ${g.label ? `<div class="nav-group-label">${g.label}</div>` : ''}
    ${g.items.map(i => `
      <a class="nav-item ${i.id === active ? 'active' : ''}" href="${i.href}">
        <span class="ico">${i.ico}</span>${i.text}
        ${i.count ? `<span class="count">${i.count}</span>` : ''}
      </a>`).join('')}
  `).join('');

  const sidebar = `
    <aside class="sidebar">
      <a class="brand" href="index.html">
        <div class="brand-mark">A</div>
        <div class="brand-name">Atlas<small>Service Catalog</small></div>
      </a>
      <nav>${groups}</nav>
    </aside>`;

  const topbar = `
    <header class="topbar">
      <div class="search">⌕ &nbsp;Search APIs, components, systems… <kbd>⌘K</kbd></div>
      <div class="topbar-actions">
        <button class="icon-btn" title="Notifications">◷</button>
        <button class="icon-btn" title="Help">?</button>
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
})();
