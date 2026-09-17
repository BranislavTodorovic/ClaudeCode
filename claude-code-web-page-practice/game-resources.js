(function(root,factory){var api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.OneSpaceGameResources=api;})(typeof window!=='undefined'?window:this,function(){
  'use strict';
  var official={
    'Diablo Immortal':'https://diabloimmortal.blizzard.com/',
    'Alan Wake 2':'https://www.alanwake.com/',
    'Hades':'https://www.supergiantgames.com/games/hades/',
    'Stardew Valley':'https://www.stardewvalley.net/',
    'Baldur\'s Gate 3':'https://baldursgate3.game/',
    'Elden Ring':'https://en.bandainamcoent.eu/elden-ring/elden-ring',
    'Genshin Impact':'https://genshin.hoyoverse.com/'
  };
  function resources(game){
    if(Array.isArray(game.resources))return game.resources;
    var name=game.title || game.name,q=encodeURIComponent(name),links=[
      {group:'Platform',label:'Find '+name+' on Steam',url:'https://store.steampowered.com/search/?term='+q},
      {group:'News / updates',label:'Search Steam news for '+name,url:'https://store.steampowered.com/news/search/?term='+q},
      {group:'Builds / guides',label:'Search community guides for '+name,url:'https://steamcommunity.com/discussions/forum/search/?q='+encodeURIComponent(name+' guide')},
      {group:'Community',label:'Find '+name+' communities',url:'https://www.reddit.com/search/?q='+q}
    ];
    if(official[name])links.unshift({group:'Official',label:'Official '+name+' website',url:official[name]});
    if(name==='Diablo Immortal')links=links.filter(function(l){return l.group!=='Platform'&&l.group!=='Builds / guides'&&l.group!=='News / updates';}).concat([{group:'News / updates',label:'Blizzard news',url:'https://news.blizzard.com/diablo-immortal'},{group:'Builds / guides',label:'Icy Veins builds and guides',url:'https://www.icy-veins.com/diablo-immortal/'},{group:'Platform',label:'Battle.net',url:'https://www.battle.net/'}]);
    return links;
  }
  function tasks(game){var type=game.trackerType || 'story';if(game.defaultTaskTemplates && game.defaultTaskTemplates[type])return game.defaultTaskTemplates[type].slice();if(game.defaultTasks && game.defaultTasks.length)return game.defaultTasks.slice();var genres=(game.genres || [game.genre || '']).join(' ').toLowerCase();if(game.trackerType==='weekly')return ['Choose a goal for this week','Complete a daily session','Review this week’s progress'];if(/racing/.test(genres))return ['Complete an introductory race','Tune a vehicle for your next event','Finish a championship'];if(/strategy|sim|farm/.test(genres))return ['Plan your first milestone','Build a sustainable setup','Complete a seasonal goal'];if(/horror/.test(genres))return ['Finish the opening chapter','Explore and collect useful resources','Complete the next story chapter'];return ['Learn the core mechanics','Complete the first major objective','Explore an optional challenge'];}
  function story(game,uid){return {chapters:[{id:uid('chapter'),title:'Your first milestones',expanded:true,objectives:tasks(game).map(function(t){return {id:uid('objective'),text:t,done:false};})}]};}
  function weekly(game){return tasks(game).map(function(t,i){return {id:'default-'+i,label:t,done:false};});}
  function cleanup(state,id){var next=JSON.parse(JSON.stringify(state));next.library=next.library.filter(function(g){return g.id!==id;});delete next.weekly[id];next.sessions=next.sessions.filter(function(s){return s.gameId!==id;});next.journal.forEach(function(j){if(j.gameId===id)j.gameId=null;});return next;}
  return {resources:resources,tasks:tasks,story:story,weekly:weekly,cleanup:cleanup};
});
