import { type TestDetails } from "@playwright/test"


const createCustomerSuccessScenario: TestDetails['annotation'] = { // positive use case
    type: 'Scenario',
    description: `Create a customer: As a bank manager I want to be able to add new bank customers so that I can provide quality services to our customers
        Given the user navigates to the banking website
        And selects bank manager login
        Then it should navigate to manager operations page
        When the manager chooses to create a customer
        Then it should navigate to add customer form
        When the user fills mandatory fields First Name, Last Name and Post Code
        And submits the form
        Then an alert with successfull message "Customer added successfully with customer id : <X>" appears
        When manager navigates to view customer records
        Then the new customer should be present in the records
        When manager tries to create a duplicate customer, alert with message "Please check the details. Customer may be duplicate.” appears
    `
}

const attemptToCreateDuplicateustomerScenario: TestDetails['annotation'] = { // negative use case
    type: 'Scenario',
    description: `Create Duplicate Customer: As a bank manager I want to be ensure that duplicate customer creation is not allowed
        Given I have existing customer details to create a customer
        And the user navigates to the banking website
        And selects bank manager login
        Then it should navigate to manager operations page
        When the manager chooses to create a customer
        Then it should navigate to add customer form
        When the user fills the details for First Name, Last Name and Post Code
        And submits the form
        Then an alert with message "Please check the details. Customer may be duplicate." appears
        Then select ok
    `
}


export { createCustomerSuccessScenario, attemptToCreateDuplicateustomerScenario}

/**
 * 
 * Scenarios to be performed: 
 * Given Precondition - : Create account as a Bank manager for a given user User1
 * When Navigate to login page
 * Then Verify that the Userdropdown list has User1 populated
 * 
 */
