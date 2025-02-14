
/**
 * Enums for transaction status messages for customer when performing deposits/withdrawals
 */
export enum WithdrawalSuccess {
    SUCCESS = 'Transaction successful',
}

export enum WithdrawalErrors {
    INSUFFICIENT_BALANCE = 'Transaction Failed. You can not withdraw amount more than the balance.',
    INVALID_INPUT = 'Please enter a valid value.',
}

export enum DepositSuccess {
    SUCCESS = 'Deposit Successful',
}

export enum DepositErrors {
    INVALID_INPUT = 'Please enter a valid value.',
}
export enum NoAccounts {
    NO_ACCOUNTS_MESSAGE = "Please open an account with us."
}


/**
 * Enums for alert messages for bank manager operations
 */
export enum BankManagerOperationsAlertMessages {
    CUSTOMER_ADDED_SUCCESSFULLY = "Customer added successfully with customer id :",
    ACCOUNT_CREATED_SUCCESSFULLY = "Account created successfully with account Number :",
    TRANSACTION_FAILED = "Transaction failed. Please try again.",
    DUPLICATE_CUSTOMER = "Please check the details. Customer may be duplicate."
}


