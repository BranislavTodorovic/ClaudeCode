# Baseline interaction acceptance inventory

Each row in `interaction-inventory.json` contains owner, source line, control identity, expected change, persistence keys, feedback, error/cancel behavior, focus return, reload contract and pending acceptance outcomes. Baseline visible UI is separately captured in `baseline-routes.json`. Dynamic record instances use their source-template row.

| ID | Owner | Source | Control | Action |
|---|---|---|---|---|
| I0001 | explore | discovery-ui.js:7 | '+esc(text)+' | external-link |
| I0002 | explore | discovery-ui.js:22 | '+OS.iconSvg('plus')+'Add Location | create |
| I0003 | explore | discovery-ui.js:22 | '+UI.field('q',domain==='destinations'?'Search places':domain==='games'?'Search games':'Search movies or series','','search','maxlength="200 | submit |
| I0004 | explore | discovery-ui.js:22 | Load more | action |
| I0005 | explore | discovery-ui.js:24 | '+OS.iconSvg('search')+'Details | filter |
| I0006 | explore | discovery-ui.js:24 | '+OS.iconSvg('plus')+(saved?'Saved':domain==='destinations'?'Shortlist':domain==='games'?'Add to My Games':'Add to library')+' | create |
| I0007 | shell | domain-ui.js:9 | Close dialog | close-or-cancel |
| I0008 | shell | domain-ui.js:9 | ' + body + ' Cancel ' + (submit ? ' ' + esc(label \|\| 'Save') + ' ' : '') + ' | submit |
| I0009 | shell | domain-ui.js:21 | ' + v + ' | entry |
| I0010 | shell | domain-ui.js:21 | input | entry |
| I0011 | shell | domain-ui.js:24 | ' + values.map(function (v) { var pair = Array.isArray(v) ? v : [v, v]; return ' ' + esc(String(pair[1]).charAt(0).toUpperCase()+String(pair | selection |
| I0012 | explore | explore-global.js:7 | localImage | entry |
| I0013 | explore | explore-global.js:7 | removeImage | destructive-or-reset |
| I0014 | explore | explore-global.js:9 | Search destinations | filter |
| I0015 | explore | explore-global.js:9 | Details | action |
| I0016 | explore | explore-global.js:9 | '+OS.iconSvg('edit')+'Edit trip | edit |
| I0017 | explore | explore-global.js:9 | '+OS.iconSvg('calendaricon')+(r.planTitle?'Edit plan':'Create trip plan')+' | create |
| I0018 | explore | explore-global.js:9 | Move  | action |
| I0019 | explore | explore-global.js:9 | Move  | action |
| I0020 | explore | explore-global.js:9 | Remove  | destructive-or-reset |
| I0021 | explore | explore.js:19 | '+OS.iconSvg('maps')+'Details | action |
| I0022 | explore | explore.js:19 | '+OS.iconSvg('star')+(isSaved?'Remove from shortlist':'Save destination')+' | destructive-or-reset |
| I0023 | explore | explore.js:19 | '+OS.iconSvg('edit')+'Trip notes | edit |
| I0024 | explore | explore.js:22 | '+Object.keys(groups).map(function(k){return UI.select(k,labels[k],[['','Any']].concat(groups[k]),(prefs[k] \|\| [])[0] \|\| '');}).join('') | submit |
| I0025 | explore | explore.js:25 | '+esc(l.label)+' | external-link |
| I0026 | games | games.js:303 | Delete  | destructive-or-reset |
| I0027 | games | games.js:308 | Spotlight  | action |
| I0028 | games | games.js:316 | Open Progress | action |
| I0029 | games | games.js:317 | Resources | action |
| I0030 | games | games.js:318 | Edit | edit |
| I0031 | games | games.js:353 | input | toggle |
| I0032 | games | games.js:357 | Edit objective | edit |
| I0033 | games | games.js:358 | Delete objective | destructive-or-reset |
| I0034 | games | games.js:365 | ' + ' ' + ICON_CHEVRON + " " + ' ' + esc(c.title) + " " + ' ' + done + "/" + (c.objectives \|\| []).length + " " + " | close-or-cancel |
| I0035 | games | games.js:372 | ' + ' ' + ' Add ' + " | submit |
| I0036 | games | games.js:386 | Add | submit |
| I0037 | games | games.js:397 | input | toggle |
| I0038 | games | games.js:409 | Reset Weekly Tasks | destructive-or-reset |
| I0039 | games | games.js:417 | ' + renderLogo(game) + " " + esc(game.name) + " | action |
| I0040 | games | games.js:552 | ' + ' ' + ' ' + ICON_CHECK + " " + ' ' + ICON_CLOSE + " " + " | submit |
| I0041 | games | games.js:714 | ' + t.label + " | save |
| I0042 | games | games.js:747 | ' + renderLogo(g) + ' ' + esc(g.name) + " " + stats.percent + "% · " + esc(stats.status) + " | action |
| I0043 | games | games.js:756 | Continue | action |
| I0044 | games | games.js:769 | input | toggle |
| I0045 | games | games.js:778 | All games ' + gameCatalog().map(function (g) { return ' ' + esc(g.title) + " "; }).join("") + " | selection |
| I0046 | games | games.js:826 | Add to My Games | create |
| I0047 | games | games.js:827 | Save to Wishlist | save |
| I0048 | games | games.js:828 | Dismiss | action |
| I0049 | games | games.js:829 | View Details | action |
| I0050 | games | games.js:886 | Move to My Games | create |
| I0051 | games | games.js:887 | Remove | destructive-or-reset |
| I0052 | games | games.js:909 | '+esc(r.label)+' | external-link |
| I0053 | games | games.js:909 | Edit resources | edit |
| I0054 | games | games.js:1103 | Stop Session | action |
| I0055 | games | games.js:1122 | Delete session | destructive-or-reset |
| I0056 | games | games.js:1169 | ' + ICON_EDIT + " Edit | edit |
| I0057 | games | games.js:1170 | ' + ICON_DELETE + " Delete | destructive-or-reset |
| I0058 | games | games.js:1306 | Platform for  | selection |
| I0059 | games | games.js:1309 | ' + gvIcon("play") + 'Open Progress | action |
| I0060 | games | games.js:1309 | Change Game ' + gvIcon("next") + ' | action |
| I0061 | games | games.js:1330 | Show  | action |
| I0062 | shell | index.html:113 | Open navigation | toggle |
| I0063 | shell | index.html:117 | Collapse sidebar | action |
| I0064 | shell | index.html:120 | Work | navigation |
| I0065 | shell | index.html:121 | Projects | navigation |
| I0066 | shell | index.html:122 | Personal | navigation |
| I0067 | shell | index.html:123 | Explore | navigation |
| I0068 | shell | index.html:124 | Games | navigation |
| I0069 | shell | index.html:125 | Movies | navigation |
| I0070 | shell | index.html:129 | Home view | navigation |
| I0071 | shell | index.html:130 | Shortcuts view | navigation |
| I0072 | shell | index.html:131 | Productivity view | navigation |
| I0073 | shell | index.html:132 | Quick Notes view | navigation |
| I0074 | shell | index.html:133 | Settings view | navigation |
| I0075 | shell | index.html:137 | Command Palette | action |
| I0076 | shell | index.html:138 | Open local toolbox | action |
| I0077 | shell | index.html:139 | Add shortcut | create |
| I0078 | shell | index.html:140 | Customize dashboard | action |
| I0079 | shell | index.html:141 | End Workday | action |
| I0080 | shell | index.html:142 | Chill Mode | action |
| I0081 | shell | index.html:143 | Getting started | action |
| I0082 | shell | index.html:148 | Download a local backup | action |
| I0083 | shell | index.html:149 | Restore from a local backup | action |
| I0084 | shell | index.html:154 | Hide focus rail | toggle |
| I0085 | shell | index.html:155 | Open timer | action |
| I0086 | shell | index.html:156 | Complete | action |
| I0087 | shell | index.html:156 | Open Productivity | action |
| I0088 | shell | index.html:159 | Open Quick Notes | action |
| I0089 | shell | index.html:161 | Open Focus | action |
| I0090 | home | index.html:176 | Change color theme | toggle |
| I0091 | home | index.html:186 | Enter your workspace | navigation |
| I0092 | home | index.html:186 | Find something new | create |
| I0093 | home | index.html:191 | Search web | filter |
| I0094 | home | index.html:191 | Find in OneSpace | filter |
| I0095 | home | index.html:192 | Search query Search | submit |
| I0096 | home | index.html:203 | Plan today | navigation |
| I0097 | home | index.html:214 | Favorites | navigation |
| I0098 | home | index.html:214 | Recent | navigation |
| I0099 | home | index.html:214 | Most Used | navigation |
| I0100 | home | index.html:221 | GAMEVAULT / PLAY Your next adventure. Games, missions &amp; the worlds you return to. Enter GameVault | navigation |
| I0101 | home | index.html:222 | MOVIES / UNWIND Set the evening scene. Your watchlist. Your own double feature. Explore Movies | navigation |
| I0102 | shortcuts | index.html:236 | Work | action |
| I0103 | shortcuts | index.html:237 | Personal | action |
| I0104 | shortcuts | index.html:238 | Explore | action |
| I0105 | shortcuts | index.html:242 | Quick open Ctrl + K | action |
| I0106 | shortcuts | index.html:248 | Quick notes | toggle |
| I0107 | shortcuts | index.html:254 | Download a backup of notes, shortcuts, and preferences | action |
| I0108 | shortcuts | index.html:260 | Restore a OneSpace backup | action |
| I0109 | shortcuts | index.html:266 | Settings | action |
| I0110 | shortcuts | index.html:270 | importDataFile | entry |
| I0111 | shortcuts | index.html:271 | Add shortcut | create |
| I0112 | shortcuts | index.html:281 | Add category | create |
| I0113 | shortcuts | index.html:281 | Done | close-or-cancel |
| I0114 | shortcuts | index.html:285 | Search name, category or website… | filter |
| I0115 | productivity | index.html:303 | Start | action |
| I0116 | productivity | index.html:303 | Reset | destructive-or-reset |
| I0117 | productivity | index.html:303 | 25 min | action |
| I0118 | productivity | index.html:307 | New task Priority Normal High Low Add task | submit |
| I0119 | productivity | index.html:314 | Countdown name Date Add date | submit |
| I0120 | games | index.html:343 | Midnight | action |
| I0121 | games | index.html:344 | Neon | action |
| I0122 | games | index.html:345 | Crimson | action |
| I0123 | games | index.html:346 | Aurora | action |
| I0124 | games | index.html:348 | Add Game | create |
| I0125 | games | index.html:361 | Previous game | action |
| I0126 | games | index.html:363 | Next game | action |
| I0127 | games | index.html:364 | Pause automatic rotation | action |
| I0128 | games | index.html:366 | Explore your collection ↓ | action |
| I0129 | games | index.html:373 | Overview | navigation |
| I0130 | games | index.html:374 | My Games | navigation |
| I0131 | games | index.html:375 | Mission Progress | navigation |
| I0132 | games | index.html:376 | Weekly Tasks | navigation |
| I0133 | games | index.html:377 | Suggestions | navigation |
| I0134 | games | index.html:378 | Sessions | navigation |
| I0135 | games | index.html:379 | Journal | navigation |
| I0136 | games | index.html:380 | Appearance | navigation |
| I0137 | games | index.html:392 | Search a game to track or add… | create |
| I0138 | games | index.html:417 | Get Suggestions | action |
| I0139 | games | index.html:418 | Clear Filters | filter |
| I0140 | games | index.html:419 | Reset Preferences | destructive-or-reset |
| I0141 | games | index.html:431 | Start Session | submit |
| I0142 | games | index.html:435 | Log Session | submit |
| I0143 | games | index.html:446 | General entry Cancel edit Save Entry | submit |
| I0144 | work | index.html:466 | Today &amp; Focus | toggle |
| I0145 | work | index.html:471 | Start a focus session | navigation |
| I0146 | work | index.html:471 | Open Projects | navigation |
| I0147 | work | index.html:478 | Manage all projects | navigation |
| I0148 | work | index.html:482 | General daily tasks | navigation |
| I0149 | projects | index.html:496 | Name Description Tags Project link (optional) Status Active Blocked Done Deadline Progress (%) Create project Cancel edit | submit |
| I0150 | personal | index.html:514 | Add | submit |
| I0151 | personal | index.html:519 | Add | submit |
| I0152 | personal | index.html:524 | Add | submit |
| I0153 | personal | index.html:528 | Add shortcut | create |
| I0154 | explore | index.html:544 | Surprise me | action |
| I0155 | explore | index.html:553 | Games Missions, sessions and your library | navigation |
| I0156 | explore | index.html:554 | Movies &amp; Series Watchlist and tonight's pick | navigation |
| I0157 | explore | index.html:555 | ✓ Take a break Set a short timer and step away | navigation |
| I0158 | explore | index.html:559 | Add shortcut | create |
| I0159 | explore | index.html:560 | Search | submit |
| I0160 | explore | index.html:564 | 5 min break | action |
| I0161 | explore | index.html:564 | Random Pick | action |
| I0162 | notes | index.html:587 | Add note | submit |
| I0163 | notes | index.html:592 | Search notes… | filter |
| I0164 | settings | index.html:611 | Auto Classic Light Deep Space Aurora Graphite | selection |
| I0165 | settings | index.html:611 | Auto Follow your device | action |
| I0166 | settings | index.html:611 | Classic Light Bright and crisp | action |
| I0167 | settings | index.html:611 | Deep Space Navy and violet | action |
| I0168 | settings | index.html:611 | Aurora Green and teal | action |
| I0169 | settings | index.html:611 | Graphite Quiet monochrome | action |
| I0170 | settings | index.html:612 | Clean | action |
| I0171 | settings | index.html:612 | Gradient | action |
| I0172 | settings | index.html:612 | Atmosphere | action |
| I0173 | settings | index.html:613 | Full dashboard Minimal Mode | selection |
| I0174 | settings | index.html:614 | OneSpace blue Nebula purple Aurora green Solar amber | selection |
| I0175 | settings | index.html:615 | Comfortable — show descriptions Compact — fit more shortcuts | selection |
| I0176 | settings | index.html:616 | Show timer, tasks, and planner Hide productivity tools | selection |
| I0177 | settings | index.html:617 | 12-hour clock 24-hour clock | selection |
| I0178 | settings | index.html:618 | Auto — follow this device Reduced motion — minimize animation Full motion — always animate | selection |
| I0179 | settings | index.html:619 | Download backup | action |
| I0180 | settings | index.html:619 | Restore backup | action |
| I0181 | settings | index.html:620 | Reset preferences | destructive-or-reset |
| I0182 | settings | index.html:620 | Reset all data | destructive-or-reset |
| I0183 | settings | index.html:620 | Done | close-or-cancel |
| I0184 | settings | index.html:628 | Return to full OneSpace | action |
| I0185 | settings | index.html:630 | Home | navigation |
| I0186 | settings | index.html:631 | Shortcuts | navigation |
| I0187 | settings | index.html:632 | Search | filter |
| I0188 | settings | index.html:633 | Productivity | navigation |
| I0189 | settings | index.html:634 | Games | navigation |
| I0190 | settings | index.html:635 | More | action |
| I0191 | settings | index.html:646 | Find links, commands, or calculate | entry |
| I0192 | settings | index.html:647 | Close command palette | close-or-cancel |
| I0193 | settings | index.html:660 | Close dialog | close-or-cancel |
| I0194 | settings | index.html:665 | Name URL Description Space Work Personal Explore Category Cancel Save shortcut | submit |
| I0195 | settings | index.html:694 | Close dialog | close-or-cancel |
| I0196 | settings | index.html:699 | Game name Genre Platform PC PS5 Xbox Nintendo Switch Mobile Logo Remove logo Accent color Tracker type Story / Mission Progress Daily / Week | submit |
| I0197 | settings | index.html:749 | Close dialog | close-or-cancel |
| I0198 | settings | index.html:762 | Close dialog | close-or-cancel |
| I0199 | settings | index.html:767 | Type Movie Series Seasons (series only, optional) Title Poster Remove poster Genre Year Duration (minutes) Language Rating (0-10) Watch stat | submit |
| I0200 | settings | index.html:828 | Close dialog | close-or-cancel |
| I0201 | settings | index.html:839 | Close toolbox | close-or-cancel |
| I0202 | settings | index.html:841 | Generated password | entry |
| I0203 | settings | index.html:841 | Generate | action |
| I0204 | settings | index.html:841 | Copy | action |
| I0205 | settings | index.html:842 | Type or paste text here… | entry |
| I0206 | settings | index.html:843 | Text or encoded URL value | entry |
| I0207 | settings | index.html:843 | Encode | action |
| I0208 | settings | index.html:843 | Decode | action |
| I0209 | settings | index.html:866 | Start exploring | action |
| I0210 | settings | index.html:1205 | Move  | action |
| I0211 | settings | index.html:1205 | Move  | action |
| I0212 | settings | index.html:1205 | Rename | action |
| I0213 | settings | index.html:1205 | Delete | destructive-or-reset |
| I0214 | settings | index.html:1208 | ' + iconSvg("chevron", "icon-sm") + ' ' + (isCollapsed ? "Expand" : "Collapse") + ' | action |
| I0215 | settings | index.html:1219 | ' + iconSvg("star", "icon-sm") + ' | destructive-or-reset |
| I0216 | settings | index.html:1220 | More actions for  | toggle |
| I0217 | settings | index.html:1222 | ' + iconSvg("copy") + 'Copy address | create |
| I0218 | settings | index.html:1223 | ↑ Move earlier | action |
| I0219 | settings | index.html:1223 | ↓ Move later | action |
| I0220 | settings | index.html:1223 | ' + iconSvg("repeat") + 'Duplicate | action |
| I0221 | settings | index.html:1223 | ' + iconSvg("edit") + 'Edit shortcut | edit |
| I0222 | settings | index.html:1223 | ' + iconSvg("trash") + 'Delete shortcut | destructive-or-reset |
| I0223 | settings | index.html:1228 | ' + ' ' + iconSvg(link.icon \|\| "link") + ' ' + ' ' + escapeHtml(link.name) + ' ' + ' ' + escapeHtml(description) + ' ' + (isCustom ? ' Cus | external-link |
| I0224 | settings | index.html:1259 | Open  | action |
| I0225 | settings | index.html:1350 | ' + iconSvg(link.icon \|\| "link") + ' ' + escapeHtml(link.name) + ' ' + escapeHtml(link.description \|\| getHostname(link.url)) + ' ' + esc | external-link |
| I0226 | settings | index.html:1365 | Browse shortcuts | action |
| I0227 | settings | index.html:1992 | Mark  | toggle |
| I0228 | settings | index.html:1992 | Delete  | destructive-or-reset |
| I0229 | settings | index.html:2058 | Delete countdown  | destructive-or-reset |
| I0230 | settings | index.html:2138 | ' + iconSvg(p.icon, "icon-sm") + escapeHtml(p.label) + ' | action |
| I0231 | settings | index.html:2779 | Note body | edit |
| I0232 | settings | index.html:2782 | Note title | edit |
| I0233 | settings | index.html:2785 | ' + iconSvg("pin") + " | action |
| I0234 | settings | index.html:2789 | Save | save |
| I0235 | settings | index.html:2789 | Cancel | close-or-cancel |
| I0236 | settings | index.html:2790 | Edit note | edit |
| I0237 | settings | index.html:2790 | Delete note | destructive-or-reset |
| I0238 | movies | movies.js:533 | All titles ' + mergedPool().map(function (movie) { return ' ' + esc(movie.title) + " "; }).join("") + " | selection |
| I0239 | movies | movies.js:538 | input | toggle |
| I0240 | movies | movies.js:576 | View Details | action |
| I0241 | movies | movies.js:577 | Add to Watchlist | create |
| I0242 | movies | movies.js:578 | Mark as Watched | action |
| I0243 | movies | movies.js:579 | Dismiss | action |
| I0244 | movies | movies.js:603 | Mark as Watched | action |
| I0245 | movies | movies.js:604 | Remove | destructive-or-reset |
| I0246 | movies | movies.js:619 | Delete  | destructive-or-reset |
| I0247 | movies | movies.js:620 | Edit  | edit |
| I0248 | movies | movies.js:623 | View  | action |
| I0249 | movies | movies.js:630 | Change status for  | selection |
| I0250 | movies | movies.js:671 | Get Suggestions | action |
| I0251 | movies | movies.js:678 | Mark as Watched | action |
| I0252 | movies | movies.js:685 | ' + posterHtml(m, "mv-mini-poster") + ' ' + esc(m.title) + " " + statusLabel(m.status) + " | action |
| I0253 | movies | movies.js:700 | Add to Watchlist | create |
| I0254 | movies | movies.js:701 | Mark as Watched | action |
| I0255 | movies | movies.js:846 | input | toggle |
| I0256 | movies | movies.js:976 | ' + t.label + " | save |
| I0257 | movies | movies.js:1048 | ' + mvIcon("play") + (inLib && inLib.status === "watched" ? "Watched" : "Mark as Watched") + " | action |
| I0258 | movies | movies.js:1049 | View Details | action |
| I0259 | movies | movies.js:1050 | Next Feature ' + mvIcon("next") + " | action |
| I0260 | movies | movies.js:1072 | Show  | action |
| I0261 | movies | movies.js:1340 | ' + t.label + " | action |
| I0262 | movies | movies.js:1342 | ' + ICON_PLUS + " Add Movie | create |
| I0263 | movies | movies.js:1358 | Previous title | action |
| I0264 | movies | movies.js:1360 | Next title | action |
| I0265 | movies | movies.js:1361 | Pause automatic rotation | action |
| I0266 | movies | movies.js:1369 | ' + mvIcon("overview") + " Overview | navigation |
| I0267 | movies | movies.js:1370 | ' + mvIcon("library") + " My Movies & Series | navigation |
| I0268 | movies | movies.js:1371 | ' + mvIcon("suggestions") + " Suggestions | navigation |
| I0269 | movies | movies.js:1372 | ' + mvIcon("watchlist") + " Watchlist | navigation |
| I0270 | movies | movies.js:1373 | ' + mvIcon("appearance") + " Appearance | navigation |
| I0271 | movies | movies.js:1387 | Search a movie or series to track or add… | create |
| I0272 | movies | movies.js:1391 | All | filter |
| I0273 | movies | movies.js:1392 | Watched | filter |
| I0274 | movies | movies.js:1393 | Unwatched | filter |
| I0275 | movies | movies.js:1394 | Watchlist | filter |
| I0276 | movies | movies.js:1396 | Movies &amp; Series Movies Series | filter |
| I0277 | movies | movies.js:1396 | All genres '+(window.MOVIE_GENRES \|\| []).map(function(g){return ' '+esc(g)+' ';}).join('')+' | filter |
| I0278 | movies | movies.js:1404 | Get Title Suggestions | action |
| I0279 | movies | movies.js:1405 | Clear Filters | filter |
| I0280 | movies | movies.js:1406 | Reset Preferences | destructive-or-reset |
| I0281 | personal | personal-controller.js:12 | Complete  | toggle |
| I0282 | personal | personal-controller.js:12 | Edit  | edit |
| I0283 | personal | personal-controller.js:12 | Delete  | destructive-or-reset |
| I0284 | projects | projects.js:25 | Open Projects | navigation |
| I0285 | projects | projects.js:26 | Open link | external-link |
| I0286 | projects | projects.js:26 | Edit | edit |
| I0287 | projects | projects.js:26 | Delete | destructive-or-reset |
| I0288 | projects | projects.js:29 | ' + label + ' ' + OS.iconSvg(page === 'notes' ? 'book' : page === 'productivity' ? 'check' : 'layers') + ' ' + value + ' ' + esc(note) + ' | navigation |
| I0289 | projects | projects.js:36 | Create your first project | create |
| I0290 | shell | shortcut-surface.js:5 | '+OS.iconSvg(icon)+' | toggle |
| I0291 | work | work-tracker.js:46 | ' + OS.iconSvg(icon \|\| 'edit') + esc(label) + ' | edit |
| I0292 | work | work-tracker.js:52 | '+({active:'Active work',backlog:'Backlog / closed',history:'Work history'})[v]+' | close-or-cancel |
| I0293 | work | work-tracker.js:52 | ' + UI.select('project','Project',[['','All projects']].concat(projects().map(function(p){return [p.id,p.name];})),filters.project \|\| '')  | submit |
| I0294 | work | work-tracker.js:68 | '+statuses.map(function(s){return ' '+s+' ';}).join('')+' | selection |
| I0295 | work | work-tracker.js:68 | '+esc(new URL(url).hostname)+' | external-link |
| I0296 | work | work-tracker.js:68 | input | toggle |
