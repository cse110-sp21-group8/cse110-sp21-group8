## Status:

**What works for our CI/CD pipeline:**

- Jest:
We can create tests for our JavaScript which will be run in our Github Actions. We just need to figure out some tests to run.

- JSDoc: 
This will automatically create a document that details what’s going on in our JavaScript files. By starting comments with /** JSDoc will create an already formatted document depending on what we put, 
@param {string} for example will edit the return type. This will make it so we don’t have to worry about creating documentation from scratch.

- Prettier: 
This will handle our stylistic rules and pretty much overwrite our original code into a consistent styling according to Prettier rules. We use --fix with ESLint to automatically run prettier.

- ESLint: 
We are using ESLint to lint our code. It will automatically fix small stylistic errors like missed indents or forgotten semicolons (we run with the --fix option). The biggest part of it though is that it will spew warnings out on other messy code like unused variables and stuff like that. 

- Github Actions: 
Currently, we are using Github Actions to automate: testing, linting, and JSDoc creation. In test.yml we run yarn jest which will run our one test case so far located in ./test/greet.test.js. In lint-prettify.yml we run yarn eslint ./src which will start linting our code. Finally we have generate-doc.yml which generates a jsdoc for us.

- Github Projects:
We use this Github Kanban board as our backlog to keep track tasks that our team is going to do. With each column representing a different state of a task card, we can move the cards around to let others (and ourselves) know the progress of our tasks. This keeps us mindful of the work we have ahead in a sprint. 

**What doesn’t work for our CI/CD pipeline:**

- Husky: We tried implementing Husky Git hooks for pre-commit actions like enforcing code rules through ESLint and Prettier. We then found that its use was not only redundant but also inconsistent. Redundant in that the CI/CD pipeline via Github Actions can do this anyway. Inconsistent in that it did not work as smoothly on Windows OS as it did on MacOS through our testing.

- Github Issues: We also decided that using Issues as a documentation or backlog tool was not as effective as the Github Project Kanban board. Moreover, although Issues could help members signal problems with the code, the scope of our project means that we can just use Slack for smoother and more direct communication. 


## Diagram:

![CI_CD_diagram](https://user-images.githubusercontent.com/46361434/118196974-d320ab80-b402-11eb-862d-6bfb869382ce.png)

## Demo:

https://user-images.githubusercontent.com/46361434/118196994-e0d63100-b402-11eb-85fd-3fa1a8ed7dab.mp4


