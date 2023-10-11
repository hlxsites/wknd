import puppeteer from 'puppeteer';

/**
 * Script which generates traffic on the WKND site URL specified by the env var WKND_URL.
 *
 * Usage: `WKND_URL=https://main--wknd--<YOUR-GITHUB-USERNAME-OR-ORG>.hlx.live npm run generate-traffic`
 * ITERATIONS can also be specified as an environment variable. Defaults to 10.
 */

const WKND_URL = process.env.WKND_URL;
const ITERATIONS = parseInt(process.env.ITERATIONS) || 10;

if (!WKND_URL) {
  console.error("Please specify the TEST_URL environment variable.");
  process.exit(1);
}

(async () => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Navigate the page to the WKND URL to generate traffic for
  await page.goto(WKND_URL);

  // Set screen size
  await page.setViewport({ width: 1080, height: 1024 });

  // Loop the desired number of times
  for (let i = 0; i < ITERATIONS; i++) {

    // First, click through the different sections of the site
    const headerLinks = ["/magazine", "/adventures", "/faqs"];
    for (const link of headerLinks) {
      // Wait for the page to load, click the next link, then repeat
      const linkSelector = `a[href='${link}']`;
      await page.waitForSelector(linkSelector);
      await page.click(linkSelector);
    }

    // Navigate to the top level page
    const headerLink = ".nav-brand a[href='/']"
    await page.waitForSelector(headerLink);
    await page.click(headerLink);

    // Wait for the "conversion" button to appear, then click it
    const linkWithConversionTracking = "a.button.primary[href='/adventures']"
    await page.waitForSelector(linkWithConversionTracking);
    await page.click(linkWithConversionTracking);

    // Wait for the header to reappear, then click it to return back to the top level page
    await page.waitForSelector(headerLink);
    await page.click(headerLink);

  }

  console.log('Done! Ran ' + ITERATIONS + " times.");
  await browser.close();
})();
