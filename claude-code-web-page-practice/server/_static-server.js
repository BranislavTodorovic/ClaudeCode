'use strict';
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
function createServer({root=path.resolve(__dirname,'..')}={}){
 const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.ico':'image/x-icon','.woff2':'font/woff2'};
 return http.createServer((req,res)=>{
  const fail=(code)=>{res.writeHead(code,{'Content-Type':'text/plain'});res.end('Not found');};
  try{
   if(!/^(localhost|127\.0\.0\.1)(:\d+)?$/.test(req.headers.host||''))return fail(403);
   if(req.method!=='GET'&&req.method!=='HEAD')return fail(405);
   const decoded=decodeURIComponent(new URL(req.url,'http://localhost').pathname),parts=decoded.split(/[\\/]+/);
   if(parts.some(x=>x.startsWith('.')||['tests','node_modules','outputs','api','server','config','secrets'].includes(x))||decoded==='/_static-server.js')return fail(404);
   const file=path.resolve(root,'.'+(decoded==='/'?'/index.html':decoded));
   if(!file.startsWith(path.resolve(root)+path.sep)||!mime[path.extname(file)])return fail(404);
   fs.readFile(file,(err,data)=>{if(err)return fail(404);res.writeHead(200,{'Content-Type':mime[path.extname(file)],'X-Content-Type-Options':'nosniff'});res.end(req.method==='HEAD'?undefined:data);});
  }catch(e){fail(400);}
 });
}
if(require.main===module)createServer().listen(Number(process.env.PORT)||8973,'127.0.0.1',()=>console.log('Local OneSpace at http://localhost:'+(process.env.PORT||8973)));
module.exports={createServer};
