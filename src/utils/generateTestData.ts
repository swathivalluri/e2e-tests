import { faker } from "@faker-js/faker";
import { CustomerData } from "@/types/customerData";

/**
 * The aim of this function is to create as many customer data objects needed for the tests
 */
export function createOneTestUser(): CustomerData {
    return {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        postCode: faker.location.zipCode(),
        accountIds: [], // New customers have no account IDs
    };
}

/**
 * Generates multiple test customers
 * @param count - Number of test users to generate
 */
export function createMultipleTestUsers(count: number): CustomerData[] {
    return Array.from({ length: count }, () => createOneTestUser());
}
