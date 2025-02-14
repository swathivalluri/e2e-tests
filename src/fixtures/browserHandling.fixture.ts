import { test as baseTest, BrowserContext, Page } from '@playwright/test';
/***
 * 
 * NOTE: custom fixture for browser handling that 
 * can be passed to tests just like page fixture for manual browser handling when needed
 * 
 */
// NOTE: Not used at the moment but need it for manual browser handling with multiple users scenarios when imlemented
const test = baseTest.extend<{ 
    context: BrowserContext
    page: Page; 
}>({
    context: async ({ browser }, use) => {
        const context = await browser.newContext(); // Uses Playwright's browser instance
        await use(context);
        await context.close(); // Ensures proper cleanup
    },

    page: async ({ context }, use) => {
        const page = await context.newPage();
        await use(page);
        await page.close(); // Closes page after test
    },
});

export { test };
