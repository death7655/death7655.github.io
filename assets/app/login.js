/* µLearn login page. Front-end only: nothing is sent anywhere.
   A valid-looking submit just continues to the dashboard. */
(function () {
  'use strict';
  var d = document, root = d.documentElement;
  function $(s) { return d.querySelector(s); }

  /* theme (shared with the dashboard via localStorage) */
  var meta = $('meta[name="theme-color"]');
  if (meta && !root.classList.contains('dark')) meta.content = '#fefefe';
  $('#theme-toggle').addEventListener('click', function () {
    var t = root.classList.contains('dark') ? 'light' : 'dark';
    root.classList.toggle('dark', t === 'dark');
    root.style.colorScheme = t;
    if (meta) meta.content = t === 'dark' ? '#0a0a0a' : '#fefefe';
    try { localStorage.setItem('mulearn-theme', t); } catch (e) {}
  });

  /* show / hide password */
  var pass = $('#password'), eye = $('#toggle-pass');
  eye.addEventListener('click', function () {
    var show = pass.type === 'password';
    pass.type = show ? 'text' : 'password';
    eye.setAttribute('aria-pressed', String(show));
    eye.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
  });

  /* validation + demo submit */
  var form = $('#login-form'), id = $('#identity'), btn = $('#submit');
  function check(input, errEl, message) {
    var bad = !input.value.trim();
    errEl.hidden = !bad;
    errEl.textContent = bad ? message : '';
    input.setAttribute('aria-invalid', String(bad));
    return !bad;
  }
  var idErr = $('#identity-err'), pwErr = $('#password-err');
  id.addEventListener('input', function () { if (id.value.trim()) check(id, idErr); });
  pass.addEventListener('input', function () { if (pass.value) check(pass, pwErr); });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var okId = check(id, idErr, 'Enter your email or µID.');
    var okPw = check(pass, pwErr, 'Enter your password.');
    if (!okId) { id.focus(); return; }
    if (!okPw) { pass.focus(); return; }
    btn.disabled = true;
    btn.textContent = 'Logging in…';
    setTimeout(function () { location.href = 'dashboard.html'; }, 600);
  });
})();
