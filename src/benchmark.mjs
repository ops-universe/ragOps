import {compareExperiments} from './experiments.mjs';try{console.log(JSON.stringify(await compareExperiments(),null,2));}catch(e){console.error(e.message);process.exitCode=1;}
