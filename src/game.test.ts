// @ts-ignore
import {describe, it} from 'node:test';
// @ts-ignore
import assert from "node:assert/strict";
import {GameRunner} from './game-runner.js';

describe('The test environment', () => {
    it('should pass', () => {
        assert.strictEqual(1 + 1, 2, "Addition failed");
    });

    it("should access game", function () {
        assert.ok(GameRunner !== undefined);
    });

});
