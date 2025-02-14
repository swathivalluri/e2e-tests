// This is the common component shared by deposits and Withdraw pages. 

import { TransactionType } from "@/types/transactionType"
import { WithdrawalSuccess, WithdrawalErrors, DepositSuccess, DepositErrors } from "@/messages/transactionMessages"
import type { Locators, ObjectModel } from "@/types/pageObject"
import { expect, Page } from "@playwright/test"
import { createLogger } from "@/utils/logger/logger"
import { title } from "process"

export const myFormPageModel = (page: Page, tabType: TransactionType, pageName: string = tabType.toString()) => {
    let newBalance: number
    let initialBalance: number
    const logger = createLogger(pageName)

    const locators = {
        initialAccountBalance: () => page.locator('div.center > strong:nth-of-type(2)'),
        container: {
            label: () => getTransactionLocatorLable(),
            inputField: () => page.getByPlaceholder('amount'),
            submitBtn: () => page.locator('[type="submit"]'),
            successMessage: () => page.locator('.error'),
            warningMessage: () => page.locator('text=Please enter a valid value'),
            tooltip: (text: string) => page.getByText(text)
        },
        inputBoxPlaceholderText: () => page.locator('[type="submit"]'),
        defaultAmountPlaceholder: () => page.getByPlaceholder('amount')
    } as const satisfies Locators

    const model = {
        mutate: {
            enterAmount: async (amount: number) => { // NOTE: entering decimal numbers throws a validation error 
                initialBalance = Number(await getInitialBalance())
                await locators.container.inputField().fill(amount.toString())
            },
            submitTransaction: async () => {
                await locators.container.submitBtn().click()
            }
        },
        validate: {
            modelSanity: async () => {
                await expect(locators.container.label()).toBeVisible()
                await expect(locators.container.inputField()).toBeEnabled()
                await expect(locators.container.submitBtn()).toBeEnabled()
            },
            successfulTransaction: async () => {
                await expect(locators.container.successMessage()).toBeVisible()
                await expect(locators.container.warningMessage()).not.toBeVisible()

                // NOTE: could have used ternary operator but since I am not assigning to any constant, 
                // lint is rhrown an unused expression error. Hence replaced with if - else

                if (tabType.toLocaleLowerCase() === "deposit") {
                    await expect(locators.container.successMessage()).toContainText(DepositSuccess.SUCCESS);
                } else {
                    await expect(locators.container.successMessage()).toContainText(WithdrawalSuccess.SUCCESS);
                }

            },
            errorInTransaction: async () => {
                // this warning message is common to both withdrawls and deposits
                await expect(locators.container.warningMessage()).toBeVisible()
                await expect(locators.container.warningMessage()).toContainText(DepositErrors.INVALID_INPUT)
            },
            withdrawlOverLimitMessage: async () => {
                await expect(locators.container.warningMessage()).toContainText(WithdrawalErrors.INSUFFICIENT_BALANCE)
            },
            validateUpdatedBalanceAfterDeposit: async (depositAmount: number) => {
                await expectedBalanceAfterDeposit(depositAmount)
                const finalBalance = Number(await getInitialBalance())
                expect(newBalance).toBe(finalBalance)
            },
            validateUpdatedBalanceAfterWithdrawl: async (withdrawalAmount: number) => {
                await expectedBalanceAfterWithdrawl(withdrawalAmount)
                const finalBalance = Number(await getInitialBalance())
                expect(newBalance).toBe(finalBalance)
            },
            validateTooltipText: async (tooltipMessage: string) => {
                await locators.defaultAmountPlaceholder().click()// @TODO: check for please fill in a number message when amout is cleared
                await locators.defaultAmountPlaceholder().fill("0")
                await locators.container.submitBtn().click()
                await page.getByPlaceholder('amount').getAttribute("class").then((attr) => {
                    expect(attr).toContain("ng-valid-number")
                })

            }
        }
    },
        getTransactionLocatorLable = () => {
            return tabType.toLocaleLowerCase() === 'deposit'
                ? page.getByText('Amount to be Deposited :')
                : page.getByText('Amount to be Withdrawn :')
        },
        getInitialBalance = async (): Promise<string> => {
            const currentBalance = await locators.initialAccountBalance().innerText()
            logger.debug("current balance : ", currentBalance)
            return currentBalance

        },
        expectedBalanceAfterDeposit = async (amountToDeposit: number) => {
            // deposit amount should be a non decimal value for successful transaction, hence validate input
            if (await validateInput(amountToDeposit)) {// if true, deposit
                newBalance = initialBalance + Number(amountToDeposit)
                logger.debug("newBalance after deposit sucessful: ", newBalance)

            } else {
                // "Abort transaction"
                newBalance = initialBalance
                logger.debug("newBalance after failing to deposit: ", newBalance)
            }
        },
        expectedBalanceAfterWithdrawl = async (amountToWithdraw: number): Promise<void> => {
            // withdrawal amount should be a non decimal value for successful transaction
            // for withdrawls, it should be a non decimal value and should not exceed the amount in the account

            if (await validateInput(amountToWithdraw) && Number(await getInitialBalance()) >= amountToWithdraw) {// if true, withdraw and update balance
                newBalance = initialBalance - amountToWithdraw
                logger.debug("newBalance after withdrawl sucessful: ", newBalance)
            } else {
                // Abort transaction
                newBalance = initialBalance
                logger.debug("newBalance after withdrawl failure: ", newBalance)
            }

        },
        /**
         * This function ensures that the input is
         *  An integer : eg: 100
         *  Not a negative number since Integer. eg: -100
         *  Whole numbers are valid . eg: 200.0
         *  String won't be accepted as input is of type Number. Eg: "-12". NOTE: The UI restricted entering this value into input field
         */
        validateInput = async (input: number): Promise<boolean> => {
            return Number.isInteger(input) || (Number.isFinite(input) && input % 1 === 0);
        }

    return model satisfies ObjectModel
}
