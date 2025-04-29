import { Policy } from "../models/Policy.js"
import { DomainError } from "../utils/domain-error.js"

export abstract class PolicyService {
  /**
   * Fetches a policy by policy id
   *
   * @rejects {PolicyNotFoundError}
   */
  abstract getPolicy(policyId: string): Promise<Policy>
}

export class PolicyNotFoundError extends DomainError {
  readonly name = "PolicyNotFoundError"

  constructor(readonly policyId: string) {
    super(`Policy ${policyId} was not found`)
  }
}
