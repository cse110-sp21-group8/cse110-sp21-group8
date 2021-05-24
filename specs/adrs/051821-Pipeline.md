# Preparing Pipeline

## Context and Problem Statement
C: We want to create a pipeline that: lints and enforces code style, monitors code quality, runs unit tests, and has automatic documentation.

P: Which parts of our pipeline do we want automated? Which parts do we want done manually? Which tools do we pick depending on how we want to build our pipeline?

## Considered Options 
* Linting and Code Style Enforcement
  * [ESlint](https://eslint.org/)
  * [Prettier](https://prettier.io/)
* Code Quality tools
  * [CodeFactor](https://www.codefactor.io/)
  * [Codacy](https://www.codacy.com/)
* Testing
  * [Jest](https://jestjs.io/)
  * [Puppeteer](https://jestjs.io/docs/puppeteer)
  * [Cypress](https://www.cypress.io/)
  * [MochaJS](https://mochajs.org/)
* Documentation
  * [JSDocs](https://jsdoc.app/)
  
## Decision Outcome
Chosen options: ESlint & Prettier; CodeFactor; Jest & Cypress; JSDocs

* ESLint & Pretter: We picked these two for their automatic code formatting, style fixing, and reporting on code smells. They are also really easy to integrate into Github Actions.
* CodeFactor: We picked CodeFactor because of the very easy Github integration, and setup. The grading scheme also gives upfront and easily understandable feedback.
* Jest & Puppeteer: First, Jest was picked under the Testing Team's decision. While Jest handles more small unit tests, Puppeteer is there for our e2e testing. We chose it because it was the e2e testing used in the lab and it is on the same platform as Jest.
* JSDocs: JSDocs has multiple guides and documentation online. It also has a comment syntax similar to those of requirements in previous class PA's. It was also recommended to us by Sanat.
