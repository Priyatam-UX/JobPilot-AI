const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Log all console messages
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  
  // Log all network requests that fail
  page.on('requestfailed', request =>
    console.log(`REQUEST FAILED: ${request.url()} - ${request.failure().errorText}`)
  );
  
  page.on('response', response => {
    if (!response.ok()) {
      console.log(`RESPONSE ERROR: ${response.url()} - ${response.status()}`);
    }
  });

  console.log('Navigating to login page...');
  await page.goto('http://localhost:5173/login');
  
  console.log('Logging in...');
  await page.fill('input[type="email"]', 'test_2@example.com');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');

  console.log('Waiting for login to complete...');
  await page.waitForNavigation().catch(() => {});
  
  console.log('Navigating to /jobs...');
  await page.goto('http://localhost:5173/jobs');

  console.log('Waiting for jobs to load...');
  // Wait for at least one job card to appear
  await page.waitForSelector('.cursor-pointer', { timeout: 10000 }).catch(() => {});
  
  // Just click the first job card
  console.log('Clicking first job card...');
  const jobCards = await page.locator('.cursor-pointer').all();
  if (jobCards.length > 0) {
    await jobCards[0].click();
    
    console.log('Waiting for Auto Apply button...');
    const applyBtn = page.locator('button:has-text("Auto Apply")');
    await applyBtn.waitFor();
    console.log('Clicking Auto Apply button...');
    await applyBtn.click();
    
    console.log('Waiting 5 seconds for fetch to fail...');
    await page.waitForTimeout(5000);
  } else {
    console.log('No job cards found!');
  }

  await browser.close();
})();
