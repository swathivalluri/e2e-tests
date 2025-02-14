import { TestDetails } from "@playwright/test";

const e2eSJourneyScenarioDeposit: TestDetails['annotation'] = {
    type: 'Scenario',
    description: `Create deposits
        Precondition: setup test 
        Given user X navigates to the banking website
        And selects bank manager login
        Then all possible operations that he can perform should be presented
        When creates a customer successfully
        Then creates one or more accounts for that customer
        And ensures that the customer records are updated with account details
        When logouts of the app
        And goes to the login page userlist 
        Then this user should be present in the list
        When selects this user from the user list
        Then should be navigated to the account details page
        And since there are accounts accounts with this customer
        And all options to make transactions depot, withdraw, view historic transactions are displayed
        Then verify that the newly created accounts appear in the list of accounts listed for the customer
        When a specific account is choosen to deposit money to
        And funds deposited
        Then validate success messages
        And funds for that account are only updated
        And transaction records are updated
        When logged out of the app
        And logged in as a bank manager
        When navigate to customers list
        And filter customers based on the test data created
        When above test customer data is deleted
        And filter rows for the deleted user
        Then the table should not have deleted user record 
    `
}

const e2eSJourneyScenarioWithdraw: TestDetails['annotation'] = {
    type: 'Scenario',
    description: `Withdraw
        Precondition: setup test - Customers, account/s, Deposit
        Given user X navigates to the banking website
        And selects bank manager login
        Then all possible operations that he can perform should be presented
        When creates a customer successfully
        Then creates one or more accounts for that customer
        When logouts of the app
        And login as above test user
        Then should be navigated to the account details page
        And all options to make transactions depot, withdraw, view historic transactions are displayed
        When a specific account is choosen to deposit money to
        And funds deposited
        And funds for that account are only updated
        And when the user navigates to withdraw screen
        And submits initially with 0 amount
        Then toolbox with a specific message is displayed
        When user tries to withdraw more than the avilable baance
        Then ensure that the transaction is failed
        And when user enters a valid amount less than equal to balance
        Then the withdrawl should be successful
        And balance is updated
        And transaction records are updated accordly with latest DateTimeStamp, amount withdrawn and transaction type as Credit
        And when logged out of the app
        And logged in as a bank manager
        When navigate to customers list
        And filter customers based on the test data created
        When above test customer data is deleted
        And filter rows for the deleted user
        Then the table should not have deleted user record 
    `
}