'use strict';
// Only this server module knows provider payloads and credentials.
const fs=require('node:fs'),path=require('node:path');
const names=a=>(Array.isArray(a)?a:[]).map(x=>String(x?.name||x||'').slice(0,80)).filter(Boolean).slice(0,30);
const text=(v,n=5000)=>String(v||'').replace(/<[^>]*>/g,'').slice(0,n);
const genreNames={28:'Action',12:'Adventure',16:'Animation',35:'Comedy',80:'Crime',99:'Documentary',18:'Drama',10751:'Family',14:'Fantasy',36:'History',27:'Horror',10402:'Music',9648:'Mystery',10749:'Romance',878:'Science fiction',10770:'TV movie',53:'Thriller',10752:'War',37:'Western',10759:'Action & Adventure',10765:'Science fiction & Fantasy'};
function normalize(raw,kind){
 if(!raw||!Number.isSafeInteger(Number(raw.id))||Number(raw.id)<1)throw error('provider-error','The provider returned an invalid record.');
 const game=kind==='game',series=kind==='series',id=String(raw.id),released=raw.released||raw.release_date||raw.first_air_date||'',tags=names(raw.tags),genres=names(raw.genres?.length?raw.genres:(raw.genre_ids||[]).map(x=>genreNames[x]).filter(Boolean));
 const item={id:(game?'rawg-':'tmdb-'+kind+'-')+id,kind,name:text(raw.title||raw.name,160),description:text(raw.description_raw||raw.overview||raw.description),genres,tags,platforms:game?names((raw.platforms||[]).map(x=>x.platform)):[],year:/^\d{4}/.test(released)?Number(released.slice(0,4)):null,released,runtime:game?null:Number(raw.runtime||raw.episode_run_time?.[0])||null,rating:Math.min(10,Math.max(0,Number(game?raw.rating*2:raw.vote_average)||0)),seasons:series?Number(raw.number_of_seasons)||null:null,episodes:series?Number(raw.number_of_episodes)||null:null,language:text(raw.original_language,80),developers:names(raw.developers),publishers:names(raw.publishers),image:null,photos:[],website:/^https?:\/\//.test(raw.homepage||raw.website||'')?(raw.homepage||raw.website):'',source:{name:game?'RAWG':'TMDB',url:game?'https://rawg.io/games/'+encodeURIComponent(raw.slug||id):'https://www.themoviedb.org/'+(series?'tv':'movie')+'/'+id,license:game?'Game metadata from RAWG.':'This product uses the TMDB API but is not endorsed or certified by TMDB.'}};
 if(!item.name)throw error('provider-error','The provider returned an unnamed record.');
 if(game)item.trackerType=/live.service|mmo|looter|gacha|battle.royale/i.test([...tags,...genres].join(' '))?'weekly':'story';
 return item;
}
function error(code,message,status=502){return Object.assign(new Error(message),{code,status});}
function credentials(root){try{return JSON.parse(fs.readFileSync(path.join(root,'config/secrets/api-keys.json'),'utf8'));}catch(_){return {};}}
function createCatalog({root=path.resolve(__dirname,'../..'),keys=credentials(root),fetcher=fetch,timeout=8000,ttl=120000,now=Date.now,mock=false}={}){
 const cache=new Map();
 const configured=k=>typeof keys[k]==='string'&&keys[k].length>8&&!/YOUR_|PLACEHOLDER|replace/i.test(keys[k]);
 function status(){return {mode:mock?'mock':'live',titles:mock||configured('TMDB_API_KEY')?'configured':'configuration-error',games:mock||configured('RAWG_API_KEY')?'configured':'configuration-error',cacheEntries:cache.size};}
 async function request(domain,action,params={},signal){
  if(signal?.aborted)throw Object.assign(new Error('Cancelled'),{name:'AbortError'});
  const game=domain==='games',page=Number(params.page||1),q=String(params.q||'').trim(),kind=game?'game':params.kind;
  if(!['titles','games'].includes(domain)||!['search','details'].includes(action)||!Number.isInteger(page)||page<1||page>500||q.length>200)throw error('invalid-request','Invalid search request.',400);
  if(action==='search'&&!q)return {items:[],nextPage:null,total:0,mode:mock?'mock':'live',cached:false};
  if(action==='details'&&(!['movie','series','game'].includes(kind)||!/^\d+$/.test(params.id||'')))throw error('invalid-request','Invalid detail request.',400);
  if(!mock&&status()[domain]!=='configured')throw error('configuration-error',(game?'Game':'Movie and series')+' search is not configured. Your local catalog remains available.',503);
  const cacheKey=JSON.stringify([domain,action,params]),hit=cache.get(cacheKey);if(hit&&hit.expires>now())return {...structuredClone(hit.value),cached:true};
  const controller=new AbortController(),cancel=()=>controller.abort(signal?.reason);signal?.addEventListener('abort',cancel,{once:true});
  const timer=setTimeout(()=>controller.abort('timeout'),timeout);
  try{
   let result;
   if(mock){
    if(['offline','timeout','rate-limit','authentication','provider-error'].includes(q))throw error(q,'Mock '+q+' response.',q==='rate-limit'?429:503);
    if(action==='details')result={item:normalize(game?{id:Number(params.id),name:'Mock Game '+params.id,tags:[{name:'MMO'}]}:{id:Number(params.id),title:kind==='movie'?'Mock Movie':undefined,name:'Mock Series',number_of_seasons:3,overview:'Local mock details for acceptance testing.'},kind)};
    else result={items:q==='empty'?[]:Array.from({length:2},(_,i)=>normalize(game?{id:(page-1)*2+i+1,name:'Mock '+q+' '+((page-1)*2+i+1),tags:[{name:i?'Single-player':'MMO'}]}:{id:(page-1)*2+i+1,title:i?'Mock '+q+' Movie':undefined,name:'Mock '+q+' Series',media_type:i?'movie':'tv',overview:'Mock search result.'},game?'game':i?'movie':'series')),nextPage:q!=='empty'&&page<2?page+1:null,total:q==='empty'?0:4};
   }else{
    const type=kind==='series'?'tv':'movie';
    const url=new URL(game?'https://api.rawg.io/api/games'+(action==='details'?'/'+params.id:''):'https://api.themoviedb.org/3/'+(action==='search'?'search/multi':type+'/'+params.id));
    url.searchParams.set(game?'key':'api_key',keys[game?'RAWG_API_KEY':'TMDB_API_KEY']);
    if(action==='search'){url.searchParams.set(game?'search':'query',q);url.searchParams.set('page',String(page));if(game)url.searchParams.set('page_size','20');else url.searchParams.set('include_adult','false');}
    let response;try{response=await fetcher(url,{signal:controller.signal});}catch(e){if(controller.signal.aborted)throw e;throw error('offline','The provider could not be reached. Your local catalog remains available.',503);}
    if(!response.ok)throw error(response.status===429?'rate-limit':[401,403].includes(response.status)?'authentication':'provider-error',response.status===429?'Search limit reached. Please try again later.':[401,403].includes(response.status)?'Provider authentication failed. Check the server configuration.':'The provider could not complete this request.',response.status===429?429:502);
    let data;try{data=await response.json();}catch(_){throw error('provider-error','The provider returned an unreadable response.');}
    if(action==='details')result={item:normalize(data,kind)};
    else{if(!Array.isArray(data.results))throw error('provider-error','The provider returned an invalid result list.');result={items:data.results.filter(x=>game||['movie','tv'].includes(x.media_type)).map(x=>normalize(x,game?'game':x.media_type==='tv'?'series':'movie')),total:Number(data.count??data.total_results)||0,nextPage:(game?!!data.next:page<Number(data.total_pages))&&page<500?page+1:null};}
   }
   result={...result,mode:mock?'mock':'live',cached:false};if(cache.size>=200)cache.clear();cache.set(cacheKey,{value:structuredClone(result),expires:now()+ttl});return result;
  }catch(e){if(signal?.aborted)throw Object.assign(new Error('Cancelled'),{name:'AbortError'});if(controller.signal.aborted)throw error('timeout','Search timed out. Please try again.',504);throw e.code?e:error('provider-error','The provider could not complete this request.');}
  finally{clearTimeout(timer);signal?.removeEventListener('abort',cancel);}
 }
 return {request,status,clear:()=>cache.clear()};
}
module.exports={createCatalog,normalize};
