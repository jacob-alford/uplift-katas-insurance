import { Claim } from "../models/Claim.js"
import { ClaimResult, ClaimService } from "../services/claim-service.js"
import { PolicyService } from "../services/policy-service.js"
import { UnimplementedError } from "../utils/domain-error.js"

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

  async processClaim(this: UpliftClaimsProvider, _claim: Claim): Promise<ClaimResult> {
    throw new UnimplementedError("UpliftClaimsProvider#processClaim")
  }
}
