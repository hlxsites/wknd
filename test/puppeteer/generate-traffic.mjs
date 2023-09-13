import puppeteer from 'puppeteer';

/**
 * Script which generates traffic on the WKND site URL specified by the env var TEST_URL.
 *
 * Usage: `TEST_URL=https://main--wknd--<YOUR-GITHUB-USERNAME-OR-ORG>.hlx.page npm run generate-traffic`
 * ITERATIONS can also be specified as an environment variable. Defaults to 10.
 */

const TEST_URL = process.env.TEST_URL;
const ITERATIONS = parseInt(process.env.ITERATIONS) || 10;

if (!TEST_URL) {
  console.error("Please specify the TEST_URL environment variable.");
  process.exit(1);
}

(async () => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Navigate the page to the WKND URL to generate traffic for
  await page.goto(TEST_URL);

  // Set screen size
  await page.setViewport({ width: 1080, height: 1024 });

  // Loop the desired number of times
  for (let i = 0; i < ITERATIONS; i++) {

    // Wait for the "conversion" button to appear, then click it
    const linkWithConversionTracking = "a.button.primary[data-conversion-tracking=true]"
    await page.waitForSelector(linkWithConversionTracking);
    await page.click(linkWithConversionTracking);

    // Wait for the header to reappear, then click it to return back to the top level page
    const headerLink = ".nav-brand a[href='/']"
    await page.waitForSelector(headerLink);
    await page.click(headerLink);

  }

  console.log('Done! Ran ' + ITERATIONS + " times.");
  await browser.close();
})();
