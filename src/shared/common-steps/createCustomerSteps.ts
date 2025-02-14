import { createCustomerPageModel } from "@/models/bank-manager/createCustomerPage"
import { customersListPageModel } from "@/models/bank-manager/customersListPage"
import { managerOperationsPageModel } from "@/models/bank-manager/managerOperationsPage"
import { CustomerData } from "@/types/customerData"
import { createOneTestUser } from "@/utils/generateTestData"
import test, { Page } from "@playwright/test"

export const createCustomerStep = async (page: Page, customer: CustomerData) => {
    const managerOps = managerOperationsPageModel(page)
    const createCustomer = createCustomerPageModel(page)
    const constumerRecords = customersListPageModel(page)

    await test.step('When the manager chooses to create a customer', async () => {
        await managerOps.mutate.navigateToCreateCustomer()
    })

    await test.step('Then it should navigate to add customer form', async () => {
        await createCustomer.validate.modelSanity()
    })

    await test.step('And when the user fills mandatory fields First Name, Last Name and Post Code', async () => {
        await createCustomer.mutate.fillCustomerFormWithAllMandatoryFields(customer)
    })
    await test.step('And submits the form', async () => {
        await createCustomer.mutate.submitForm()
    })
}

