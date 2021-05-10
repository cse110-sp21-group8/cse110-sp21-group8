/* global test, expect */
const greet = require('../js/greet');

test('Say hello to User', () => {
  expect(greet('User')).toBe('Hello User');
});
