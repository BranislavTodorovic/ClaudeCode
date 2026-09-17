(function(){
  'use strict';
  var OS=window.OneSpace,esc=OS.escapeHtml;
  window.OneSpaceShortcutUI={card:function(link,anchor,favorite,recent){
    function button(action,label,icon){return '<button class="btn" type="button" data-space-action="'+action+'" data-id="'+esc(link.id)+'" aria-label="'+esc(label+' '+link.name)+'" title="'+esc(label)+'"'+(action==='favorite'?' aria-pressed="'+favorite+'"':'')+'>'+OS.iconSvg(icon)+'</button>';}
    return '<div class="space-shortcut">'+anchor+'<div class="domain-actions">'+button('favorite',favorite?'Unfavorite':'Favorite','star')+(link.custom?button('edit','Edit','edit')+button('delete','Delete','trash'):'')+(recent?'<small>Recently opened</small>':'')+'</div></div>';
  }};
  document.addEventListener('click',function(e){var b=e.target.closest('[data-space-action]');if(!b)return;var action=b.dataset.spaceAction,id=b.dataset.id;if(action==='edit')OS.editShortcut(id);if(action==='delete')OS.deleteShortcut(id);if(action==='favorite'){OS.toggleFavorite(id);OS.renderSpaceShortcuts();var next=Array.from(document.querySelectorAll('[data-space-action="favorite"]')).find(function(x){return x.dataset.id===id && x.offsetParent;});if(next)next.focus();}});
  OS.renderSpaceShortcuts();
})();
