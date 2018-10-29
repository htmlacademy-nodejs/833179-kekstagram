'use strict';

// not sure if it's need to be tested by mocha
class MockImageStore {
  get() {}
  save() {}
}

module.exports = new MockImageStore();
