import { describe, expect, it, test } from "vitest"

import { UpliftClaimsProvider } from "../src/providers/claims-provider-uplift.js"
import { StaticPolicyProvider } from "../src/providers/policy-provider-static.js"
import { ClaimResult } from "../src/services/claim-service.js"
import { PolicyNotFoundError } from "../src/services/policy-service.js"

const mockPolicyService = new StaticPolicyProvider([
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
])

describe(UpliftClaimsProvider, () => {
  const mockUpliftClaimsProvider = new UpliftClaimsProvider(mockPolicyService)

  describe(UpliftClaimsProvider.prototype.processClaim, () => {
    /**
     * The primary business logic unit-tests to ensure "uplift-claims-provider" is
     * implemented according to specification
     */
    test("The policy must be active on the incidentDate", async () => {
      const result = mockUpliftClaimsProvider.processClaim({
        policyId: "POL123",
        incidentType: "fire",
        incidentDate: new Date("2024-01-02"),
        amountClaimed: 3500,
      })

      await expect(result).resolves.toEqual({
        approved: false,
        reasonCode: "POLICY_INACTIVE",
        payout: 0,
      } satisfies ClaimResult)
    })

    test("The incidentType must be included in the policy’s coveredIncidents", async () => {
      const result = mockUpliftClaimsProvider.processClaim({
        policyId: "POL123",
        incidentType: "water damage",
        incidentDate: new Date("2023-06-16"),
        amountClaimed: 3500,
      })

      await expect(result).resolves.toEqual({
        approved: false,
        reasonCode: "NOT_COVERED",
        payout: 0,
      } satisfies ClaimResult)
    })

    test("Payout = amountClaimed - deductible", async () => {
      const result = mockUpliftClaimsProvider.processClaim({
        policyId: "POL123",
        incidentType: "fire",
        incidentDate: new Date("2023-06-16"),
        amountClaimed: 3500,
      })

      await expect(result).resolves.toEqual({
        approved: true,
        reasonCode: "APPROVED",
        payout: 3000,
      } satisfies ClaimResult)
    })

    test("If payout is zero or negative, return 0 with reasonCode: ZERO_PAYOUT", async () => {
      const result = mockUpliftClaimsProvider.processClaim({
        policyId: "POL123",
        incidentType: "accident",
        incidentDate: new Date("2023-06-16"),
        amountClaimed: 250,
      })

      await expect(result).resolves.toEqual({
        approved: true,
        reasonCode: "ZERO_PAYOUT",
        payout: 0,
      } satisfies ClaimResult)
    })

    test("The payout may not exceed the coverageLimit", async () => {
      const result = mockUpliftClaimsProvider.processClaim({
        policyId: "POL123",
        incidentType: "fire",
        incidentDate: new Date("2023-06-16"),
        amountClaimed: 11000,
      })

      await expect(result).resolves.toEqual({
        approved: true,
        reasonCode: "APPROVED",
        payout: 10000,
      } satisfies ClaimResult)
    })

    // ---------------------------------------------------------------------------

    /** Additional unit tests useful to the implementation */

    it("throws a PolicyNotFoundError when the policy ID isn't found", async () => {
      const result = mockUpliftClaimsProvider.processClaim({
        policyId: "POL000",
        incidentType: "fire",
        incidentDate: new Date("2023-06-16"),
        amountClaimed: 11000,
      })

      await expect(result).rejects.toThrow(PolicyNotFoundError)
    })
  })
})
