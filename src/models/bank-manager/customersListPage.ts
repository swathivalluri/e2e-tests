import type { Locators, ObjectModel } from "@/types/pageObject";
import { expect, Page, Locator } from "@playwright/test";
import { assertAllLocatorsVisible } from "@/utils/assertAllLocatorsVisibility";

export const customersListPageModel = (page: Page) => {
    const locators = {
        searchBox: () => page.getByPlaceholder("Search Customer"),
        table: () => page.locator("table"),
        tableRows: () => page.locator("table tbody tr"),
        headers: { // column headers
            firstName: () => page.getByRole("link", { name: "First Name" }),
            lastName: () => page.getByRole("link", { name: "Last Name" }),
            postCode: () => page.getByRole("link", { name: "Post Code" }),
            accountNumber: () => page.getByRole("cell", { name: "Account Number" }),
            deleteCustomer: () => page.getByRole("cell", { name: "Delete Customer" }),
        }
    } as const satisfies Locators

    const getCustomerDetails = async (firstName: string) => {
        const row = page.locator("table tbody tr").filter({ hasText: firstName });
        return {
            firstName: await row.locator("td:nth-child(1)").innerText(),
            lastName: await row.locator("td:nth-child(2)").innerText(),
            postCode: await row.locator("td:nth-child(3)").innerText(),
            accountNumber: await row.locator("td:nth-child(4)").innerText(),
        };
    };

    const model = {
        mutate: {
            deleteCustomer: async (firstName: string) => {
                await model.mutate.searchCustomer(firstName) // filter rows
                await page.getByRole('row', { name: firstName }).getByRole('button').click() // delete the record
            },

            sortByColumn: async (column: "First Name" | "Last Name" | "Post Code" | "Account Number") => {
                const header = locators.headers[column.toLowerCase().replace(" ", "") as keyof typeof locators.headers];
                await header().click()
            },
            searchCustomer: async (searchTerm: string) => {
                await locators.searchBox().fill(searchTerm)
            }
        },

        validate: {
            modelSanity: async () => {
                await page.waitForURL(/#\/manager\/list/, { timeout: 5000 })
                await expect(page).toHaveURL(/#\/manager\/list/);
                await assertAllLocatorsVisible(locators)
            },

            customerShouldNotExist: async (firstName: string) => {
                const row = page.locator("table tbody tr").filter({ hasText: firstName })
                await expect(row).toHaveCount(0)
            },

            validateSearchResults: async (expectedFirstName: string) => {
                const rows = await locators.tableRows().all()
                expect(rows.length).toBe(1);
                expect(await rows[0].locator("td:nth-child(1)").innerText()).toBe(expectedFirstName)
            },
            validateAccountNumber: async (expectedAccountNumber: string | undefined) => {
                const rows = await locators.tableRows().all()
                expect(await rows[0].locator("td:nth-child(4)").innerText()).toContain(expectedAccountNumber)
            }
        },
    }
    model satisfies ObjectModel
    return { model, getCustomerDetails }
}
