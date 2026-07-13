const assert = require('assert');
const C = require('../src/screen-content/model.js');

const scenes = [
  { id: 'timer-scene', name: 'Timer', layers: [{ id: 'timer', type: 'timer' }] },
  { id: 'deck-scene', name: 'Deck', layers: [{ id: 'deck', type: 'pdf', src: 'media://deck.pdf', page: 2 }] },
  { id: 'blank-scene', name: 'Blank', layers: [{ id: 'blank', type: 'text', text: '' }] },
  { id: 'internal-clear', name: 'Clear', internal: true, layers: [] }
];

let passed = 0;
function check(name, fn) { fn(); passed++; console.log(name + '=true'); }

check('SCREEN_CONTENT_DERIVES_STANDARD_TYPES_OK', () => {
  const model = C.normalizeModel({}, scenes, 'timer-scene');
  assert.deepStrictEqual(model.items.map(item => item.type), ['timer', 'pdf', 'blank']);
  assert.strictEqual(model.selectedContentItemId, 'content-timer-scene');
  assert.strictEqual(model.items.find(item => item.type === 'pdf').page, 2);
});

check('SCREEN_CONTENT_PRESERVES_IDS_AND_SELECTION_OK', () => {
  const model = C.normalizeModel({
    items: [{ id: 'slide-deck', name: 'Sponsor deck', type: 'pdf', sceneId: 'deck-scene', page: 4 }],
    selectedContentItemId: 'slide-deck', liveContentItemId: 'slide-deck'
  }, scenes, 'timer-scene');
  assert.strictEqual(model.items.find(item => item.sceneId === 'deck-scene').id, 'slide-deck');
  assert.strictEqual(model.selectedContentItemId, 'slide-deck');
  assert.strictEqual(model.liveContentItemId, 'slide-deck');
});

check('SCREEN_CONTENT_REJECTS_MISSING_LIVE_ITEM_OK', () => {
  const model = C.normalizeModel({ liveContentItemId: 'missing' }, scenes, 'timer-scene');
  assert.strictEqual(model.liveContentItemId, '');
});

check('SCREEN_CONTENT_CUE_TAKE_REQUIRES_REAL_ITEM_OK', () => {
  const model = C.normalizeModel({}, scenes, 'timer-scene');
  assert.strictEqual(C.cueTakePlan({ contentItemId: 'content-deck-scene', autoTakeContentOnGo: true }, model).enabled, true);
  assert.strictEqual(C.cueTakePlan({ contentItemId: 'missing', autoTakeContentOnGo: true }, model).enabled, false);
  assert.strictEqual(C.cueTakePlan({ contentItemId: 'content-deck-scene', autoTakeContentOnGo: false }, model).enabled, false);
});

console.log('SCREEN_CONTENT_MODEL_TESTS_OK count=' + passed);
