import { Configuration, PlaidApi, Products, CountryCode, PlaidEnvironments, AccountType } from 'plaid'

export const POSITIVE_ACCOUNT_TYPES = [AccountType.Brokerage, AccountType.Depository, AccountType.Investment] as const // Extract<AccountType, 'depository' | 'investment' | 'brokerage'>
export const NEGATIVE_ACCOUNT_TYPES = [AccountType.Credit, AccountType.Loan] as const // Extract<AccountType, 'credit' | 'loan'>

const configuration = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV || 'sandbox'],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
    },
  },
});

export const client = new PlaidApi(configuration);

export const products = [
  Products.Transactions
]

export const countryCodes = [
  CountryCode.Us
]
