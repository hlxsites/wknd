let SITE_KEY = '6LcB318mAAAAAO6smzDd-TtD1-AWlidsHsCXcJHy';

function loadScript(url) {
  const head = document.querySelector('head');
  let script = head.querySelector(`script[src="${url}"]`);
  if (!script) {
    script = document.createElement('script');
    script.src = url;
    script.async = true;
    head.append(script);
    return script;
  }
  return script;
}

export async function transformCaptchaDOM(formDef, form) {
  SITE_KEY = formDef.find((field) => field.Name === 'googleRecaptcha')?.Value;
  const button = form.querySelector('button[type="submit"]');
  if (SITE_KEY && button) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loadScript(`https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`);
          obs.disconnect();
        }
      });
    });
    obs.observe(button);
  }
}

export async function transformCaptchaRequest(request) {
  const { grecaptcha } = window;
  const { body, headers, url } = request;
  return new Promise((resolve) => {
    if (grecaptcha) {
      grecaptcha.ready(() => {
        grecaptcha.execute(SITE_KEY, { action: 'submit' }).then(async (token) => {
          const newbody = {
            data: JSON.parse(body).data,
            token,
          };
          resolve({
            body: JSON.stringify(newbody),
            headers,
            url,
          });
        });
      });
    } else {
      resolve(request);
    }
  });
}
