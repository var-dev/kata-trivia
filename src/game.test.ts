import {describe, it} from 'node:test';
import {assert} from 'assert'
import {GameRunner} from '../src/game-runner.js';

describe('The test environment', () => {
    it('should pass', () => {
        assert(true).to.be.true;
    });

    it("should access game", function () {
        assert(GameRunner).to.not.be.undefined;
    });

});
