import { Claim } from "../models/Claim.js"
import { ClaimResult, ClaimService } from "../services/claim-service.js"
import { PolicyService } from "../services/policy-service.js"

/**
 * The core implementation for the business logic determining if a claim is valid or not.
 * UpliftClaimsProvider#processClaim is implemented according to the following rules:
 *
 * - The policy must be active on the incidentDate
 * - The incidentType must be included in the policy’s coveredIncidents
 * - Payout = amountClaimed - deductible
 * - If payout is zero or negative, return 0 with reasonCode: ZERO_PAYOUT
 * - The payout may not exceed the coverageLimit
 */
export class UpliftClaimsProvider extends ClaimService {
  constructor(private readonly policyService: PolicyService) {
    super()
  }

  async processClaim(this: UpliftClaimsProvider, claim: Claim): Promise<ClaimResult> {
    const policy = await this.policyService.getPolicy(claim.policyId)

    const isBeforePolicyStart = claim.incidentDate < policy.startDate
    const isAfterPolicyEnd = claim.incidentDate > policy.endDate

    /** Return no coverage for inactive policies */
    if (isBeforePolicyStart || isAfterPolicyEnd) {
      return {
        approved: false,
        reasonCode: "POLICY_INACTIVE",
        payout: 0,
      }
    }

    const isCovered = policy.coveredIncidents.includes(claim.incidentType)

    /** Return NOT_COVERED for a lack of coverage */
    if (!isCovered) {
      return {
        approved: false,
        reasonCode: "NOT_COVERED",
        payout: 0,
      }
    }

    /**
     * Payout is whichever of these is smallest (but never smaller than 0):
     *
     * - AmountClaimed - deductible
     * - CoverageLimit
     */
    const payout = Math.max(
      0,
      Math.min(claim.amountClaimed - policy.deductible, policy.coverageLimit),
    )

    return {
      approved: true,
      reasonCode: payout === 0 ? "ZERO_PAYOUT" : "APPROVED",
      payout,
    }
  }
}
