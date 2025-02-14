import { accountOverviewPageModel } from "@/models/customer/customerAccountOverviewPage"
import { loginPageModel } from "@/models/loginPage"
import { managerOperationsPageModel } from "@/models/bank-manager/managerOperationsPage"
import { createLogger } from "@/utils/logger/logger"
import { test, Page } from "@playwright/test"

// boxed steps to enfore re-usability 

export const navigateToLoginPage = async (page: Page) => {
    const login = loginPageModel(page, 'LoginPage')
    await test.step('Given the user navigates to the banking website', async () => {
        await login.mutate.navigateToLoginPage()
        await login.validate.modelSanity()
    })
}
export const loginAsCustomerStep = async (page: Page, loginAsUser: string, noAccounts: boolean) => {
    const logger = createLogger("LoginTest")

    const login = loginPageModel(page, 'LoginPage')
    const accountOverview = accountOverviewPageModel(page)

    await navigateToLoginPage(page)

    await test.step('And selects customer login', async () => {
        await login.mutate.loginAsCustomer() // login as Role: customer
    })

    await test.step('And log in as a specific user', async () => {
        // @TODO: Pick up a random user from the account
        // Select the user to login as. eg: Harry Potter
        await login.mutate.loginInAsCustomerWithName(loginAsUser)
    })
    if(!noAccounts) {
        await test.step('Then the user should be presented with the account details if an account exists', async () => {
            // Verify that the user navigates to account overview page if accounts exist
            logger.info("Accounts exist")
            await accountOverview.validate.modelSanity(loginAsUser)
    
        })
    } else {
        logger.info("Validate model sanity for no accounts page")
    }
    
}

export const loginAsBankManagerStep = async (page: Page) => {
    const logger = createLogger("LoginTest")

    const login = loginPageModel(page, 'LoginPage')
    const accountOverview = accountOverviewPageModel(page)

    await navigateToLoginPage(page)

    await test.step('And selects manager login', async () => {
        await login.mutate.loginAsBankManager() // login as Role: bank-manager
    })

    await test.step('Then it should navigate to manager operations page', async () => {
        const managerOps = managerOperationsPageModel(page)
        await managerOps.validate.modelSanity()

    })
}


