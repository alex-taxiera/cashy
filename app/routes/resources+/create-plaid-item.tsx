import { parse } from '@conform-to/zod'
import { json, type DataFunctionArgs } from '@remix-run/node'
import { z } from 'zod'
import { requireUserId } from '#app/utils/auth.server'
import { prisma } from '#app/utils/db.server.ts'
import { requireUserWithPermission } from '#app/utils/permissions'
import { client } from '#app/utils/plaid.server'
import { createToastHeaders } from '#app/utils/toast.server'

const CreatePlaidItemSchema = z.object({
  public_token: z.string(),
  institution: z.string(),
})

export async function action({ request }: DataFunctionArgs) {
  const userId = await requireUserId(request)
  await requireUserWithPermission(request, 'create:plaidItem:own')

  const formData = await request.formData()
  const submission = parse(formData, { schema: CreatePlaidItemSchema })
  if (submission.intent !== 'submit') {
		return json({ status: 'idle', submission } as const)
	}
  if (!submission.value) {
		return json({ status: 'error', submission } as const, { status: 400 })
	}

  const { data: { access_token, item_id } } = await client.itemPublicTokenExchange({ public_token: submission.value.public_token })

  const item = await prisma.plaidItem.upsert({
    where: {
      itemId: item_id,
    },
    create: {
      accessToken: access_token,
      ownerId: userId,
      itemId: item_id,
      institution: submission.value.institution,
    },
    update: {
      accessToken: access_token,
    },
  })

  const toastHeaders = await createToastHeaders({
		type: 'success',
		title: 'Success',
		description: `You successfully linked ${submission.value.institution}.`,
	})

  return json(item, { headers: toastHeaders })
}
