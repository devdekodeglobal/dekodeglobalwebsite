import test from 'node:test';
import assert from 'node:assert/strict';
import { isLikelyGibberish } from '../src/utils/messageQuality.js';

test('detects the random inputs from the intake screenshots', () => {
  assert.equal(isLikelyGibberish('fyuhffui'), true);
  assert.equal(isLikelyGibberish('gtdluydf;uyf;fg'), true);
  assert.equal(isLikelyGibberish('ujhgg'), true);
  assert.equal(isLikelyGibberish('fylfuyf;pf'), true);
});

test('keeps short but meaningful project answers', () => {
  assert.equal(isLikelyGibberish('doctors'), false);
  assert.equal(isLikelyGibberish('small retail businesses'), false);
  assert.equal(isLikelyGibberish('payments and user accounts'), false);
  assert.equal(isLikelyGibberish('ASAP'), false);
  assert.equal(isLikelyGibberish('in 3 months'), false);
  assert.equal(isLikelyGibberish('not sure'), false);
});
