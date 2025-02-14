import { test, Page, expect } from "@playwright/test"
import { loginAsBankManagerStep, navigateToLoginPage } from "@/shared/steps/loginSteps"
import { attemptToCreateDuplicateustomerScenario, createCustomerSuccessScenario } from "@/features/createCustomerOperation.scenario.annotations"
import { managerOperationsPageModel } from "@/models/bank-manager/managerOperationsPage"
import { createCustomerPageModel } from "@/models/bank-manager/createCustomerPage"
import { CustomerData } from "@/types/customerData"
import { createMultipleTestUsers, createOneTestUser } from "@/utils/generateTestData"
import { BankManagerOperationsAlertMessages } from "@/messages/transactionMessages"
import { customersListPageModel } from "@/models/bank-manager/customersListPage"
import { createLogger } from "@/utils/logger/logger"
import { createCustomerStep } from "@/shared/steps/createCustomerSteps"


test.describe('Feature: Bank Manager Operations - Create Customer', () => {
    let dialogMessage: Promise<string> | undefined = undefined
    const logger = createLogger("create-customer")
    const customers: CustomerData[] = createMultipleTestUsers(2)


    test.beforeEach(async ({ page }) => {
        page.on('dialog', async dialog => {
            dialogMessage = Promise.resolve(dialog.message())
            dialog.accept()
        })

        // Navigate to XYZ website and login as a bank manager
        await navigateToLoginPage(page)
        await loginAsBankManagerStep(page)
        await createCustomerStep(page, customers[0]) // create a new user

    })
    test.describe('As a bank manager, I want to be able to add new bank customers so that I can provide quality services to our customers', () => {
        test('verify alert message when customer is successfully created', {
            annotation: createCustomerSuccessScenario,
            tag: ['@createCustomer', '@smoke']
        }, async ({ page }) => {
            const managerOps = managerOperationsPageModel(page)
            const createCustomer = createCustomerPageModel(page)
            const constumerRecords = customersListPageModel(page)

            await test.step('Then an alert with successfull message "Customer added successfully with customer id : <X>" appears', async () => {
                await createCustomerStep(page, customers[1])
                await Promise.all([dialogMessage]).then((message) => {
                    const actualDialogMessage = message.pop()
                    const customerNumber = actualDialogMessage?.split(':')[1]?.trim()

                    logger.info("Create customer: success message on alert: ", actualDialogMessage)
                    logger.info("Account Number : ", customerNumber)

                    expect(actualDialogMessage).toContain(BankManagerOperationsAlertMessages.CUSTOMER_ADDED_SUCCESSFULLY)
                })
            })

            await test.step('When manager navigates to view customer records', async () => {
                await managerOps.mutate.navigateToViewCustomers()
            })
            await test.step('Then the new customer should be present in the records', async () => {
                await constumerRecords.model.mutate.searchCustomer(customers[0].firstName)
                await constumerRecords.model.validate.validateSearchResults(customers[0].firstName)
            })
        })
    })

    test.describe('Create Duplicate Customer: As a bank manager I want to be ensure that duplicate customer creation is not allowed', () => {
        test('verify alert message when attempted to create a duplicate customer', {
            annotation: attemptToCreateDuplicateustomerScenario,
            tag: ['@createCustomer', '@smoke']
        }, async ({ page }) => {
            await test.step('When manager tries to create a duplicate customer, alert with message "Please check the details. Customer may be duplicate.” appears', async () => {
                await createCustomerStep(page, customers[0]) // enter same customer detils used in creating customer in previous step 

                await Promise.all([dialogMessage]).then((message) => {
                    const actualDialogMessage = message.pop()
                    logger.info("Duplicate customer alert message: ", actualDialogMessage)

                    expect(actualDialogMessage).toContain(BankManagerOperationsAlertMessages.DUPLICATE_CUSTOMER)
                })
            })
        })
    })



})
