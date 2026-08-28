#!/usr/bin/env node
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const raw = process.argv.slice(2); const args = {};
for (let i=0;i<raw.length;i+=2) args[raw[i]?.replace(/^--/,'')] = raw[i+1];
if (!args.platform || !args.step || !['pass','blocked'].includes(args.result)) process.exit(2);
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const receipt={schema:'vdai.install-proof.v1',product:'VDAI OS',version:'0.1.0',platform:String(args.platform).slice(0,32),step:String(args.step).slice(0,64),result:args.result,localOnly:true,sharedAccessProved:false,secretsIncluded:false,createdAt:new Date().toISOString(),supportUrl:`https://t.me/vdai_club_bot?start=os_${encodeURIComponent(String(args.platform).slice(0,16))}`};
const output=resolve(root,'runtime','install-proof.json'); mkdirSync(dirname(output),{recursive:true}); writeFileSync(output,JSON.stringify(receipt,null,2)+'\n',{mode:0o600}); console.log(output);
