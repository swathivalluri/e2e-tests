import type { Locators, ObjectModel } from "@/types/pageObject"
import { expect, Page } from "@playwright/test"

export const managerOperationsPageModel = (page: Page) => {
    const locators = {
        buttons: {
            addCustomerBtn: () => page.locator('.tab').filter( { hasText: 'Add Customer'}),
            openAccountBtn: () => page.getByRole('button', { name: 'Open Account' }),
            viewCustomersBtn: () => page.getByRole('button', { name: 'Customers' })
        }

    } as const satisfies Locators

    const model = {
        mutate: {
            navigateToCreateCustomer: async () => {
                await locators.buttons.addCustomerBtn().click();
            },
            navigateToOpenAccount: async () => {
                await locators.buttons.openAccountBtn().click()
            },
            navigateToViewCustomers: async () => {
                await page.waitForLoadState("domcontentloaded")
                await locators.buttons.viewCustomersBtn().waitFor({ state: "visible" })
                await locators.buttons.viewCustomersBtn().click()
            }
        },
        validate: {
            modelSanity: async () => {
                await expect(locators.buttons.addCustomerBtn()).toBeVisible()
                await expect(locators.buttons.openAccountBtn()).toBeVisible()
                await expect(locators.buttons.viewCustomersBtn()).toBeVisible()

            }

        }
    }
    return model satisfies ObjectModel
}



