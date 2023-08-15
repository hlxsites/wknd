// Wait for sidekick to be loaded
const sidekick = await new Promise((resolve) => {
  const sk = document.querySelector('helix-sidekick');
  if (sk) {
    resolve(sk);
    return;
  }

  document.addEventListener('helix-sidekick-ready', () => {
    resolve(document.querySelector('helix-sidekick'));
  }, { once: true });
});

// Wait for preview with date button
const previewWithDateButton = await new Promise((resolve) => {
  const check = () => {
    const btn = sidekick.shadowRoot.querySelector('button[title="Preview with Date"]');
    if (btn) {
      resolve(btn);
    } else {
      setTimeout(check, 100);
    }
  };
  check();
});

// Add CSS file to sidekick shadowRoot
sidekick.shadowRoot.append(
  document
    .createRange()
    .createContextualFragment(`<link rel="stylesheet" href="${window.hlx.codeBasePath}/scripts/scheduling/scheduling.css" />`),
);

const today = new Date().toISOString().split('T')[0];
const current = window.sessionStorage.getItem('preview-date') || today;

// Replace preview date button with date field
previewWithDateButton.replaceWith(
  document
    .createRange()
    .createContextualFragment(`<input class="date-selection" type="date" id="date" name="preview-start" value=${current} required pattern="\\d{4}-\\d{2}-\\d{2}" />`),
);

sidekick.shadowRoot.querySelector('.date-selection').addEventListener('change', (event) => {
  const newValue = event.target.value.trim();
  if (newValue) {
    window.sessionStorage.setItem('preview-date', event.target.value);
  } else {
    window.sessionStorage.removeItem('preview-date');
  }
  window.location.reload();
});

sidekick.addEventListener('hidden', () => {
  window.sessionStorage.removeItem('preview-date');
  window.location.reload();
});
