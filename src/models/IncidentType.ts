import * as z from "zod"

export const IncidentTypeSchema = z.enum(["accident", "theft", "fire", "water damage"])

export type IncidentType = z.infer<typeof IncidentTypeSchema>
