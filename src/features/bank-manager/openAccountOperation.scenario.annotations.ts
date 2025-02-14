import { type TestDetails } from "@playwright/test"


export const openAccountSuccessScenario: TestDetails['annotation'] = { // positive use case
    type: 'Scenario',
    description: `Open Account: As a bank manager I want to be able to open new accounts for existing customers So that I can provide quality services to our customers
        Given the user navigates to the banking website
        And selects bank manager login
        Then it should navigate to manager's operations page
        When the manager chooses to open account for an existing user
        Then it should navigate to open account page
        And when the user selects an existing customer
        And currency in which the account would like to transact
        And process the form
        Then an alert with successfull message "Account created successfully with account Number :<account number>" appears
        When manager navigates to view customer records
        Then customer should have account number associated with the record
       
    `
}

/**
 * 
 * Scenarios to be performed: 
 * Precondition : Create Account as a Bank manager for a given user User1
 * When Login as the User 1,
 * Then Accounts dropdown for User 1 should have the newly created account in the list
 */

