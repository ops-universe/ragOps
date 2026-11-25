import {createHash} from 'node:crypto';
const hash=s=>createHash('sha256').update(s).digest('hex');
const tokens=s=>s.toLowerCase().match(/[\p{L}\p{N}]+/gu)||[];
export function ingest(text,{source='memory',size=500,overlap=50}={}){
 if(typeof text!=='string'||text.length>1000000||!text.trim())throw Error('Invalid document');
 if(typeof source!=='string'||source.length>1024||!source.trim())throw Error('Invalid source');
 if(!Number.isSafeInteger(size)||size<32||size>4096||!Number.isSafeInteger(overlap)||overlap<0||overlap>=size||Math.ceil(text.length/(size-overlap))>10000)throw Error('Invalid chunk configuration');
 const contentHash=hash(text),id=hash(JSON.stringify([source,contentHash]));
 const chunks=[];for(let start=0;start<text.length;start+=size-overlap){const end=Math.min(start+size,text.length);chunks.push({schemaVersion:1,id:hash(JSON.stringify([id,start,end])),documentId:id,source,start,end,text:text.slice(start,end),trust:'untrusted'});if(end===text.length)break;}
 return {schemaVersion:1,id,source,contentHash,chunks};
}
export function validateDocument(d){
 if(!d||d.schemaVersion!==1||typeof d.source!=='string'||!d.source.trim()||d.source.length>1024||typeof d.contentHash!=='string'||!/^[a-f0-9]{64}$/.test(d.contentHash)||d.id!==hash(JSON.stringify([d.source,d.contentHash]))||!Array.isArray(d.chunks)||!d.chunks.length||d.chunks.length>10000)throw Error('Invalid document contract');
 let reconstructed='',previousStart=-1;for(const c of d.chunks){
 if(!c||c.schemaVersion!==1||c.documentId!==d.id||c.source!==d.source||c.trust!=='untrusted'||!Number.isSafeInteger(c.start)||!Number.isSafeInteger(c.end)||c.start<0||c.start<=previousStart||c.start>reconstructed.length||c.end<=c.start||c.end>1000000||typeof c.text!=='string'||c.text.length!==c.end-c.start||c.text.length>4096||c.id!==hash(JSON.stringify([d.id,c.start,c.end])))throw Error('Invalid chunk contract');
 const overlap=reconstructed.length-c.start;if(overlap>=c.text.length||reconstructed.slice(c.start)!==c.text.slice(0,overlap))throw Error('Invalid chunk overlap');
 reconstructed+=c.text.slice(overlap);previousStart=c.start;
 }
 if(hash(reconstructed)!==d.contentHash||!reconstructed.trim())throw Error('Document hash mismatch');
 return d;
}
export function collectChunks(documents,{source}={}){
 if(!Array.isArray(documents)||documents.length>1000||(source!==undefined&&(typeof source!=='string'||source.length>1024)))throw Error('Invalid corpus options');
 let count=0,chars=0;for(const d of documents){validateDocument(d);count+=d.chunks.length;for(const c of d.chunks)chars+=c.text.length;if(count>10000||chars>8000000)throw Error('Index limit exceeded');}
 const seen=new Set(),chunks=[];for(const d of [...documents].sort((a,b)=>a.id.localeCompare(b.id))){if(source!==undefined&&d.source!==source)continue;if(seen.has(d.contentHash))continue;seen.add(d.contentHash);chunks.push(...d.chunks);}
 return chunks;
}
export function retrieve(documents,query,{k=5,source}={}){
 if(!Array.isArray(documents)||documents.length>1000||typeof query!=='string'||query.length>4096||!Number.isSafeInteger(k)||k<1||k>100)throw Error('Invalid retrieval options');
 const chunks=collectChunks(documents,{source});
 const terms=[...new Set(tokens(query))];const rows=chunks.map(chunk=>{const words=tokens(chunk.text),freq=new Map();for(const w of words)freq.set(w,(freq.get(w)||0)+1);return {chunk,length:words.length,freq};});const avg=rows.reduce((s,r)=>s+r.length,0)/Math.max(1,rows.length)||1;
 const dfs=new Map(terms.map(t=>[t,rows.filter(r=>r.freq.has(t)).length]));
 return rows.map(({chunk,length,freq})=>{let score=0;for(const t of terms){const f=freq.get(t)||0,df=dfs.get(t);score+=Math.log(1+(rows.length-df+.5)/(df+.5))*f*2.2/(f+1.2*(.25+.75*length/avg));}return {schemaVersion:1,chunk,score};}).filter(r=>r.score>0).sort((a,b)=>b.score-a.score||a.chunk.id.localeCompare(b.chunk.id)).slice(0,k);
}
