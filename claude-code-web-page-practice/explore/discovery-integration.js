/* Games and titles share one provider typeahead; Explore keeps its local atlas. */
(function(){
 'use strict';var OS=window.OneSpace,D=window.OneSpaceDiscovery,P=window.OneSpaceProviderSearch;
 function titleOptions(root){root.querySelectorAll('option,.gv-pref-chip span,.mv-pref-chip span').forEach(function(el){var value=el.textContent;if(/^[a-z]/.test(value)){if(el.tagName==='OPTION'&&!el.hasAttribute('value'))el.setAttribute('value',value);el.textContent=D.label(value);}});}
 var scheduled=false;new MutationObserver(function(){if(scheduled)return;scheduled=true;requestAnimationFrame(function(){scheduled=false;titleOptions(document);});}).observe(document.body,{childList:true,subtree:true});
 var settings=document.querySelector('.settings-provider-status');
 if(settings){var credits=document.createElement('p');credits.className='provider-credit';credits.innerHTML='<img src="assets/provider-logos/tmdb.svg" width="70" style="height:auto" alt="TMDB"> Movie and series metadata: <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer">TMDB</a>. This product uses the TMDB API but is not endorsed or certified by TMDB. Game metadata: <a href="https://rawg.io" target="_blank" rel="noopener noreferrer">RAWG</a>. Search runs through your local server; saved records stay on this device.';
 var clear=document.createElement('button');clear.className='btn';clear.textContent='Clear discovery cache';clear.onclick=async function(){clear.disabled=true;try{await P.request('cache',null,'DELETE');D.clearCache();OS.showToast('Search cache cleared. Saved records are preserved.');}catch(e){OS.showToast(e.message);}finally{clear.disabled=false;P.status();}};settings.append(credits,clear);}
 titleOptions(document);
})();

