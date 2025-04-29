import { Claim } from "../models/Claim.js"

export type ClaimResultReason =
  | "APPROVED"
  | "POLICY_INACTIVE"
  | "NOT_COVERED"
  | "ZERO_PAYOUT"

export interface ClaimResult {
  readonly approved: boolean
  readonly payout: number
  readonly reasonCode: ClaimResultReason
}

export abstract class ClaimService {
  /**
   * A method (to implement) that fetches a policy based on a claim, and determines if it
   * ought to be paid out (and by how much).
   *
   * @rejects {DomainError}
   */
  abstract processClaim(claim: Claim): Promise<ClaimResult>
}
