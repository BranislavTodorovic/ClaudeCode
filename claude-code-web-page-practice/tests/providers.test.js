const {test}=require('node:test'),assert=require('node:assert/strict');
const {createCatalog,normalize}=require('../server/providers/catalog');
const {createServer}=require('../server/_static-server');
test('provider records normalize to local discovery shapes without remote images or secrets',()=>{
 const series=normalize({id:42,name:'A Series',first_air_date:'2020-01-01',genre_ids:[18],number_of_seasons:2,poster_path:'/remote.jpg'},'series');
 assert.equal(series.kind,'series');assert.equal(series.year,2020);assert.deepEqual(series.genres,['Drama']);assert.equal(series.image,null);assert.equal(series.seasons,2);
 const game=normalize({id:8,name:'A Game',tags:[{name:'MMO'}],platforms:[{platform:{name:'PC'}}]},'game');assert.equal(game.trackerType,'weekly');assert.deepEqual(game.platforms,['PC']);
 assert.throws(()=>normalize({id:1},'movie'));
});
test('mock search exposes pagination, details, empty and all degraded states with no network',async()=>{
 const api=createCatalog({mock:true,fetcher:()=>{throw Error('Unexpected network');}});
 const first=await api.request('titles','search',{q:'Example'});assert.deepEqual(first.items.map(x=>x.kind),['series','movie']);assert.equal(first.nextPage,2);
 assert.equal((await api.request('titles','search',{q:'Example',page:2})).nextPage,null);
 assert.equal((await api.request('titles','search',{q:'empty'})).items.length,0);
 assert.equal((await api.request('titles','details',{kind:'series',id:'1'})).item.seasons,3);
 for(const code of ['offline','timeout','rate-limit','authentication','provider-error'])await assert.rejects(api.request('games','search',{q:code}),e=>e.code===code);
 await assert.rejects(createCatalog({keys:{}}).request('titles','search',{q:'X'}),e=>e.code==='configuration-error');
});
test('provider cache expires, clears, and respects cancellation',async()=>{
 let time=0;const api=createCatalog({mock:true,now:()=>time,ttl:100});
 await api.request('games','search',{q:'Test'});assert.equal((await api.request('games','search',{q:'Test'})).cached,true);time=101;assert.equal((await api.request('games','search',{q:'Test'})).cached,false);api.clear();assert.equal(api.status().cacheEntries,0);
 const controller=new AbortController();controller.abort();await assert.rejects(api.request('games','search',{q:'Test'},controller.signal),e=>e.name==='AbortError');
});
test('real transport maps timeout, rate limit, auth, offline and malformed payload without leaking credentials',async()=>{
 const keys={TMDB_API_KEY:'test-secret-key'};
 for(const [status,code] of [[429,'rate-limit'],[401,'authentication'],[503,'provider-error']])await assert.rejects(createCatalog({keys,fetcher:async()=>({ok:false,status})}).request('titles','search',{q:'Test'}),e=>e.code===code&&!e.message.includes(keys.TMDB_API_KEY));
 await assert.rejects(createCatalog({keys,fetcher:async()=>{throw Error('socket');}}).request('titles','search',{q:'Test'}),e=>e.code==='offline');
 await assert.rejects(createCatalog({keys,timeout:5,fetcher:(_,{signal})=>new Promise((_,reject)=>signal.addEventListener('abort',()=>reject(Error('abort'))))}).request('titles','search',{q:'Test'}),e=>e.code==='timeout');
 await assert.rejects(createCatalog({keys,fetcher:async()=>({ok:true,json:async()=>({})})}).request('titles','search',{q:'Test'}),e=>e.code==='provider-error');
});
test('API serves neutral records, protects mutations and never exposes credentials',async()=>{
 const server=createServer({providerOptions:{mock:true}});await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
 try{const result=await(await fetch(base+'/api/search/games?q=Test')).json();assert.equal(result.items[0].kind,'game');assert.equal((await fetch(base+'/api/details/series/1')).status,200);assert.equal((await fetch(base+'/api/cache',{method:'DELETE',headers:{Origin:'https://evil.test'}})).status,403);assert.equal((await fetch(base+'/api/cache',{method:'DELETE'})).status,200);assert.equal((await fetch(base+'/api/details/movie/not-numeric')).status,404);assert.equal((await fetch(base+'/config/secrets/api-keys.json')).status,404);}finally{server.closeAllConnections();await new Promise(r=>server.close(r));}
});
