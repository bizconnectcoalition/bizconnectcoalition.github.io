/* ============================================================
   ALLIE — the Biz Connect Coalition guide — pose manifest
   Each pose: { src, style: "cutout" | "circle", flip: true|false, alt }
   ADD NEW POSES HERE: drop a transparent PNG into assets/img/allie/
   and add a row — the widget picks it up automatically. Pose shown
   is chosen per-page, then cycles with a crossfade over time.
   ============================================================ */
window.ALLIE_POSES = [
  { src:"assets/img/allie/allie-cutout.png",  style:"cutout", flip:false, alt:"Allie, the Biz Connect Coalition guide, smiling" },
  { src:"assets/img/allie/allie-avatar.png",  style:"circle", flip:false, alt:"Allie smiling in a portrait circle" },
  { src:"assets/img/allie/allie-cutout.png",  style:"cutout", flip:true,  alt:"Allie glancing the other way" },
  { src:"assets/img/allie/allie-portrait.png",style:"circle", flip:false, alt:"Allie in a warm portrait" },
  { src:"assets/img/allie/allie-cutout.png",  style:"cutout", flip:false, alt:"Allie ready to help" },
  { src:"assets/img/allie/allie-avatar.png",  style:"circle", flip:true,  alt:"Allie looking over" }
];

/* which pose greets you on each page (index into ALLIE_POSES) */
window.ALLIE_PAGE_POSE = {
  "index.html": 0,            /* full-figure cutout */
  "chapters.html": 1,         /* circle avatar */
  "chapter.html": 2,          /* cutout, mirrored */
  "start-a-chapter.html": 4,  /* cutout, ready */
  "membership.html": 3,       /* warm portrait */
  "facilitators.html": 0,
  "faq.html": 5,              /* avatar, mirrored */
  "contact.html": 3,
  "portal.html": 1
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
