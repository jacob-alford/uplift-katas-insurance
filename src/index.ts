import { Claim } from "./models/Claim.js"
import { Policy } from "./models/Policy.js"
import { UpliftClaimsProvider } from "./providers/claims-provider-uplift.js"
import { StaticPolicyProvider } from "./providers/policy-provider-static.js"

const mockPolicies: ReadonlyArray<Policy> = [
  {
    policyId: "POL123",
    startDate: new Date("2023-01-01"),
    endDate: new Date("2024-01-01"),
    deductible: 500,
    coverageLimit: 10000,
    coveredIncidents: ["accident", "fire"],
  },
  {
    policyId: "POL456",
    startDate: new Date("2022-06-01"),
    endDate: new Date("2025-06-01"),
    deductible: 250,
    coverageLimit: 50000,
    coveredIncidents: ["accident", "theft", "fire", "water damage"],
  },
]

const upliftClaimsProvider = new UpliftClaimsProvider(
  new StaticPolicyProvider(mockPolicies),
)

const mockPassingClaim: Claim = {
  policyId: "POL123",
  incidentType: "fire",
  incidentDate: new Date("2023-06-16"),
  amountClaimed: 3500,
}

upliftClaimsProvider
  .processClaim(mockPassingClaim)
  .then(result => {
    console.log(result)
    process.exit(0)
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
