import { type ComponentProps } from 'react'
import { FormattedNumber } from 'react-intl'

type FormattedNumberProps = ComponentProps<typeof FormattedNumber>

export type FormattedCurrencyProps = Omit<FormattedNumberProps, 'style'>

export function FormattedCurrency(props: FormattedCurrencyProps) {
	return (
		<FormattedNumber style="currency" {...props} />
	)
}
