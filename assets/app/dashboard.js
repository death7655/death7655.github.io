/* µLearn dashboard: small vanilla replacement for the app's client-side bundle.
   Handles theme, sidebar, account menu, greeting, calendar and logout.
   No data is fetched; the page content is the static snapshot. */
(function () {
  'use strict';
  var d = document, root = d.documentElement, body = d.body;
  function $(s, c) { return (c || d).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); }

  /* ---------- theme ---------- */
  var themeMeta = $('meta[name="theme-color"]');
  function setTheme(t) {
    root.classList.toggle('dark', t === 'dark');
    root.style.colorScheme = t;
    if (themeMeta) themeMeta.content = t === 'dark' ? '#0a0a0a' : '#fefefe';
    try { localStorage.setItem('mulearn-theme', t); } catch (e) {}
  }
  if (themeMeta && !root.classList.contains('dark')) themeMeta.content = '#fefefe';
  var themeBtn = $('#theme-toggle');
  if (themeBtn) themeBtn.addEventListener('click', function () {
    setTheme(root.classList.contains('dark') ? 'light' : 'dark');
  });

  /* ---------- sidebar (collapse on desktop, drawer on mobile) ---------- */
  var sb = $('#app-sidebar'), trigger = $('[data-sidebar="trigger"]'), backdrop = $('.sidebar-backdrop');
  var wide = window.matchMedia('(min-width: 768px)');
  var ICON_X = '<path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>';
  var ICON_MENU = '<path d="M4 5h16"></path><path d="M4 12h16"></path><path d="M4 19h16"></path>';
  function setIcon(open) { var s = $('svg', trigger); if (s) s.innerHTML = open ? ICON_X : ICON_MENU; }
  function setCollapsed(c) {
    setIcon(!c);
    sb.setAttribute('data-state', c ? 'collapsed' : 'expanded');
    sb.setAttribute('data-collapsible', c ? 'offcanvas' : '');
    body.classList.toggle('sidebar-collapsed', c);
    trigger.setAttribute('aria-expanded', String(!c));
  }
  function setDrawer(o) {
    setIcon(o);
    body.classList.toggle('drawer-open', o);
    backdrop.hidden = !o;
    trigger.setAttribute('aria-expanded', String(o));
  }
  if (sb && trigger) {
    if (!wide.matches) { trigger.setAttribute('aria-expanded', 'false'); setIcon(false); }
    trigger.addEventListener('click', function () {
      if (wide.matches) setCollapsed(!body.classList.contains('sidebar-collapsed'));
      else setDrawer(!body.classList.contains('drawer-open'));
    });
    backdrop.addEventListener('click', function () { setDrawer(false); });
    wide.addEventListener('change', function () {
      setDrawer(false);
      var open = wide.matches ? !body.classList.contains('sidebar-collapsed') : false;
      setIcon(open);
      trigger.setAttribute('aria-expanded', String(open));
    });
  }

  /* ---------- account menu ---------- */
  var acBtn = $('[aria-label="Account menu"]'), acMenu = $('#account-menu');
  function setMenu(open, focusTrigger) {
    acMenu.hidden = !open;
    acBtn.setAttribute('aria-expanded', String(open));
    acBtn.setAttribute('data-state', open ? 'open' : 'closed');
    if (!open && focusTrigger) acBtn.focus();
  }
  if (acBtn && acMenu) {
    acBtn.addEventListener('click', function () { setMenu(acMenu.hidden); });
    d.addEventListener('click', function (e) {
      if (!acMenu.hidden && !acMenu.contains(e.target) && !acBtn.contains(e.target)) setMenu(false);
    });
    acMenu.addEventListener('keydown', function (e) {
      var items = $$('a,button', acMenu), i = items.indexOf(d.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); items[(i + 1) % items.length].focus(); }
      if (e.key === 'ArrowUp') { e.preventDefault(); items[(i - 1 + items.length) % items.length].focus(); }
    });
    acBtn.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); setMenu(true); $('a,button', acMenu).focus(); }
    });
  }
  d.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (acMenu && !acMenu.hidden) setMenu(false, true);
    if (body.classList.contains('drawer-open')) { setDrawer(false); trigger.focus(); }
  });

  /* ---------- logout (demo: just returns to the login page) ---------- */
  $$('[data-action="logout"]').forEach(function (b) {
    b.addEventListener('click', function () { location.href = 'login.html'; });
  });

  /* ---------- greeting ---------- */
  var greet = $('#greet-word');
  if (greet) {
    var h = new Date().getHours();
    greet.textContent = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  }

  /* ---------- calendar ---------- */
  var grid = $('#cal-days'), title = $('#cal-title');
  var prev = $('[aria-label="Previous month"]'), next = $('[aria-label="Next month"]');
  if (grid && title && prev && next) {
    var MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    var cls = { out: '', day: '', today: '' }, dotCls = '', events = {};
    $$('button', grid).forEach(function (b) {
      var c = b.getAttribute('class') || '', dot = $('span', b);
      if (c.indexOf('opacity-40') > -1) cls.out = cls.out || c;
      else if (c.indexOf('bg-blue-500') > -1) cls.today = cls.today || c;
      else cls.day = cls.day || c;
      if (dot) {
        dotCls = dot.getAttribute('class');
        var m = /^([A-Za-z]+) (\d+), (\d+)$/.exec(b.getAttribute('aria-label'));
        if (m) events[m[3] + '-' + MONTHS.indexOf(m[1]) + '-' + (+m[2])] = true;
      }
    });
    var now = new Date(), view = new Date(now.getFullYear(), now.getMonth(), 1);

    function cell(y, m, day, kind) {
      var b = d.createElement('button');
      b.type = 'button';
      b.setAttribute('data-slot', 'button'); b.setAttribute('data-variant', 'secondary'); b.setAttribute('data-size', 'default');
      b.setAttribute('class', cls[kind]);
      b.setAttribute('aria-label', MONTHS[m] + ' ' + day + ', ' + y);
      if (kind === 'today') b.setAttribute('aria-current', 'date');
      b.appendChild(d.createTextNode(String(day)));
      if (kind !== 'today' && events[y + '-' + m + '-' + day]) {
        var s = d.createElement('span'); s.setAttribute('class', dotCls); b.appendChild(s);
      }
      return b;
    }
    function render() {
      var y = view.getFullYear(), m = view.getMonth();
      var lead = new Date(y, m, 1).getDay(), total = new Date(y, m + 1, 0).getDate(), pd = new Date(y, m, 0).getDate();
      var py = m === 0 ? y - 1 : y, pm = m === 0 ? 11 : m - 1;
      var frag = d.createDocumentFragment();
      for (var i = lead - 1; i >= 0; i--) frag.appendChild(cell(py, pm, pd - i, 'out'));
      for (var n = 1; n <= total; n++) {
        var isToday = y === now.getFullYear() && m === now.getMonth() && n === now.getDate();
        frag.appendChild(cell(y, m, n, isToday ? 'today' : 'day'));
      }
      grid.textContent = '';
      grid.appendChild(frag);
      title.textContent = MONTHS[m] + ', ' + y;
    }
    prev.addEventListener('click', function () { view = new Date(view.getFullYear(), view.getMonth() - 1, 1); render(); });
    next.addEventListener('click', function () { view = new Date(view.getFullYear(), view.getMonth() + 1, 1); render(); });
    render();
  }
})();
