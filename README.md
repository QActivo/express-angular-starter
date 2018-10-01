# express-angular-starter
[![Build Status](https://travis-ci.org/toptive/express-angular-starter.svg)](https://travis-ci.org/toptive/express-angular-starter)
[![Coverage Status](https://coveralls.io/repos/github/toptive/express-angular-starter/badge.svg)](https://coveralls.io/github/toptive/express-angular-starter)
[![dependencies Status](https://david-dm.org/toptive/express-angular-starter/status.svg)](https://david-dm.org/toptive/express-angular-starter)

## Stack
* [Express](https://www.npmjs.com/package/express)
* Angular 1.5 ([John Papa Styleguide](https://github.com/johnpapa/angular-styleguide))
* [Gulp](https://gulpjs.com/)
* [Babel](https://babeljs.io/)
* [Sequalize](http://docs.sequelizejs.com/)
* ACL
* [Mocha](https://mochajs.org/)
* [Karma](https://karma-runner.github.io/2.0/index.html)

# Get Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

## Prerequisites
Make sure you have installed all of the following prerequisites on your development machine:
* Git - [Download & Install Git](https://git-scm.com/downloads). OSX and Linux machines typically have this already installed.
* Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager. If you encounter any problems, you can also use this [GitHub Gist](https://gist.github.com/isaacs/579814) to install Node.js.
* [Postgres](https://www.postgresql.org/)
* Yarn [Download & Install Yarn](https://yarnpkg.com/en/docs/install)
* [Gulp](https://gulpjs.com/)
* [Bower](https://bower.io/)

## Database

### Create postgres user
```bash
createuser --pwprompt postgres
postgres
postgres
```

### Create database
```bash
createdb mean_relational
```

## Quick Install

To install the dependencies, run this in the application folder from the command-line:

```bash
$ yarn
$ bower install
```
## Running The Application

Run your application using npm:

```bash
$ gulp serve-dev
```

### Running in Production mode
To run your application with *production* environment configuration, execute grunt as follows:

```bash
$ gulp build
$ gulp serve-build
```

## Testing Your Application
You can run the test suite:

```bash
$ gulp test
$ gulp server-tests
```

## Linter
You can run the linter:

```bash
$ gulp vet
```
