'use strict';

const assert = require('assert');
const API = require('../src/control-api/commands.js');

let passed = 0;
function check(name, fn) {
  fn();
  passed++;
  console.log(name + '=true');
}

check('CONTROL_API_HTTP_AND_OSC_ALIASES_OK', () => {
  assert.strictEqual(API.normalizeCommand({ type: 'start' }).command.type, 'startPause');
  assert.strictEqual(API.normalizeCommand({ type: 'go/next' }).command.type, 'goNext');
  assert.strictEqual(API.normalizeCommand({ type: 'lower-third/take' }).command.type, 'ltTake');
  assert.strictEqual(API.normalizeCommand({ type: 'slides/clear' }).command.type, 'contentClear');
});

check('CONTROL_API_PROFESSIONAL_COMMANDS_OK', () => {
  const commands = [
    ['goSelected'], ['message/send', 'Wrap up'], ['lt/select-template', 'Keynote'],
    ['lt/auto', 'on'], ['content/take', 'cut'], ['output/blackout', 'off']
  ].map(([type, value]) => API.normalizeCommand({ type, value }));
  assert(commands.every(result => result.ok));
  assert.deepStrictEqual(commands.map(result => result.command.type), [
    'goSelected', 'messageSend', 'ltSelectTemplate', 'ltAuto', 'contentTake', 'blackout'
  ]);
});

check('CONTROL_API_REJECTS_INVALID_VALUES_OK', () => {
  assert.strictEqual(API.normalizeCommand({ type: 'adjust', value: 'many' }).ok, false);
  assert.strictEqual(API.normalizeCommand({ type: 'ltAuto' }).ok, false);
  assert.strictEqual(API.normalizeCommand({ type: 'contentTake', value: 'dissolve' }).ok, false);
  assert.strictEqual(API.normalizeCommand({ type: 'not-a-command' }).ok, false);
});

const rawStatus = {
  ready: true,
  updatedAt: 1000,
  show: { id: 'show-1', name: 'Demo Show', token: 'do-not-copy' },
  timer: { mode: 'countdown', running: true, durationMs: 60000, remainingMs: 50000, endAt: 70000, capturedAt: 20000 },
  cue: {
    total: 2,
    live: { index: 0, id: 'cue-a', name: 'Opening', speakerName: 'Ana', speakerTitle: 'Host', notes: 'private note' },
    selected: { index: 1, id: 'cue-b', name: 'Keynote' }
  },
  lowerThird: { visible: true, auto: true, canReplay: true, templateId: 'lt-a', templateName: 'Keynote', instanceId: 'instance-a', phase: 'hold', library: { templates: ['secret'] } },
  content: { selected: { id: 'slide-a', name: 'Holding', type: 'image', sceneId: 'scene-a', page: 1 } },
  output: { open: true, blackout: false },
  message: { text: 'Two minutes', flash: true },
  apiToken: 'secret',
  license: 'secret'
};

check('CONTROL_STATUS_STRICT_SANITIZER_OK', () => {
  const status = API.sanitizeControlStatus(rawStatus);
  assert.strictEqual(status.show.name, 'Demo Show');
  assert.strictEqual(status.cue.live.notes, undefined);
  assert.strictEqual(status.lowerThird.library, undefined);
  assert.strictEqual(status.apiToken, undefined);
  assert.strictEqual(status.license, undefined);
});

check('CONTROL_STATUS_RUNNING_TIMER_MATERIALIZES_OK', () => {
  const status = API.materializeControlStatus(rawStatus, 30000);
  assert.strictEqual(status.timer.remainingMs, 40000);
  assert.strictEqual(status.queriedAt, 30000);
});

check('CONTROL_STATUS_SECTIONS_ARE_BOUNDED_OK', () => {
  const show = API.selectStatusSection(rawStatus, 'show', 30000);
  const cue = API.selectStatusSection(rawStatus, 'cue', 30000);
  const lowerThird = API.selectStatusSection(rawStatus, 'lowerThird', 30000);
  assert(show.show && show.timer && show.output && !show.cue && !show.lowerThird);
  assert(cue.cue && cue.timer && !cue.show && !cue.lowerThird);
  assert(lowerThird.lowerThird && !lowerThird.show && !lowerThird.cue);
});

console.log('CONTROL_API_TESTS_OK count=' + passed);
