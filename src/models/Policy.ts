import * as z from "zod"

import { IncidentTypeSchema } from "./IncidentType.js"

export const PolicySchema = z.object({
  policyId: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  deductible: z.number().int(),
  coverageLimit: z.number(),
  coveredIncidents: z.array(IncidentTypeSchema),
})

export interface Policy extends z.infer<typeof PolicySchema> {}
