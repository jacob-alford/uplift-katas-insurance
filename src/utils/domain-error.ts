/**
 * A base error class that wraps Error.
 *
 * @remarks
 *   A little known fact, the message property of the Error class in JavaScript is a
 *   non-enumerable property type. This makes it challenging for JSON serializers to log
 *   the error object.
 */
export abstract class DomainError extends Error {
  override readonly message: string

  abstract readonly name: string

  constructor(message: string) {
    super(message)

    this.message = message
  }
}

export class UnimplementedError extends DomainError {
  readonly name = "UnimplementedError"

  constructor(methodName: string) {
    super(`${methodName} is not implemented yet`)
  }
}
