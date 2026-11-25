import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {randomBytes} from 'node:crypto';
import {authorizedCorpus,inspectRetrieval,compareExperiments,runScenarios,roles} from './enterprise.mjs';
const assets=new Map([['/','index.html'],['/app.js','app.js'],['/style.css','style.css']]);
const types={'index.html':'text/html; charset=utf-8','app.js':'text/javascript; charset=utf-8','style.css':'text/css; charset=utf-8'};
export function createDashboard({port=4178}={}){
 if(!Number.isSafeInteger(port)||port<0||port>65535)throw Error('Invalid port');
 const token=randomBytes(32).toString('hex');
 const server=createServer(async(req,res)=>{
 const address=server.address(),host='127.0.0.1:'+address.port;
 res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','no-referrer');res.setHeader('Content-Security-Policy',"default-src 'none'; script-src 'self'; style-src 'self'; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'");
 const json=(status,data)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8'});res.end(JSON.stringify(data));};
 try{if(req.headers.host!==host||req.headers.origin&&req.headers.origin!=='http://'+host)return json(403,{error:'Origin denied'});if(req.method!=='GET')return json(405,{error:'Method denied'});const url=new URL(req.url,'http://'+host);
 if(assets.has(url.pathname)){const file=assets.get(url.pathname);res.writeHead(200,{'Content-Type':types[file]});return res.end(await readFile(new URL('../dashboard/'+file,import.meta.url)));}
 if(url.pathname==='/api/session')return json(200,{token,roles,synthetic:true});
 if(req.headers['x-ragops-token']!==token)return json(403,{error:'Session denied'});
 const role=url.searchParams.get('role')||'employee';
 if(url.pathname==='/api/documents')return json(200,authorizedCorpus(role));
 if(url.pathname==='/api/retrieve')return json(200,await inspectRetrieval({role,query:url.searchParams.get('q'),strategy:url.searchParams.get('strategy')||'lexical',k:Number(url.searchParams.get('k')||5),budget:Number(url.searchParams.get('budget')||400)}));
 if(url.pathname==='/api/experiments')return json(200,await compareExperiments());
 if(url.pathname==='/api/scenarios')return json(200,await runScenarios());
 return json(404,{error:'Not found'});
 }catch{return json(400,{error:'Invalid request'});}
 });server.requestTimeout=10000;server.headersTimeout=5000;server.maxHeadersCount=40;server.maxConnections=20;return {server,start:()=>new Promise((resolve,reject)=>{server.once('error',reject);server.listen(port,'127.0.0.1',()=>resolve(server.address()));})};
}
