'use strict';

const assert = require('assert');
const Report = require('../src/report/model.js');

let passed = 0;
function check(name, fn) {
  fn();
  passed++;
  console.log(name + '=true');
}

const anchor = new Date(2026, 6, 10, 9, 0, 0, 0).getTime();
const report = Report.buildReport({
  show: { id: 'show-report', name: 'Konferencija Ž', details: { eventDate: '2026-07-10', client: 'Demo', venue: 'Hall A' } },
  showStart: '09:00',
  now: anchor + 150000,
  cues: [
    { id: 'cue-a', name: '=Željko, 漢字', durationMs: 60000, actualStart: anchor, actualEnd: anchor + 70000, actualDurationMs: 70000, status: 'completed', note: 'He said "go", then\nleft' },
    { id: 'cue-b', name: 'Coffee Break', durationMs: 30000, actualStart: anchor + 70000, actualEnd: anchor + 90000, actualDurationMs: 20000, status: 'completed', note: 'Lobby' },
    { id: 'cue-c', name: 'Closing', durationMs: 30000, actualStart: null, actualEnd: null, actualDurationMs: null, status: 'skipped', note: '' }
  ],
  legacyActualTimes: [{ i: 0, n: 'Wrong legacy name', p: 999999, s: anchor + 5000, e: anchor + 90000 }]
});

check('REPORT_USES_CANONICAL_CUE_FIELDS_OK', () => {
  assert.strictEqual(report.rows[0].name, '=Željko, 漢字');
  assert.strictEqual(report.rows[0].plannedDurationMs, 60000);
  assert.strictEqual(report.rows[0].actualStart, anchor);
  assert.strictEqual(report.rows[0].actualDurationMs, 70000);
  assert.strictEqual(report.rows[0].notes, 'He said "go", then\nleft');
});

check('REPORT_PLANNED_START_SEQUENCE_OK', () => {
  assert.deepStrictEqual(report.rows.map(row => row.plannedStart), [anchor, anchor + 60000, anchor + 90000]);
});

check('REPORT_SUMMARY_METRICS_OK', () => {
  assert.deepStrictEqual(report.summary, {
    totalPlannedMs: 120000,
    totalActualMs: 90000,
    finalDelayMs: -30000,
    overtimeSegments: 1,
    longestOvertimeMs: 10000,
    breaks: 1,
    skippedCues: 1,
    completedCues: 2,
    timedCues: 2,
    allTerminal: true,
    plannedEndAt: anchor + 120000,
    actualEndAt: anchor + 90000
  });
});

check('REPORT_LIVE_CUE_USES_BOUNDED_NOW_OK', () => {
  const live = Report.buildReport({
    show: { name: 'Live' }, showStart: '', now: 20000,
    cues: [{ id: 'live', name: 'Live cue', durationMs: 10000, actualStart: 5000, status: 'live' }]
  });
  assert.strictEqual(live.rows[0].actualDurationMs, 15000);
  assert.strictEqual(live.rows[0].varianceMs, 5000);
  assert.strictEqual(live.summary.finalDelayMs, null);
  assert.strictEqual(live.summary.allTerminal, false);
});

check('REPORT_LEGACY_LOG_FALLBACK_OK', () => {
  const legacy = Report.buildReport({
    show: { name: 'Legacy' }, now: 50000,
    cues: [{ id: 'legacy-cue', name: 'Legacy cue', durationMs: 30000, status: 'pending' }],
    legacyActualTimes: [{ i: 0, n: 'Legacy cue', p: 30000, s: 10000, e: 45000 }]
  });
  assert.strictEqual(legacy.rows[0].actualStart, 10000);
  assert.strictEqual(legacy.rows[0].actualDurationMs, 35000);
  assert.strictEqual(legacy.rows[0].varianceMs, 5000);
  assert.strictEqual(legacy.rows[0].status, 'completed');
});

check('REPORT_CSV_UNICODE_ESCAPING_AND_SUMMARY_OK', () => {
  const csv = Report.toCsv(report);
  assert(csv.startsWith('\ufeffcue_number,cue_id,name'));
  assert(csv.includes('"\'=Željko, 漢字"'));
  assert(csv.includes('"He said ""go"", then\nleft"'));
  assert(csv.includes('\r\nsummary_metric,value\r\n'));
  assert(csv.includes('final_delay,-0:30'));
  assert(csv.endsWith('\r\n'));
});

console.log('REPORT_MODEL_TESTS_OK count=' + passed);
