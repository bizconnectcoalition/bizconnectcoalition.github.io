/* ============================================================
   ALLIE — floating guide + Q&A chat
   Appears ~5s after load, poses per page, crossfades poses.
   CLICK her to open the chat panel: type or speak a question and
   she answers from data/allie-brain.js (plus live chapter data).
   ============================================================ */
(function(){
  "use strict";
  if(!window.ALLIE_POSES || !ALLIE_POSES.length) return;
  if(sessionStorage.getItem("allieHidden")==="1") return;

  var page=(location.pathname.split("/").pop()||"index.html");
  var lines=(window.ALLIE_LINES&&ALLIE_LINES[page])||["Hi, I'm Allie — happy to help you find your chapter."];
  var openers=(window.ALLIE_PAGE_OPENERS&&ALLIE_PAGE_OPENERS[page])||["What is Biz Connect Coalition?","How much does it cost?"];
  var POSE_CYCLE_MS=22000, APPEAR_MS=5000, BUBBLE_MS=9000;

  function hash(s){ var h=0; for(var i=0;i<s.length;i++){ h=(h*31+s.charCodeAt(i))>>>0; } return h; }
  var poseIx=(window.ALLIE_PAGE_POSE&&typeof ALLIE_PAGE_POSE[page]==="number")
    ? ALLIE_PAGE_POSE[page]%ALLIE_POSES.length
    : hash(page)%ALLIE_POSES.length;
  var lineIx=0;

  /* ---------------- DOM ---------------- */
  var root=document.createElement("div");
  root.className="allie";
  root.setAttribute("role","complementary");
  root.setAttribute("aria-label","Allie, the Biz Connect Coalition guide");
  root.innerHTML=
    '<div class="allie-chat" id="allieChat" role="dialog" aria-label="Chat with Allie">'+
      '<div class="ac-head"><span class="ac-dot"></span><b>Allie</b><span class="ac-sub">Coalition guide</span>'+
        '<button class="ac-close" id="allieChatClose" aria-label="Close chat">&times;</button></div>'+
      '<div class="ac-msgs" id="allieMsgs"></div>'+
      '<div class="ac-chips" id="allieChips"></div>'+
      '<div class="ac-input">'+
        '<input type="text" id="allieInput" placeholder="Ask me anything…" aria-label="Ask Allie a question" maxlength="300">'+
        '<button id="allieMic" aria-label="Speak your question" title="Speak your question">'+
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10v1a7 7 0 0 0 14 0v-1M12 18v4"/></svg></button>'+
        '<button id="allieSend" aria-label="Send">'+
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 12h14M13 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round"/></svg></button>'+
      '</div>'+
    '</div>'+
    '<div class="allie-bubble" id="allieBubble" aria-live="polite"></div>'+
    '<button class="allie-close" id="allieClose" aria-label="Hide Allie" title="Hide Allie">&times;</button>'+
    '<div class="allie-figure" id="allieFigure" title="Click to chat with Allie">'+
      '<img class="allie-img on" id="allieImgA" alt="">'+
      '<img class="allie-img" id="allieImgB" alt="">'+
    '</div>';
  document.body.appendChild(root);

  var imgA=document.getElementById("allieImgA"),
      imgB=document.getElementById("allieImgB"),
      bubble=document.getElementById("allieBubble"),
      figure=document.getElementById("allieFigure"),
      chat=document.getElementById("allieChat"),
      msgs=document.getElementById("allieMsgs"),
      chips=document.getElementById("allieChips"),
      input=document.getElementById("allieInput"),
      frontIsA=true, bubbleTimer=null, chatOpened=false;

  function applyPose(img,p){ img.src=p.src; img.alt=p.alt; img.classList.toggle("flip",!!p.flip); }
  applyPose(imgA,ALLIE_POSES[poseIx]);
  ALLIE_POSES.forEach(function(p){ var i=new Image(); i.src=p.src; });

  function nextPose(){
    poseIx=(poseIx+1)%ALLIE_POSES.length;
    var front=frontIsA?imgA:imgB, back=frontIsA?imgB:imgA;
    applyPose(back,ALLIE_POSES[poseIx]);
    var go=function(){ back.classList.add("on"); front.classList.remove("on"); frontIsA=!frontIsA; };
    if(back.complete) requestAnimationFrame(go); else back.onload=function(){ requestAnimationFrame(go); };
  }

  function say(text){
    if(chat.classList.contains("open")) return; /* no ambient tips while chatting */
    bubble.textContent=text;
    bubble.classList.add("show");
    clearTimeout(bubbleTimer);
    bubbleTimer=setTimeout(function(){ bubble.classList.remove("show"); }, BUBBLE_MS);
  }

  setTimeout(function(){
    root.classList.add("in");
    setTimeout(function(){ say(lines[0]); }, 900);
  }, APPEAR_MS);

  setInterval(function(){
    if(!root.classList.contains("in")) return;
    nextPose();
    lineIx=(lineIx+1)%lines.length;
    if(lineIx!==0){ say(lines[lineIx]); }
  }, POSE_CYCLE_MS);

  document.getElementById("allieClose").addEventListener("click",function(){
    root.classList.add("bye");
    sessionStorage.setItem("allieHidden","1");
    setTimeout(function(){ root.remove(); }, 600);
  });

  /* ---------------- Q&A engine ---------------- */
  var STOP={the:1,a:1,an:1,is:1,are:1,do:1,does:1,i:1,me:1,my:1,you:1,your:1,to:1,of:1,in:1,on:1,for:1,it:1,and:1,or:1,can:1,how:1,what:1,whats:1,who:1,when:1,where:1,why:1,tell:1,about:1,with:1,get:1,be:1,this:1,that:1,there:1,much:1,many:1,any:1,have:1,has:1,was:1,at:1};
  var SYN={price:"cost",prices:"cost",pricing:"cost",costs:"cost",fees:"fee",member:"membership",members:"membership",signup:"join","sign":"join",veterans:"veteran",vets:"veteran",vet:"veteran",kids:"family",located:"location",owner:"founder",boss:"founder",speak:"contact",talk:"contact",call:"contact",begin:"start",create:"start",open:"start",earnings:"earn",money:"earn",salary:"earn",income:"earn"};

  function norm(s){
    return s.toLowerCase().replace(/[^a-z0-9\s]/g," ").split(/\s+/).filter(Boolean)
      .map(function(w){ return SYN[w]||w; })
      .filter(function(w){ return !STOP[w]; });
  }

  function chapterLookup(qRaw){
    if(!window.BCC_CHAPTERS) return null;
    var q=qRaw.toLowerCase();
    for(var i=0;i<BCC_CHAPTERS.length;i++){
      var c=BCC_CHAPTERS[i];
      var nameBits=c.name.toLowerCase().replace(/[^a-z0-9\s]/g,"").split(/\s+/).filter(function(w){return w.length>3 && w!=="chapter";});
      var hits=nameBits.filter(function(w){ return q.indexOf(w)>=0; }).length;
      if((hits>=2)||(hits>=1&&nameBits.length===1)||q.indexOf(c.name.toLowerCase())>=0){
        var status=c.status==="active"?"an active chapter":"a forming chapter looking for founding members";
        return { a:c.name+" is "+status+" in the "+(window.BCC_FAMILY_LABELS?BCC_FAMILY_LABELS[c.family]:c.family)+" family, based in "+c.loc+". "+c.desc+" You can see its page in the chapter list!",
                 s:["Take me to the chapter list","How do I join a chapter?"] };
      }
    }
    return null;
  }

  function dynamicAnswer(text){
    if(text==="__DYNAMIC_COUNT__"){
      var n=window.BCC_CHAPTERS?BCC_CHAPTERS.length:38;
      var act=window.BCC_CHAPTERS?BCC_CHAPTERS.filter(function(c){return c.status==="active";}).length:6;
      return "There are "+n+" communities in the network today across five chapter families — "+act+" active and the rest forming and looking for founding members. Most cluster around the greater Philadelphia region, with chapters reaching Florida, Wisconsin, Kansas, Rhode Island, and Virginia.";
    }
    if(text==="__DYNAMIC_ACTIVE__"){
      var actives=window.BCC_CHAPTERS?BCC_CHAPTERS.filter(function(c){return c.status==="active";}):[];
      if(!actives.length) return "Check the Chapters page for the live list — you can filter by family and search by city or state.";
      return "Our active chapters right now: "+actives.map(function(c){return c.name+" ("+c.loc+")";}).join(", ")+". Dozens more are forming — including maybe yours!";
    }
    return text;
  }

  function answer(qRaw){
    /* 1. specific chapter lookup */
    var ch=chapterLookup(qRaw);
    if(ch) return ch;
    /* 2. keyword scoring over the brain */
    var words=norm(qRaw), qLow=qRaw.toLowerCase();
    var best=null, bestScore=0;
    ALLIE_BRAIN.forEach(function(entry){
      if(entry.k[0]==="__CHAPTER_LOOKUP__") return;
      var score=0;
      entry.k.forEach(function(kw){
        if(kw.indexOf(" ")>=0){ if(qLow.indexOf(kw)>=0) score+=3; }
        else { var k2=SYN[kw]||kw; if(words.indexOf(k2)>=0||words.indexOf(kw)>=0) score+=1; }
      });
      if(score>bestScore){ bestScore=score; best=entry; }
    });
    if(best&&bestScore>0){
      return { a:dynamicAnswer(best.a), s:best.s||[] };
    }
    return { a:"Great question — that one's beyond my notes! The team can answer it personally through the Contact page, and they genuinely read everything. Meanwhile, I'm solid on membership, chapters, events, and facilitating — try me.",
             s:["How much does it cost?","How do I start a chapter?","Contact the team"] };
  }

  /* ---------------- chat UI ---------------- */
  function esc(s){ return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;"); }

  function addMsg(text,who){
    var m=document.createElement("div");
    m.className="ac-msg "+who;
    m.innerHTML=esc(text);
    msgs.appendChild(m);
    msgs.scrollTop=msgs.scrollHeight;
    return m;
  }

  function setChips(list){
    chips.innerHTML="";
    (list||[]).slice(0,3).forEach(function(t){
      var c=document.createElement("button");
      c.className="ac-chip"; c.textContent=t;
      c.addEventListener("click",function(){ ask(t); });
      chips.appendChild(c);
    });
  }

  var NAV={"take me to the chapter list":"chapters.html","find a chapter":"chapters.html","open the contact page":"contact.html","contact the team":"contact.html","start a chapter instead":"start-a-chapter.html","show me the portal preview":"portal.html","show me veteran biz connect":"chapter.html?c=veteran-biz-connect","show me that chapter":"chapter.html?c=inspire-fcu","see the inspire fcu chapter":"chapter.html?c=inspire-fcu"};

  function ask(q){
    addMsg(q,"user");
    setChips([]);
    input.value="";
    var nav=NAV[q.toLowerCase()];
    var typing=document.createElement("div");
    typing.className="ac-msg allie typing";
    typing.innerHTML="<span></span><span></span><span></span>";
    msgs.appendChild(typing); msgs.scrollTop=msgs.scrollHeight;
    setTimeout(function(){
      typing.remove();
      if(nav){
        addMsg("Right this way!","allie");
        setTimeout(function(){ location.href=nav; }, 700);
        return;
      }
      var res=answer(q);
      addMsg(res.a,"allie");
      setChips(res.s&&res.s.length?res.s:openers);
      nextPose(); /* she strikes a new pose when she answers */
    }, 650+Math.random()*500);
  }

  function openChat(){
    chat.classList.add("open");
    bubble.classList.remove("show");
    figure.classList.add("chatting");
    if(!chatOpened){
      chatOpened=true;
      addMsg("Hi! I'm Allie 👋 Ask me anything about the Coalition — or tap a question below.","allie");
      setChips(openers);
    }
    setTimeout(function(){ input.focus(); }, 350);
  }
  function closeChat(){
    chat.classList.remove("open");
    figure.classList.remove("chatting");
  }

  figure.addEventListener("click",function(){
    if(chat.classList.contains("open")) closeChat(); else openChat();
  });
  document.getElementById("allieChatClose").addEventListener("click",closeChat);
  document.getElementById("allieSend").addEventListener("click",function(){
    var q=input.value.trim(); if(q) ask(q);
  });
  input.addEventListener("keydown",function(e){
    if(e.key==="Enter"){ var q=input.value.trim(); if(q) ask(q); }
  });

  /* ---------------- voice input ---------------- */
  var micBtn=document.getElementById("allieMic");
  var SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!SR){ micBtn.style.display="none"; }
  else{
    var rec=null, listening=false;
    micBtn.addEventListener("click",function(){
      if(listening){ try{rec.stop();}catch(e){} return; }
      try{
        rec=new SR();
        rec.lang="en-US"; rec.interimResults=true; rec.maxAlternatives=1;
        listening=true; micBtn.classList.add("listening");
        input.placeholder="Listening…";
        rec.onresult=function(ev){
          var t="";
          for(var i=0;i<ev.results.length;i++){ t+=ev.results[i][0].transcript; }
          input.value=t;
          if(ev.results[ev.results.length-1].isFinal){
            var q=t.trim();
            if(q) setTimeout(function(){ ask(q); }, 300);
          }
        };
        rec.onend=function(){ listening=false; micBtn.classList.remove("listening"); input.placeholder="Ask me anything…"; };
        rec.onerror=function(){ listening=false; micBtn.classList.remove("listening"); input.placeholder="Ask me anything…"; };
        rec.start();
      }catch(e){ listening=false; micBtn.classList.remove("listening"); }
    });
  }
})();
