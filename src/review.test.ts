import { describe,it,expect } from 'vitest';
import { capScore, validateReview } from './review';
const valid={summary:'ok',rules:[],findings:[{item:'기준',verdict:'보류',reason:'자료 부족',evidence:[],score:null,maxScore:5}],confirmedScore:2,estimatedScore:2,scoreCap:10,missingEvidence:[],inconsistencies:[],supplements:[],reportMarkdown:'# 결과',emailDraft:'메일'};
describe('review validation',()=>{it('accepts schema-shaped output and requires a hold reason',()=>{expect(validateReview(valid).findings[0].verdict).toBe('보류');expect(()=>validateReview({...valid,findings:[{...valid.findings[0],reason:''}]})).toThrow(/보류/);});it('rejects malformed output',()=>{expect(()=>validateReview({})).toThrow();});});
describe('score cap',()=>{it('caps calculated score and preserves uncapped value without a cap',()=>{expect(capScore(120,100)).toBe(100);expect(capScore(80,null)).toBe(80);});});
