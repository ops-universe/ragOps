import {createHash} from 'node:crypto';
import {collectChunks,retrieve} from './core.mjs';
export const offlineEmbedding=Object.freeze({kind:'offline',id:'hash-v1',embed(text){const v=Array(64).fill(0);for(const token of text.toLowerCase().match(/[\p{L}\p{N}]+/gu)||[]){const h=createHash('sha256').update(token).digest();v[h[0]%64]+=h[1]%2?1:-1;}return v;}});
function vector(v){if(!Array.isArray(v)||v.length<1||v.length>4096||v.some(n=>typeof n!=='number'||!Number.isFinite(n)||Math.abs(n)>1e6))throw Error('Invalid embedding');return v;}
export function cosine(a,b){vector(a);vector(b);if(a.length!==b.length)throw Error('Embedding dimension mismatch');let dot=0,x=0,y=0;for(let i=0;i<a.length;i++){dot+=a[i]*b[i];x+=a[i]**2;y+=b[i]**2;}return x&&y?Math.max(-1,Math.min(1,dot/Math.sqrt(x*y))):0;}
export async function semanticRetrieve(documents,query,{provider=offlineEmbedding,authorizeExternal=false,k=5,source,signal,timeoutMs=5000}={}){
 if(typeof query!=='string'||!query.trim()||query.length>4096||!Number.isSafeInteger(k)||k<1||k>100||!provider||typeof provider.embed!=='function'||!['offline','external'].includes(provider.kind)||typeof provider.id!=='string')throw Error('Invalid semantic options');
 // Only the built-in provider is trusted as offline; arbitrary adapters require authorization.
 if(provider!==offlineEmbedding&&authorizeExternal!==true)throw Error('External adapter authorization required');
 const chunks=collectChunks(documents,{source});if(chunks.length>1000)throw Error('Semantic corpus limit');
 if(!Number.isSafeInteger(timeoutMs)||timeoutMs<1||timeoutMs>60000)throw Error('Invalid timeout');
 const deadline=Date.now()+timeoutMs;
 async function embed(text){if(signal?.aborted)throw Error('Embedding cancelled');const remaining=deadline-Date.now();if(remaining<=0)throw Error('Embedding timeout');const controller=new AbortController();let timer,abort;try{return await Promise.race([Promise.resolve().then(()=>provider.embed(text,{signal:controller.signal})),new Promise((_,reject)=>{timer=setTimeout(()=>{controller.abort();reject(Error('Embedding timeout'));},remaining);abort=()=>{controller.abort();reject(Error('Embedding cancelled'));};signal?.addEventListener('abort',abort,{once:true});if(signal?.aborted)abort();})]);}finally{clearTimeout(timer);signal?.removeEventListener('abort',abort);}}
 const q=vector(await embed(query));const results=[];for(const chunk of chunks){const score=cosine(q,await embed(chunk.text));if(score>0)results.push({schemaVersion:1,chunk,score,provider:provider.id});}
 return results.sort((a,b)=>b.score-a.score||a.chunk.id.localeCompare(b.chunk.id)).slice(0,k);
}
export async function hybridRetrieve(documents,query,options={}){const {k=5,source}=options;if(!Number.isSafeInteger(k)||k<1||k>100)throw Error('Invalid top K');const lexical=retrieve(documents,query,{k:100,source}),semantic=await semanticRetrieve(documents,query,{...options,k:100});const rows=new Map();for(const [kind,list] of [['lexical',lexical],['semantic',semantic]])for(const [i,row] of list.entries()){const item=rows.get(row.chunk.id)||{schemaVersion:1,chunk:row.chunk,score:0,ranks:{}};item.score+=1/(60+i+1);item.ranks[kind]=i+1;rows.set(row.chunk.id,item);}return [...rows.values()].sort((a,b)=>b.score-a.score||a.chunk.id.localeCompare(b.chunk.id)).slice(0,k);}
