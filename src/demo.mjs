import {ingest,retrieve} from './core.mjs';
const docs=[ingest('Employees request vacation through the HR portal.',{source:'synthetic-hr'}),ingest('The product catalog includes emerald notebooks.',{source:'synthetic-catalog'})];console.log(JSON.stringify(retrieve(docs,process.argv.slice(2).join(' ')||'vacation'),null,2));
