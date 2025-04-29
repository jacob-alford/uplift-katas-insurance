# Insurance Kata

This project is a solution for [Uplift Katas > Insurance](https://github.com/uplift-delivery/katas/tree/main/insurance).

## Getting Started

- Ensure you have a recent version of NodeJS, i.e. version 22
- Ensure you have pnpm installed. Here, you can use Node `corepack` to install it. Follow [the instructions here](https://pnpm.io/installation#using-corepack) to get it working.
- Finally, install Dependencies:

```sh
pnpm i
```

## Running Tests

This project uses `vitest` as its test runner. In order to run the tests in watch mode, run the following command:

```sh
pnpm run test
```

## Running Mock File

A mock index file is included to run arbitrary claims and policies. The command for that is:

```sh
pnpm run start
```

## Architecture

This repository is written with the following architecture, it is nearly identical to the architecture employed by [NestJS](https://nestjs.com). In this case, it's written such that it abides SOLID principles.

### SOLID principles

Code written to abide SOLID follows the following principles:

- Separation of Concerns – A class or service should not involve methods or effects unrelated to its core function.
- Open-Closed Principle – A class or service should be open to extension but closed to modification.
- Liskov Substitution Principle – An instance of a class or service should completely satisfy, in itself, a dependency of the class or service it implements.
- Interface Segregation Principle – The dependencies of a class or service should be as small as possible.
- Dependency Inversion Principle (Inversion of Control) – Consumers of a class or service can determine functionality by selecting particular providers.

### Models

A collection of schemas using [`zod`](https://zod.dev), which comes with many features but here is used primarily for their types.

- `Claim` – a schema and type that represent a particular insurance claim.
- `IncidentType` – a schema and type that represent the type of incident that occurred, i.e. "fire"
- `Policy` – a schema and type that represent a policy.

### Services

A collection of abstract class definitions that ensure implementations have the same functionality.

- `ClaimsService` – A service definition for processing a claim given a claim-id.
- `PolicyService` – A service definition for fetching the policies to match against.

### Providers

A collection of service implementations that abide the specification of the service they extend.

- `UpliftClaimsProvider` – An implementation of ClaimsService that abides the core business logic.
- `StaticPolicyProvider` – An implementation of PolicyService that takes an array of policies on construction, and uses it to lookup the requested policy-id.
