/* ============================================================
   BIZ CONNECT COALITION — chapter roster
   Source: BCC asset library (Google Drive, July 2026) + old-site captures.
   EDIT ME: status is provisional — set "active" | "forming",
   fix cities/regions, add/remove chapters freely. The chapters
   page, homepage map, and chapter detail pages all read this file.
   families: member | alumni | veteran | heroes | circle
   regions:  northeast | south | midwest | west
   pin: [x, y] in the US_MAP projected space (975x610, Albers USA)
        — real geographic coordinates, generated from each chapter's
        town. est:1 marks a best-guess location (no exact town known).
        beyond:"XX" chapters also appear in the map card's
        "Beyond the Valley" strip and show as pins on the USA view.
   ============================================================ */
window.BCC_CHAPTERS = [
  {
    slug:"nac", name:"Newtown Athletic Club", family:"member", region:"northeast",
    loc:"Newtown, PA", status:"active", pin:[856.69,230.1],
    desc:"The flagship Member Biz Connect chapter — business owners and professionals who share the NAC floor, now sharing referrals."
  },
  {
    slug:"inspire-fcu", name:"Inspire Federal Credit Union", family:"veteran", region:"northeast",
    loc:"Langhorne, PA", status:"active", pin:[857.2,231.27],
    desc:"Infusing veteran-owned businesses with Inspire FCU — serving Langhorne, Newtown, Bristol, Warminster, and Bensalem since 1936. Monthly networking nights with food, speakers, and community."
  },
  {
    slug:"berks-moms-in-motion", name:"Berks Moms in Motion", family:"member", region:"northeast",
    loc:"Berks County, PA", status:"active", pin:[839.57,231.37],
    desc:"A community of entrepreneurial moms across Berks County turning friendship into a business directory that works."
  },
  {
    slug:"veteran-biz-connect", name:"Veteran Biz Connect", family:"veteran", region:"northeast",
    loc:"Nationwide · HQ New Hope, PA", status:"active", pin:[855.46,227.66],
    desc:"For those who served — veterans building businesses among brothers and sisters in arms, coast to coast. Home of the Veteran-Owned Business Directory."
  },
  {
    slug:"heroes-biz-connect", name:"Heroes Biz Connect", family:"heroes", region:"northeast",
    loc:"Nationwide · HQ New Hope, PA", status:"active", pin:[856.1,226.58],
    desc:"First responders — firefighters, police, EMS — doing business shoulder to shoulder."
  },
  {
    slug:"spa23", name:"Spa23 Business Coalition", family:"member", region:"northeast",
    loc:"Pompton Plains, NJ", status:"active", pin:[863.41,211.24],
    desc:"The Spa23 fitness community's own business coalition — training partners turned referral partners."
  },
  {
    slug:"vfw-post-9045", name:"VFW Post 9045", family:"veteran", region:"northeast",
    loc:"Northeast", status:"forming", pin:[858.76,232.65],est:1,est:1,
    desc:"A Veteran Biz Connect chapter anchored to the post — service, community, and commerce under one roof."
  },
  {
    slug:"conwell-egan", name:"Conwell-Egan Catholic HS", family:"alumni", region:"northeast",
    loc:"Fairless Hills, PA", status:"forming", pin:[858.3,230.91],
    desc:"Eagles alumni doing business with the people who shared the same halls and the same colors."
  },
  {
    slug:"cranford-hs", name:"Cranford HS Alumni", family:"alumni", region:"northeast",
    loc:"Cranford, NJ", status:"forming", pin:[865.13,218.09],
    desc:"Cranford graduates turning a hometown bond into a professional network."
  },
  {
    slug:"spring-grove", name:"Spring Grove HS Alumni", family:"alumni", region:"northeast",
    loc:"Spring Grove, PA", status:"forming", pin:[825.93,245.01],
    desc:"Rocket pride, real referrals — the Spring Grove alumni business network."
  },
  {
    slug:"villa-joseph-marie", name:"Villa Joseph Marie", family:"alumni", region:"northeast",
    loc:"Holland, PA", status:"forming", pin:[856.24,230.47],
    desc:"VJM alumnae supporting each other's practices, firms, and ventures."
  },
  {
    slug:"wayne-hs", name:"Wayne High School Alumni", family:"alumni", region:"northeast",
    loc:"Wayne, NJ", status:"forming", pin:[864.13,212.05],
    desc:"Wayne graduates networking around the connection that never graduates."
  },
  {
    slug:"cr-alumni", name:"CR Alumni Biz Connect", family:"alumni", region:"northeast",
    loc:"Bucks County, PA", status:"forming", pin:[855.53,230.69],
    desc:"Council Rock alumni building a business directory out of a shared alma mater."
  },
  {
    slug:"temple-baseball", name:"Temple Baseball Alumni", family:"alumni", region:"northeast",
    loc:"Philadelphia, PA", status:"forming", pin:[854.26,236.47],
    desc:"Former Owls ballplayers keeping the roster together in business."
  },
  {
    slug:"passaic-county", name:"Passaic County", family:"member", region:"northeast",
    loc:"Passaic County, NJ", status:"forming", pin:[865.9,211.84],
    desc:"North Jersey business owners connected by county lines and common ground."
  },
  {
    slug:"wayne-parents", name:"Wayne Parents Networking", family:"member", region:"northeast",
    loc:"Wayne, NJ", status:"forming", pin:[864.53,211.45],
    desc:"Parents from the same sidelines and school runs, building each other's businesses."
  },
  {
    slug:"metro-adjusters", name:"Metro Adjusters", family:"member", region:"northeast",
    loc:"Metro NY/NJ", status:"forming", pin:[866.84,215.88],
    desc:"Public adjusters and property-claim professionals sharing a metro and a market."
  },
  {
    slug:"pa-fitness", name:"PA Fitness", family:"member", region:"northeast",
    loc:"Pennsylvania", status:"forming", pin:[845.9,223.75],est:1,est:1,
    desc:"Members of PA Fitness connecting reps to referrals."
  },
  {
    slug:"non-stop-fitness", name:"Non Stop Fitness", family:"member", region:"northeast",
    loc:"Northeast", status:"forming", pin:[853.05,229.02],est:1,est:1,
    desc:"A gym-floor chapter where the 6am crew becomes the referral crew."
  },
  {
    slug:"retro-fitness", name:"Retro Fitness", family:"member", region:"northeast",
    loc:"Northeast", status:"forming", pin:[869.28,225.78],est:1,est:1,
    desc:"The Retro Fitness community's business network — old-school effort, new-school connections."
  },
  {
    slug:"garage-barre", name:"Garage Barre", family:"member", region:"northeast",
    loc:"Northeast", status:"forming", pin:[858.31,229.45],est:1,est:1,
    desc:"A boutique studio community turning class camaraderie into client flow."
  },
  {
    slug:"pounding-golf-balls", name:"Pounding Golf Balls", family:"member", region:"northeast",
    loc:"Northeast", status:"forming", pin:[852.28,232.84],est:1,est:1,
    desc:"Business gets done on the range — a golf community chapter."
  },
  {
    slug:"arete-syndicate", name:"Arete Syndicate", family:"circle", region:"northeast",
    loc:"Invitation only", status:"forming", pin:[849.68,234.95],est:1,est:1,
    desc:"A curated circle of high-performing operators — one seat per industry."
  },
  {
    slug:"defiant-syndicate", name:"Defiant Syndicate", family:"circle", region:"northeast",
    loc:"Invitation only", status:"forming", pin:[854.11,232.68],est:1,est:1,
    desc:"Founders who play offense — an invitation-only referral circle."
  },
  {
    slug:"medlogic", name:"MedLogic", family:"member", region:"northeast",
    loc:"Northeast", status:"forming", pin:[852.8,236.17],est:1,est:1,
    desc:"Healthcare-adjacent professionals and vendors networking inside their own vertical."
  },
  {
    slug:"real-estate-show", name:"The Real Estate Show", family:"member", region:"northeast",
    loc:"Northeast", status:"forming", pin:[857.09,233.03],est:1,est:1,
    desc:"Agents, investors, lenders, and trades — the whole deal table in one chapter."
  },
  {
    slug:"connector-street", name:"Connector Street", family:"member", region:"northeast",
    loc:"Northeast", status:"forming", pin:[856.55,223.49],est:1,est:1,
    desc:"Main-street connectors who know everyone — and now have a directory to prove it."
  },
  {
    slug:"coming-together", name:"Coming Together Community", family:"member", region:"northeast",
    loc:"Northeast", status:"forming", pin:[860.55,226.22],est:1,est:1,
    desc:"A faith-and-community anchored chapter where connection comes before commerce."
  },
  {
    slug:"fhaa", name:"FHAA", family:"alumni", region:"northeast",
    loc:"Northeast", status:"forming", pin:[855.31,235.29],est:1,est:1,
    desc:"An athletic association's alumni keeping the team together in business."
  },

  /* ---- beyond the Delaware Valley ---- */
  {
    slug:"salve-regina-nursing", name:"Salve Regina Nursing", family:"alumni", region:"northeast",
    loc:"Newport, RI", status:"forming", beyond:"RI", pin:[909.7,187.39],
    desc:"Salve Regina nursing alumni — a trusted circle for practices, services, and career moves."
  },
  {
    slug:"southern-tier", name:"Southern Tier", family:"member", region:"northeast",
    loc:"Southern Tier, NY", status:"forming", beyond:"NY", pin:[831.27,191.91],
    desc:"Upstate New York's Southern Tier — small-market businesses with big-network reach."
  },
  {
    slug:"uwm", name:"UWM Alumni", family:"alumni", region:"midwest",
    loc:"Milwaukee, WI", status:"forming", beyond:"WI", pin:[631.34,200.1],
    desc:"University of Wisconsin–Milwaukee alumni doing business Panther to Panther."
  },
  {
    slug:"halstead-high", name:"Halstead High Alumni", family:"alumni", region:"midwest",
    loc:"Halstead, KS", status:"forming", beyond:"KS", pin:[471.32,320.85],
    desc:"Small town, strong ties — Halstead alumni in business together."
  },
  {
    slug:"virginia-beach", name:"Virginia Beach", family:"member", region:"south",
    loc:"Virginia Beach, VA", status:"forming", beyond:"VA", pin:[855.4,309.57],
    desc:"Coastal Virginia professionals networking where they already live and play."
  },
  {
    slug:"uss-america", name:"USS America", family:"veteran", region:"south",
    loc:"Shipmates nationwide", status:"forming", beyond:"USA", pin:[848.57,309.18],est:1,est:1,
    desc:"Shipmates of the USS America reconnecting around business, referrals, and mutual support."
  },
  {
    slug:"florida-educators", name:"Florida Educators", family:"member", region:"south",
    loc:"Florida", status:"forming", beyond:"FL", pin:[788.96,514.55],est:1,est:1,
    desc:"Educators across Florida with businesses, side ventures, and services — connected."
  },
  {
    slug:"swfl-entrepreneurs", name:"SWFL Entrepreneurs", family:"member", region:"south",
    loc:"Fort Myers, FL", status:"forming", beyond:"FL", pin:[785.56,558.43],
    desc:"Southwest Florida founders and operators trading local knowledge and warm referrals."
  },
  {
    slug:"san-carlos-park", name:"San Carlos Park", family:"member", region:"south",
    loc:"San Carlos Park, FL", status:"forming", beyond:"FL", pin:[787.58,562.07],
    desc:"A neighborhood chapter for the businesses that make San Carlos Park run."
  },
  {
    slug:"gateway-residents", name:"Gateway Residents", family:"member", region:"south",
    loc:"Gateway, FL", status:"forming", beyond:"FL", pin:[788.25,559.43],
    desc:"A residents' chapter — neighbors first, referral partners second."
  }
];

window.BCC_FAMILY_LABELS = {
  member:"Member Biz Connect",
  alumni:"Alumni Biz Connect",
  veteran:"Veteran Biz Connect",
  heroes:"Heroes Biz Connect",
  circle:"Circle Biz Connect"
};
