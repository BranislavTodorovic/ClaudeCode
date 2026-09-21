'use strict';
const {createCatalog}=require('./providers/catalog');
function createApi(options){const catalog=createCatalog(options);return async function(req,res,url){
 const send=(status,body)=>{if(res.destroyed)return;res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(body));};
 if(req.headers.origin&&req.headers.origin!=='http://'+req.headers.host)return send(403,{code:'forbidden',message:'Same-origin requests only.'});
 if(url.pathname==='/api/cache'&&req.method==='DELETE'){catalog.clear();return send(200,{cleared:true});}
 if(req.method!=='GET')return send(405,{code:'method',message:'Method not allowed.'});
 if(url.pathname==='/api/status')return send(200,catalog.status());
 const search=url.pathname.match(/^\/api\/search\/(titles|games)$/),detail=url.pathname.match(/^\/api\/details\/(movie|series|game)\/(\d+)$/);
 if(!search&&!detail)return send(404,{code:'not-found',message:'Unknown API route.'});
 const controller=new AbortController();res.on('close',()=>{if(!res.writableEnded)controller.abort();});
 try{send(200,await catalog.request(search?search[1]:detail[1]==='game'?'games':'titles',search?'search':'details',search?Object.fromEntries(url.searchParams):{kind:detail[1],id:detail[2]},controller.signal));}catch(e){if(e.name!=='AbortError')send(e.status||502,{code:e.code||'provider-error',message:e.message});}
 };}
module.exports={createApi};
