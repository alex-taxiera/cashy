import { type PlaidItem } from '@prisma/client'
import { type DataFunctionArgs, json } from '@remix-run/node'
import { useFetcher, useLoaderData } from '@remix-run/react'
import { type AccountBase, AccountType } from 'plaid'
import { useCallback, useMemo } from 'react'
import {
	type PlaidLinkOnSuccess,
	usePlaidLink,
} from 'react-plaid-link'
import { GeneralErrorBoundary } from '#app/components/error-boundary.tsx'
import { FormattedCurrency } from '#app/components/formatted-currency'
import { Accordion, AccordionPanel, AccordionContent, AccordionHeader, AccordionItem, AccordionTrigger } from '#app/components/ui/accordion'
import { Button } from '#app/components/ui/button'
import { Icon } from '#app/components/ui/icon'
import { requireUserId } from '#app/utils/auth.server'
import { prisma } from '#app/utils/db.server'
import {
	products,
	countryCodes,
	POSITIVE_ACCOUNT_TYPES,
	NEGATIVE_ACCOUNT_TYPES,
	ACCOUNT_TYPE_DISPLAY_NAMES,
} from '#app/utils/plaid'
import { client } from '#app/utils/plaid.server'

type CategorizedAccountMap = Record<
	AccountType,
	(AccountBase & { item: Pick<PlaidItem, 'id' | 'institution'> })[]
>

export async function loader({ request }: DataFunctionArgs) {
	const userId = await requireUserId(request)

	const createTokenResponse = await client.linkTokenCreate({
		user: {
			client_user_id: userId,
		},
		client_name: 'Cashy',
		products: products,
		country_codes: countryCodes,
		language: 'en',
	})

	const plaidItems = await prisma.plaidItem.findMany({
		where: {
			ownerId: userId,
		},
	})

	const plaidData = await Promise.all(
		plaidItems.map(async item => {
			const {
				data: { accounts },
			} = await client.accountsGet({
				access_token: item.accessToken,
			})

			return {
				id: item.id,
				institution: item.institution,
				accounts,
			}
		}),
	)

	const categorizedAccounts = plaidData.reduce<CategorizedAccountMap>(
		(acc, item) => {
			const { accounts } = item
			accounts.forEach(account => {
				const accountWithItem = {
					...account,
					item: {
						id: item.id,
						institution: item.institution,
					},
				}
				acc[accountWithItem.type].push(accountWithItem)
			})

			return acc
		},
		{
			credit: [],
			depository: [],
			investment: [],
			loan: [],
			other: [],
			brokerage: [],
		},
	)

	const totalAssets = POSITIVE_ACCOUNT_TYPES.flatMap(
		type => categorizedAccounts[type],
	).reduce((acc, account) => {
		return acc + (account.balances.current ?? 0)
	}, 0)

	const totalDebts = NEGATIVE_ACCOUNT_TYPES.flatMap(
		type => categorizedAccounts[type],
	).reduce((acc, account) => {
		return acc + (account.balances.current ?? 0)
	}, 0)

	const totalOther = categorizedAccounts.other.reduce((acc, account) => {
		return acc + (account.balances.current ?? 0)
	}, 0)

	return json({
		linkData: createTokenResponse.data,
		currencyCode:
			plaidData[0]?.accounts[0]?.balances.iso_currency_code ?? 'USD',
		totals: {
			net: totalAssets - totalDebts,
			assets: totalAssets,
			debts: totalDebts,
			other: totalOther,
		},
		categorizedAccounts,
	})
}

export default function DashboardRoute() {
	const data = useLoaderData<typeof loader>()
	console.log('data :', data)
	return (
		<main className="container flex h-full min-h-[400px] max-w-[800px] mx-auto flex-col gap-8 pb-12 md:gap-12">
			<div className="flex flex-col gap-y-4 font-bold">
				<span>Net Worth</span>
				<h1 className="text-5xl">
					<FormattedCurrency
						value={data.totals.net}
						currency={data.currencyCode}
					/>
				</h1>
			</div>
      <AccountSection type="assets" />
      <AccountSection type="debts" />
      <AccountSection type="other" />
		</main>
	)
}

type AccountSectionProps = {
  type: 'assets' | 'debts' | 'other'
}

function AccountSection({ type }: AccountSectionProps) {
  const data = useLoaderData<typeof loader>()

  const accountCategories = type === 'assets' ? POSITIVE_ACCOUNT_TYPES : type === 'debts' ? NEGATIVE_ACCOUNT_TYPES : [AccountType.Other]

  if (type === 'other' && data.categorizedAccounts.other.length === 0) {
    return null
  }

  return (
    <section>
      <div className="flex justify-between pl-4 mb-4">
        <div>
          <h2 className="font-bold text-2xl capitalize">{type}</h2>
          <span><FormattedCurrency value={data.totals[type]} currency={data.currencyCode} /></span>
        </div>
        <LinkAccountButton />
      </div>
      <Accordion type="multiple">
        {accountCategories.map(category => (
          <AccountCategory key={category} type={category} />
        ))}
      </Accordion>
    </section>
  )
}

type AccountCategoryProps = {
	type: AccountType
}

function AccountCategory({ type }: AccountCategoryProps) {
	const data = useLoaderData<typeof loader>()
	const accounts = data.categorizedAccounts[type]

	if (accounts.length === 0) {
		return null
	}

	const total = accounts.reduce((acc, account) => {
		return acc + (account.balances.current ?? 0)
	}, 0)

	return (
		<AccordionItem value={type}>
			<AccordionHeader className="font-bold">
        <AccordionTrigger>
          {ACCOUNT_TYPE_DISPLAY_NAMES[type]}
          <span>
            <FormattedCurrency value={total} currency={data.currencyCode} />
          </span>
        </AccordionTrigger>
			</AccordionHeader>
      <AccordionPanel className="border-secondary border-t">
        <AccordionContent asChild>
          <ul className="flex flex-col gap-4">
            {accounts.map(account => (
              <li className="flex justify-between text-sm" key={account.account_id}>
                <div>
                  <h4 className="font-bold">{account.name}</h4>
                  <span>{account.item.institution}</span>
                </div>
                <div className="font-bold">
                  <FormattedCurrency value={account.balances.current ?? 0} currency={data.currencyCode} />
                </div>
              </li>
            ))}
          </ul>
        </AccordionContent>
      </AccordionPanel>
		</AccordionItem>
	)
}

function LinkAccountButton() {
	const data = useLoaderData<typeof loader>()
	const fetcher = useFetcher()

	const onSuccess = useCallback<PlaidLinkOnSuccess>(
		(publicToken, metadata) => {
			fetcher.submit(
				{
					public_token: publicToken,
					institution: metadata.institution?.name ?? '',
				},
				{
					action: '/resources/create-plaid-item',
					method: 'POST',
				},
			)
		},
		[fetcher],
	)

	const config = useMemo(
		() => ({
			onSuccess,
			token: data.linkData.link_token,
		}),
		[data.linkData.link_token, onSuccess],
	)

	const {
		open,
		ready,
	} = usePlaidLink(config)

	return (
		<Button variant="link" onClick={() => open()} disabled={!ready}>
			<Icon name="plus" className="mr-1" />
			Link More
		</Button>
	)
}

export function ErrorBoundary() {
	return <GeneralErrorBoundary />
}
