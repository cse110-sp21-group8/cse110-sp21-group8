/* global test, expect */
const bye = require('../js/bye');

test('Say goodbye to User', () => {
  expect(bye('User')).toBe('Goodbye User!');
});
