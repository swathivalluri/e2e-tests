import type { Locators, ObjectModel } from "@/types/pageObject";
import { expect, Page, Locator } from "@playwright/test"
import { createLogger } from "@/utils/logger/logger";

export const transactionHistoryPageModel = (page: Page) => {
    const logger = createLogger('transaction-history')
    const locators = {
        button: {
            back: () => page.locator("button:text('Back')"), // Back button
            reset: () => page.locator("button:text('Reset')"), // Reset button
            nextPage: () => page.getByRole('button', { name: '>' }), // Pagination button
        },
        input: {
            startDateTime: () => page.locator("input#start"), // Start datetime input
            endDateTime: () => page.locator("input#end"), // End datetime input
        },
        table: {
            transactionRows: () => page.locator("table").locator("tbody").locator("tr"), // Transaction rows
            dateTimeColumn: () => page.getByRole('link', { name: 'Date-Time' }),
            amountColumn: () => page.getByText('Amount'),
            transactionTypeColumn: () => page.getByText('Transaction Type'),
        },
    } as const satisfies Locators

    const getHistoricalTransactons = async (): Promise<Array<string>> => {
        return await locators.table.transactionRows().allTextContents() // get initial transaction list
    }

    const model = {
        mutate: {
            filterTransactions: async (start: string, end: string) => {
                logger.info(`Filtering transactions from ${start} to ${end}`);

                await page.fill("input#start", start)
                await page.fill("input#end", end)
                await page.keyboard.press("Enter") // Trigger filter
            },
            resetFilter: async () => {
                await locators.button.reset().click()
            },

            goToNextPage: async () => {
                await locators.button.nextPage().click()
            },
            navigateBack: async () => {
                await locators.button.back().click()
            },
            waitForTransactionUpdate: async (initialTransactions: string[]) => {
                logger.info("Waiting for transaction table to update...")
                await page.waitForFunction(
                    (oldData) => {
                        const newTransactions = Array.from(document.querySelectorAll("table tbody tr")).map(row => row.textContent);
                        return JSON.stringify(newTransactions) !== JSON.stringify(oldData);
                    },
                    initialTransactions
                )
                logger.info("Transaction table updated!")
            }

        },

        validate: {
            modelSanity: async () => {
                await expect(locators.button.back()).toBeVisible()
                await expect(locators.button.reset()).toBeVisible()
                await expect(locators.button.nextPage()).toBeVisible()

                await expect(locators.input.startDateTime()).toBeVisible()
                await expect(locators.input.startDateTime()).toBeVisible()

                await expect(locators.table.dateTimeColumn()).toBeVisible()
                await expect(locators.table.amountColumn()).toBeVisible()
                await expect(locators.table.transactionTypeColumn()).toBeVisible()
            },
            transactionsAreDisplayed: async () => {
                logger.info("Validating transactions are present...");
                const rows = await locators.table.transactionRows().count();
                expect(rows).toBeGreaterThan(0);
            },
            transactionsMatchDateRange: async (expectedDate: string) => {
                logger.info(`Validating transactions match the expected date: ${expectedDate}`);
                const dates = await locators.input.startDateTime().allTextContents();
                for (const date of dates) {
                    expect(date).toContain(expectedDate);
                }
            },
            transactionTypeExists: async (transactionType: string) => {
                logger.info(`Validating transaction type: ${transactionType}`);
                const types = await locators.table.transactionTypeColumn().allTextContents();
                expect(types).toContain(transactionType);
            },
            validateTransactionType: async () => { // by Transaction Type
                const rows = locators.table.transactionTypeColumn()
                expect(await rows.allInnerTexts()).toContain('Credit')
            },
            filterResetWorks: async () => {
                logger.info("Validating filter reset...");
                const fromDate = await locators.input.startDateTime().inputValue();
                const toDate = await locators.input.endDateTime().inputValue();
                expect(fromDate).toBe("");
                expect(toDate).toBe("");
            },

            validateLatestTransactionTypeToBe: async (value: string) => {
                // transactions are sorted in asc order
                const lastRow = locators.table.transactionRows().last()
                logger.info("Validate latest transaction to have the last created transaction with Tranaction Type as Credit")
                expect(lastRow).toContainText("Credit")
            }
        },
    }
    model satisfies ObjectModel
    return { model, getHistoricalTransactons }
}
