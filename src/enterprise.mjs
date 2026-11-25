import {ingest,retrieve} from './core.mjs';
import {semanticRetrieve,hybridRetrieve} from './semantic.mjs';
import {verifiedContext} from './context.mjs';
import {compareExperiments,syntheticCorpus} from './experiments.mjs';
const entries=Object.freeze([...syntheticCorpus.map(d=>Object.freeze({...d,roles:Object.freeze(d.source==='hr'?['employee','administrator']:d.source==='catalog'?['employee','sales','administrator']:['engineer','administrator'])})),Object.freeze({source:'restricted-hr',text:'Synthetic confidential employee compensation review and vacation exception record.',roles:Object.freeze(['administrator'])})]);
export const roles=Object.freeze(['employee','sales','engineer','administrator']);
export function authorizedCorpus(role){if(!roles.includes(role))throw Error('Unknown role');return entries.filter(d=>d.roles.includes(role)).map(d=>ingest(d.text,{source:d.source,size:64,overlap:16}));}
export async function inspectRetrieval({role='employee',query,strategy='lexical',k=5,budget=400}={}){
 if(!['lexical','offline','hybrid'].includes(strategy)||typeof query!=='string'||!query.trim()||query.length>4096)throw Error('Invalid retrieval request');
 const corpus=authorizedCorpus(role);const search={lexical:retrieve,offline:semanticRetrieve,hybrid:hybridRetrieve}[strategy];
 const results=await search(corpus,query,{k});return {schemaVersion:1,role,results,context:verifiedContext(corpus,results,{budget})};
}
export async function runScenarios(){const cases=[{name:'Employee knowledge',role:'employee',query:'vacation annual leave',expected:'hr'},{name:'Product catalog',role:'sales',query:'notebooks SKU',expected:'catalog'},{name:'Technical documentation',role:'engineer',query:'rotate credentials token',expected:'technical'},{name:'Restricted record denied',role:'employee',query:'compensation review',expected:null}];const reports=[];for(const c of cases){const result=await inspectRetrieval(c);reports.push({...c,passed:c.expected===null?result.results.length===0:result.results[0]?.chunk.source===c.expected,sources:result.results.map(r=>r.chunk.source)});}return reports;}
export {compareExperiments};
