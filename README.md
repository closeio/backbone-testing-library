# Backbone Testing Library
[![NPM](https://img.shields.io/npm/v/@closeio/backbone-testing-library.svg)](https://www.npmjs.com/package/@closeio/backbone-testing-library)
[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-prettier-success)](https://prettier.io)

DOM testing utilities for `Backbone` with an API that mirrors [React Testing Library](https://github.com/testing-library/react-testing-library).

### <img height="40px" src="https://close.com/static/img/close-logo-dark.svg" />

Interested in working on projects like this? [Close](https://close.com) is looking for [great engineers](https://jobs.close.com) to join our team!

## Installation

This module is distributed via [npm](https://www.npmjs.com/) which is bundled with [node](https://nodejs.org/en/) and
should be installed as one of your project's `devDependencies`.
This library also has `peerDependencies` listings for `@testing-library/dom`:

```
npm install --save-dev @closeio/backbone-testing-library @testing-library/dom
```

or

for installation via [yarn](https://yarnpkg.com/)

```
yarn add --dev @closeio/backbone-testing-library @testing-library/dom
```

You may also be interested in installing `@testing-library/jest-dom` so you can
use [the custom jest matchers](https://github.com/testing-library/jest-dom).

## Why would you want this... It's nearly 2021!?

At Close a large portion of our app is still written in `Backbone` and we're carefully
transitioning this to `React`. We created this library as a way to write tests on our
`Backbone` components in the style of `React Testing Library`. This means, as we port
components over, we are able to use the same tests with very minimal changes and so
minimize regressions in our app. While we wouldn't recommend building a brand new FE app
with `Backbone`, we're open sourcing this to help anyone else looking to transition a
legacy codebase.

## Example

```javascript
// models/HiddenMessageModel.js

import Backbone from 'backbone';

const HiddenMessageModel = Backbone.Model.extend({
  defaults: {
    message: '',
    showMessage: false,
  },
});

export default HiddenMessageModel;
```

```javascript
// views/HiddenMessageView.js

import Backbone from 'backbone';

const HiddenMessageView = Backbone.View.extend({
  events: {
    'change #toggle': 'setShowMessage',
  },

  initialize({ model }) {
    this.model = model;
    this.model.on('change', this.render.bind(this));
  },

  setShowMessage(e) {
    this.model.set('showMessage', e.target.checked);
  },

  template({ showMessage, message }) {
    return `<div>
      <label for="toggle">Show Message</label>
      <input
        id="toggle"
        type="checkbox"
        ${showMessage ? 'checked' : ''}
      />
      ${showMessage ? message : ''}
    </div>`;
  },

  render() {
    this.$el.html(this.template(this.model.attributes));
  },
});

export default HiddenMessageView;
```

```javascript
// views/HiddenMessageView.test.js

// these imports are something you'd normally configure Jest to import for you
// automatically. Learn more in the setup docs: https://testing-library.com/docs/react-testing-library/setup#cleanup
import '@testing-library/jest-dom';
// NOTE: jest-dom adds handy assertions to Jest and is recommended, but not required

import { render, fireEvent } from '@closeio/backbone-testing-library';

import HiddenMessageModel from '../models/HiddenMessageModel';
import HiddenMessageView from './HiddenMessageView';

test('shows the children when the checkbox is checked', () => {
  const testMessage = 'Test Message';
  const testModel = new HiddenMessageModel({
    message: testMessage,
  });

  // The queries you'd expect from React Testing Library are returned from render, as are
  // `view`, `container`, `baseElement`, `debug` and `unmount`. We also hook into React
  // Testing Library's `RTL_SKIP_AUTO_CLEANUP` const to auto unmount views in `afterEach`
  const { queryByText, getByLabelText, getByText } = render(HiddenMessageView, {
    model: testModel,
  });

  // query* functions will return the element or null if it cannot be found
  // get* functions will return the element or throw an error if it cannot be found
  expect(queryByText(testMessage)).toBeNull();

  // the queries can accept a regex to make your selectors more resilient to content tweaks and changes.
  fireEvent.click(getByLabelText(/show/i));

  // .toBeInTheDocument() is an assertion that comes from jest-dom
  // otherwise you could use .toBeDefined()
  expect(getByText(testMessage)).toBeInTheDocument();
});
```

## `render` Parameters

- `View` - the first argument is the `Backbone.View` Class to test, it will be
  instantiated by the render function
- `options` - optional - the second argument is an options object with the following
  parameters:
  - `container` - optional - behaves like [RTL's `container`](https://testing-library.com/docs/react-testing-library/api#container)
    by default creates a `div` and appends it to `document.body`
  - `baseElement` - optional - behaves like [RTL's `baseElement`](https://testing-library.com/docs/react-testing-library/api#baseelement)
    if `container` is specified, then it defaults to that, otherwise this defaults to `document.body`
  - `autoRender` - optional - this defaults to `true`. Sometimes you may want to
    assert on something in between your `Backbone.View`'s `initialize` and `render` methods, if
    so you can pass `false` here and call `render` manually on the returned `view` instance.
  - `...options` - any other properties will be passed through as `options` to the
    `Backbone.View`'s constructor. For example, you could add `el` if you wanted to manually
    provide this to the view rather than have `Backbone` auto create it. You'll also likely
    often want to pass a `model`.

## `render` Result

The render method returns an object that has a few properties:

- `...queries` - The most important feature of render is that the queries from [`DOM Testing Library`](https://testing-library.com/docs/dom-testing-library/api-queries/)
  are automatically returned with their first argument bound to the `baseElement`, which
  defaults to `document.body`
- `view` - The `Backbone` view instance itself.
- `container` - behaves like [RTL's `container`](https://testing-library.com/docs/react-testing-library/api#container-1)
  returns either a `div` autocreated for you, or the `container` passed to `render`. To get
  the root element of your rendered element, use `container.firstChild` _or_ `view.el`.
- `baseElement` - behaves like [RTL's `baseElement`](https://testing-library.com/docs/react-testing-library/api#baseelement-1)
  returns either `document.body` or the `baseElement` passed to `render.
- `debug` - behaves like [RTL's `debug`](https://testing-library.com/docs/react-testing-library/api#debug)
  this function is a shortcut for `console.log(prettyDOM(baseElement))`.
- `unmount` - calls `remove` on the `Backbone.View` instance and cleans up the `container`
  element. Useful for testing what happens when your view is removed from the page.
  By default, when `RTL_SKIP_AUTO_CLEANUP` is `false`, `cleanup` is called in every `afterEach`
  block which runs `render`, which means you don't need to manually unmount your views if
  you're not testing `remove`. While it might seem odd to rely on a ENV var from another
  library, our intention here is that this library is run in tandem with RTL and behaves
  identically for porting components.

## License

MIT © [Close](https://github.com/closeio)
