(function () {
  var form = document.getElementById('contact-form');
  if (!form) return;
  var status = document.getElementById('cf-status');
  var btn = form.querySelector('button[type="submit"]');

  function say(msg, ok) {
    status.textContent = msg;
    status.className = 'form-status ' + (ok ? 'ok' : 'err');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (form.botcheck && form.botcheck.checked) return;      // spam trap
    if (!form.name.value.trim() || !form.email.validity.valid || !form.message.value.trim()) {
      say('Please fill in your name, a valid email address, and a message.', false);
      return;
    }
    btn.disabled = true;
    say('Sending…', true);
    fetch(form.action, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(form)
    }).then(function (r) { return r.json().then(function (j) { return { ok: r.ok && j.success !== false, j: j }; }); })
      .then(function (res) {
        if (res.ok) {
          form.reset();
          say('Thank you. Your message was sent.', true);
        } else {
          say('Sorry, something went wrong. Please try again in a moment.', false);
        }
      })
      .catch(function () { say('Sorry, the message could not be sent. Please check your connection and try again.', false); })
      .then(function () { btn.disabled = false; });
  });
})();
