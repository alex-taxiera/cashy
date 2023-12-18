import { Products, CountryCode, AccountType } from 'plaid'

export const POSITIVE_ACCOUNT_TYPES = [AccountType.Brokerage, AccountType.Depository, AccountType.Investment] as const // Extract<AccountType, 'depository' | 'investment' | 'brokerage'>
export const NEGATIVE_ACCOUNT_TYPES = [AccountType.Credit, AccountType.Loan] as const // Extract<AccountType, 'credit' | 'loan'>

export const ACCOUNT_TYPE_DISPLAY_NAMES = {
  [AccountType.Brokerage]: 'Investments',
  [AccountType.Depository]: 'Cash',
  [AccountType.Investment]: 'Investments',
  [AccountType.Credit]: 'Credit cards',
  [AccountType.Loan]: 'Loans',
  [AccountType.Other]: 'Other',
}

export const products = [
  Products.Transactions
]

export const countryCodes = [
  CountryCode.Us
]
