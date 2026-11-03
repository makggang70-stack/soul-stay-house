import test from 'node:test';
import assert from 'node:assert/strict';
import {clamp,isLevels,DEFAULT_LEVELS} from '../src/audio/engine.ts';
import {validContent,isJournalList,removeEntry,escapeHTML} from '../src/journal/model.ts';
test('음량은 0-100 범위로 제한',()=>{assert.equal(clamp(200),100);assert.equal(clamp(-5),0);assert.equal(clamp(41),41);});
test('저장된 믹서 데이터 검증',()=>{assert.ok(isLevels(DEFAULT_LEVELS));assert.ok(isLevels({...DEFAULT_LEVELS,rain:80,wind:90}));assert.equal(isLevels({...DEFAULT_LEVELS,volume:999}),false);});
test('기록 검증 및 XSS 이스케이프',()=>{assert.equal(validContent('  '),false);assert.equal(validContent('a'.repeat(5001)),false);assert.equal(escapeHTML('<script>'), '&lt;script&gt;');assert.equal(isJournalList([{id:'1',date:'2026',mood:'평온함',content:'나의 기록'}]),true);});
test('기록 삭제는 지정 ID만 제거',()=>{const list=[{id:'a',date:'x',mood:'x',content:'a'},{id:'b',date:'x',mood:'x',content:'b'}];assert.deepEqual(removeEntry(list,'a').map(e=>e.id),['b']);});
