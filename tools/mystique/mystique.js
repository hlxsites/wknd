const EVENT_NAME = 'mystique-playground';

const mystique = async ({ detail }) => {
  const sk = detail.data;
  const script = document.createElement('script');
  script.src = 'https://localhost:4010/assistant.js';
  script.type = 'text/javascript';
  script.async = true;
  document.head.appendChild(script);
  console.log('Load Mystique here...', sk);
};

const sk = document.querySelector('helix-sidekick');
if (sk) {
  sk.addEventListener(`custom:${EVENT_NAME}`, mystique);
} else {
  document.addEventListener('sidekick-ready', () => {
    document.querySelector('helix-sidekick')
      .addEventListener(`custom:${EVENT_NAME}`, mystique);
  }, { once: true });
}
