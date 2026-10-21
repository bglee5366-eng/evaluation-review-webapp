export type Verdict = 'O' | 'X' | '보류';
export interface Finding { item: string; verdict: Verdict; reason: string; evidence: string[]; score?: number | null; maxScore?: number | null }
export interface ReviewResult { summary: string; rules: string[]; findings: Finding[]; confirmedScore: number; estimatedScore: number; scoreCap: number | null; cappedEstimatedScore:number; missingEvidence: string[]; inconsistencies: string[]; supplements: string[]; reportMarkdown: string; emailDraft: string }
export const RESULT_SCHEMA = {type:'object',additionalProperties:false,required:['summary','rules','findings','confirmedScore','estimatedScore','scoreCap','missingEvidence','inconsistencies','supplements','reportMarkdown','emailDraft'],properties:{summary:{type:'string'},rules:{type:'array',items:{type:'string'}},findings:{type:'array',items:{type:'object',additionalProperties:false,required:['item','verdict','reason','evidence','score','maxScore'],properties:{item:{type:'string'},verdict:{type:'string',enum:['O','X','보류']},reason:{type:'string'},evidence:{type:'array',items:{type:'string'}},score:{type:['number','null']},maxScore:{type:['number','null']}}}},confirmedScore:{type:'number'},estimatedScore:{type:'number'},scoreCap:{type:['number','null']},missingEvidence:{type:'array',items:{type:'string'}},inconsistencies:{type:'array',items:{type:'string'}},supplements:{type:'array',items:{type:'string'}},reportMarkdown:{type:'string'},emailDraft:{type:'string'}}} as const;
export function validateReview(value: unknown): ReviewResult {
 if (!value || typeof value !== 'object') throw new Error('응답이 JSON 객체가 아닙니다.');
 const v=value as Record<string,unknown>; const required=['summary','rules','findings','confirmedScore','estimatedScore','scoreCap','missingEvidence','inconsistencies','supplements','reportMarkdown','emailDraft'];
 if(Object.keys(v).length!==required.length||Object.keys(v).some(k=>!required.includes(k))) throw new Error('응답 필드가 JSON 스키마와 일치하지 않습니다.');
 if(required.some(k=>!(k in v))) throw new Error('필수 결과 항목이 누락됐습니다.');
 for(const k of ['summary','reportMarkdown','emailDraft']) if(typeof v[k]!=='string') throw new Error(`${k} 값이 문자열이 아닙니다.`);
 for(const k of ['rules','findings','missingEvidence','inconsistencies','supplements']) if(!Array.isArray(v[k])) throw new Error(`${k} 값이 배열이 아닙니다.`);
 for(const k of ['confirmedScore','estimatedScore']) if(typeof v[k]!=='number'||!Number.isFinite(v[k] as number)) throw new Error(`${k} 값이 올바른 숫자가 아닙니다.`);
 if(v.scoreCap!==null&&(typeof v.scoreCap!=='number'||!Number.isFinite(v.scoreCap))) throw new Error('scoreCap 값이 올바르지 않습니다.');
 for(const k of ['rules','missingEvidence','inconsistencies','supplements']) if(!(v[k] as unknown[]).every(x=>typeof x==='string')) throw new Error(`${k} 항목은 문자열이어야 합니다.`);
 for(const f of v.findings as unknown[]) { if(!f||typeof f!=='object') throw new Error('판정 항목 구조가 올바르지 않습니다.'); const x=f as Record<string,unknown>;const fields=['item','verdict','reason','evidence','score','maxScore'];if(Object.keys(x).length!==fields.length||Object.keys(x).some(k=>!fields.includes(k)))throw new Error('판정 항목 필드가 JSON 스키마와 일치하지 않습니다.');if(typeof x.item!=='string'||!['O','X','보류'].includes(String(x.verdict))||typeof x.reason!=='string'||!Array.isArray(x.evidence)||!x.evidence.every(e=>typeof e==='string')) throw new Error('판정 항목의 필수 값이 올바르지 않습니다.'); if(x.verdict==='보류'&&!x.reason.trim()) throw new Error('보류 판정에는 사유가 필요합니다.'); if(x.score!==null&&(typeof x.score!=='number'||!Number.isFinite(x.score))) throw new Error('점수 형식이 올바르지 않습니다.'); if(x.maxScore!==null&&(typeof x.maxScore!=='number'||!Number.isFinite(x.maxScore))) throw new Error('배점 형식이 올바르지 않습니다.'); }
 const result={...v} as unknown as ReviewResult;
 result.cappedEstimatedScore=capScore(result.estimatedScore,result.scoreCap);
 result.reportMarkdown=`${result.reportMarkdown.trim()}\n\n## 점수 요약\n- 확정 점수: ${result.confirmedScore}\n- 추정 원점수: ${result.estimatedScore}\n- 상한 적용 추정점수: ${result.cappedEstimatedScore}`;
 return result;
}
export function capScore(raw:number,cap:number|null):number { return cap===null?raw:Math.min(raw,cap); }
export function formatBytes(n:number):string { return n<1024*1024?`${(n/1024).toFixed(0)} KB`:`${(n/1024/1024).toFixed(1)} MB`; }
export function isSupported(name:string):boolean { return /\.(pdf|docx|xlsx|xls|hwpx|txt|md|json|csv)$/i.test(name); }
