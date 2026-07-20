'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const context = { window: {} };
vm.createContext(context);
vm.runInContext(
  fs.readFileSync(path.join(__dirname, '..', 'i18n.js'), 'utf8'),
  context,
  { filename: 'i18n.js' }
);

const {
  PT_LANGUAGES: languages,
  PT_I18N: main,
  PT_I18N_REMOTE: remote,
  PT_I18N_BACKSTAGE: backstage,
  PT_I18N_OUTPUT: output,
  PT_I18N_UTIL: util
} = context.window;

const codes = languages.map(language => language.code);
assert.strictEqual(languages.length, 37);
assert.strictEqual(new Set(codes).size, 37);
assert.strictEqual(codes[0], 'en');
console.log('LOCALIZATION_37_UNIQUE_PACKS_OK=true');

const full = languages.filter(language => language.coverage === 'full').map(language => language.code).sort();
assert.deepStrictEqual(Array.from(full), ['en', 'sr']);
assert(languages.filter(language => !language.coverage).length === 35);
console.log('LOCALIZATION_FULL_CORE_DISCLOSURE_OK=true');

const rtl = languages.filter(language => language.dir === 'rtl').map(language => language.code).sort();
assert.deepStrictEqual(Array.from(rtl), ['ar', 'fa', 'ur']);
assert.strictEqual(languages.filter(language => language.dir && language.dir !== 'rtl').length, 0);
console.log('LOCALIZATION_RTL_METADATA_OK=true');

function verifyEffectivePack(label, pack) {
  const englishKeys = Object.keys(pack.en).sort();
  assert(englishKeys.length > 0, `${label} English dictionary is empty`);
  for (const code of codes) {
    assert.deepStrictEqual(Array.from(Object.keys(pack[code]).sort()), Array.from(englishKeys), `${label}.${code} key set differs`);
    for (const key of englishKeys) {
      const value = util.tr(pack, code, key);
      assert.strictEqual(typeof value, 'string', `${label}.${code}.${key} is not text`);
      assert(value.trim().length > 0, `${label}.${code}.${key} is empty after fallback`);
    }
  }
}

verifyEffectivePack('main', main);
console.log('LOCALIZATION_MAIN_FALLBACK_COMPLETE_OK=true');
verifyEffectivePack('remote', remote);
console.log('LOCALIZATION_REMOTE_FALLBACK_COMPLETE_OK=true');
verifyEffectivePack('backstage', backstage);
console.log('LOCALIZATION_BACKSTAGE_FALLBACK_COMPLETE_OK=true');
verifyEffectivePack('output', output);
console.log('LOCALIZATION_OUTPUT_FALLBACK_COMPLETE_OK=true');

assert.strictEqual(util.normalizeLang('sr'), 'sr');
assert.strictEqual(util.normalizeLang('not-a-language'), 'en');
assert.strictEqual(util.langMeta('not-a-language').code, 'en');
assert.strictEqual(util.tr(main, 'not-a-language', 'start'), main.en.start);
console.log('LOCALIZATION_UNKNOWN_LANGUAGE_SAFE_FALLBACK_OK=true');

for (const code of ['en', 'sr']) {
  for (const pack of [main, remote, backstage, output]) {
    for (const [key, value] of Object.entries(pack[code])) {
      assert.strictEqual(typeof value, 'string', `${code}.${key} must be directly translated`);
      assert(value.trim().length > 0, `${code}.${key} direct translation is empty`);
    }
  }
}
console.log('LOCALIZATION_FULL_PACKS_DIRECTLY_TRANSLATED_OK=true');

const visibleText = [main, remote, backstage, output]
  .flatMap(pack => codes.flatMap(code => Object.values(pack[code])))
  .filter(value => typeof value === 'string')
  .join('\n');
assert.doesNotMatch(visibleText, /license-status|license-activate|\btrial\b|\(PRO\)|·\s*PRO/i);
assert.doesNotMatch(
  fs.readFileSync(path.join(__dirname, '..', 'controller.html'), 'utf8'),
  /\(PRO\)|·\s*PRO/i
);
console.log('LOCALIZATION_NO_LEGACY_LICENSE_LABELS_OK=true');

assert(main.en.ltStudioName && main.sr.ltStudioName);
assert(main.en.outputAdd && main.sr.outputAdd);
assert(main.en.studioProgram && main.sr.studioProgram);
console.log('LOCALIZATION_FULL_ADVANCED_SURFACES_OK=true');

console.log('LOCALIZATION_TESTS_OK count=10');
