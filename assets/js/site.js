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

  /* map pins on the hero (index) */
  BCC.dropPins=function(layerId, tipId, wrapId){
    var layer=document.getElementById(layerId);
    if(!layer||!window.BCC_CHAPTERS) return;
    var tip=document.getElementById(tipId), wrap=document.getElementById(wrapId);
    var ns="http://www.w3.org/2000/svg";

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

    BCC_CHAPTERS.filter(function(c){return c.pin;}).forEach(function(c,i){
      var g=document.createElementNS(ns,"g");
      g.setAttribute("class","pin-g");
      g.style.setProperty("--px",c.pin[0]+"px");
      g.style.setProperty("--py",c.pin[1]+"px");
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
      g.appendChild(ring); g.appendChild(dot);
      g.addEventListener("mouseenter",function(evt){
        if(!tip||!wrap) return;
        tip.innerHTML="<b>"+c.name+"</b>"+BCC.familyLabel(c.family)+" · "+c.loc;
        var r=wrap.getBoundingClientRect();
        var pt=dot.getBoundingClientRect();
        tip.style.left=Math.min(r.width-190,Math.max(8,pt.left-r.left-40))+"px";
        tip.style.top=(pt.top-r.top-56)+"px";
        tip.style.opacity="1";
      });
      g.addEventListener("mouseleave",function(){ if(tip) tip.style.opacity="0"; });
      g.addEventListener("click",function(){ location.href="chapter.html?c="+encodeURIComponent(c.slug); });
      layer.appendChild(g);
      setTimeout(function(){ g.classList.add("dropped"); }, 400+i*90);
    });
  };
})();
