import { BankManagerOperationsAlertMessages } from "@/messages/transactionMessages"
import type { Locators, ObjectModel } from "@/types/pageObject"
import { createLogger } from "@/utils/logger/logger"
import { expect, Page } from "@playwright/test"

export const openAccountPageModel = (page: Page) => {
    const logger = createLogger('account-opening')
    const locators = {
        customers: {
            dropdown: () => page.locator('#userSelect')
        },
        currency: {
            dropdown: () => page.locator('#currency')
        },
        processBtn: () => page.getByRole('button', { name: 'Process' })
    } as const satisfies Locators

    const model = {
        mutate: {
            selectCurrency: async (currency: 'Dollar' | 'Pound' | 'Rupee') => {
                await locators.currency.dropdown().selectOption(currency)
            },
            selectSpecicCustomer: async (name: string) => {
                await locators.customers.dropdown().selectOption(name)
            },
            selectFirstCustomer: async () => {
                await locators.customers.dropdown().selectOption('1')
            },
            processAccountInfo: async () => {
                await locators.processBtn().click()
                logger.info("Process button clicked: expect a dialog")
            }
        },
        validate: {
            modelSanity: async () => {
                await page.waitForURL(/#\/manager\/openAccount/, { timeout: 5000 })
            
                await expect(locators.customers.dropdown()).toBeVisible()
                await expect(locators.currency.dropdown()).toBeVisible()
                await expect(locators.processBtn()).toBeVisible()
            }

        }
    }
    return model satisfies ObjectModel
}



