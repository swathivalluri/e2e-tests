export interface CustomerData {
    firstName: string;
    lastName: string;
    postCode: string;
    accountIds: string[] // New customers have no accountIds associated initially
}
