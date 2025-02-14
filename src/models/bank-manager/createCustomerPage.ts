import { CustomerData } from "@/types/customerData"
import type { Locators, ObjectModel } from "@/types/pageObject"
import { Page } from "@playwright/test"
import { dialogPageModel } from "../sharedComponents/dialogPage"
import { BankManagerOperationsAlertMessages } from "@/messages/transactionMessages"
import { assertAllLocatorsVisible } from '@/utils/assertAllLocatorsVisibility'



export const createCustomerPageModel = (page: Page) => {
    const dialog = dialogPageModel(page)
    const locators = {

        labels: {
            firstNameLabel: () => page.getByText('First Name :'),
            lastNameLabel: () => page.getByText('Last Name :'),
            postcode: () => page.getByText('Post Code :')
        },
        inputs: {
            firstNameTxtBox: () => page.getByPlaceholder('First Name'),
            lastNameTxtBox: () => page.getByPlaceholder('Last Name'),
            postcodeTxtBox: () => page.getByPlaceholder('Post Code'),
        },
        addCustomerBtn: () => page.getByRole('form').getByRole('button', { name: 'Add Customer' }),

    } as const satisfies Locators


    const model = {
        mutate: {
            fillCustomerFormWithAllMandatoryFields: async (customer: CustomerData) => { // This will use dynamically created test data
                await locators.inputs.firstNameTxtBox().fill(customer.firstName)
                await locators.inputs.lastNameTxtBox().fill(customer.lastName)
                await locators.inputs.postcodeTxtBox().fill(customer.postCode)
            },
            fillMultipleCustomers: async (customers: CustomerData[]) => { // creats multiple customers based on count of how many requested
                for (const customer of customers) {
                    await model.mutate.fillCustomerFormWithAllMandatoryFields(customer);
                    await model.mutate.submitForm()
                    await model.validate.successMessage()
                
                    await model.mutate.handleAlert(BankManagerOperationsAlertMessages.CUSTOMER_ADDED_SUCCESSFULLY)
                }
            },
            submitWithDuplicateCustomerDetails: async (customer: CustomerData, expectedMessage: BankManagerOperationsAlertMessages) => {
                await model.mutate.fillCustomerFormWithAllMandatoryFields(customer)
                await model.mutate.submitForm()
                await model.validate.successMessage()

                // check if dialog is visible 

                await dialogPageModel(page).validateAlertMessage(expectedMessage)
            },
            submitForm: async () => {
                await locators.addCustomerBtn().click()
            },
            handleAlert: async (expectedMessage: BankManagerOperationsAlertMessages) => { // BankManagerOperationsAlertMessages.CUSTOMER_ADDED_SUCCESSFULLY
                await dialogPageModel(page).validateAlertMessage(expectedMessage)
            }
        },
        validate: {
            modelSanity: async () => {
                await page.waitForURL(/#\/manager\/addCust/, { timeout: 5000 })
            
                await assertAllLocatorsVisible(locators)
            },
            successMessage: async () => {
                await dialog.validateAlertMessage(BankManagerOperationsAlertMessages.CUSTOMER_ADDED_SUCCESSFULLY)
            },
            duplicateMessage: async () => {
                await dialog.validateAlertMessage(BankManagerOperationsAlertMessages.DUPLICATE_CUSTOMER)  
            }

        }
    }
    return model satisfies ObjectModel
}



function expect(page: Page) {
    throw new Error("Function not implemented.")
}

