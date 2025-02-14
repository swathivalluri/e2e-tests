import { type TestDetails } from "@playwright/test"


const withdrawAmountScenario: TestDetails['annotation'] = {
    type: 'Scenario',
    description: `Customer should be able to withdraw money from a specific account successfully
        Given the user navigates to the banking website
        And selects customer login
        And log in as a specific user 
        Then the user should be presented with the account details
        When user withdraws money not more than the available balance successfully
        Then the account balance should be updated
        And transaction successful message notification should be displayed
    `
}

export { withdrawAmountScenario }


/**
 * 
 * Scenarios To Be verified: Login as two different users 
 * Pre-condition: Create a Test user with two accounts
 * User 1 -> Deposits into the account
 * User 2 -> Withdraws from the same account
 * 
 * Order of transactions: 
 *  -   Withdrawal attempt before deposit with insufficient balance -> Transaction failed error
 *  -   Withdraw after deposit with insufficient balance -> Transaction failed error
 *  -   
 * 
 *
 */