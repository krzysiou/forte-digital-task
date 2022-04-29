# Forte Digital Task

## How to run

First type ```yarn install``` to install all packages and dependencies. After installation run ```yarn start``` to host website in development mode.

## Available Scripts

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `yarn build`

Builds the app for production to the `build` folder.\
See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time.\
This command will remove the single build dependency from your project.

## Task One - validation of intern editing

​
You need to work on the `Edit Intern` page.
​

- Load details of an intern from API (http://localhost:3001/interns/:id) and display it in the form
- Add Missing fields: `internshipStart`, `internshipEnd` allowing to edit dates
- Make all fields required (name, email, internshipStart, internshipEnd)
- Validate if the email is correct
- Validate if `internshipEnd` after `internshipStart`
- Update intern data in `db.json` on form submit using API endpoint (PUT http://localhost:3001/interns/:id)
  ​

## Task Two - Page styling and semantic HTML

​
You need to work on both `Intern List` page and `Edit Intern` page.

- Change the HTML markup to the more semantic one.
- Style both pages according to the design:
  https://www.figma.com/file/DNF5oDSn7NTO4Ls1kVkK1K/Task?node-id=1%3A2
- Remember about accessibility
