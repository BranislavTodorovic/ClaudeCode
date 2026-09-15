/* Original OneSpace vector sets, drawn locally at any resolution. */
(function () {
  "use strict";
  function svg(id, sky, light, drawing) {
    return '<svg viewBox="0 0 1440 660" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs>' +
      '<linearGradient id="' + id + '-sky" x2="0" y2="1"><stop stop-color="' + sky[0] + '"/><stop offset="1" stop-color="' + sky[1] + '"/></linearGradient>' +
      '<radialGradient id="' + id + '-light"><stop stop-color="' + light + '" stop-opacity=".65"/><stop offset="1" stop-color="' + light + '" stop-opacity="0"/></radialGradient>' +
      '<linearGradient id="' + id + '-metal" x2="1" y2="1"><stop stop-color="#d4e3e0"/><stop offset=".45" stop-color="#547a85"/><stop offset="1" stop-color="#142e3d"/></linearGradient>' +
      '</defs><rect width="1440" height="660" fill="url(#' + id + '-sky)"/>' + drawing + '</svg>';
  }
  function stars() {
    return '<g class="scene-spark" fill="#e2efff">' + Array.from({length:32}, function (_, i) {
      return '<circle cx="' + ((i*137+71)%1440) + '" cy="' + ((i*53+20)%330) + '" r="' + (i%3===0 ? 1.8 : 1) + '"/>';
    }).join('') + '</g>';
  }
  function grid() {
    return '<g fill="none" stroke="#b9e3ef" stroke-opacity=".16">' + Array.from({length:15}, function (_, i) { return '<path d="M940 330 L' + (i*140-240) + ' 660"/>'; }).join('') + '<path d="M0 420H1440M0 470H1440M0 540H1440M0 640H1440"/></g>';
  }
  var scenes = {
    projects: svg('atelier',['#102d39','#466566'],'#c5e8da',
      '<circle cx="1050" cy="240" r="400" fill="url(#atelier-light)"/><path d="M0 420L940 300 1440 400V660H0Z" fill="#152c34"/>' + grid() +
      '<g class="scene-project-model"><path d="M770 399L1020 270 1300 380 1030 532Z" fill="#6c9397" stroke="#b9d5cf" stroke-width="2"/>' +
      '<path d="M820 388V234L1020 130V284Z" fill="#678e91"/><path d="M1020 130L1190 198V354L1020 284Z" fill="#284751"/><path d="M820 234L995 305 1190 198 1020 130Z" fill="#acccc3"/>' +
      '<path d="M880 430V318L1070 222V337Z" fill="#a0bdb5"/><path d="M1070 222L1250 298V414L1070 337Z" fill="#385d68"/><path d="M880 318L1060 393 1250 298 1070 222Z" fill="#d4e0cb"/>' +
      '<g fill="#e8d8a8"><path d="M1100 278L1130 291V351L1100 338Z"/><path d="M1150 299L1180 312V371L1150 358Z"/><path d="M1200 320L1230 333V392L1200 379Z"/></g>' +
      '<g fill="none" stroke="#d6efea" stroke-opacity=".6"><path d="M785 410V180L1020 58 1230 144V374" stroke-dasharray="5 9"/><path class="scene-draw" d="M760 200L1020 65 1260 160M770 550L1040 408 1340 526"/></g></g>' +
      '<g stroke="#7ea9b1" fill="none"><path d="M950 574L1310 390M972 590L1332 406M1320 382L1350 420"/><circle cx="1280" cy="116" r="42"/><path d="M1280 64V168M1228 116H1332"/></g>'),
    personal: svg('garden',['#38273f','#a1746e'],'#ffd8a0',
      '<circle cx="1050" cy="230" r="380" fill="url(#garden-light)"/><path d="M690 660V280a330 330 0 0 1 660 0v380" fill="#344c51"/>' +
      '<path d="M755 660V276a264 264 0 0 1 528 0v384" fill="#e6b78d"/><circle class="scene-breathe" cx="1090" cy="215" r="75" fill="#fff0bf"/>' +
      '<path d="M755 350Q880 215 980 347T1283 308V660H755Z" fill="#758e81"/><path d="M755 430Q1020 300 1283 450V660H755Z" fill="#405d59"/>' +
      '<path d="M0 560L1440 492V660H0Z" fill="#392c39"/><path d="M890 558L1250 496 1340 516 944 602Z" fill="#d3a784" opacity=".25"/>' +
      '<g class="scene-leaves" fill="#243b35" stroke="#719480" stroke-width="2"><path d="M1265 574Q1200 390 1340 200M1270 530Q1340 390 1415 340" fill="none"/>' +
      '<ellipse cx="1290" cy="306" rx="26" ry="69" transform="rotate(-35 1290 306)"/><ellipse cx="1365" cy="264" rx="25" ry="74" transform="rotate(38 1365 264)"/><ellipse cx="1255" cy="405" rx="26" ry="65" transform="rotate(-49 1255 405)"/><ellipse cx="1376" cy="395" rx="27" ry="68" transform="rotate(50 1376 395)"/></g>' +
      '<path d="M1210 542H1330L1310 637H1230Z" fill="#ae7772"/><g transform="translate(895 470)"><path d="M0 0Q90-50 188 0V62H0Z" fill="#d0ad91"/><path d="M14 61V129M174 61V129" stroke="#e1c6a5" stroke-width="12"/><ellipse cx="90" cy="-8" rx="74" ry="21" fill="#e5c6a1"/></g>'),
    explore: svg('voyage',['#0c2943','#cf9a72'],'#ffdc94',
      stars() + '<circle cx="1130" cy="200" r="260" fill="url(#voyage-light)"/><circle cx="1130" cy="200" r="66" fill="#ffdeb2"/>' +
      '<path d="M0 440L260 182 430 345 650 104 900 368 1110 238 1440 398V660H0Z" fill="#527282"/><path d="M530 240L650 104 783 252 685 208 650 170 612 218Z" fill="#d3d7cc"/>' +
      '<path d="M0 520L220 338 440 430 710 250 940 434 1160 310 1440 482V660H0Z" fill="#284d5e"/><path d="M0 535Q350 460 760 493T1440 480V660H0Z" fill="#73a1a4"/>' +
      '<g class="scene-water" stroke="#d4d9c7" stroke-width="2" opacity=".5"><path d="M820 516H1150M960 533H1240M800 553H1070M1070 578H1310M690 595H1140"/></g>' +
      '<path d="M0 625L890 534 1130 660H0Z" fill="#163138"/><path d="M1010 530L1080 554H957Z" fill="#172d3a"/><path d="M1009 430V532L1070 524Z" fill="#f3d6b0"/><path d="M1000 447V523H969Z" fill="#c59e83"/>' +
      '<g class="scene-birds" fill="none" stroke="#f1dfca" stroke-width="3"><path d="M1130 110q12-12 24 0q12-12 24 0M1200 146q9-9 18 0q9-9 18 0"/></g>'),
    shortcuts: svg('launch',['#101831','#3b4673'],'#a2b6ff',
      stars() + '<circle cx="1080" cy="290" r="340" fill="url(#launch-light)"/>' + grid() +
      '<g fill="none" stroke="#9daff3"><ellipse cx="1060" cy="340" rx="250" ry="100" transform="rotate(-35 1060 340)" opacity=".35"/><ellipse class="scene-orbit" cx="1060" cy="340" rx="215" ry="270" stroke-dasharray="2 12" opacity=".7"/></g>' +
      '<g class="scene-float" transform="translate(920 195)"><path d="M0 50L135 0 270 66 135 125Z" fill="#b9caff"/><path d="M0 50V225L135 298V125Z" fill="#586aac"/><path d="M135 125L270 66V225L135 298Z" fill="#283f79"/><path d="M40 107L95 133V191L40 165ZM172 143L224 120V175L172 200Z" fill="#cde9ff"/><path d="M135 15L242 66 135 110 28 55Z" fill="none" stroke="#ecf3ff" stroke-width="2"/></g>' +
      '<g class="scene-spark" fill="#dce5ff"><circle cx="823" cy="254" r="7"/><circle cx="1250" cy="490" r="9"/><circle cx="1305" cy="160" r="5"/></g><path class="scene-draw" d="M715 560L835 510 790 443M1290 325L1360 295V220" fill="none" stroke="#8fb6fd" stroke-width="3"/>'),
    productivity: svg('focus',['#102e2e','#668678'],'#d5ebae',
      '<circle cx="1070" cy="270" r="350" fill="url(#focus-light)"/><path d="M0 500Q620 405 1440 440V660H0Z" fill="#163d3c"/><path d="M0 600Q790 430 1440 510V660H0Z" fill="#102b2c"/>' +
      '<g transform="translate(760 45)"><path d="M95 467L460 422 570 509 186 580Z" fill="#608a7b"/><path d="M95 467V500L186 612V580Z" fill="#284c46"/><path d="M186 580L570 509V540L186 612Z" fill="#355e51"/>' +
      '<circle cx="300" cy="248" r="197" fill="#142f33" stroke="url(#focus-metal)" stroke-width="18"/><circle cx="300" cy="248" r="173" fill="#1c4142" stroke="#a8ceaf" stroke-width="1"/>' +
      '<circle cx="300" cy="248" r="158" fill="none" stroke="#b4d5b2" stroke-width="9" stroke-dasharray="2 18.7"/>' +
      '<circle id="prodProgressRing" cx="300" cy="248" r="90" fill="none" stroke="#c7e4ac" stroke-width="4" stroke-dasharray="565.48" stroke-dashoffset="565.48" transform="rotate(-90 300 248)"/>' +
      '<path d="M300 248V136M300 248L373 293" stroke="#e2e7c4" stroke-width="8" stroke-linecap="round"/><circle cx="300" cy="248" r="10" fill="#e5d8a7"/></g>' +
      '<g class="scene-breathe" fill="none" stroke="#bbd7b4" opacity=".25"><ellipse cx="1090" cy="568" rx="284" ry="45"/><ellipse cx="1090" cy="568" rx="323" ry="61"/></g>'),
    notes: svg('journal',['#352039','#836164'],'#f3c79e',
      '<circle cx="1070" cy="255" r="350" fill="url(#journal-light)"/><path d="M0 500L1060 355 1440 440V660H0Z" fill="#3c2a3b"/>' +
      '<g class="scene-paper"><path d="M745 322L948 280 1193 368 1000 461Z" fill="#36223d"/><path d="M755 303L970 259 1208 345 994 433Z" fill="#aa83a1"/><path d="M755 303V319L994 452V433Z" fill="#d5bac6"/><path d="M994 433L1208 345V364L994 452Z" fill="#846078"/>' +
      '<path d="M790 251Q900 209 1003 263L1001 412Q893 354 790 374Z" fill="#efe0c8"/><path d="M1003 263Q1128 180 1267 237L1250 362Q1119 332 1001 412Z" fill="#fff1d6"/>' +
      '<g fill="none" stroke="#ad8d87" stroke-width="2"><path d="M820 277Q900 254 974 288M820 301Q900 278 974 312M820 326Q900 303 950 333M1032 283Q1130 228 1225 260M1032 309Q1130 254 1225 286M1032 335Q1130 280 1190 301"/></g>' +
      '<path d="M1100 242L1092 387 1114 372 1130 377 1140 229" fill="#b76374"/></g>' +
      '<g transform="rotate(-24 1250 470)"><rect x="1238" y="355" width="18" height="212" rx="6" fill="#ce9c67"/><path d="M1238 551L1247 582 1256 551" fill="#efdfbd"/><path d="M1244 570L1247 582 1250 570" fill="#2c2531"/></g>' +
      '<g class="scene-spark" fill="#f4d3a6"><circle cx="840" cy="155" r="3"/><circle cx="1170" cy="126" r="2"/><circle cx="1310" cy="322" r="2"/></g>'),
    settings: svg('control',['#101f2e','#344863'],'#7bcaef',
      '<circle cx="1050" cy="280" r="370" fill="url(#control-light)"/>' + grid() +
      '<g transform="translate(810 102)"><path d="M0 66L385 0 520 95 120 180Z" fill="#416780"/><path d="M0 66V347L120 457V180Z" fill="#233d53"/><path d="M120 180L520 95V360L120 457Z" fill="#102b43" stroke="#698ca1"/>' +
      '<g transform="matrix(1,-.21,0,1,159,205)"><rect width="307" height="203" rx="13" fill="#203f54" stroke="#51788d"/><g stroke="#688da0" stroke-width="5"><path d="M45 36V165M115 36V165M185 36V165M255 36V165"/></g>' +
      '<g fill="#b7dfdf" stroke="#e7f2e5" stroke-width="2"><rect x="31" y="66" width="28" height="19" rx="5"/><rect x="101" y="119" width="28" height="19" rx="5"/><rect x="171" y="49" width="28" height="19" rx="5"/><rect x="241" y="93" width="28" height="19" rx="5"/></g></g>' +
      '<g class="scene-signal" fill="#a5f4d4"><circle cx="340" cy="68" r="7"/><circle cx="372" cy="61" r="7"/><circle cx="405" cy="54" r="7"/></g></g>' +
      '<g class="scene-orbit" fill="none" stroke="#a1d5e5" stroke-opacity=".4"><ellipse cx="1050" cy="330" rx="340" ry="240" stroke-dasharray="4 12"/></g>')
  };
  Object.keys(scenes).forEach(function (page) {
    var hero = document.querySelector('#' + page + 'View .page-hero');
    if (!hero) return;
    var art = hero.querySelector('.page-hero-art, .project-scene-art');
    if (!art) return;
    hero.dataset.pageHero = page;
    art.className = 'page-hero-art';
    art.innerHTML = scenes[page];
  });
  var heroes = document.querySelectorAll('.page-hero, .scene-hero');
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { entry.target.classList.toggle('scene-offscreen', !entry.isIntersecting); });
    });
    heroes.forEach(function (hero) { observer.observe(hero); });
  }
  document.addEventListener('visibilitychange', function () { document.body.classList.toggle('scene-document-hidden', document.hidden); });
})();
