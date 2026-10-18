import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
http.createServer(async(req,res)=>{try{
 const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname),file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
 if(!file.startsWith(root)||path.relative(root,file).split(path.sep).some(p=>p.startsWith('.')))throw new Error('Forbidden');
 const type={'.html':'text/html','.css':'text/css','.js':'text/javascript','.json':'application/json','.md':'text/plain'}[path.extname(file)]||'application/octet-stream';
 res.writeHead(200,{'Content-Type':type+'; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(await fs.readFile(file));
 }catch{res.writeHead(404);res.end('Not found');}}).listen(4174,'127.0.0.1',()=>console.log('QuantDesk public demo: http://localhost:4174'));
