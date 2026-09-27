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
    }).sort(function (a,b) { if(filters.sort==='name')return a.name.localeCompare(b.name);if(filters.sort==='newest')return b.createdAt.localeCompare(a.createdAt);if(filters.sort==='oldest')return a.createdAt.localeCompare(b.createdAt);if(filters.sort==='deadline')return (a.deadline || '9999').localeCompare(b.deadline || '9999') || a.name.localeCompare(b.name);return priorities.indexOf(b.priority) - priorities.indexOf(a.priority) || (a.deadline || '9999').localeCompare(b.deadline || '9999') || a.createdAt.localeCompare(b.createdAt); });
  }
  function mount(root) {
    var OS = root.OneSpace, UI = root.OneSpaceUI, esc = OS.escapeHtml;
    var host = document.getElementById('workTracker'); if (!host) return;
    var searchTimer = null, detailPanel = null, selected = null, notified = new Set(), filters = { view:document.body.dataset.workView || 'active' };
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
    function label(value){return String(value).replace(/-/g,' ').replace(/^./,function(c){return c.toUpperCase();});}
    function badge(date) { var d = due(date); return date ? '<span class="status-chip deadline-' + d + '">' + esc(label(d)) + ' · ' + esc(date) + '</span>' : ''; }
    function button(action,id,label,icon) { return '<button class="btn" type="button" data-work-action="' + action + '" data-id="' + esc(id || '') + '">' + OS.iconSvg(icon || 'edit') + esc(label) + '</button>'; }
    function projectLabel(id) { var p=projects().find(function(x){return x.id===id;}); return p ? p.name : 'Archived project'; }
    // Reconcile changed regions in place so active inputs, checkbox focus and scroll survive.
    function patch(parent,markup){
      var template=document.createElement('template');template.innerHTML=markup;
      function key(node){if(node.nodeType!==1)return '';return node.getAttribute('data-work-card') || node.getAttribute('data-task-key') || node.getAttribute('data-history-key') || node.id || (node.hasAttribute('data-work-action')?node.getAttribute('data-work-action')+':'+node.getAttribute('data-id'):'') || node.getAttribute('data-work-overview') || node.getAttribute('data-work-clear') || '';}
      function sync(target,wanted){
        if(target.nodeType===3){if(target.nodeValue!==wanted.nodeValue)target.nodeValue=wanted.nodeValue;return;}
        if(target.nodeType!==1)return;
        Array.from(target.attributes).forEach(function(a){if(!wanted.hasAttribute(a.name)&&!(target.tagName==='DETAILS'&&a.name==='open'))target.removeAttribute(a.name);});
        Array.from(wanted.attributes).forEach(function(a){if(target.getAttribute(a.name)!==a.value)target.setAttribute(a.name,a.value);});
        children(target,wanted);
        if(target.tagName==='INPUT'){target.checked=wanted.checked;target.disabled=wanted.disabled;if(target.type!=='checkbox'&&target!==document.activeElement&&target.value!==wanted.value)target.value=wanted.value;}
        if(target.tagName==='SELECT'&&target.value!==wanted.value)target.value=wanted.value;
      }
      function children(target,wanted){
        var desired=Array.from(wanted.childNodes);
        desired.forEach(function(next,index){var id=key(next),current=target.childNodes[index];
          if(id){var found=Array.from(target.childNodes).find(function(n){return key(n)===id;});if(found)current=found;else current=null;}
          if(!current||current.nodeType!==next.nodeType||current.nodeName!==next.nodeName||(!id&&key(current))){var created=next.cloneNode(true);target.insertBefore(created,target.childNodes[index]||null);current=created;}
          else {if(current!==target.childNodes[index])target.insertBefore(current,target.childNodes[index]||null);sync(current,next);}
        });
        while(target.childNodes.length>desired.length)target.lastChild.remove();
      }
      children(parent,template.content);
    }
    function render() {
      var state=read(), active=state.items.filter(function(i){return i.status !== 'closed';});
      patch(document.getElementById('workOverview'), [['Active items',active.length,'all','Stories and defects in motion'],['Blocked',active.filter(function(i){return i.status==='blocked';}).length,'blocked','Resolve the next obstacle'],['Overdue',active.filter(function(i){return due(i.deadline)==='overdue';}).length,'overdue','Bring a deadline back on track']].map(function(pair){return '<button class="overview-tile" type="button" data-page-jump="work" data-work-overview="'+pair[2]+'"><span class="overview-tile-top"><span>'+pair[0]+'</span>'+OS.iconSvg(pair[2]==='all'?'layers':pair[2]==='blocked'?'shield':'calendaricon')+'</span><strong>'+pair[1]+'</strong><span class="overview-tile-bottom">'+pair[3]+OS.iconSvg('arrow')+'</span></button>';}).join(''));
      if(!host.firstElementChild) host.innerHTML = '<div class="page-section-head"><div><h2>' + OS.iconSvg('layers') + 'Development tracker</h2><p>Projects → stories & defects → tasks</p></div>' + button('add','','New work item','plus') + '</div><div class="domain-actions" role="group" aria-label="Work views">' + ['active','projects','backlog','history'].map(function(v){return '<button class="btn" type="button" data-view="'+v+'" aria-pressed="'+(filters.view===v)+'">'+({active:'Board',projects:'Projects',backlog:'Backlog',history:'History'})[v]+'</button>';}).join('') + '</div><form id="workFilters" class="domain-filters">' + UI.select('project','Project',[['','All projects']].concat(projects().map(function(p){return [p.id,p.name];})),filters.project || '') + UI.select('type','Type',[['','All types'],'story','defect'],filters.type || '') + UI.select('status','Status',[['','All statuses']].concat(statuses),filters.status || '') + UI.select('priority','Priority',[['','All priorities']].concat(priorities),filters.priority || '') + UI.select('deadline','Deadline',[['','Any deadline'],['due-soon','Due in 3 days'],['overdue','Overdue'],['later','Later']],filters.deadline || '') + UI.field('search','Search work',filters.search || '', 'search','maxlength="160"') + UI.select('sort','Sort by',[['priority','Priority'],['deadline','Deadline'],['newest','Newest first'],['oldest','Oldest first'],['name','Name']],filters.sort || 'priority') + '</form><div class="work-result-meta"><div id="workFilterChips" class="work-filter-chips" aria-label="Active filters"></div><span id="workResultCount" role="status" aria-live="polite"></span></div><div id="workResults" class="domain-grid"></div><div id="workDetail"></div>';
      host.querySelectorAll('[data-view]').forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.view===filters.view));});
      var projectSelect=host.querySelector('[name="project"]'),projectOptions=[['','All projects']].concat(projects().map(function(p){return[p.id,p.name];}));
      patch(projectSelect,projectOptions.map(function(p){return '<option value="'+esc(p[0])+'"'+(p[0]===(filters.project||'')?' selected':'')+'>'+esc(p[1])+'</option>';}).join(''));
      host.querySelectorAll('#workFilters [name]').forEach(function(control){var value=filters[control.name] || (control.name==='sort'?'priority':'');if(control!==document.activeElement&&control.value!==value)control.value=value;});
      var results=host.querySelector('#workResults');
      document.getElementById('workProjectsPanel').hidden=filters.view!=='projects';
      document.getElementById('workTimelineSection').hidden=filters.view!=='active';
      host.querySelector('#workFilters').hidden=filters.view==='projects';results.hidden=filters.view==='projects';
      if(filters.view==='history') {
        var history=state.history.filter(function(h){return (!filters.project || h.projectId===filters.project) && (!filters.search || (h.name+' '+h.action).toLowerCase().includes(filters.search.toLowerCase())) && (!filters.type || h.snapshot && h.snapshot.type===filters.type) && (!filters.status || h.snapshot && h.snapshot.status===filters.status) && (!filters.priority || h.snapshot && h.snapshot.priority===filters.priority) && (!filters.deadline || h.snapshot && due(h.snapshot.deadline)===filters.deadline);});
        patch(results,history.length?history.map(function(h){return '<article class="domain-card" data-history-key="'+esc(h.id)+'"><strong>'+esc(h.name)+'</strong><p>'+esc(h.action)+' · '+esc(new Date(h.at).toLocaleString())+'</p><p>'+esc(projectLabel(h.projectId))+'</p><details><summary>Saved state</summary><p>'+esc(h.snapshot ? h.snapshot.status+' · '+(h.snapshot.execution || 'No execution notes') : 'Legacy event')+'</p><p>'+ (h.tasks || []).filter(function(t){return t.done;}).length+' / '+(h.tasks || []).length+' tasks complete</p></details></article>';}).join(''):'<p class="proof-empty">No matching history yet.</p>');
      } else {
        var items=filter(state.items,filters);
        patch(results,items.length?items.map(function(i){var tasks=state.tasks.filter(function(t){return t.itemId===i.id;}),done=tasks.filter(function(t){return t.done;}).length,percent=tasks.length?Math.round(done/tasks.length*100):0;return '<article class="domain-card work-item-card" data-work-card="'+esc(i.id)+'" data-priority="'+esc(i.priority)+'"><div class="work-card-top"><span class="work-type">'+OS.iconSvg(i.type==='defect'?'target':'book')+esc(label(i.type))+'</span><span class="work-priority" role="img" aria-label="'+esc(label(i.priority))+' priority" title="'+esc(label(i.priority))+' priority"></span></div><p class="domain-eyebrow">'+esc(projectLabel(i.projectId))+'</p><h3>'+esc(i.name)+'</h3><div class="domain-actions"><span class="status-chip status-'+esc(i.status)+'">'+esc(label(i.status))+'</span>'+badge(i.deadline)+'</div><div class="work-progress-label"><span>Task progress</span><strong>'+done+' / '+tasks.length+'</strong></div><div class="work-progress" role="progressbar" aria-label="'+esc(i.name)+' task progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+percent+'"><span style="width:'+percent+'%"></span></div><p class="work-labels">'+esc((i.labels || []).join(' · '))+'</p>'+button('detail',i.id,'Open details','layers')+'</article>';}).join(''):'<div class="proof-empty work-empty">'+OS.iconSvg('layers')+'<h3>No matching work items</h3><p>Create a project, then add a story or defect. Your next step starts here.</p>'+button('add','','New work item','plus')+'</div>');
      }
      var filterNames={project:'Project',type:'Type',status:'Status',priority:'Priority',deadline:'Deadline',search:'Search'};
      patch(host.querySelector('#workFilterChips'),Object.keys(filterNames).filter(function(k){return !!filters[k];}).map(function(k){var value=k==='project'?projectLabel(filters[k]):filters[k];return '<button class="work-filter-chip" type="button" data-work-clear="'+k+'" aria-label="Clear '+filterNames[k]+' filter">'+filterNames[k]+': '+esc(value)+' '+OS.iconSvg('close')+'</button>';}).join(''));
      var resultCount=filters.view==='history'?history.length:items.length;
      host.querySelector('#workResultCount').textContent=filters.view==='projects'?'':resultCount+' '+(filters.view==='history'?'event':'item')+(resultCount===1?'':'s');
      host.querySelector('.work-result-meta').hidden=filters.view==='projects';
      var item=state.items.find(function(i){return i.id===selected;});
      if(item && detailPanel && !detailPanel.overlay.hidden) renderDetail(item,state); else if(!item && detailPanel) detailPanel.close();
      renderTimeline(state);
    }
    function renderDetail(item,state) {
      var tasks=state.tasks.filter(function(t){return t.itemId===item.id;}), closed=item.status==='closed';
      detailPanel.setTitle(item.name); patch(detailPanel.body,'<section class="domain-detail" aria-label="Work item details"><h3 tabindex="-1" id="workDetailTitle">'+esc(item.name)+'</h3><div class="domain-actions">'+button('edit',item.id,'Edit item')+button('lifecycle',item.id,closed?'Reopen item':'Close item & tasks','check')+button('delete',item.id,'Delete item','trash')+button('hide',item.id,'Hide details','close')+'</div><label>Lifecycle<select data-work-action="status" data-id="'+esc(item.id)+'">'+statuses.map(function(s){return '<option value="'+s+'"'+(s===item.status?' selected':'')+'>'+label(s)+'</option>';}).join('')+'</select></label>'+['analysis','plan','execution'].map(function(k){return '<h4>'+k[0].toUpperCase()+k.slice(1)+'</h4><p class="domain-prose">'+esc(item[k] || 'Add notes using Edit item.')+'</p>';}).join('')+'<p>Reminder: '+esc(item.reminderAt || 'None')+'</p><div class="domain-actions">'+(item.links || []).map(function(url){return '<a class="btn" target="_blank" rel="noopener noreferrer" href="'+esc(url)+'">'+esc(new URL(url).hostname)+'</a>';}).join('')+'</div><h4>Tasks · '+tasks.filter(function(t){return t.done;}).length+'/'+tasks.length+'</h4>'+(closed?'<p>Reopen this item to edit tasks. Completed task history is retained.</p>':button('add-task',item.id,'Add task','plus'))+'<ul class="domain-task-list">'+tasks.map(function(t){return '<li data-task-key="'+esc(t.id)+'" class="'+(t.done?'is-done':'')+'"><label><input type="checkbox" data-work-action="toggle" data-id="'+esc(t.id)+'"'+(t.done?' checked':'')+(closed?' disabled':'')+'><span>'+esc(t.title)+'</span></label><p>'+esc(t.details || '')+'</p><small>'+esc(label(t.priority))+' · '+(t.estimate || 0)+'h estimated '+badge(t.dueDate)+'</small>'+(!closed?'<div class="domain-actions">'+button('edit-task',t.id,'Edit task')+button('delete-task',t.id,'Delete task','trash')+'</div>':'')+'</li>';}).join('')+'</ul></section>');
    }
    function renderTimeline(state) {
      var active=state.items.filter(function(i){return i.status!=='closed';}), rows=active.map(function(i){return {id:i.id,name:i.name,priority:i.priority,date:i.deadline};});
      state.tasks.filter(function(t){return !t.done && active.some(function(i){return i.id===t.itemId;});}).forEach(function(t){rows.push({id:t.itemId,name:t.title,priority:t.priority,date:t.dueDate});});
      rows.sort(function(a,b){return (a.date || '9999').localeCompare(b.date || '9999') || priorities.indexOf(b.priority)-priorities.indexOf(a.priority);});
      document.getElementById('workTimelineList').innerHTML=rows.length?rows.slice(0,8).map(function(r){return '<li><strong>'+esc(r.name)+'</strong><span>'+esc(label(r.priority))+' priority '+badge(r.date)+'</span></li>';}).join(''):'<li class="timeline-empty">Your development priorities will appear here.</li>';
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
    document.querySelector('[data-work-new]').onclick=function(){editItem(null);};
    document.getElementById('workOverview').onclick=function(e){var button=e.target.closest('[data-work-overview]');if(!button)return;e.stopPropagation();OS.goToPage('work');filters={view:'active'};if(button.dataset.workOverview==='blocked')filters.status='blocked';if(button.dataset.workOverview==='overdue')filters.deadline='overdue';render();};
    host.onclick=function(e){
      var clear=e.target.closest('[data-work-clear]');if(clear){var cleared=clear.dataset.workClear;filters[cleared]='';render();host.querySelector('[name="'+cleared+'"]').focus();return;}
      var view=e.target.closest('[data-view]');if(view){filters.view=view.dataset.view;document.body.dataset.workView=filters.view;filters.status='';selected=null;render();host.querySelector('[data-view="'+filters.view+'"]').focus();return;}
      var b=e.target.closest('button[data-work-action]');if(!b)return;var action=b.dataset.workAction,id=b.dataset.id;
      if(action==='lifecycle'){var state=read(),item=state.items.find(function(i){return i.id===id;});if(item)commit(lifecycle(state,id,item.status==='closed'?'open':'closed',new Date().toISOString(),OS.uid('event')),item.status==='closed'?'Item reopened. Completed task history retained.':'Item closed. All tasks completed.');}
      if(action==='add' || action==='edit')editItem(action==='edit'?id:null);
      if(action==='detail'){selected=id;if(!detailPanel){detailPanel=UI.panel('Work details');detailPanel.body.onclick=host.onclick;detailPanel.body.onchange=host.onchange;}detailPanel.show();render();}
      if(action==='hide'){selected=null;if(detailPanel)detailPanel.close();}
      if(action==='add-task')editTask(null,id);
      if(action==='edit-task')editTask(id);
      if(action==='delete' || action==='delete-task')UI.confirm('Delete '+(action==='delete'?'work item':'task')+'?','A snapshot will remain in Work history.',function(){var state=read(),item=action==='delete'?state.items.find(function(i){return i.id===id;}):state.items.find(function(i){return state.tasks.some(function(t){return t.id===id && t.itemId===i.id;});});if(!item)return;log(state,item,action==='delete'?'deleted':'task-deleted');if(action==='delete'){state.items=state.items.filter(function(i){return i.id!==id;});state.tasks=state.tasks.filter(function(t){return t.itemId!==id;});selected=null;}else state.tasks=state.tasks.filter(function(t){return t.id!==id;});return commit(state,'Deleted. History retained.');});
    };
    host.onchange=function(e){if(e.target.closest('#workFilters')){filters[e.target.name]=e.target.value;render();return;}var a=e.target.dataset.workAction,id=e.target.dataset.id,state=read();if(a==='status')commit(lifecycle(state,id,e.target.value,new Date().toISOString(),OS.uid('event')),'Status updated.');if(a==='toggle'){var t=state.tasks.find(function(t){return t.id===id;}),i=t && state.items.find(function(i){return i.id===t.itemId;});if(!t || !i || i.status==='closed')return;t.done=e.target.checked;t.completedAt=t.done?new Date().toISOString():null;t.updatedAt=new Date().toISOString();log(state,i,t.done?'task-completed':'task-updated');if(!commit(state,'Task completion updated.'))e.target.checked=!e.target.checked;}};
    host.oninput=function(e){if(e.target.name!=='search')return;clearTimeout(searchTimer);var value=e.target.value;searchTimer=setTimeout(function(){filters.search=value;render();},220);};
    host.onsubmit=function(e){if(e.target.id!=='workFilters')return;e.preventDefault();clearTimeout(searchTimer);new FormData(e.target).forEach(function(v,k){filters[k]=v;});render();};
    function remind(){var state=read(),now=Date.now();state.items.filter(function(i){return i.status!=='closed';}).forEach(function(i){var reason=i.reminderAt && +new Date(i.reminderAt)<=now?'Reminder':due(i.deadline)==='overdue'?'Overdue':due(i.deadline)==='due-soon'?'Due soon':'';var token=i.id+':'+i.updatedAt+':'+reason;if(reason && !notified.has(token)){notified.add(token);OS.showToast(reason+': '+i.name);}});if(document.body.dataset.page==='work'){var extra=state.tasks.filter(function(t){return !t.done && state.items.some(function(i){return i.id===t.itemId && i.status!=='closed';});}).map(function(t){return {id:t.id,name:t.title,date:t.dueDate};});extra.forEach(function(x){var reason=due(x.date),token=x.id+':'+x.date+':'+reason;if(['overdue','due-soon'].includes(reason)&&!notified.has(token)){notified.add(token);OS.showToast(reason.replace('-',' ')+': '+x.name);}});renderTimeline(state);}}
    document.addEventListener('onespace:page-changed',function(e){if(e.detail.page==='work'){filters.view=document.body.dataset.workView || 'active';render();remind();}});
    document.addEventListener('onespace:data-changed',function(e){if(e.detail.key==='orbit-work-projects')render();});
    root.OneSpaceWork.deleteProject=function(id){var state=read();state.items.filter(function(i){return i.projectId===id;}).forEach(function(i){log(state,i,'deleted');});var ids=state.items.filter(function(i){return i.projectId===id;}).map(function(i){return i.id;});state.items=state.items.filter(function(i){return i.projectId!==id;});state.tasks=state.tasks.filter(function(t){return !ids.includes(t.itemId);});selected=null;return commit(state,'Project and its work deleted; history retained.',{'orbit-work-projects':JSON.stringify(projects().filter(function(p){return p.id!==id;}))});};
    document.addEventListener('onespace:end-workday',function(){var items=read().items,closed=items.filter(function(i){return i.status==='closed';}).length;OS.showToast('Workday closed: '+closed+' closed, '+(items.length-closed)+' active work items.');});
    render();if(document.body.dataset.page==='work')remind();setInterval(remind,30000);
  }
  return { keys:keys, lifecycle:lifecycle, filter:filter, due:due, mount:mount };
});
