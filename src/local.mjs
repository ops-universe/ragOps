import {open,realpath,lstat} from 'node:fs/promises';
import {constants} from 'node:fs';
import path from 'node:path';
import {ingest} from './core.mjs';
const MAX=1000000;
// Root must be a trusted directory not concurrently writable by an attacker.
export async function ingestFile(root,relative,{size,overlap}={}){
 if(typeof relative!=='string'||relative.length>1024||path.isAbsolute(relative)||relative.includes('\\')||relative.includes('\0')||relative.split('/').some(x=>!x||x==='.'||x==='..')||!['.txt','.md'].includes(path.extname(relative).toLowerCase()))throw Error('Invalid relative document path');
 const base=await realpath(root);let target=base;
 for(const segment of relative.split('/')){target=path.join(target,segment);if((await lstat(target)).isSymbolicLink())throw Error('Symlinks denied');}
 if(await realpath(target)!==target)throw Error('Unsafe path');
 const handle=await open(target,constants.O_RDONLY|constants.O_NOFOLLOW|constants.O_NONBLOCK);
 try{const stat=await handle.stat();if(!stat.isFile()||stat.size>MAX)throw Error('Invalid file size or type');
 const bytes=Buffer.alloc(MAX+1);let count=0;while(count<bytes.length){const {bytesRead}=await handle.read(bytes,count,bytes.length-count,null);if(!bytesRead)break;count+=bytesRead;}
 if(count>MAX)throw Error('File exceeds byte limit');const text=new TextDecoder('utf-8',{fatal:true}).decode(bytes.subarray(0,count));if(text.includes('\0'))throw Error('Binary content denied');return ingest(text,{source:relative,size,overlap});
 }finally{await handle.close();}
}
