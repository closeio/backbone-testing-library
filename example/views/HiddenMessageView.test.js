// these imports are something you'd normally configure Jest to import for you
// automatically. Learn more in the setup docs: https://testing-library.com/docs/react-testing-library/setup#cleanup
import '@testing-library/jest-dom';
// NOTE: jest-dom adds handy assertions to Jest and is recommended, but not required

import { render, fireEvent } from '../../src';

import HiddenMessageModel from '../models/HiddenMessageModel';
import HiddenMessageView from './HiddenMessageView';

test('shows the children when the checkbox is checked', () => {
  const testMessage = 'Test Message';
  const testModel = new HiddenMessageModel({
    message: testMessage,
  });

  // The queries you'd expect from React Testing Library are returned from render, as are
  // `container`, `baseElement`, `debug` and `unmount`. We also hook into React Testing
  // Library's `RTL_SKIP_AUTO_CLEANUP` const to auto unmount views in `afterEach`
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
