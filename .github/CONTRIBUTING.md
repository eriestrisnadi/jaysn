# Have a question?

Please ask questions on [Stack Overflow](https://stackoverflow.com/questions/tagged/jaysn) instead of opening a Github Issue. There are more people on Stack Overflow who
can answer questions, and good answers can be searchable and canonical.

# Issues

We use GitHub issues to track bugs. Please ensure your bug description is clear
and has sufficient instructions to be able to reproduce the issue.

The absolute best way to report a bug is to submit a pull request including a
new failing test which describes the bug. When the bug is fixed, your pull
request can then be merged!

The next best way to report a bug is to provide a reduced test case on jsFiddle
or jsBin or produce exact code inline in the issue which will reproduce the bug.

# Pull Requests

All active development of Jaysn happens on GitHub. We actively welcome
your [pull requests](https://help.github.com/articles/creating-a-pull-request).

 1. Fork the repo and create your branch from `master`.
 2. Install all dependencies. (`npm install`)
 3. If you've added code, add tests.
 4. If you've changed APIs, update the documentation.
 5. Build generated JS, run tests and ensure your code passes lint. (`npm run test`)

## Documentation

Documentation for Jaysn (hosted at http://lowsprofile.github.io/jaysn)
is developed in `docs/`. Run `npm start` to get a local copy in your browser
while making edits.

## Coding Style

* 2 spaces for indentation (no tabs)
* 80 character line length strongly preferred.
* Prefer `'` over `"`
* ES6 Harmony when possible.
* Use semicolons;
* Trailing commas,


# Functionality Testing

Run the following command to build the library and test functionality:
```bash
npm run build && npm run test
```

## License

By contributing to Immutable.js, you agree that your contributions will be
licensed under its MIT license.