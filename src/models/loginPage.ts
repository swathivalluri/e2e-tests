import type {  Locators, ObjectModel } from "@/types/pageObject"
import { expect, Page } from "@playwright/test";
import { dropdownSelectionPageModel } from "./sharedComponents/dropdownSelectionPage";
import { createLogger } from "@/utils/logger/logger";


export const loginPageModel = (page: Page, pageName: string) => {
    const logger = createLogger(pageName)
    const dropdown = dropdownSelectionPageModel(page, 'login')
    const locators = {
        headers: {
            title: () => page.locator('.mainHeading')
        },
        buttons: {
            home: () => page.locator('.home'),
            customerLogin: () => page.getByRole('button', { name: "Customer Login" }),
            bankManagerLogin: () => page.getByRole('button', { name: "Bank Manager Login" }),
        }
    } as const satisfies Locators

    const model = {
        mutate: {
            loginAsCustomer: async () => {
                logger.info("Log in as a customer")
                await locators.buttons.customerLogin().click();
            },
            loginAsBankManager: async () => {
                await locators.buttons.bankManagerLogin().click()
            },
            navigateToLoginPage: async () => {
                await page.goto('/angularJs-protractor/BankingProject')  // prefixes bases url to this url
                expect(page.url()).toContain(process.env.BASE_URL)
            },
            loginInAsCustomerWithName: async (username: string) => {
                await dropdown.validate.modelSanity()
                await dropdown.mutate.selectUserFromList(username)
                await dropdown.mutate.submitLogin()
            }
        },
        validate: {
            modelSanity: async () => {
                await expect(locators.headers.title()).toHaveText('XYZ Bank')
                await expect(locators.buttons.home()).toBeVisible()
                await expect(locators.buttons.customerLogin()).toBeEnabled()
                await expect(locators.buttons.bankManagerLogin()).toBeEnabled()
            }
        }
    }
    return model satisfies ObjectModel
}



