import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/user.model.js";
import Post from "./models/post.model.js";
import Category from "./models/category.model.js";

dotenv.config({ path: "./.env" });

const categoriesData = [
  {
    name: "Technology",
    nameHi: "प्रौद्योगिकी",
    slug: "technology",
    subcategories: [
      { name: "Artificial Intelligence", nameHi: "कृत्रिम बुद्धिमत्ता", slug: "artificial-intelligence" },
      { name: "Mobile & Gadgets", nameHi: "मोबाइल और गैजेट्स", slug: "mobile-gadgets" },
    ]
  },
  {
    name: "Sports",
    nameHi: "खेल",
    slug: "sports",
    subcategories: [
      { name: "Cricket", nameHi: "क्रिकेट", slug: "cricket" },
      { name: "Olympics", nameHi: "ओलंपिक", slug: "olympics" },
    ]
  },
  {
    name: "Business",
    nameHi: "व्यापार",
    slug: "business",
    subcategories: [
      { name: "Markets", nameHi: "बाजार", slug: "markets" },
      { name: "Startups", nameHi: "स्टार्टअप्स", slug: "startups" },
    ]
  },
  {
    name: "Entertainment",
    nameHi: "मनोरंजन",
    slug: "entertainment",
    subcategories: [
      { name: "Bollywood", nameHi: "बॉलीवुड", slug: "bollywood" },
      { name: "Hollywood", nameHi: "हॉलीवुड", slug: "hollywood" },
    ]
  },
  {
    name: "World",
    nameHi: "दुनिया",
    slug: "world",
    subcategories: [
      { name: "US News", nameHi: "अमेरिकी समाचार", slug: "us-news" },
      { name: "Europe", nameHi: "यूरोप", slug: "europe" },
    ]
  }
];

const postsData = [
  // Technology
  {
    title: "OpenAI Announces Breakthrough in Mathematical Reasoning Models",
    category: "technology",
    subcategory: "artificial-intelligence",
    image: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    content: "<p>OpenAI has revealed a groundbreaking advancement in their AI models capable of solving complex mathematical theorems and reasoning tasks with human-level accuracy. The new Astra model successfully solved ten open problems in mathematics and theoretical computer science. Researchers state this brings the world closer to AGI, demonstrating unprecedented logical deduction capabilities.</p>",
    slug: "openai-mathematical-reasoning-breakthrough",
  },
  {
    title: "EU AI Act Officially Takes Effect, Mandating Labels for Generated Content",
    category: "technology",
    subcategory: "artificial-intelligence",
    image: "https://images.pexels.com/photos/6153354/pexels-photo-6153354.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    content: "<p>The European Union's comprehensive AI Act has officially come into enforcement today. Tech companies operating in the EU must now explicitly label AI-generated images, videos, and text. Violators face hefty fines up to 7% of their global revenue. The regulation aims to combat misinformation and deepfakes ahead of upcoming elections.</p>",
    slug: "eu-ai-act-takes-effect-mandates-labels",
  },
  {
    title: "Motorola Launches Moto Pad 70 Groove with JBL Speakers",
    category: "technology",
    subcategory: "mobile-gadgets",
    image: "https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    content: "<p>Motorola has expanded its tablet lineup with the introduction of the Moto Pad 70 Groove. Priced competitively, the device boasts a 144Hz display, a MediaTek Dimensity processor, and quad JBL speakers optimized with Dolby Atmos. It is aimed directly at content consumers and mobile gamers looking for budget-friendly performance.</p>",
    slug: "motorola-launches-moto-pad-70-groove",
  },
  {
    title: "Global IT Spending Shifts Towards 'A La Carte' AI Solutions",
    category: "technology",
    subcategory: "artificial-intelligence",
    image: "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    content: "<p>Corporate giants are moving away from single-vendor AI reliance, opting instead for a mix-and-match approach. Companies are blending premium models like GPT-4 with open-source and lower-cost alternatives to manage skyrocketing API costs while maintaining efficiency.</p>",
    slug: "global-it-spending-shifts-alacarte-ai",
  },
  {
    title: "Apple's Next iPhone Rumored to Feature 'Invisible' Under-Display Camera",
    category: "technology",
    subcategory: "mobile-gadgets",
    image: "https://images.pexels.com/photos/1647976/pexels-photo-1647976.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    content: "<p>Leaks suggest the upcoming iPhone flagship will finally eliminate the Dynamic Island in favor of an under-display camera system. The technology, which Apple has allegedly been perfecting for years, allows for a true edge-to-edge uninterrupted screen experience.</p>",
    slug: "apple-next-iphone-invisible-camera-rumors",
  },
  {
    title: "Cybersecurity Alert: New Zero-Day Exploit Targeting Smart Home Devices",
    category: "technology",
    subcategory: "mobile-gadgets",
    image: "https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    content: "<p>Security researchers have uncovered a critical vulnerability affecting millions of popular smart home hubs. The zero-day exploit allows attackers to gain unauthorized access to home networks. Patches are being rolled out, and users are urged to update their IoT devices immediately.</p>",
    slug: "cybersecurity-alert-smart-home-zero-day",
  },

  // Sports
  {
    title: "India Concludes Commonwealth Games Campaign with 39 Medals",
    category: "sports",
    subcategory: "olympics",
    image: "https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    content: "<p>On the final day of the Commonwealth Games in Glasgow, India's contingent wrapped up a spectacular showing, finishing with 13 Gold, 17 Silver, and 9 Bronze medals. Notable victories included thrilling finals in Badminton, Wrestling, and Track Cycling, cementing India's position as a global sports powerhouse.</p>",
    slug: "india-concludes-cwg-39-medals",
  },
  {
    title: "Jasprit Bumrah Ruled Out of Upcoming Test Series Against Sri Lanka",
    category: "sports",
    subcategory: "cricket",
    image: "https://images.pexels.com/photos/3628912/pexels-photo-3628912.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    content: "<p>In a major blow to the Indian cricket team, star pacer Jasprit Bumrah has been ruled out of the upcoming two-match Test series against Sri Lanka due to a minor back strain. The BCCI medical team has advised a three-week rest to ensure his availability for the crucial tour of Australia later this year.</p>",
    slug: "jasprit-bumrah-ruled-out-sri-lanka-tests",
  },
  {
    title: "Tanvi Sharma Clinches Taipei Open Title in Historic Win",
    category: "sports",
    subcategory: "olympics",
    image: "https://images.pexels.com/photos/3660204/pexels-photo-3660204.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    content: "<p>Rising Indian badminton star Tanvi Sharma secured a spectacular victory at the Taipei Open, defeating her top-seeded opponent in straight sets (21-17, 21-19). This marks her first BWF Super 300 title, signaling a new era for Indian women's singles on the international stage.</p>",
    slug: "tanvi-sharma-clinches-taipei-open",
  },
  {
    title: "Alcaraz and Sinner Prepare for Epic Showdown at National Bank Open",
    category: "sports",
    subcategory: "olympics",
    image: "https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    content: "<p>The tennis world's eyes are on Toronto as Carlos Alcaraz and Jannik Sinner advance to the semi-finals of the National Bank Open. Their burgeoning rivalry continues to draw massive crowds, with both players in peak form ahead of the US Open.</p>",
    slug: "alcaraz-sinner-national-bank-open-showdown",
  },
  {
    title: "Premier League: Manchester City Secures Dramatic Stoppage-Time Victory",
    category: "sports",
    subcategory: "olympics",
    image: "https://images.pexels.com/photos/114296/pexels-photo-114296.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    content: "<p>Erling Haaland struck again in the 94th minute, giving Manchester City a crucial 2-1 win over Arsenal in a top-of-the-table clash at the Etihad. The victory pushes Pep Guardiola's side three points clear as the title race heats up.</p>",
    slug: "man-city-dramatic-victory-arsenal",
  },
  {
    title: "Esports World Cup Breaks Viewership Records in Final Weekend",
    category: "sports",
    subcategory: "olympics",
    image: "https://images.pexels.com/photos/7862653/pexels-photo-7862653.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    content: "<p>The highly anticipated Esports World Cup has shattered concurrent viewership records across major streaming platforms. The Dota 2 and CS2 grand finals drew over 5 million peak concurrent viewers, highlighting the explosive growth of competitive gaming as a mainstream sport.</p>",
    slug: "esports-world-cup-viewership-records",
  },

  // Business
  {
    title: "Asian Markets Rally as Global Inflation Fears Ease",
    category: "business",
    subcategory: "markets",
    image: "https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    content: "<p>Stock markets across Asia saw significant gains this morning following softer-than-expected inflation data from the US. The Nikkei and Sensex both surged over 1.5%, driven by tech and banking stocks, as investors anticipate potential rate cuts by major central banks.</p>",
    slug: "asian-markets-rally-inflation-fears-ease",
  },
  {
    title: "Indian EV Startup 'ChargeGrid' Hits Unicorn Status After Series C",
    category: "business",
    subcategory: "startups",
    image: "https://images.pexels.com/photos/2566089/pexels-photo-2566089.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    content: "<p>Bengaluru-based electric vehicle infrastructure startup ChargeGrid has officially become a unicorn after closing a $150 million Series C funding round led by Sequoia Capital. The company plans to deploy 50,000 rapid charging stations across Tier-2 cities by the end of next year.</p>",
    slug: "chargegrid-ev-startup-unicorn-status",
  },
  {
    title: "Oil Prices Dip Amidst Increased Output from OPEC+ Nations",
    category: "business",
    subcategory: "markets",
    image: "https://images.pexels.com/photos/87163/pexels-photo-87163.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    content: "<p>Brent crude dropped below $75 a barrel for the first time in months after OPEC+ announced an unexpected increase in production quotas. Analysts suggest the move is intended to regain market share amidst rising non-OPEC production, bringing slight relief to global fuel prices.</p>",
    slug: "oil-prices-dip-opec-output-increase",
  },
  {
    title: "Fintech Giant Stripe Explores Potential IPO in Q4",
    category: "business",
    subcategory: "startups",
    image: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    content: "<p>Payments behemoth Stripe is reportedly in talks with investment banks regarding a highly anticipated initial public offering (IPO) in the fourth quarter. Valued at roughly $65 billion in secondary markets, the listing is expected to be one of the largest tech IPOs of the decade.</p>",
    slug: "stripe-explores-potential-q4-ipo",
  },
  {
    title: "Gold Hits All-Time High as Investors Seek Safe Havens",
    category: "business",
    subcategory: "markets",
    image: "https://images.pexels.com/photos/3305104/pexels-photo-3305104.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    content: "<p>Gold prices soared to an unprecedented $2,500 per ounce in early trading today. The surge is attributed to geopolitical tensions in the Middle East and uncertainty surrounding the upcoming US elections, pushing institutional investors toward traditional safe-haven assets.</p>",
    slug: "gold-hits-all-time-high-safe-haven",
  },
  {
    title: "SpaceX Secures $2 Billion Contract for Commercial Space Station",
    category: "business",
    subcategory: "startups",
    image: "https://images.pexels.com/photos/23769/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    content: "<p>Elon Musk's SpaceX has won a lucrative $2 billion contract from a consortium of private research firms to launch core modules for a new commercial space station. The 'Orbital Reef' competitor aims to begin assembly by 2028, signaling a boom in the private space economy.</p>",
    slug: "spacex-secures-commercial-space-station-contract",
  },

  // Entertainment
  {
    title: "Shah Rukh Khan Announces Next Action Thriller 'King' with Suhana Khan",
    category: "entertainment",
    subcategory: "bollywood",
    image: "https://images.pexels.com/photos/2510428/pexels-photo-2510428.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    content: "<p>Bollywood superstar Shah Rukh Khan has officially confirmed his next project, a high-octane action thriller titled 'King'. The film will notably feature his daughter Suhana Khan in a parallel lead role, marking their first on-screen collaboration. Directed by Sujoy Ghosh, filming begins next month.</p>",
    slug: "srk-announces-king-with-suhana-khan",
  },
  {
    title: "Marvel's 'Deadpool & Wolverine' Crosses $1 Billion at Global Box Office",
    category: "entertainment",
    subcategory: "hollywood",
    image: "https://images.pexels.com/photos/1111597/pexels-photo-1111597.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    content: "<p>The highly anticipated superhero team-up 'Deadpool & Wolverine' has shattered R-rated box office records, crossing the $1 billion mark globally in just its second weekend. Ryan Reynolds and Hugh Jackman's chemistry has been praised by critics and fans alike, reviving the MCU's theatrical momentum.</p>",
    slug: "deadpool-wolverine-crosses-1-billion",
  },
  {
    title: "Taylor Swift's 'Eras Tour' Concludes with Spectacular London Finale",
    category: "entertainment",
    subcategory: "hollywood",
    image: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    content: "<p>After a record-breaking multi-year run, Taylor Swift's global 'Eras Tour' came to a tearful and triumphant close at Wembley Stadium. The final show featured surprise appearances by Paul McCartney and Ed Sheeran, concluding the highest-grossing concert tour in history.</p>",
    slug: "taylor-swift-eras-tour-concludes-london",
  },
  {
    title: "Netflix Renews 'Stranger Things' Spin-off Series Ahead of Premiere",
    category: "entertainment",
    subcategory: "hollywood",
    image: "https://images.pexels.com/photos/1200450/pexels-photo-1200450.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    content: "<p>In a rare show of confidence, Netflix has ordered a second season of the upcoming animated 'Stranger Things' spin-off series before the first season has even aired. The Duffer Brothers remain attached as executive producers, expanding the Hawkins universe further.</p>",
    slug: "netflix-renews-stranger-things-spinoff",
  },
  {
    title: "A.R. Rahman to Compose Music for Indo-British Historical Epic",
    category: "entertainment",
    subcategory: "bollywood",
    image: "https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    content: "<p>Oscar-winning maestro A.R. Rahman has signed on to compose the soundtrack for 'The Last Nawab', an upcoming big-budget Indo-British co-production. The film, directed by Gurinder Chadha, explores the fall of the Awadh empire and boasts a massive international cast.</p>",
    slug: "ar-rahman-compose-indo-british-epic",
  },
  {
    title: "Squid Game Season 2 Teaser Drops, Revealing Deadly New Games",
    category: "entertainment",
    subcategory: "hollywood",
    image: "https://images.pexels.com/photos/3785927/pexels-photo-3785927.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    content: "<p>Netflix has released the first intense teaser for the highly anticipated second season of 'Squid Game'. The footage reveals protagonist Seong Gi-hun re-entering the mysterious arena with a new batch of desperate contestants and significantly more brutal childhood games.</p>",
    slug: "squid-game-season-2-teaser-drops",
  },

  // World
  {
    title: "US Elections 2026: Key Battleground States Show Tight Race",
    category: "world",
    subcategory: "us-news",
    image: "https://images.pexels.com/photos/461326/pexels-photo-461326.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    content: "<p>As the midterm elections approach, recent polling data indicates an incredibly tight race in key swing states including Pennsylvania, Georgia, and Arizona. Both major parties are ramping up campaign spending, focusing heavily on economic policy and healthcare reform.</p>",
    slug: "us-elections-2026-tight-race-battlegrounds",
  },
  {
    title: "European Union Announces Historic Investment in Green Energy Grid",
    category: "world",
    subcategory: "europe",
    image: "https://images.pexels.com/photos/414837/pexels-photo-414837.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    content: "<p>The EU Commission has unveiled a €300 billion infrastructure plan to modernize the continent's electrical grid. The 'Green Grid Initiative' aims to seamlessly integrate offshore wind and solar power across member states, pushing Europe closer to its 2040 net-zero emissions target.</p>",
    slug: "eu-announces-historic-green-energy-grid",
  },
  {
    title: "G20 Summit Concludes with Landmark Agreement on Plastic Pollution",
    category: "world",
    subcategory: "us-news",
    image: "https://images.pexels.com/photos/802221/pexels-photo-802221.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    content: "<p>World leaders at the G20 summit in Rio have signed a legally binding treaty to phase out single-use plastics globally by 2035. The landmark agreement includes a $50 billion fund to assist developing nations in transitioning to sustainable alternatives and improving waste management.</p>",
    slug: "g20-summit-agreement-plastic-pollution",
  },
  {
    title: "Major Breakthrough in Nuclear Fusion Achieved in France",
    category: "world",
    subcategory: "europe",
    image: "https://images.pexels.com/photos/33358/nuclear-power-plant-atomic-energy-energy-power-plant.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    content: "<p>Scientists at the ITER facility in southern France have successfully sustained a fusion reaction yielding net positive energy for a record 30 minutes. This major milestone proves the commercial viability of fusion power, potentially solving the world's clean energy crisis within decades.</p>",
    slug: "nuclear-fusion-breakthrough-achieved-france",
  },
  {
    title: "Space Agencies Unveil Collaborative Lunar Base Design",
    category: "world",
    subcategory: "us-news",
    image: "https://images.pexels.com/photos/110854/pexels-photo-110854.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    content: "<p>NASA, ESA, and JAXA have jointly presented the architectural blueprints for the 'Artemis Gateway Base' on the moon's south pole. The permanently crewed outpost will feature hydroponic greenhouses, advanced 3D-printed habitats, and act as a staging ground for future Mars missions.</p>",
    slug: "space-agencies-unveil-lunar-base-design",
  },
  {
    title: "Venice Implements Strict Daily Tourist Quota to Preserve Heritage",
    category: "world",
    subcategory: "europe",
    image: "https://images.pexels.com/photos/164226/pexels-photo-164226.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    content: "<p>In a dramatic move to combat overtourism, the city of Venice will now limit daily visitors to just 30,000 per day. The new digital ticketing system, heavily enforced by local authorities, aims to preserve the sinking city's crumbling infrastructure and improve the quality of life for residents.</p>",
    slug: "venice-implements-strict-tourist-quota",
  }
];

async function seedTrendingNews() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB.");

    const user = await User.findOne();
    if (!user) {
      console.log("No users found. Please sign up a user first.");
      process.exit(1);
    }
    console.log(`Seeding data on behalf of user: ${user.username}`);

    for (const catData of categoriesData) {
      const existingCat = await Category.findOne({ slug: catData.slug });
      if (!existingCat) {
        await Category.create(catData);
        console.log(`Created category: ${catData.name}`);
      } else {
        // Update subcategories if needed
        existingCat.subcategories = catData.subcategories;
        await existingCat.save();
        console.log(`Updated category: ${catData.name}`);
      }
    }

    let postsInserted = 0;
    for (const postData of postsData) {
      const existingPost = await Post.findOne({ slug: postData.slug });
      if (!existingPost) {
        await Post.create({
          ...postData,
          userId: user._id,
          status: "approved", // Automatically approve these posts
          language: "english"
        });
        postsInserted++;
      }
    }

    console.log(`Successfully inserted ${postsInserted} new posts.`);
    process.exit(0);
  } catch (err) {
    console.error("Error seeding data:", err);
    process.exit(1);
  }
}

seedTrendingNews();
