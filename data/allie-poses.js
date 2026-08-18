/* ============================================================
   ALLIE — the Biz Connect Coalition guide — pose manifest
   Six full-body head-to-toe poses, generated from the original
   Allie character reference (Gemini/Nano Banana, chroma-keyed).
   Each pose: { src, flip: true|false, alt }
   ADD NEW POSES: drop a transparent PNG into assets/img/allie/
   and add a row — the widget picks it up automatically. The pose
   shown is chosen per-page, then cycles with a crossfade.
   ============================================================ */
window.ALLIE_POSES = [
  { src:"assets/img/allie/allie-pose-wave.png",         flip:false, alt:"Allie waving hello" },
  { src:"assets/img/allie/allie-pose-point.png",        flip:false, alt:"Allie pointing something out" },
  { src:"assets/img/allie/allie-pose-welcome.png",      flip:false, alt:"Allie welcoming you with open arms" },
  { src:"assets/img/allie/allie-pose-thumbsup.png",     flip:false, alt:"Allie giving a thumbs up" },
  { src:"assets/img/allie/allie-pose-arms-crossed.png", flip:false, alt:"Allie standing confidently" },
  { src:"assets/img/allie/allie-pose-clipboard.png",    flip:false, alt:"Allie holding a clipboard, ready to help" }
];

/* which pose greets you on each page (index into ALLIE_POSES) */
window.ALLIE_PAGE_POSE = {
  "index.html": 0,            /* wave hello */
  "chapters.html": 1,         /* pointing */
  "chapter.html": 2,          /* welcoming */
  "start-a-chapter.html": 5,  /* clipboard — application time */
  "membership.html": 3,       /* thumbs up */
  "facilitators.html": 4,     /* arms crossed, confident */
  "faq.html": 1,
  "contact.html": 0,
  "portal.html": 5
};

/* what Allie says, per page */
window.ALLIE_LINES = {
  "index.html":            ["Hi, I'm Allie! 👋 New here? Start with the chapter map — one of those pins is yours.",
                            "Every chapter starts with something people already share. What do you share?"],
  "chapters.html":         ["Looking for your people? Try the search — or claim open territory and start your own.",
                            "Don't see your community? That's first-mover advantage."],
  "chapter.html":          ["Every chapter starts with one connector. Maybe that's you?",
                            "Peek at the Premium Directory tab — that's where the referrals live."],
  "start-a-chapter.html":  ["Three quick steps and the pin is yours. I'll wait right here.",
                            "Facilitators get Premium free, forever. Just saying."],
  "membership.html":       ["Core is free forever. The ladder's here whenever you're ready.",
                            "Premium pays for itself with one good referral."],
  "facilitators.html":     ["Host the room, own the pin, share the upside. The math is right there.",
                            "One evening a month. That's the whole job."],
  "faq.html":              ["Questions? You're in exactly the right place.",
                            "If it's not answered here, the contact page reaches a real person."],
  "contact.html":          ["We read everything. Say hi!",
                            "Tell us about your community — we love this part."],
  "portal.html":           ["Your dashboard is coming online — this is a preview of what members get.",
                            "Referrals, directories, events — all tracked in one place soon."]
};
