/* Dedicated disposable origin. MISSING_ASSET simulates an unavailable local image. */
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),port=Number(process.env.PORT || 18974);
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.json':'application/json'};
http.createServer((req,res)=>{
 let route;try{route=decodeURIComponent(req.url.split('?')[0]);}catch(_){res.writeHead(400);res.end();return;}
 const relative=route==='/'?'index.html':route.replace(/^\//,''),file=path.resolve(root,relative);
 if(!file.startsWith(root+path.sep) || relative===process.env.MISSING_ASSET){res.writeHead(404);res.end('Unavailable test asset');return;}
 fs.readFile(file,(err,data)=>{if(err){res.writeHead(404);res.end();return;}res.writeHead(200,{'Content-Type':types[path.extname(file)] || 'application/octet-stream','Cache-Control':'no-store'});res.end(data);});
}).listen(port,'127.0.0.1',()=>console.log('Disposable browser test server: http://localhost:'+port));
