import test, { expect, Page } from "@playwright/test"
import { createLogger } from "@/utils/logger/logger"
import { loginPageModel } from "@/models/loginPage"
import { createOneTestUser } from "@/utils/generateTestData"
import { createCustomerStep } from "@/shared/steps/createCustomerSteps"
import { noAccountScenario } from "@/features/deposits.scenario.annotations"
import { navigateToLoginPage, loginAsBankManagerStep, loginAsCustomerStep } from "@/shared/steps/loginSteps"
import { accountOverviewPageModel } from "@/models/customer/customerAccountOverviewPage"
import { managerOperationsPageModel } from "@/models/bank-manager/managerOperationsPage"
import { customersListPageModel } from "@/models/bank-manager/customersListPage"

test.describe('Feature: Bank Customer Operations - Make a deposit', () => {
    const logger = createLogger('no-accounts')
    let dialogMessage: Promise<string> | undefined = undefined


    const testUser = createOneTestUser()
    const fullName = `${testUser.firstName} ${testUser.lastName}`

    test.beforeEach(async ({ page }) => {
        page.on('dialog', async dialog => {
            dialogMessage = Promise.resolve(dialog.message())
            logger.info("Dialog Message: ", dialogMessage)
            dialog.accept()
        })

        // Navigate to XYZ website and login as a bank manager
        await navigateToLoginPage(page)
        await loginAsBankManagerStep(page)
        await createCustomerStep(page, testUser) // create a new user
    })
    test.afterEach(async ({ page }) => {
        // delete test users created
       /**
        * 
        * Login as a Bank Manager
       To to list of customers
       filter rows to select a spefic user with first name <xxx>
        click on the Delete button
       naviagte away and search for the deleted entry, it should return 0 rows
        * 
        */
       
       const managerOperations = managerOperationsPageModel(page)

        await navigateToLoginPage(page)
        await loginAsBankManagerStep(page)
        
        await managerOperations.mutate.navigateToViewCustomers()
        
        const customerRecords = customersListPageModel(page)
        await customerRecords.model.mutate.searchCustomer(testUser.firstName)
            
        await customerRecords.model.validate.validateSearchResults(testUser.firstName)
        await customerRecords.model.mutate.deleteCustomer(testUser.firstName)
        
        await customerRecords.model.validate.customerShouldNotExist(testUser.firstName)
        
        


    })

    test('verify that the user is restricted from showing deposit form when there are no accounts associated with ', {
        annotation: noAccountScenario,
        tag: ['@noAccounts', '@smoke']
    }, async ({ page }) => {
        // Welcome Jason Bourne !! Please open an account with us.
        const login = loginPageModel(page, 'LoginPageAfterDataSetup')
        const account = accountOverviewPageModel(page)

        await login.mutate.navigateToLoginPage()
        await loginAsCustomerStep(page, fullName, true)

        logger.info("validate no accounts page")
        expect(await account.validate.modelSanityNoAccounts())
    })


})