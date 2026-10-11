(function () {
  var KEY = 'pc-theme';
  var THEMES = [
    ['dark', 'Soft dark'],
    ['light', 'Light'],
    ['contrast', 'High contrast']
  ];
  function read() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function write(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  function valid(v) { return THEMES.some(function (t) { return t[0] === v; }); }

  var current = read();
  if (!valid(current)) current = 'dark';
  document.documentElement.setAttribute('data-theme', current);

  function apply(v) {
    current = v;
    document.documentElement.setAttribute('data-theme', v);
    write(v);
  }

  document.addEventListener('DOMContentLoaded', function () {
    var wrap = document.querySelector('.site-header .wrap');
    if (!wrap) return;

    var box = document.createElement('div');
    box.className = 'display-ctl';

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'display-btn';
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', 'display-panel');
    btn.textContent = 'Display';

    var panel = document.createElement('div');
    panel.id = 'display-panel';
    panel.className = 'display-panel';
    panel.setAttribute('role', 'group');
    panel.setAttribute('aria-label', 'Page lighting');
    panel.hidden = true;

    var label = document.createElement('p');
    label.className = 'display-label';
    label.textContent = 'Lighting';
    panel.appendChild(label);

    var buttons = THEMES.map(function (t) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'display-opt';
      b.textContent = t[1];
      b.dataset.theme = t[0];
      b.addEventListener('click', function () { apply(t[0]); sync(); });
      panel.appendChild(b);
      return b;
    });

    function sync() {
      buttons.forEach(function (b) {
        b.setAttribute('aria-pressed', b.dataset.theme === current ? 'true' : 'false');
      });
    }
    function close() { panel.hidden = true; btn.setAttribute('aria-expanded', 'false'); }
    function open() { panel.hidden = false; btn.setAttribute('aria-expanded', 'true'); }

    btn.addEventListener('click', function () { panel.hidden ? open() : close(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !panel.hidden) { close(); btn.focus(); }
    });
    document.addEventListener('click', function (e) {
      if (!box.contains(e.target)) close();
    });

    box.appendChild(btn);
    box.appendChild(panel);
    wrap.appendChild(box);
    sync();
  });
})();
