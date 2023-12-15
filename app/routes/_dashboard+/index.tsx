import { type DataFunctionArgs, json } from '@remix-run/node'
import { useFetcher, useLoaderData } from '@remix-run/react'
import { type AccountType } from 'plaid'
import { useCallback, useMemo } from 'react'
import {
	type PlaidLinkOnSuccess,
	type PlaidLinkOnEvent,
	type PlaidLinkOnExit,
	usePlaidLink,
} from 'react-plaid-link'
import { GeneralErrorBoundary } from '#app/components/error-boundary.tsx'
import { requireUserId } from '#app/utils/auth.server'
import { prisma } from '#app/utils/db.server'
import { products, countryCodes, client, POSITIVE_ACCOUNT_TYPES, NEGATIVE_ACCOUNT_TYPES } from '#app/utils/plaid.server'

export async function loader({ request }: DataFunctionArgs) {
	const userId = await requireUserId(request)

	const createTokenResponse = await client.linkTokenCreate({
		user: {
			client_user_id: userId,
		},
		client_name: 'Plaid Quickstart',
		products: products,
		country_codes: countryCodes,
		language: 'en',
	})

  const plaidItems = await prisma.plaidItem.findMany({
    where: {
      ownerId: userId,
    },
  });

  const plaidData = await Promise.all(plaidItems.map(async (item) => {
    const { data: { accounts } } = await client.accountsGet({
      access_token: item.accessToken,
    });

    const summary = accounts.reduce<Record<AccountType | 'net', number>>((acc, account) => {
      const { type, balances: { available, current } } = account;
      const value = available ?? current ?? 0

      if (acc[type]) {
        acc[type] += value
      } else {
        acc[type] = value
      }

      if (POSITIVE_ACCOUNT_TYPES.includes(type)) {
        acc.net += value
      } else if (NEGATIVE_ACCOUNT_TYPES.includes(type)) {
        acc.net -= value
      }

      return acc;
    }, {
      credit: 0,
      depository: 0,
      investment: 0,
      loan: 0,
      other: 0,
      brokerage: 0,
      net: 0,
    })

    return {
      id: item.id,
      institution: item.institution,
      accounts,
      summary,
    }
  }));

  const totals = plaidData.reduce<Record<'net' | 'cash' | 'debt', number>>(
    (acc, item) => {
      acc.net += item.summary.net
      acc.cash += POSITIVE_ACCOUNT_TYPES.reduce((acc, type) => {
        return acc + (item.summary[type] ?? 0)
      }, 0)
      acc.debt += NEGATIVE_ACCOUNT_TYPES.reduce((acc, type) => {
        return acc + (item.summary[type] ?? 0)
      }
      , 0)
  
      return acc
    },
    {
      net: 0,
      cash: 0,
      debt: 0,
    },
  )


	return json({...createTokenResponse.data, totals, plaidData })
}

export default function DashboardRoute() {
  const data = useLoaderData<typeof loader>()
  console.log('data :', data)
	return (
		<main className="container flex h-full min-h-[400px] px-0 pb-12 md:px-8">
			<div className="flex w-full flex-col gap-8 p-8 md:gap-12">
				<div className="flex justify-between">
					<h1 className="text-center text-base font-bold md:text-lg lg:text-left lg:text-2xl">
						Dashboard
					</h1>
					<LinkAccountButton />
				</div>
        <div>
          <h2 className="text-center text-base font-bold md:text-lg lg:text-left lg:text-2xl">
            Totals
          </h2>
          <ul className="flex flex-col gap-2">
            <li>Net: {data.totals.net}</li>
            <li>Cash: {data.totals.cash}</li>
            <li>Debt: {data.totals.debt}</li>
          </ul>
        </div>
				<ul className="flex flex-col gap-8">
					{data.plaidData.map((item) => (
						<li key={item.id} className="flex flex-col gap-4">
							<h3>{item.institution}</h3>
              <ul className="flex flex-col gap-2 rounded-md bg-muted p-4">
                {item.accounts.map((account) => (
                  <li key={account.account_id}>
                    {account.name} - {account.balances.current}
                  </li>
                ))}
              </ul>
						</li>
					))}
				</ul>
			</div>
		</main>
	)
}

function LinkAccountButton() {
	const data = useLoaderData<typeof loader>()
  const fetcher = useFetcher()

	const onSuccess = useCallback<PlaidLinkOnSuccess>((publicToken, metadata) => {
    fetcher.submit({
      public_token: publicToken, 
      institution: metadata.institution?.name ?? '',
    }, {
      action: '/resources/create-plaid-item',
      method: 'POST',
    })
	}, [fetcher])
	const onEvent = useCallback<PlaidLinkOnEvent>((eventName, metadata) => {
		// https://plaid.com/docs/link/web/#onevent
		console.log(eventName, metadata)
	}, [])
	const onExit = useCallback<PlaidLinkOnExit>((error, metadata) => {
		// https://plaid.com/docs/link/web/#onexit
		console.log(error, metadata)
	}, [])

	const config = useMemo(
		() => ({
			onSuccess,
			onEvent,
			onExit,
			token: data.link_token,
		}),
		[data.link_token, onEvent, onExit, onSuccess],
	)

	const {
		open,
		ready,
		// error,
		// exit
	} = usePlaidLink(config)

	return (
		<button className="text-blue-700" onClick={() => open()} disabled={!ready}>
			Link Account
		</button>
	)
}

export function ErrorBoundary() {
	return <GeneralErrorBoundary />
}
