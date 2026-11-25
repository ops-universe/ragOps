import {open,rename,unlink} from 'node:fs/promises';
import {randomUUID} from 'node:crypto';
import {collectChunks} from './core.mjs';
const LIMIT=16000000;
export function encodeIndex(documents){collectChunks(documents);const encoded=JSON.stringify({schemaVersion:1,documents});if(Buffer.byteLength(encoded)>LIMIT)throw Error('Index byte limit');return encoded;}
export function decodeIndex(encoded){if(typeof encoded!=='string'||Buffer.byteLength(encoded)>LIMIT)throw Error('Index byte limit');const data=JSON.parse(encoded);if(!data||data.schemaVersion!==1)throw Error('Invalid index version');collectChunks(data.documents);return data.documents;}
export async function saveIndex(filename,documents){const encoded=encodeIndex(documents),temp=filename+'.'+randomUUID()+'.tmp';let handle;try{handle=await open(temp,'wx',0o600);await handle.writeFile(encoded,'utf8');await handle.sync();await handle.close();handle=undefined;await rename(temp,filename);}finally{if(handle)await handle.close();await unlink(temp).catch(e=>{if(e.code!=='ENOENT')throw e;});}}
export async function loadIndex(filename){const handle=await open(filename,'r');try{const stat=await handle.stat();if(!stat.isFile()||stat.size>LIMIT)throw Error('Invalid index file');const bytes=Buffer.alloc(LIMIT+1);let count=0;while(count<bytes.length){const {bytesRead}=await handle.read(bytes,count,bytes.length-count,null);if(!bytesRead)break;count+=bytesRead;}if(count>LIMIT)throw Error('Index byte limit');return decodeIndex(new TextDecoder('utf-8',{fatal:true}).decode(bytes.subarray(0,count)));}finally{await handle.close();}}
