export default async () => {
    console.log("Global teardown: Closing browser...");

    try {
        if (globalThis.__BROWSER_GLOBAL__) {
            await globalThis.__BROWSER_GLOBAL__.close();
            console.log("✅ Browser closed successfully.");
        } else {
            console.warn("⚠️ No global browser instance found. Skipping teardown.");
        }
    } catch (error) {
        console.error("Error closing the browser:", error);
    }
};
