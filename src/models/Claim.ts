import * as z from "zod"

import { IncidentTypeSchema } from "./IncidentType.js"

export const ClaimSchema = z.object({
  policyId: z.string(),
  incidentType: IncidentTypeSchema,
  incidentDate: z.date(),
  amountClaimed: z.number().int(),
})

export interface Claim extends z.infer<typeof ClaimSchema> {}
