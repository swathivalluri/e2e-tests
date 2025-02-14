import { myFormPageModel } from "@/models/sharedComponents/myFormPage"
import { tabSelectionPageModel } from "@/models/sharedComponents/tabSelectionComponentPage"
import test, { Page } from "@playwright/test"

// boxed steps to enfore re-usability 
export const depositAmountSucessfullyStep = async (page: Page, depositAmount: number) => {
    const transactionTabs = tabSelectionPageModel(page, 'deposit')
    const transactionForm = myFormPageModel(page, 'deposit')
    
    await test.step('When user deposits money', async () => {
        // perform deposits

        await transactionTabs.mutate.navigateToDeposit()

        await transactionForm.validate.modelSanity()

        await transactionForm.mutate.enterAmount(depositAmount)

        await transactionForm.mutate.submitTransaction()

    })
    await test.step('Then the account balance should be updated', async () => {
        await transactionForm.validate.validateUpdatedBalanceAfterDeposit(depositAmount)
    })

    await test.step('And transaction successful message notification should be displayed', async () => {
        await transactionForm.validate.successfulTransaction()
    })

}