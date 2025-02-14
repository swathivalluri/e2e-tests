import type {  Locators, ObjectModel } from "@/types/pageObject"
import { createLogger } from "@/utils/logger/logger";
import { Page } from "@playwright/test";


export const tabSelectionPageModel = (page: Page, name: string, pageName: string = 'AccountDetials') => { // NOTE: Withdrawal, Deposit both use same UI component
    const logger = createLogger(pageName)
    const locators = {
        tab: {
            transactions: () => page.getByRole('button', { name: 'Transactions' }),
            deposit: () => page.getByRole('button', { name: 'Deposit' }),
            withdrawl: () => page.getByRole('button', { name: 'Withdrawl' }),
        },
        
        selectOption: (option: string) => page.locator('#userSelect').filter({ hasText: option}),
       

        loginBtn: () => page.locator('[type="submit"]')
    } as const satisfies Locators

    const model = {
        mutate: {
            viewTransactions: async (...args: [username: string]) => {
                logger.debug(`Transactions for user, ${args[0]}`)
                await locators.tab.transactions().click()

                // @TODO: MOdel view transactions page
            },
            navigateToDeposit: async () => {
                await locators.tab.deposit().click()
            },
            navigateToWithdraw: async () => { 
                await locators.tab.withdrawl().click()
            }
        },
        validate: {
            modelSanity: async () => {
                
            }

        }
    }
    return model satisfies ObjectModel
}



