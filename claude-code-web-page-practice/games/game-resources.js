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
  function tasks(game){var type=game.trackerType || 'story';if(game.defaultTaskTemplates && game.defaultTaskTemplates[type])return game.defaultTaskTemplates[type].slice();if(type==='weekly')return game.weeklyTemplate?.length?game.weeklyTemplate.map(function(t){return t.label;}):['Choose a goal for this week','Complete a daily session','Review this week’s progress'];if(game.defaultTasks && game.defaultTasks.length)return game.defaultTasks.slice();var genres=(game.genres || [game.genre || '']).join(' ').toLowerCase();if(game.trackerType==='weekly')return ['Choose a goal for this week','Complete a daily session','Review this week’s progress'];if(/racing/.test(genres))return ['Complete an introductory race','Tune a vehicle for your next event','Finish a championship'];if(/strategy|sim|farm/.test(genres))return ['Plan your first milestone','Build a sustainable setup','Complete a seasonal goal'];if(/horror/.test(genres))return ['Finish the opening chapter','Explore and collect useful resources','Complete the next story chapter'];return ['Learn the core mechanics','Complete the first major objective','Explore an optional challenge'];}
  function infer(game){if(['story','weekly'].includes(game.trackerType))return game.trackerType;var tags=[game.genre].concat(game.genres||[],game.tags||[],game.playstyles||[]).join(' ');return /live.service|mmo|looter|gacha|battle.royale/i.test(tags)?'weekly':'story';}
  // Editable progress milestones, rather than a claim to reproduce an official quest log.
  var outlines={
   'Hades':[['Tartarus','Find a weapon and boon combination'],['Asphodel and Elysium','Reach the champions with a reliable build'],['The surface','Complete an escape attempt']],
   'Hollow Knight':[['Forgotten Crossroads','Explore the crossroads and defeat the False Knight'],['Greenpath','Find Hornet and unlock a new movement ability'],['City of Tears','Explore the city and strengthen your nail'],['The Dreamers','Find the Dreamers and return to the Black Egg']],
   'Elden Ring':[['Limgrave','Explore Limgrave and prepare for Stormveil'],['Liurnia','Find a route into Raya Lucaria'],['Altus and Leyndell','Reach the capital and follow the main journey'],['The final journey','Explore the late-game regions and complete your chosen ending']],
   'God of War Ragnarök':[['Fimbulwinter','Begin the journey with Kratos and Atreus'],['Across the realms','Follow the main quests and unlock new realms'],['Preparing for Ragnarök','Strengthen equipment and finish companion quests'],['Ragnarök','Complete the final story battles']],
   "Baldur's Gate 3":[['Act I: The wilderness','Gather companions and resolve the grove conflict'],['Act II: Shadow-cursed lands','Explore the shadow curse and Moonrise Towers'],["Act III: Baldur's Gate",'Resolve companion stories and the final conflict']],
   'Stardew Valley':[['First spring','Plant crops and meet your neighbors'],['Summer and autumn','Expand the farm and complete seasonal bundles'],['Winter and beyond','Upgrade tools and plan the next farming year']],
   'It Takes Two':[['The shed and the tree','Master the first co-op tools together'],['Rose’s room and the clock','Complete the toy and time challenges'],['Snow, garden and attic','Finish the final co-op chapters']],
   'Dead Cells':[['Prison and promenade','Build a route and learn enemy patterns'],['The first bosses','Defeat a boss and unlock permanent upgrades'],['The castle','Reach the late-game biomes and complete a run']],
   'Outer Wilds':[['Timber Hearth','Prepare for launch and learn the time loop'],['The solar system','Follow the ship log across the planets'],['The final expedition','Connect the discoveries and complete the journey']],
   'Persona 5 Royal':[['The first palaces','Build your party and complete the opening heists'],['The Phantom Thieves','Balance confidants with the middle palace missions'],['The final heists','Finish the main story and pursue the additional semester']]
  };
  function outline(game){if(game.chapterOutline?.length)return game.chapterOutline;if(game.story?.chapters?.length)return game.story.chapters.map(function(c){return {title:c.title,objectives:c.objectives.map(function(o){return o.text;})};});var rows=outlines[game.name||game.title];return rows?rows.map(function(row){return {title:row[0],objectives:row.slice(1)};}):[];}
  function story(game,uid){var chapters=outline(game);if(!chapters.length)chapters=tasks(Object.assign({},game,{trackerType:'story'})).map(function(t,i){return {title:['Getting started','The main journey','Further challenges'][i]||'Next milestone',objectives:[t]};});return {chapters:chapters.map(function(c,i){return {id:uid('chapter'),title:c.title,expanded:i===0,objectives:c.objectives.map(function(t){return {id:uid('objective'),text:t,done:false};})};})};}
  function reconcile(game,weekly,type,uid){var previous=game.trackerType;game.trackerArchive=game.trackerArchive||{};if(type==='weekly'){if(game.story?.chapters?.length)game.trackerArchive.story=JSON.parse(JSON.stringify(game.story));delete game.story;if(!weekly[game.id]&&game.trackerArchive.weekly)weekly[game.id]=JSON.parse(JSON.stringify(game.trackerArchive.weekly));}else{if(weekly[game.id])game.trackerArchive.weekly=JSON.parse(JSON.stringify(weekly[game.id]));delete weekly[game.id];if(previous!=='story'||!game.story?.chapters?.length)game.story=game.trackerArchive.story?JSON.parse(JSON.stringify(game.trackerArchive.story)):game.story?.chapters?.length?game.story:story(game,uid);}game.trackerType=type;return game;}
  function weekly(game){if(game.weeklyTemplate?.length)return game.weeklyTemplate.map(function(t){return {id:t.id,label:t.label,done:false};});return tasks(Object.assign({},game,{trackerType:'weekly'})).map(function(t,i){return {id:'default-'+i,label:t,done:false};});}
  function cleanup(state,id){var next=JSON.parse(JSON.stringify(state));next.library=next.library.filter(function(g){return g.id!==id;});delete next.weekly[id];next.sessions=next.sessions.filter(function(s){return s.gameId!==id;});next.journal.forEach(function(j){if(j.gameId===id)j.gameId=null;});return next;}
  return {infer:infer,outline:outline,reconcile:reconcile,resources:resources,tasks:tasks,story:story,weekly:weekly,cleanup:cleanup};
});
