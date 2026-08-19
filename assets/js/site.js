/* Biz Connect Coalition — shared behavior */
(function(){
  "use strict";

  /* header scroll state */
  var header=document.querySelector("header.site");
  function onScroll(){ if(header){ header.classList.toggle("scrolled", window.scrollY>10); } }
  window.addEventListener("scroll", onScroll, {passive:true});
  onScroll();

  /* mobile menu */
  var menuBtn=document.getElementById("menuBtn");
  var mobileNav=document.getElementById("mobileNav");
  if(menuBtn && mobileNav){
    menuBtn.addEventListener("click", function(){ mobileNav.classList.toggle("open"); });
    mobileNav.querySelectorAll("a").forEach(function(a){
      a.addEventListener("click", function(){ mobileNav.classList.remove("open"); });
    });
  }

  /* active nav highlighting */
  var page=(location.pathname.split("/").pop()||"index.html");
  document.querySelectorAll(".nav-links a, .mobile-nav a").forEach(function(a){
    var href=a.getAttribute("href")||"";
    if(href===page || (page==="" && href==="index.html")){ a.classList.add("active"); }
  });

  /* reveal on scroll */
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); }
    });
  },{threshold:.14});
  document.querySelectorAll(".reveal").forEach(function(el){
    // anything already in the first viewport reveals immediately —
    // never gate above-the-fold content on observer timing
    if(el.getBoundingClientRect().top < window.innerHeight*.96){ el.classList.add("in"); }
    else{ io.observe(el); }
  });

  /* animated stat counters */
  var statIO=new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(!e.isIntersecting) return;
      statIO.unobserve(e.target);
      var el=e.target, target=parseInt(el.getAttribute("data-count"),10)||0;
      var suffix=el.getAttribute("data-suffix")||"", comma=el.getAttribute("data-comma")==="1";
      var t0=null, dur=1600;
      function tick(now){
        if(!t0) t0=now;
        var p=Math.min((now-t0)/dur,1), eased=1-Math.pow(1-p,3);
        var v=Math.round(target*eased);
        el.textContent=(comma?v.toLocaleString():v)+suffix;
        if(p<1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  },{threshold:.5});
  document.querySelectorAll("[data-count]").forEach(function(el){ statIO.observe(el); });

  /* tabs */
  document.querySelectorAll("[data-tabs]").forEach(function(group){
    var tabs=group.querySelectorAll(".tab");
    tabs.forEach(function(tab){
      tab.addEventListener("click", function(){
        tabs.forEach(function(t){ t.classList.remove("active"); });
        tab.classList.add("active");
        var scope=group.getAttribute("data-tabs");
        document.querySelectorAll('[data-tab-panel][data-scope="'+scope+'"]').forEach(function(p){
          p.classList.toggle("active", p.getAttribute("data-tab-panel")===tab.getAttribute("data-tab"));
        });
      });
    });
  });

  /* ---------- shared chapter helpers ---------- */
  window.BCC=window.BCC||{};

  BCC.familyLabel=function(f){ return (window.BCC_FAMILY_LABELS&&BCC_FAMILY_LABELS[f])||f; };

  BCC.chapterCard=function(c){
    var card=document.createElement("a");
    card.className="chapter-card";
    card.href="chapter.html?c="+encodeURIComponent(c.slug);
    var statusLabel=c.status==="active"?"Active":"Forming";
    card.innerHTML=
      '<div class="cc-top">'+
        '<span class="cc-fam">'+BCC.familyLabel(c.family)+'</span>'+
        '<span class="cc-status '+c.status+'"><span class="dot"></span>'+statusLabel+'</span>'+
      '</div>'+
      '<h3>'+c.name+'</h3>'+
      '<span class="cc-loc"><svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M12 21s-7-6.5-7-11a7 7 0 0 1 14 0c0 4.5-7 11-7 11Z"/><circle cx="12" cy="10" r="2.5"/></svg>'+c.loc+'</span>'+
      '<p>'+c.desc+'</p>'+
      '<span class="cc-link">View chapter <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 12h14M13 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round"/></svg></span>';
    return card;
  };

  BCC.renderChapters=function(mountId, list){
    var mount=document.getElementById(mountId);
    if(!mount) return;
    mount.innerHTML="";
    if(!list.length){
      var empty=document.createElement("div");
      empty.className="tbl-empty";
      empty.style.gridColumn="1/-1";
      empty.innerHTML="<b>No chapters match that search — yet.</b>That's open territory. Start the chapter yourself and claim the pin.";
      mount.appendChild(empty);
      return;
    }
    list.forEach(function(c,i){
      var card=BCC.chapterCard(c);
      mount.appendChild(card);
      requestAnimationFrame(function(){ setTimeout(function(){ card.classList.add("in"); }, i*45); });
    });
  };

  /* ---------- the geographic chapter map (index hero) ----------
     Real US state geometry (assets/js/us-map.js, Albers USA projection)
     with chapter pins at true coordinates. Defaults zoomed to the
     Delaware Valley; a toggle animates out to the full United States.
     Pins, labels, and the HQ star sit in scale(var(--pk)) groups so
     they keep a constant on-screen size at any zoom level. */
  BCC.buildMap=function(){
    var svg=document.getElementById("regionMap");
    if(!svg||!window.US_MAP||!window.BCC_CHAPTERS) return;
    var ns="http://www.w3.org/2000/svg";
    var wrap=document.getElementById("mapWrap"), tip=document.getElementById("mapTip");
    var VALLEY=US_MAP.valley, USA=US_MAP.vb;

    function pk(vbW){ return vbW/400*(window.innerWidth<=680?1.4:1); }
    function setVB(v){
      svg.setAttribute("viewBox",v[0]+" "+v[1]+" "+v[2]+" "+v[3]);
      svg.style.setProperty("--pk",pk(v[2]));
      /* keep the engraved textures at a constant on-screen scale */
      var s=v[2]/975;
      ["seaTex","landTex"].forEach(function(id){
        var pat=document.getElementById(id);
        if(pat) pat.setAttribute("patternTransform","scale("+s+")");
      });
    }
    function anchored(el,x,y){ el.style.transform="translate("+x+"px,"+y+"px) scale(var(--pk))"; }

    /* ocean layer — everything behind the land is water (its own layer,
       so the land group can cast a shadow onto it) */
    var sea=document.createElementNS(ns,"rect");
    sea.setAttribute("x","-60"); sea.setAttribute("y","-60");
    sea.setAttribute("width","1095"); sea.setAttribute("height","730");
    sea.setAttribute("class","ocean");
    document.getElementById("seaLayer").appendChild(sea);
    /* states — each gets a fill pass and a texture pass */
    var sl=document.getElementById("statesLayer");
    US_MAP.states.forEach(function(s){
      var p=document.createElementNS(ns,"path");
      p.setAttribute("d",s.d);
      p.setAttribute("class","st"+(s.f?" focus":""));
      p.setAttribute("data-n",s.n);
      p.setAttribute("vector-effect","non-scaling-stroke");
      sl.appendChild(p);
    });
    US_MAP.states.forEach(function(s){
      var t=document.createElementNS(ns,"path");
      t.setAttribute("d",s.d);
      t.setAttribute("class","sttex");
      sl.appendChild(t);
    });

    /* reference city labels (valley view only) */
    var cl=document.getElementById("cityLayer");
    for(var name in US_MAP.cities){
      var xy=US_MAP.cities[name];
      var g=document.createElementNS(ns,"g");
      g.setAttribute("class","city val-only");
      anchored(g,xy[0],xy[1]);
      var d=document.createElementNS(ns,"circle");
      d.setAttribute("r","1.6"); d.setAttribute("fill","rgba(221,224,230,.6)");
      var t=document.createElementNS(ns,"text");
      t.setAttribute("x","3.4"); t.setAttribute("y","-2.6");
      t.setAttribute("font-size","8"); t.textContent=name;
      g.appendChild(d); g.appendChild(t);
      cl.appendChild(g);
    }
    /* water labels (valley view only) */
    [["Delaware River",849.5,238.5,-52],["Atlantic Ocean",884,241,-64]].forEach(function(w){
      var g=document.createElementNS(ns,"g");
      g.setAttribute("class","sea val-only");
      anchored(g,w[1],w[2]);
      var t=document.createElementNS(ns,"text");
      t.setAttribute("transform","rotate("+w[3]+")");
      t.setAttribute("font-size","8.5"); t.textContent=w[0];
      g.appendChild(t);
      cl.appendChild(g);
    });

    /* HQ star — New Hope, PA (visible at both zooms) */
    var hq=US_MAP.hq;
    var hqG=document.createElementNS(ns,"g");
    hqG.setAttribute("class","hq");
    anchored(hqG,hq[0],hq[1]);
    hqG.innerHTML=
      '<circle r="10" fill="none" stroke="rgba(231,200,120,.55)" stroke-width=".9" stroke-dasharray="2 3"/>'+
      '<path d="M0 -7 L2.1 -2.4 L7 -1.9 L3.3 1.4 L4.4 6.1 L0 3.7 L-4.4 6.1 L-3.3 1.4 L-7 -1.9 L-2.1 -2.4 Z" fill="#F0DCA0" filter="url(#hqGlow)"/>'+
      '<text class="val-only" x="-31" y="-15" font-size="7.5" fill="#E7C878" letter-spacing="1">NEW HOPE · HQ</text>';
    document.getElementById("hqLayer").appendChild(hqG);

    /* dashed network lines from HQ — near set + far set */
    var lines=document.getElementById("netLines");
    function lineTo(slug,cls){
      var c=null;
      for(var i=0;i<BCC_CHAPTERS.length;i++){ if(BCC_CHAPTERS[i].slug===slug){ c=BCC_CHAPTERS[i]; break; } }
      if(!c||!c.pin) return;
      var ln=document.createElementNS(ns,"line");
      ln.setAttribute("x1",hq[0]); ln.setAttribute("y1",hq[1]);
      ln.setAttribute("x2",c.pin[0]); ln.setAttribute("y2",c.pin[1]);
      ln.setAttribute("class",cls);
      ln.setAttribute("vector-effect","non-scaling-stroke");
      lines.appendChild(ln);
    }
    ["berks-moms-in-motion","spa23","temple-baseball","metro-adjusters","spring-grove"].forEach(function(s){ lineTo(s,"net val-only"); });
    ["uwm","halstead-high","florida-educators","salve-regina-nursing","virginia-beach","southern-tier"].forEach(function(s){ lineTo(s,"net far us-only"); });

    /* "Beyond the Valley" strip — chapters outside the mapped region */
    var beyondMount=document.getElementById("mapBeyond");
    if(beyondMount){
      var beyond=BCC_CHAPTERS.filter(function(c){return c.beyond;});
      if(beyond.length){
        beyondMount.innerHTML='<span class="bl">Beyond the Valley:</span>'+
          beyond.map(function(c){
            return '<span class="bc" data-slug="'+c.slug+'" title="'+c.name+' — '+c.loc+'">'+c.beyond+' · '+c.name+'</span>';
          }).join("");
        beyondMount.querySelectorAll(".bc").forEach(function(chip){
          chip.addEventListener("click",function(){
            location.href="chapter.html?c="+encodeURIComponent(chip.getAttribute("data-slug"));
          });
        });
      }
    }

    /* pins — one per chapter, at its real (or estimated) location */
    var layer=document.getElementById("pinLayer");
    BCC_CHAPTERS.filter(function(c){return c.pin;}).forEach(function(c,i){
      var g=document.createElementNS(ns,"g");
      g.setAttribute("class","pin-g"+(c.beyond?" far-pin":""));
      var inner=document.createElementNS(ns,"g");
      anchored(inner,c.pin[0],c.pin[1]);
      var color=c.status==="active"?"#5FB98A":"#E7C878";
      var ring=document.createElementNS(ns,"circle");
      ring.setAttribute("r","10"); ring.setAttribute("fill","none");
      ring.setAttribute("stroke",color); ring.setAttribute("stroke-width","1.4");
      ring.setAttribute("class","ring");
      ring.style.animationDelay=(i*.35)+"s";
      var dot=document.createElementNS(ns,"circle");
      dot.setAttribute("r","4.6"); dot.setAttribute("fill",color);
      dot.setAttribute("stroke","rgba(10,20,40,.9)"); dot.setAttribute("stroke-width","1.6");
      dot.setAttribute("filter","url(#pinGlow)");
      inner.appendChild(ring); inner.appendChild(dot);
      g.appendChild(inner);
      g.addEventListener("mouseenter",function(){
        if(!tip||!wrap) return;
        tip.innerHTML="<b>"+c.name+"</b>"+BCC.familyLabel(c.family)+" · "+c.loc+(c.est?" · approx.":"");
        var r=wrap.getBoundingClientRect();
        var pt=dot.getBoundingClientRect();
        tip.style.left=Math.min(r.width-190,Math.max(8,pt.left-r.left-40))+"px";
        tip.style.top=(pt.top-r.top-56)+"px";
        tip.style.opacity="1";
      });
      g.addEventListener("mouseleave",function(){ if(tip) tip.style.opacity="0"; });
      g.addEventListener("click",function(){ location.href="chapter.html?c="+encodeURIComponent(c.slug); });
      layer.appendChild(g);
      setTimeout(function(){ g.classList.add("dropped"); }, 400+i*70);
    });

    /* zoom toggle + animated viewBox + mouse-wheel zoom */
    setVB(VALLEY);
    var btnV=document.getElementById("mzValley"), btnU=document.getElementById("mzUsa");
    var current=VALLEY.slice(), animId=null;
    var AR=USA[3]/USA[2]; /* height per width */
    function ease(t){ return t<.5 ? 4*t*t*t : 1-Math.pow(-2*t+2,3)/2; }
    function setMode(usMode){
      svg.classList.toggle("us-mode",usMode);
      if(wrap) wrap.classList.toggle("us",usMode);
      if(btnV) btnV.classList.toggle("on",!usMode);
      if(btnU) btnU.classList.toggle("on",usMode);
    }
    function zoomTo(target,usMode){
      if(animId) cancelAnimationFrame(animId);
      setMode(usMode);
      if(tip) tip.style.opacity="0";
      /* the pull-back to the whole country deserves a slow, cinematic ride */
      var from=current.slice(), t0=null, dur=usMode?2400:1600;
      function frame(now){
        if(!t0) t0=now;
        var p=Math.min((now-t0)/dur,1), e=ease(p);
        for(var i=0;i<4;i++){ current[i]=from[i]+(target[i]-from[i])*e; }
        setVB(current);
        if(p<1){ animId=requestAnimationFrame(frame); } else { animId=null; }
      }
      animId=requestAnimationFrame(frame);
    }
    if(btnV) btnV.addEventListener("click",function(){ zoomTo(VALLEY,false); });
    if(btnU) btnU.addEventListener("click",function(){ zoomTo(USA,true); });

    /* scroll-wheel zoom, anchored at the cursor */
    svg.addEventListener("wheel",function(e){
      e.preventDefault();
      if(animId){ cancelAnimationFrame(animId); animId=null; }
      var f=e.deltaY>0?1.16:1/1.16;
      var newW=Math.min(USA[2],Math.max(45,current[2]*f));
      f=newW/current[2];
      if(f===1) return;
      var r=svg.getBoundingClientRect();
      var mx=current[0]+(e.clientX-r.left)/r.width*current[2];
      var my=current[1]+(e.clientY-r.top)/r.height*current[3];
      current[2]*=f; current[3]=current[2]*AR;
      current[0]=mx-(mx-current[0])*f;
      current[1]=my-(my-current[1])*f;
      /* keep the view over the map */
      current[0]=Math.max(-60,Math.min(1035-current[2],current[0]));
      current[1]=Math.max(-60,Math.min(670-current[3],current[1]));
      setVB(current);
      setMode(current[2]>300);
      if(tip) tip.style.opacity="0";
    },{passive:false});
  };
})();
