import { test } from "@playwright/test"
import { faker } from '@faker-js/faker'
import { tabSelectionPageModel } from "@/models/sharedComponents/tabSelectionComponentPage"
import { myFormPageModel } from "@/models/sharedComponents/myFormPage"

import { loginAsCustomerStep } from "@/shared/steps/loginSteps"
import { withdrawAmountScenario } from "@/features/withdraw.scenario.annotations"
import { TransactionType } from "@/types/transactionType"
import { depositAmountSucessfullyStep } from "../../shared/common-steps/depositAmountSteps"
import { account } from "@/shared/test-data/userAccount"
import { createLogger } from "@/utils/logger/logger"

test.describe('Feature: Withdraw money as Customer', () => {
    const logger = createLogger('withdraw')
        const accountName = `${account.firstName} ${account.lastName}`
        
        logger.debug("Withdraw from account: ", accountName)
    
   const depositAmount = faker.number.int({ min: 200, max: 10000 }) // enter a valid input for this scenario
   const withdrawalAmount = 100 // enter a valid input for this scenario

    test.beforeEach(async ({ page }) => {
        await loginAsCustomerStep(page, accountName,false)
        await depositAmountSucessfullyStep(page, depositAmount)
    })

    test('should be able to login as a customer and withdraw money successfully from a given account', {
        annotation: withdrawAmountScenario,
        tag: ['@withdrawMoney', '@smoke']
    }, async ({ page }) => {
       
        const actionToPerform: TransactionType = 'withdraw'

        const transactionTabs = tabSelectionPageModel(page, actionToPerform)
        const transactionForm = myFormPageModel(page, actionToPerform)

        await test.step('When user withdraws money not more than the available balance successfully', async () => {
            // perform deposits

            await transactionTabs.mutate.navigateToWithdraw()

            await transactionForm.validate.modelSanity()

            await transactionForm.mutate.enterAmount(withdrawalAmount)

            await transactionForm.mutate.submitTransaction()

        })

        await test.step('Then the account balance should be updated', async() => {
            await transactionForm.validate.validateUpdatedBalanceAfterWithdrawl(withdrawalAmount)
        })

        await test.step('And transaction successful message notification should be displayed', async() => {
            await transactionForm.validate.successfulTransaction()
        })

    })
})