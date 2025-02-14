import { Locator, expect } from "@playwright/test";

export const assertAllLocatorsVisible = async (locators: Record<string, (() => Locator) | Record<string, () => Locator>>) => {
    for (const key in locators) {
        const locator = locators[key];

        if (typeof locator === "function") {
            const element = locator();
            const elements = await element.all(); // gets all the elements that match the locator

            if (elements.length > 1) {
                for (const el of elements) {
                    await expect(el).toBeVisible() // check for visibility
                }
            } else {
                await expect(element).toBeVisible()
            }
        } else if (typeof locator === "object") {
            await assertAllLocatorsVisible(locator); // recursively check nested locators
        }
    }
};
