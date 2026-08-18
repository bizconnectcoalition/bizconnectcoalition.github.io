/* ============================================================
   ALLIE — floating guide widget
   Appears ~5s after page load, follows across pages, strikes a
   different pose per page, and crossfades to a new pose every
   ~22 seconds. Dismissable (remembered for the browser session).
   Poses + lines live in data/allie-poses.js.
   ============================================================ */
(function(){
  "use strict";
  if(!window.ALLIE_POSES || !ALLIE_POSES.length) return;
  if(sessionStorage.getItem("allieHidden")==="1") return;

  var page=(location.pathname.split("/").pop()||"index.html");
  var lines=(window.ALLIE_LINES&&ALLIE_LINES[page])||["Hi, I'm Allie — happy to help you find your chapter."];
  var POSE_CYCLE_MS=22000, APPEAR_MS=5000, BUBBLE_MS=9000;

  /* pick a starting pose per page: explicit map first, hash fallback */
  function hash(s){ var h=0; for(var i=0;i<s.length;i++){ h=(h*31+s.charCodeAt(i))>>>0; } return h; }
  var poseIx=(window.ALLIE_PAGE_POSE&&typeof ALLIE_PAGE_POSE[page]==="number")
    ? ALLIE_PAGE_POSE[page]%ALLIE_POSES.length
    : hash(page)%ALLIE_POSES.length;
  var lineIx=0;

  /* build DOM */
  var root=document.createElement("div");
  root.className="allie";
  root.setAttribute("role","complementary");
  root.setAttribute("aria-label","Allie, the Biz Connect Coalition guide");
  root.innerHTML=
    '<div class="allie-bubble" id="allieBubble" aria-live="polite"></div>'+
    '<button class="allie-close" id="allieClose" aria-label="Hide Allie" title="Hide Allie">&times;</button>'+
    '<div class="allie-figure" id="allieFigure">'+
      '<img class="allie-img on" id="allieImgA" alt="">'+
      '<img class="allie-img" id="allieImgB" alt="">'+
    '</div>';
  document.body.appendChild(root);

  var imgA=document.getElementById("allieImgA"),
      imgB=document.getElementById("allieImgB"),
      bubble=document.getElementById("allieBubble"),
      figure=document.getElementById("allieFigure"),
      frontIsA=true, bubbleTimer=null;

  function applyPose(img,p){
    img.src=p.src; img.alt=p.alt;
    img.classList.toggle("flip",!!p.flip);
    figure.classList.toggle("circle",p.style==="circle");
  }
  applyPose(imgA,ALLIE_POSES[poseIx]);

  /* preload the rest */
  ALLIE_POSES.forEach(function(p){ var i=new Image(); i.src=p.src; });

  function nextPose(){
    poseIx=(poseIx+1)%ALLIE_POSES.length;
    var front=frontIsA?imgA:imgB, back=frontIsA?imgB:imgA;
    applyPose(back,ALLIE_POSES[poseIx]);
    /* crossfade once the incoming image is ready */
    var go=function(){
      back.classList.add("on"); front.classList.remove("on");
      frontIsA=!frontIsA;
    };
    if(back.complete) requestAnimationFrame(go); else back.onload=function(){ requestAnimationFrame(go); };
  }

  function say(text){
    bubble.textContent=text;
    bubble.classList.add("show");
    clearTimeout(bubbleTimer);
    bubbleTimer=setTimeout(function(){ bubble.classList.remove("show"); }, BUBBLE_MS);
  }

  /* appear after ~5s */
  setTimeout(function(){
    root.classList.add("in");
    setTimeout(function(){ say(lines[0]); }, 900);
  }, APPEAR_MS);

  /* cycle poses (and rotate her line every other cycle) */
  setInterval(function(){
    if(!root.classList.contains("in")) return;
    nextPose();
    lineIx=(lineIx+1)%lines.length;
    if(lineIx!==0){ say(lines[lineIx]); }
  }, POSE_CYCLE_MS);

  /* click Allie = toggle her tip */
  figure.addEventListener("click",function(){
    if(bubble.classList.contains("show")){ bubble.classList.remove("show"); }
    else{ say(lines[lineIx]); }
  });

  /* dismiss for this browser session */
  document.getElementById("allieClose").addEventListener("click",function(){
    root.classList.add("bye");
    sessionStorage.setItem("allieHidden","1");
    setTimeout(function(){ root.remove(); }, 600);
  });
})();
