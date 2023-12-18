import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { Slot } from '@radix-ui/react-slot'
import * as React from 'react'

import { cn } from '#app/utils/misc.tsx'

const Accordion = React.forwardRef<
	React.ElementRef<typeof AccordionPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>
>(({ className, ...props }, ref) => (
	<AccordionPrimitive.Root
		ref={ref}
		className={cn('w-full space-y-4', className)}
		{...props}
	/>
))
Accordion.displayName = AccordionPrimitive.Root.displayName

const AccordionItem = React.forwardRef<
	React.ElementRef<typeof AccordionPrimitive.Item>,
	React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
	<AccordionPrimitive.Item
		ref={ref}
		className={cn(
			'focus-within:ring-4 w-full rounded-lg bg-muted outline-none ring-ring ring-offset-2 ring-offset-background transition-colors',
			className,
		)}
		{...props}
	/>
))
AccordionItem.displayName = AccordionPrimitive.Item.displayName

const AccordionHeader = React.forwardRef<
	React.ElementRef<typeof AccordionPrimitive.Header>,
	React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Header>
>(({ className, ...props }, ref) => (
	<AccordionPrimitive.Header
		ref={ref}
		className={cn('w-full', className)}
		{...props}
	/>
))
AccordionHeader.displayName = AccordionPrimitive.Header.displayName

const AccordionTrigger = React.forwardRef<
	React.ElementRef<typeof AccordionPrimitive.Trigger>,
	React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, ...props }, ref) => (
	<AccordionPrimitive.Trigger
		ref={ref}
		className={cn(
			'group',
			'radix-state-closed:rounded-lg radix-state-open:rounded-t-lg',
			'focus:outline-none',
			'hover:bg-accent hover:text-accent-foreground',
			'inline-flex w-full items-center justify-between px-4 py-2 text-left',
			className,
		)}
		{...props}
	/>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionPanel = React.forwardRef<
	React.ElementRef<typeof AccordionPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, ...props }, ref) => (
	<AccordionPrimitive.Content
		ref={ref}
		className={cn(
			'w-full overflow-hidden rounded-b-lg radix-state-closed:animate-accordion-up radix-state-open:animate-accordion-down',
			className,
		)}
		{...props}
	/>
))
AccordionPanel.displayName = AccordionPrimitive.Content.displayName

export interface AccordionContentProps
	extends React.BaseHTMLAttributes<HTMLDivElement> {
	asChild?: boolean
}

const AccordionContent = React.forwardRef<
	React.ElementRef<'div'>,
	AccordionContentProps
>(({ asChild, className, ...props }, ref) => {
	const Comp = asChild ? Slot : 'div'

	return <Comp ref={ref} className={cn('px-4 py-3', className)} {...props} />
})
AccordionContent.displayName = 'AccordionContent'

export {
	Accordion,
	AccordionItem,
	AccordionHeader,
	AccordionTrigger,
	AccordionPanel,
	AccordionContent,
}
