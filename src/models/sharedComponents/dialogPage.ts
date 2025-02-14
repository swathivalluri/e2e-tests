
import { BankManagerOperationsAlertMessages } from "@/messages/transactionMessages";
import { Page, expect } from "@playwright/test";
import { createLogger } from "@/utils/logger/logger"

export const dialogPageModel = (page: Page) => {
    const logger = createLogger('dialog')
    return {
        /**
         * Waits for and extracts alert message
         * Accepts the alert after capturing the message
         */
        handleAlert: async () => {
            return new Promise<string>((resolve) => {
                page.on("dialog", async (dialog) => {
                    logger.info(`Alert message: ${dialog.message()}`)
                    await dialog.accept() // click on ok button
                    resolve(dialog.message()) // return message
                })

            })
        },

        // Validates that the alert message matches expected text

        validateAlertMessage: async (expectedMessage: BankManagerOperationsAlertMessages) => {
            const actualMessage = await dialogPageModel(page).handleAlert()
            expect(actualMessage).toContain(expectedMessage)
        }
    }
}

