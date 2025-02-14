import type {  Locators, ObjectModel } from "@/types/pageObject"
import { createLogger } from "@/utils/logger/logger";
import { Page } from "@playwright/test";


export const dropdownSelectionPageModel = (page: Page, pageName: string) => {
    const logger = createLogger(pageName)
    const locators = {
        userList: () => page.locator('#userSelect'),
        selectOption: (option: string) => page.locator('#userSelect').filter({ hasText: option}),
        loginBtn: () => page.locator('[type="submit"]')
    } as const satisfies Locators

    const model = {
        mutate: {
            selectUserFromList: async (username: string) => {
                await locators.userList().selectOption(username)
            },
            submitLogin: async () => {
                await locators.loginBtn().click()
            }
        },
        validate: {
            modelSanity: async () => {
                logger.info("Dropdown is visible")
                await locators.userList().isVisible()

                //Login button is hidden until user selected
                await locators.loginBtn().isHidden()
            }

        }
    }
    return model satisfies ObjectModel
}



