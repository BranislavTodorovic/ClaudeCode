/* Pure lifecycle operations and the Work page; all writes cross OneSpaceStorage. */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else { root.OneSpaceWork = api; api.mount(root); }
})(typeof window !== 'undefined' ? window : this, function () {
  'use strict';
  var keys = { items:'orbit-work-items', tasks:'orbit-work-tasks', history:'orbit-work-history' };
  var statuses = ['open','in-progress','blocked','closed'], priorities = ['low','medium','high','urgent'];
  function due(value, now) {
    if (!value) return '';
    var end = new Date(value + 'T23:59:59').getTime(), delta = end - new Date(now || Date.now()).getTime();
    return delta < 0 ? 'overdue' : delta <= 3 * 86400000 ? 'due-soon' : 'later';
  }
  function lifecycle(state, itemId, status, at, eventId) {
    if (!statuses.includes(status)) throw new Error('Invalid status');
    var next = JSON.parse(JSON.stringify(state)), item = next.items.find(function (i) { return i.id === itemId; });
    if (!item) throw new Error('Work item not found');
    if (item.status === status) return next;
    var action = status === 'closed' ? 'closed' : item.status === 'closed' ? 'reopened' : 'updated';
    item.status = status; item.updatedAt = at; item.completedAt = status === 'closed' ? at : null;
    if (status === 'closed') next.tasks.forEach(function (t) { if (t.itemId === itemId && !t.done) { t.done = true; t.completedAt = at; t.updatedAt = at; } });
    next.history.unshift({ id:eventId, itemId:item.id, projectId:item.projectId, name:item.name, action:action, at:at, snapshot:JSON.parse(JSON.stringify(item)), tasks:next.tasks.filter(function(t){return t.itemId === itemId;}).map(function(t){return Object.assign({},t);}) });
    return next;
  }
  function filter(items, filters, now) {
    return items.filter(function (i) {
      return (!filters.project || i.projectId === filters.project) && (!filters.type || i.type === filters.type) && (!filters.status || i.status === filters.status) && (!filters.priority || i.priority === filters.priority) && (!filters.deadline || due(i.deadline,now) === filters.deadline) && (!filters.search || [i.name,i.analysis,i.plan,i.execution,(i.labels || []).join(' ')].join(' ').toLowerCase().includes(filters.search.toLowerCase())) && (filters.view === 'backlog' ? i.status === 'closed' : i.status !== 'closed');
    }).sort(function (a,b) { return priorities.indexOf(b.priority) - priorities.indexOf(a.priority) || (a.deadline || '9999').localeCompare(b.deadline || '9999') || a.createdAt.localeCompare(b.createdAt); });
  }
  function mount(root) {
    var OS = root.OneSpace, UI = root.OneSpaceUI, esc = OS.escapeHtml;
    var host = document.getElementById('workTracker'); if (!host) return;
    var selected = null, notified = new Set(), filters = { view:'active' };
    function read() { return { items:OS.safeGetJSON(keys.items,[]), tasks:OS.safeGetJSON(keys.tasks,[]), history:OS.safeGetJSON(keys.history,[]) }; }
    function projects() { return OS.safeGetJSON('orbit-work-projects',[]); }
    function commit(state, message, extra) {
      var data = extra || {}; Object.keys(keys).forEach(function (k) { data[keys[k]] = JSON.stringify(state[k]); });
      try { Object.keys(data).forEach(function(k){var raw = OS.safeGet(k); if (!root.OneSpaceStorage.valid(k,raw)) throw new Error('Stored data needs recovery. Export a backup first.');}); root.OneSpaceStorage.transaction(root.localStorage,data); }
      catch (error) { OS.showToast(error.message); return false; }
      Object.keys(data).forEach(function (k) { document.dispatchEvent(new CustomEvent('onespace:data-changed',{detail:{key:k}})); });
      render(); if (message) OS.showToast(message); return true;
    }
    function log(state,item,action) { state.history.unshift({id:OS.uid('event'),itemId:item.id,projectId:item.projectId,name:item.name,action:action,at:new Date().toISOString(),snapshot:Object.assign({},item),tasks:state.tasks.filter(function(t){return t.itemId===item.id;}).map(function(t){return Object.assign({},t);})}); }
    function badge(date) { var d = due(date); return date ? '<span class="status-chip deadline-' + d + '">' + esc(d.replace('-',' ')) + ' · ' + esc(date) + '</span>' : ''; }
    function button(action,id,label,icon) { return '<button class="btn" type="button" data-work-action="' + action + '" data-id="' + esc(id || '') + '">' + OS.iconSvg(icon || 'edit') + esc(label) + '</button>'; }
    function projectLabel(id) { var p=projects().find(function(x){return x.id===id;}); return p ? p.name : 'Archived project'; }
    function render() {
      var state=read(), active=state.items.filter(function(i){return i.status !== 'closed';});
      var focus=document.activeElement, focusAction=focus && focus.dataset.workAction, focusId=focus && focus.dataset.id;
      document.getElementById('workOverview').innerHTML = [['Active items',active.length],['Blocked',active.filter(function(i){return i.status==='blocked';}).length],['Overdue',active.filter(function(i){return due(i.deadline)==='overdue';}).length]].map(function(pair){return '<div class="overview-tile"><span>'+pair[0]+'</span><strong>'+pair[1]+'</strong></div>';}).join('');
      host.innerHTML = '<div class="page-section-head"><div><h2>Development tracker</h2><p>Projects → stories & defects → tasks</p></div>' + button('add','','New work item','plus') + '</div><div class="domain-actions" role="group" aria-label="Work views">' + ['active','backlog','history'].map(function(v){return '<button class="btn" type="button" data-view="'+v+'" aria-pressed="'+(filters.view===v)+'">'+({active:'Active work',backlog:'Backlog / closed',history:'Work history'})[v]+'</button>';}).join('') + '</div><form id="workFilters" class="domain-filters">' + UI.select('project','Project',[['','All projects']].concat(projects().map(function(p){return [p.id,p.name];})),filters.project || '') + UI.select('type','Type',[['','All types'],'story','defect'],filters.type || '') + UI.select('status','Status',[['','All statuses']].concat(statuses),filters.status || '') + UI.select('priority','Priority',[['','All priorities']].concat(priorities),filters.priority || '') + UI.select('deadline','Deadline',[['','Any deadline'],['due-soon','Due in 3 days'],['overdue','Overdue'],['later','Later']],filters.deadline || '') + UI.field('search','Search work',filters.search || '', 'search','maxlength="160"') + '<button class="btn" type="submit">Apply filters</button></form><div id="workResults" class="domain-grid"></div><div id="workDetail"></div>';
      var results=host.querySelector('#workResults');
      if(filters.view==='history') {
        var history=state.history.filter(function(h){return (!filters.project || h.projectId===filters.project) && (!filters.search || (h.name+' '+h.action).toLowerCase().includes(filters.search.toLowerCase())) && (!filters.type || h.snapshot && h.snapshot.type===filters.type) && (!filters.status || h.snapshot && h.snapshot.status===filters.status) && (!filters.priority || h.snapshot && h.snapshot.priority===filters.priority) && (!filters.deadline || h.snapshot && due(h.snapshot.deadline)===filters.deadline);});
        results.innerHTML=history.length?history.map(function(h){return '<article class="domain-card"><strong>'+esc(h.name)+'</strong><p>'+esc(h.action)+' · '+esc(new Date(h.at).toLocaleString())+'</p><p>'+esc(projectLabel(h.projectId))+'</p><details><summary>Saved state</summary><p>'+esc(h.snapshot ? h.snapshot.status+' · '+(h.snapshot.execution || 'No execution notes') : 'Legacy event')+'</p><p>'+ (h.tasks || []).filter(function(t){return t.done;}).length+' / '+(h.tasks || []).length+' tasks complete</p></details></article>';}).join(''):'<p class="proof-empty">No matching history yet.</p>';
      } else {
        var items=filter(state.items,filters);
        results.innerHTML=items.length?items.map(function(i){var tasks=state.tasks.filter(function(t){return t.itemId===i.id;});return '<article class="domain-card"><p class="domain-eyebrow">'+esc(projectLabel(i.projectId))+' / '+esc(i.type)+'</p><h3>'+esc(i.name)+'</h3><div class="domain-actions"><span class="status-chip">'+esc(i.status)+'</span><span>'+esc(i.priority)+'</span>'+badge(i.deadline)+'</div><p>'+tasks.filter(function(t){return t.done;}).length+' / '+tasks.length+' tasks complete</p><p>'+esc((i.labels || []).join(' · '))+'</p>'+button('detail',i.id,'Open details','layers')+'</article>';}).join(''):'<p class="proof-empty">No matching work items. Create a project, then add a story or defect.</p>';
      }
      var item=state.items.find(function(i){return i.id===selected;});
      if(item) { renderDetail(item,state); if(!OS.prefersReducedMotion())host.querySelector('.domain-detail').classList.add('is-updating'); }
      renderTimeline(state);
      if(focusAction){var target=Array.from(host.querySelectorAll('[data-work-action]')).find(function(el){return el.dataset.workAction===focusAction && el.dataset.id===focusId;});if(target)target.focus({preventScroll:true});}
    }
    function renderDetail(item,state) {
      var tasks=state.tasks.filter(function(t){return t.itemId===item.id;}), closed=item.status==='closed';
      host.querySelector('#workDetail').innerHTML='<section class="domain-detail" aria-label="Work item details"><h3 tabindex="-1" id="workDetailTitle">'+esc(item.name)+'</h3><div class="domain-actions">'+button('edit',item.id,'Edit item')+button('lifecycle',item.id,closed?'Reopen item':'Close item & tasks','check')+button('delete',item.id,'Delete item','trash')+button('hide',item.id,'Hide details','close')+'</div><label>Lifecycle<select data-work-action="status" data-id="'+esc(item.id)+'">'+statuses.map(function(s){return '<option'+(s===item.status?' selected':'')+'>'+s+'</option>';}).join('')+'</select></label>'+['analysis','plan','execution'].map(function(k){return '<h4>'+k[0].toUpperCase()+k.slice(1)+'</h4><p class="domain-prose">'+esc(item[k] || 'Add notes using Edit item.')+'</p>';}).join('')+'<p>Reminder: '+esc(item.reminderAt || 'None')+'</p><div class="domain-actions">'+(item.links || []).map(function(url){return '<a class="btn" target="_blank" rel="noopener noreferrer" href="'+esc(url)+'">'+esc(new URL(url).hostname)+'</a>';}).join('')+'</div><h4>Tasks · '+tasks.filter(function(t){return t.done;}).length+'/'+tasks.length+'</h4>'+(closed?'<p>Reopen this item to edit tasks. Completed task history is retained.</p>':button('add-task',item.id,'Add task','plus'))+'<ul class="domain-task-list">'+tasks.map(function(t){return '<li class="'+(t.done?'is-done':'')+'"><label><input type="checkbox" data-work-action="toggle" data-id="'+esc(t.id)+'"'+(t.done?' checked':'')+(closed?' disabled':'')+'><span>'+esc(t.title)+'</span></label><p>'+esc(t.details || '')+'</p><small>'+esc(t.priority)+' · '+(t.estimate || 0)+'h estimated '+badge(t.dueDate)+'</small>'+(!closed?'<div class="domain-actions">'+button('edit-task',t.id,'Edit task')+button('delete-task',t.id,'Delete task','trash')+'</div>':'')+'</li>';}).join('')+'</ul></section>';
    }
    function renderTimeline(state) {
      var active=state.items.filter(function(i){return i.status!=='closed';}), rows=active.map(function(i){return {id:i.id,name:i.name,priority:i.priority,date:i.deadline};});
      state.tasks.filter(function(t){return !t.done && active.some(function(i){return i.id===t.itemId;});}).forEach(function(t){rows.push({id:t.itemId,name:t.title,priority:t.priority,date:t.dueDate});});
      rows.sort(function(a,b){return (a.date || '9999').localeCompare(b.date || '9999') || priorities.indexOf(b.priority)-priorities.indexOf(a.priority);});
      document.getElementById('workTimelineList').innerHTML=rows.length?rows.slice(0,8).map(function(r){return '<li><strong>'+esc(r.name)+'</strong><span>'+esc(r.priority)+' priority '+badge(r.date)+'</span></li>';}).join(''):'<li class="timeline-empty">Your development priorities will appear here.</li>';
      projects().filter(function(p){return p.status!=='done' && p.deadline;}).forEach(function(p){rows.push({id:p.id,name:'Project: '+p.name,date:p.deadline,priority:'medium'});});
      var reminders=rows.filter(function(r){return ['overdue','due-soon'].includes(due(r.date));});
      document.getElementById('workReminders').innerHTML='<h3>Deadline reminders</h3><p>Reminders run locally while OneSpace is open.</p>'+(reminders.length?reminders.map(function(r){return '<p>'+esc(r.name)+' '+badge(r.date)+'</p>';}).join(''):'<p>No deadlines in the next 3 days.</p>');
    }
    function editItem(id) {
      var all=projects();if(!all.length){OS.showToast('Create a project first.');OS.goToPage('projects');return;}
      var i=read().items.find(function(x){return x.id===id;}) || {type:'story',status:'open',priority:'medium',projectId:all[0].id};
      UI.open(id?'Edit work item':'New work item',UI.field('name','Name',i.name,'text','required maxlength="160"')+UI.select('projectId','Project',all.map(function(p){return[p.id,p.name];}),i.projectId)+UI.select('type','Type',['story','defect'],i.type)+UI.select('status','Status',statuses,i.status)+UI.select('priority','Priority',priorities,i.priority)+['analysis','plan','execution'].map(function(k){return UI.field(k,k[0].toUpperCase()+k.slice(1),i[k],'textarea');}).join('')+UI.field('labels','Labels (comma separated)',(i.labels || []).join(', '),'text','maxlength="1000"')+UI.field('deadline','Deadline',i.deadline,'date')+UI.field('reminderAt','Reminder time (local)',i.reminderAt,'datetime-local')+UI.field('links','Links (one per line)',(i.links || []).join('\n'),'textarea'),function(f){
        var now=new Date().toISOString(), value=Object.assign({},i,{id:id || OS.uid('work'),createdAt:i.createdAt || now,updatedAt:now});
        ['name','projectId','type','priority','analysis','plan','execution','deadline','reminderAt'].forEach(function(k){value[k]=String(f.get(k) || '').trim();});
        if(!value.name)throw new Error('Enter a name.');
        value.labels=String(f.get('labels')).split(',').map(function(s){return s.trim();}).filter(Boolean);
        value.links=String(f.get('links')).split('\n').map(function(s){return s.trim();}).filter(Boolean);
        if(!root.OneSpaceStorage.validDate(value.deadline) || !root.OneSpaceStorage.validDate(value.reminderAt,true))throw new Error('Use a valid date and time.');
        if(!value.links.every(root.OneSpaceStorage.validUrl))throw new Error('Links must use http or https.');
        var state=read();if(id)state.items=state.items.map(function(x){return x.id===id?value:x;});else state.items.unshift(value);
        log(state,value,id?'updated':'created');
        if(f.get('status')!==value.status)state=lifecycle(state,value.id,f.get('status'),now,OS.uid('event'));
        if(!commit(state,'Work item saved.'))return false;selected=value.id;render();
      });
    }
    function editTask(id,itemId) {
      var t=read().tasks.find(function(x){return x.id===id;}) || {itemId:itemId,priority:'medium',done:false};
      UI.open(id?'Edit task':'New task',UI.field('title','Task title',t.title,'text','required maxlength="160"')+UI.field('details','Details',t.details,'textarea','maxlength="5000"')+UI.select('priority','Priority',priorities,t.priority)+UI.field('dueDate','Due date',t.dueDate,'date')+UI.field('estimate','Estimate (hours)',t.estimate || 0,'number','min="0" max="10000" step="0.25"'),function(f){
        var now=new Date().toISOString(), value=Object.assign({},t,{id:id || OS.uid('task'),title:String(f.get('title')).trim(),details:String(f.get('details')),priority:f.get('priority'),dueDate:f.get('dueDate'),estimate:Number(f.get('estimate')),createdAt:t.createdAt || now,updatedAt:now});
        if(!value.title)throw new Error('Enter a task title.');
        var state=read(), parent=state.items.find(function(i){return i.id===t.itemId;}); if(!parent || parent.status==='closed')throw new Error('Reopen the parent item first.');
        if(id)state.tasks=state.tasks.map(function(x){return x.id===id?value:x;});else state.tasks.push(value);
        log(state,parent,id?'task-updated':'task-created'); return commit(state,'Task saved.');
      });
    }
    host.onclick=function(e){
      var view=e.target.closest('[data-view]');if(view){filters.view=view.dataset.view;filters.status='';selected=null;render();host.querySelector('[data-view="'+filters.view+'"]').focus();return;}
      var b=e.target.closest('button[data-work-action]');if(!b)return;var action=b.dataset.workAction,id=b.dataset.id;
      if(action==='lifecycle'){var state=read(),item=state.items.find(function(i){return i.id===id;});if(item)commit(lifecycle(state,id,item.status==='closed'?'open':'closed',new Date().toISOString(),OS.uid('event')),item.status==='closed'?'Item reopened. Completed task history retained.':'Item closed. All tasks completed.');}
      if(action==='add' || action==='edit')editItem(action==='edit'?id:null);
      if(action==='detail'){selected=id;render();document.getElementById('workDetailTitle').focus();}
      if(action==='hide'){selected=null;render();var detailButton=host.querySelector('[data-work-action="detail"][data-id="'+id+'"]');if(detailButton)detailButton.focus();}
      if(action==='add-task')editTask(null,id);
      if(action==='edit-task')editTask(id);
      if(action==='delete' || action==='delete-task')UI.confirm('Delete '+(action==='delete'?'work item':'task')+'?','A snapshot will remain in Work history.',function(){var state=read(),item=action==='delete'?state.items.find(function(i){return i.id===id;}):state.items.find(function(i){return state.tasks.some(function(t){return t.id===id && t.itemId===i.id;});});if(!item)return;log(state,item,action==='delete'?'deleted':'task-deleted');if(action==='delete'){state.items=state.items.filter(function(i){return i.id!==id;});state.tasks=state.tasks.filter(function(t){return t.itemId!==id;});selected=null;}else state.tasks=state.tasks.filter(function(t){return t.id!==id;});return commit(state,'Deleted. History retained.');});
    };
    host.onchange=function(e){var a=e.target.dataset.workAction,id=e.target.dataset.id,state=read();if(a==='status')commit(lifecycle(state,id,e.target.value,new Date().toISOString(),OS.uid('event')),'Status updated.');if(a==='toggle'){var t=state.tasks.find(function(t){return t.id===id;}),i=t && state.items.find(function(i){return i.id===t.itemId;});if(!t || !i || i.status==='closed')return;t.done=e.target.checked;t.completedAt=t.done?new Date().toISOString():null;t.updatedAt=new Date().toISOString();log(state,i,t.done?'task-completed':'task-updated');if(!commit(state,'Task completion updated.'))e.target.checked=!e.target.checked;}};
    host.onsubmit=function(e){if(e.target.id!=='workFilters')return;e.preventDefault();new FormData(e.target).forEach(function(v,k){filters[k]=v;});render();host.querySelector('[name="search"]').focus();};
    function remind(){var state=read(),now=Date.now();state.items.filter(function(i){return i.status!=='closed';}).forEach(function(i){var reason=i.reminderAt && +new Date(i.reminderAt)<=now?'Reminder':due(i.deadline)==='overdue'?'Overdue':due(i.deadline)==='due-soon'?'Due soon':'';var token=i.id+':'+i.updatedAt+':'+reason;if(reason && !notified.has(token)){notified.add(token);OS.showToast(reason+': '+i.name);}});if(document.body.dataset.page==='work'){var extra=state.tasks.filter(function(t){return !t.done && state.items.some(function(i){return i.id===t.itemId && i.status!=='closed';});}).map(function(t){return {id:t.id,name:t.title,date:t.dueDate};}).concat(projects().filter(function(p){return p.status!=='done';}).map(function(p){return {id:p.id,name:p.name,date:p.deadline};}));extra.forEach(function(x){var reason=due(x.date),token=x.id+':'+x.date+':'+reason;if(['overdue','due-soon'].includes(reason)&&!notified.has(token)){notified.add(token);OS.showToast(reason.replace('-',' ')+': '+x.name);}});renderTimeline(state);}}
    document.addEventListener('onespace:page-changed',function(e){if(e.detail.page==='work'){render();remind();}});
    document.addEventListener('onespace:data-changed',function(e){if(e.detail.key==='orbit-work-projects')render();});
    root.OneSpaceWork.deleteProject=function(id){var state=read();state.items.filter(function(i){return i.projectId===id;}).forEach(function(i){log(state,i,'deleted');});var ids=state.items.filter(function(i){return i.projectId===id;}).map(function(i){return i.id;});state.items=state.items.filter(function(i){return i.projectId!==id;});state.tasks=state.tasks.filter(function(t){return !ids.includes(t.itemId);});selected=null;return commit(state,'Project and its work deleted; history retained.',{'orbit-work-projects':JSON.stringify(projects().filter(function(p){return p.id!==id;}))});};
    render();if(document.body.dataset.page==='work')remind();setInterval(remind,30000);
  }
  return { keys:keys, lifecycle:lifecycle, filter:filter, due:due, mount:mount };
});
