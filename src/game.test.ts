import {describe, it, mock, test} from 'node:test';
import assert from "node:assert/strict";
import {SavedGameRunner} from './testResources.js';
import { gameRunnerSavedOutput} from './testResources.js';

describe('The test environment', () => {
  it('should pass', () => {
    assert.strictEqual(1 + 1, 2, "Addition failed");
  });

  it("should access game", function () {
    assert.ok(SavedGameRunner !== undefined);
  });
});

test("Game runner produces expected output", function () {
  const log = mock.method(console, 'log');
  SavedGameRunner.main();
  const spyConsoleLogs = log.mock.calls.map((call) => call.arguments[0])

  assert.ok(spyConsoleLogs.length > 0, "No logs were captured")
  assert.equal(spyConsoleLogs.length, gameRunnerSavedOutput.length)
  assert.deepEqual(spyConsoleLogs.slice(0,100), gameRunnerSavedOutput.slice(0,100), 'Error in the range 0-100')
  assert.deepEqual(spyConsoleLogs.slice(101,200), gameRunnerSavedOutput.slice(101,200), 'Error in the range 101-200')
  assert.deepEqual(spyConsoleLogs.slice(201,300), gameRunnerSavedOutput.slice(201,300), 'Error in the range 201-300')
  assert.deepEqual(spyConsoleLogs, gameRunnerSavedOutput)
  log.mock.restore()
})
