import { NoAccounts } from "@/messages/transactionMessages"
import type { Locators, ObjectModel } from "@/types/pageObject"
import { assertAllLocatorsVisible } from "@/utils/assertAllLocatorsVisibility"
import { expect, Page } from "@playwright/test"

export const accountOverviewPageModel = (page: Page) => {
    const locators = {
        headers: {
            title: () => page.locator('.mainHeading')
        },
        buttons: {
            homeBtn: () => page.locator('.home'),
            logoutBtn: () => page.getByRole('button', { name: "Logout" }),
            transactionsBtn: () => page.getByRole('button', { name: "Transactions" }),
            depositBtn: () => page.getByRole('button', { name: "Deposit" }),
            withdrawlBtn: () => page.getByRole('button', { name: "Withdrawl" }),
            accountSelectionDropdown: () => page.getByRole("combobox")
                .locator('[name="accountSelect"]'),
            selectAccountDropdown: () => page.locator("accountSelect"),
            selectOption: (accountNumber: string) => page.locator('#userSelect').filter({ hasText: accountNumber }),
            selectAnyUserAccount: () => page.locator('#userSelect option').first()
        },
        accountDetails: {
            name: (username: string) => page.getByText(username),
            number: () => page.locator('div.center > strong:nth-of-type(1)'),
            balance: () => page.locator('div.center > strong:nth-of-type(2)'),
            currency: () => page.locator('div.center > strong:nth-of-type(3)'),
        },
        noAccountsMesage: () => page.getByText(NoAccounts.NO_ACCOUNTS_MESSAGE)

    } as const satisfies Locators


    const model = {
        mutate: {
            navigateToDeposits: async () => {
                await locators.buttons.depositBtn().click();
            },
            navigateToWithdrawals: async () => {
                await locators.buttons.withdrawlBtn().click()
            },
            navigateToTransactions: async () => {
                await locators.buttons.transactionsBtn().click()
            }
        },
        validate: {
            modelSanity: async (customerName: string) => {

                await expect(locators.headers.title()).toHaveText('XYZ Bank')
                await expect(locators.buttons.logoutBtn()).toBeVisible()

                await expect(locators.buttons.depositBtn()).toBeVisible()
                await expect(locators.buttons.withdrawlBtn()).toBeVisible()
                await expect(locators.buttons.transactionsBtn()).toBeVisible()

                // account details visiblility
                await expect(locators.accountDetails.name(customerName)).toBeVisible()
                await expect(locators.accountDetails.number()).toBeVisible()
                await expect(locators.accountDetails.balance()).toBeVisible()
                await expect(locators.accountDetails.currency()).toBeVisible()

            },
            modelSanityNoAccounts: async () => {
                await expect(locators.noAccountsMesage()).toContainText(NoAccounts.NO_ACCOUNTS_MESSAGE)
            }

        }
    }
    return model satisfies ObjectModel
}



