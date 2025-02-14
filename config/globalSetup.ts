import { chromium, firefox, webkit, Browser, BrowserContext } from '@playwright/test';

export default async () => {
    const browserTypes: Record<string, typeof chromium> = { chromium, firefox, webkit };
    const browserType = (process.env.PLAYWRIGHT_BROWSER || 'chromium').toLowerCase();

    if (!browserTypes[browserType]) {
        throw new Error(`Unknown browser type: ${browserType}. Use 'chromium', 'firefox', or 'webkit'.`);
    }

    console.log(`Launching browser: ${browserType}...`);

    // Launch browser and store globally
    globalThis.__BROWSER_GLOBAL__ = await browserTypes[browserType].launch();

    console.log("Global browser launched.");

    // Attach a dialog handler to EVERY new context
    globalThis.__BROWSER_GLOBAL__.on("context", async (context: BrowserContext) => {
        console.log("New browser context detected. Attaching dialog handler...");

        context.on("dialog", async (dialog) => {
            console.log(`Alert Message: ${dialog.message()}`);
            await dialog.accept(); // Auto-accept all alerts
        });
    });
};
