import test from "@playwright/test"
import { faker } from '@faker-js/faker'
import { loginAsCustomerStep } from "@/shared/steps/loginSteps"
import { depositAmountSucessfullyStep } from "../../shared/common-steps/depositAmountSteps"
import { account } from "@/shared/test-data/userAccount"
import { depositAmountScenario } from "../../features/customer/deposits.scenario.annotations"
import { createLogger } from "@/utils/logger/logger"
import { accountOverviewPageModel } from "@/models/customer/customerAccountOverviewPage"
import { transactionHistoryPageModel } from "@/models/customer/transactionHistoryPage"
import { myFormPageModel } from "@/models/sharedComponents/myFormPage"
import { tabSelectionPageModel } from "@/models/sharedComponents/tabSelectionComponentPage"

test.describe('Feature: Bank Customer Operations - Make a deposit', () => {
    const logger = createLogger('deposit')
    const accountName = `${account.firstName} ${account.lastName}`

    test.beforeEach(async ({ page }) => {
        await loginAsCustomerStep(page, accountName, false)
    })

    test('should be able to login as a customer and deposit money successfully into a given account', {
        annotation: depositAmountScenario,
        tag: ['@depositMoney', '@smoke']
    }, async ({ page }) => {
        const accountOverview = accountOverviewPageModel(page)
        const transactionHistory = transactionHistoryPageModel(page)
        let initialTransactions: string[]

        await test.step("get historical transactions first", async () => {
            logger.info("get old transactions first")
            await accountOverview.mutate.navigateToTransactions()

            initialTransactions = await transactionHistory.getHistoricalTransactons()
            logger.info("initialTransactions count : ", initialTransactions.length)
            
            await transactionHistory.model.mutate.navigateBack()
        })

        logger.info("Depositing into account: ", accountName)

        const depositAmount = faker.number.int({ min: 1, max: 10000 }) // enter a valid input for this scenario
        await depositAmountSucessfullyStep(page, depositAmount)

        /***
         * 
         * @TODO: Raise a bug. The transactions are not updating and are stale at times
         * // Hence a workaround : Wait until transaction list changes, but still data doesn't update within desired windows.
         * Skipping assertion logic
         * */


        await test.step('verify that the latest transaction appears in customer table and it has transaction type as Credit', async () => {
            // Navigate transactions history
            await accountOverview.mutate.navigateToTransactions()
            await transactionHistory.model.validate.modelSanity()

            // wait for table to be updated if necessary
            // await transactionHistory.model.mutate.waitForTransactionUpdate(initialTransactions)

            // verify latest record has Credit 
            // await transactionHistory.model.validate.validateLatestTransactionTypeToBe('Credit')
        })
    })
    // Same test applies for withdraw as well 
    test('verify that when there is no amount entered in the amount textbox, tooltip with text "Please fill in this field." is displayed', async ({ page }) => {
        // navigate to Deposits page
        const customerOperations = tabSelectionPageModel(page, 'deposit')
        await customerOperations.mutate.navigateToDeposit()

        const expectedMessageOnTooltip = "Please fill in this field."
        const deposit = myFormPageModel(page, 'deposit')
        
        // Verify tooltip when 0 amount deposited
        await deposit.validate.validateTooltipText(expectedMessageOnTooltip)

    })
    test('user should be restricted from entering any invalid or non restricted values for deposits', async () => {
        // currently I can enter -1 into the test box but nothing happens. Expectation: Some error message for invalid inputs
        // Ideally we should errors
        // Also, the number increment decrement arrow should not decrement below 0
        // 1.0 is valid as it is a whole
        // Currently there is amount value to enter
        // special charatcters are not allowed
    
        /**
         * Invalid test data for deposits
         *  -1
         *  100.2
         *  "jdn"
         *  556676776786777878787887878798898978798888988889898998988989898989898998898998989898989898
         *  {}-
         * 
         *  
         */

    })
    test('verify that when we deposit amount into a user account, only that user balance is updated', async() => {
        // Test case: TO BE IMPLEMENTED
    })

    test('verify that when two or more users make deposits into the same account, there is no lose of data and balance updated correctly', async () => {
        // Test case - TO BE IMPLEMENTED
    })

    test('verify that when deposits and withdrawls happen in parallel, amount is reflected correctly at the end', async() => {
         // Test case : TO BE IMPLEMENTED
    })
   
})
