/**
 * @constant {string|symbol} NO_MATCH_FOUND
 */
export const NO_MATCH_FOUND = typeof Symbol === 'function' ? Symbol('NO_MATCH_FOUND') : '__SWITCHER_NO_MATCH_FOUND__';

/**
 * @function isEqual
 *
 * @description
 * based on the type of the testValue, compare it to the value passed
 *
 * @param {*} testValue the value to test against (the first argument in the case statement)
 * @param {*} matchValue the value to test (the value passed to the .match() method)
 * @returns {boolean} are the values equal
 */
export const isEqual = (testValue, matchValue) => {
  return typeof testValue === 'function'
    ? testValue(matchValue)
    : testValue instanceof RegExp ? testValue.test(matchValue) : testValue === matchValue;
};

/**
 * @function createCaseCreator
 *
 * @description
 * create a method that will create a method that creates the case entry in Switchem
 *
 * @param {function} method the method that compares the testValue to the matchValue
 * @param {boolean} [isNot] is the method a "not" comparison, returning true if the method returns falsy
 * @returns {function} the method to create the case entry in Switchem
 */
export const createCaseCreator = (method, isNot) => {
  /**
   * @function createCase
   *
   * @description
   * create a case entry with both key tested and the method to test with
   *
   * @param {*} testValue the value to test against (the first argument in the case statement)
   * @param {*} [matchResult=true] the matchResult to return if the method returns correctly
   * @returns {{key: *, test: function(*): *}} the case entry for future testing of a matchValue
   */
  return (testValue, matchResult = true) => {
    return {
      key: testValue,
      test: isNot
        ? (matchValue) => {
          return !method(testValue, matchValue) ? matchResult : NO_MATCH_FOUND;
        }
        : (matchValue) => {
          return method(testValue, matchValue) ? matchResult : NO_MATCH_FOUND;
        }
    };
  };
};

/**
 * @function getMatchingKeyValuePair
 *
 * @description
 * get the key / value pair that matches based on the case test returning truthy
 *
 * @param {Array<Object>} cases the cases to iterated over and test
 * @param {*} testValue the value to test against (the first argument in the case statement)
 * @param {*} defaultValue the value to return if no cases match
 * @returns {{key: *, value: *}} the object with the key and value of the matching result
 */
export const getMatchingKeyValuePair = (cases, testValue, defaultValue) => {
  let iterationValue;

  for (let index = 0; index < cases.length; index++) {
    iterationValue = cases[index].test(testValue);

    if (iterationValue !== NO_MATCH_FOUND) {
      return {
        key: cases[index].key,
        value: iterationValue
      };
    }
  }

  return {
    key: 'default',
    value: defaultValue
  };
};

export const is = createCaseCreator(isEqual, false);
export const not = createCaseCreator(isEqual, true);
