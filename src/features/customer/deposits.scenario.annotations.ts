import { type TestDetails } from "@playwright/test"


const depositAmountScenario: TestDetails['annotation'] = {
    type: 'Scenario',
    description: `Make a deposit: As a bank customer I want to be able to make a deposit to one of my existing accounts So that I can manage my finance
        Given the user navigates to the banking website
        And selects customer login
        And log in as a specific user 
        Then the user should be presented with the account details
        When user deposits money into an existing account
        Then transaction successful message "Depos Successful" should be displayed
        And the account balance should be updated
        And transaction successful message "Depos Successful" should be displayed
        When navigtated to transactions
        Then new record is added to the Transactions table with Transaction Type = Credit
    `
}
const noAccountScenario: TestDetails['annotation'] = {
    type: 'Scenario',
    description : `No accounts: When the logged in customer has no accounts accosiated with, message to Please open an account with us is displayed 
        Given the user logins as a Bank manager and creats a customer sucssfully
        When logged in as that customer
        Then a message "Please open an account with us is diaplayed"
    `

}

export { depositAmountScenario, noAccountScenario }

/**
 * 
 * Acceptance Criteria: On successful deposit the following red message is displayed above the ‘Amount to be Deposited’ field: “Depos Successful” 
 * The account balance is updated accordingly 
 * New record is added to the Transactions table with Transaction Type = Credit If an empty amount is submitted, 
 * the following tooltip is displayed: “Please fill in this fields
 * 
 */

/**
 * 
 * More scenarios: 
 * 
 * 
 */

// Scenario: Create a new customer with no accounts, and login as that user and verify that the UI says : Please open an account with us.