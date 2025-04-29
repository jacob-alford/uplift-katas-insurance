import { Policy } from "../models/Policy.js"
import { PolicyService, PolicyNotFoundError } from "../services/policy-service.js"

export class StaticPolicyProvider extends PolicyService {
  constructor(readonly predefinedPolicies: ReadonlyArray<Policy>) {
    super()
  }

  async getPolicy(this: StaticPolicyProvider, policyId: string): Promise<Policy> {
    for (const policy of this.predefinedPolicies) {
      if (policy.policyId === policyId) {
        return policy
      }
    }

    throw new PolicyNotFoundError(policyId)
  }
}
