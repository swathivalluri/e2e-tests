import { openAccountSuccessScenario } from "@/features/openAccountOperation.scenario.annotations"
import { BankManagerOperationsAlertMessages } from "@/messages/transactionMessages"
import { customersListPageModel } from "@/models/bank-manager/customersListPage"
import { managerOperationsPageModel } from "@/models/bank-manager/managerOperationsPage"
import { openAccountPageModel } from "@/models/bank-manager/openAccountPage"
import { navigateToLoginPage, loginAsBankManagerStep } from "@/shared/steps/loginSteps"
import { createLogger } from "@/utils/logger/logger"
import test, { expect } from "@playwright/test"
import { account } from "@/shared/test-data/userAccount"

test.describe('Feature: Bank Manager Operations - Open Account', () => {
    let dialogMessage: Promise<string> | undefined = undefined
    let accountNumber: string | undefined
    const logger = createLogger("open-account")
    

    test.beforeEach(async ({ page }) => {
        page.on('dialog', async dialog => {
            dialogMessage = Promise.resolve(dialog.message())
            dialog.accept()
        })
        
        await navigateToLoginPage(page)
        await loginAsBankManagerStep(page)

    })
    test('As a bank manager I want to be able to open new accounts for existing customers So that I can provide quality services to our customers', {
        annotation: openAccountSuccessScenario,
        tag: ['@open-account', '@smoke']
    }, async ({ page }) => {

        const managerOps = managerOperationsPageModel(page)
        const openAccount = openAccountPageModel(page)
        const constumerRecords = customersListPageModel(page)

        await test.step('When the manager chooses to open an account for an existing user', async () => {
            await managerOps.mutate.navigateToOpenAccount()
        })

        await test.step('Then it should navigate to open account page', async () => {
            await openAccount.validate.modelSanity()
        })

        await test.step('And when the user selects an existing customer', async () => {
            await openAccount.mutate.selectSpecicCustomer("Harry Potter")
        })
        await test.step('And currency in which the account would like to transact', async () => {
            await openAccount.mutate.selectCurrency('Rupee')
        })
        await test.step('And process the form', async () => {
            await openAccount.mutate.processAccountInfo()
        })
        await test.step('Then an alert with successfull message "Account created successfully with account Number :<account number>" appears', async () => {
            await Promise.all([dialogMessage]).then((message) => {
                const actualDialogMessage = message.pop()
                accountNumber = actualDialogMessage?.split(':')[1].trim()
                // set account number in test data
                account.accountNumber = accountNumber
                logger.info("actualMessage: ", actualDialogMessage)
                logger.info("Account Number : ", accountNumber)
                expect(actualDialogMessage).toContain(BankManagerOperationsAlertMessages.ACCOUNT_CREATED_SUCCESSFULLY)
            })
        })
        await test.step('When manager navigates to view customer records', async () => {
            await managerOps.mutate.navigateToViewCustomers()

        })
        await test.step('Then customer should have account number associated with the record', async () => {
            await constumerRecords.model.validate.modelSanity()
    
            await constumerRecords.model.mutate.searchCustomer(account.firstName)
            await constumerRecords.model.validate.validateSearchResults(account.firstName)

            await constumerRecords.model.validate.validateAccountNumber(accountNumber)
        })

    })

})