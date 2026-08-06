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

// Using pollinations.ai to generate completely unique, highly relatable images on the fly based on the post title.

const headlines = [
  // AI
  { title: "OpenAI Astra Solves 10 Open Mathematical Problems", cat: "technology", sub: "artificial-intelligence" },
  { title: "EU AI Act Officially Enforced Across European Member States", cat: "technology", sub: "artificial-intelligence" },
  { title: "Google Unveils Next-Gen Gemini Architecture for Enterprise", cat: "technology", sub: "artificial-intelligence" },
  { title: "Corporate AI Spending Shifts to A La Carte Open Source Models", cat: "technology", sub: "artificial-intelligence" },
  { title: "New AI Image Generation Model Rivals Midjourney with Real-Time Rendering", cat: "technology", sub: "artificial-intelligence" },
  // Mobile
  { title: "Motorola Launches Moto Pad 70 Groove with JBL Audio", cat: "technology", sub: "mobile-gadgets" },
  { title: "Apple iPhone 18 Leaks Reveal True Under-Display Camera", cat: "technology", sub: "mobile-gadgets" },
  { title: "Samsung's New Foldable Z Fold 8 Breaks Sales Records in Asia", cat: "technology", sub: "mobile-gadgets" },
  { title: "Global Smartphone Shipments Rebound by 12% in Q3 2026", cat: "technology", sub: "mobile-gadgets" },
  { title: "Smart Home Zero-Day Exploit Patched by Major IoT Manufacturers", cat: "technology", sub: "mobile-gadgets" },
  // Cricket
  { title: "Jasprit Bumrah Ruled Out of Sri Lanka Test Series Due to Back Strain", cat: "sports", sub: "cricket" },
  { title: "Virat Kohli Hints at Coaching Role Following Upcoming World Cup", cat: "sports", sub: "cricket" },
  { title: "India Dominates Sri Lanka in Series Opener with 10-Wicket Victory", cat: "sports", sub: "cricket" },
  { title: "BCCI Announces Massive Pay Hike for Domestic Circuit Players", cat: "sports", sub: "cricket" },
  { title: "Women's Premier League Expands to Include Two New Franchises", cat: "sports", sub: "cricket" },
  // Olympics
  { title: "India Concludes Commonwealth Games 2026 with 39 Medals", cat: "sports", sub: "olympics" },
  { title: "Avtar Singh Secures Historic Judo Gold for India at CWG", cat: "sports", sub: "olympics" },
  { title: "US Track and Field Team Sweeps 4x100m Relays in Glasgow", cat: "sports", sub: "olympics" },
  { title: "Swimming World Records Shattered on Final Day of Commonwealth Games", cat: "sports", sub: "olympics" },
  { title: "Glasgow Closing Ceremony Honors Athletes Ahead of 2030 Games", cat: "sports", sub: "olympics" },
  // Markets
  { title: "Asian Markets Rally as Global Inflation Fears Subside Significantly", cat: "business", sub: "markets" },
  { title: "Oil Prices Dip Below $75 Amidst Unexpected OPEC+ Output Increase", cat: "business", sub: "markets" },
  { title: "Gold Reaches Unprecedented All-Time High of $2,500 Per Ounce", cat: "business", sub: "markets" },
  { title: "Tech Stocks Surge as Federal Reserve Signals Imminent Rate Cuts", cat: "business", sub: "markets" },
  { title: "European Central Bank Maintains Interest Rates Amidst Economic Uncertainty", cat: "business", sub: "markets" },
  // Startups
  { title: "Indian EV Startup ChargeGrid Achieves Unicorn Status with $150M Series C", cat: "business", sub: "startups" },
  { title: "Fintech Giant Stripe Files Confidential Prospectus for Q4 IPO", cat: "business", sub: "startups" },
  { title: "Agritech Startups See Record Funding as Climate Concerns Grow", cat: "business", sub: "startups" },
  { title: "Space Economy Booms: Private Firms Secure $2B Orbital Reef Contract", cat: "business", sub: "startups" },
  { title: "AI-Powered Healthcare Startup Medibot Acquired for $800 Million", cat: "business", sub: "startups" },
  // Bollywood
  { title: "Shah Rukh Khan Announces Action Thriller 'King' Co-Starring Suhana Khan", cat: "entertainment", sub: "bollywood" },
  { title: "A.R. Rahman Signs On for Epic Indo-British Historical Drama 'The Last Nawab'", cat: "entertainment", sub: "bollywood" },
  { title: "Animal Park: Sandeep Reddy Vanga Reveals Sequel Release Date", cat: "entertainment", sub: "bollywood" },
  { title: "Box Office Report: Latest Romantic Comedy Crosses 100 Crores Globally", cat: "entertainment", sub: "bollywood" },
  { title: "Bollywood Embraces Virtual Production Studios for Upcoming Fantasy Epics", cat: "entertainment", sub: "bollywood" },
  // Hollywood
  { title: "Deadpool & Wolverine Crosses $1 Billion Global Box Office Milestone", cat: "entertainment", sub: "hollywood" },
  { title: "Taylor Swift's Record-Breaking Eras Tour Concludes in London", cat: "entertainment", sub: "hollywood" },
  { title: "Netflix Greenlights Stranger Things Animated Spin-off Series", cat: "entertainment", sub: "hollywood" },
  { title: "Squid Game Season 2 Teaser Breaks Viewership Records in 24 Hours", cat: "entertainment", sub: "hollywood" },
  { title: "Christopher Nolan's Next Sci-Fi Project to Begin Filming in IMAX 3D", cat: "entertainment", sub: "hollywood" },
  // US News
  { title: "2026 Midterm Elections: Latest Polls Show Dead Heat in Key Swing States", cat: "world", sub: "us-news" },
  { title: "Congress Passes Bipartisan Infrastructure Bill for Renewable Energy", cat: "world", sub: "us-news" },
  { title: "Major Heatwave Sweeps Across the West Coast Prompting Emergency Measures", cat: "world", sub: "us-news" },
  { title: "Supreme Court Issues Landmark Ruling on Digital Privacy Rights", cat: "world", sub: "us-news" },
  { title: "Automakers in Detroit Reach Historic Agreement with Auto Workers Union", cat: "world", sub: "us-news" },
  // Europe
  { title: "EU Commission Unveils €300 Billion Green Grid Modernization Plan", cat: "world", sub: "europe" },
  { title: "France Achieves Major Nuclear Fusion Milestone Sustaining Plasma for 30 Minutes", cat: "world", sub: "europe" },
  { title: "Venice Implements Strict 30,000 Daily Tourist Quota to Preserve Heritage", cat: "world", sub: "europe" },
  { title: "UK Prime Minister Announces Comprehensive Healthcare Reform Package", cat: "world", sub: "europe" },
  { title: "Germany Commits Additional €5 Billion to Domestic Semiconductor Manufacturing", cat: "world", sub: "europe" }
];

function generateContent(title, category, subcategory, index) {
  const displayCat = category.charAt(0).toUpperCase() + category.slice(1);
  const displaySub = subcategory.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const embeddedImage = `https://image.pollinations.ai/prompt/${encodeURIComponent("editorial photo of " + title + " realistic")}?width=800&height=400&nologo=true`;

  return `
    <p class="mb-4 text-lg leading-relaxed text-gray-800"><strong>August 2, 2026</strong> — In a significant development that has captured global attention, latest reports confirm that <strong>${title}</strong>. This event marks a major milestone in the realm of ${displayCat}, specifically impacting the ${displaySub} sector. Observers and analysts have been closely monitoring the situation, noting that the implications of this development will likely resonate for years to come. As the story unfolds, stakeholders across the industry are rapidly assessing the immediate and long-term effects on global dynamics.</p>
    
    <p class="mb-4 text-lg leading-relaxed text-gray-800">To understand the magnitude of this news, it is essential to examine the historical context. Over the past few years, the ${displaySub} landscape has undergone dramatic transformations, driven by rapid innovation, shifting regulatory frameworks, and evolving consumer demands. Previous milestones set the stage for today's breakthrough. Experts have long predicted that a shift of this nature was imminent, but the speed and scale of the current development have surpassed even the most aggressive forecasts. This represents a paradigm shift in how we approach ${displayCat} on a daily basis.</p>
    
    <div class="my-8">
      <img src="${embeddedImage}" alt="${title}" class="w-full h-[400px] object-cover rounded-xl shadow-lg border border-gray-100" />
      <p class="text-sm text-gray-500 mt-3 text-center italic">A visual representation capturing the essence of the ongoing developments in ${displaySub}.</p>
    </div>
    
    <p class="mb-4 text-lg leading-relaxed text-gray-800">Diving deeper into the mechanics of this event, several key factors emerge. First, the strategic timing aligns perfectly with broader macroeconomic trends and sector-specific cycles. Organizations and key figures involved have leveraged cutting-edge methodologies to achieve this outcome. Furthermore, the competitive landscape will inevitably be altered. Rival entities are now under immense pressure to respond, either through matching innovations, strategic pivots, or new alliances. The ripple effects will be felt not just locally, but on a global scale, fundamentally altering market dynamics and shifting power structures in unforeseen ways.</p>
    
    <p class="mb-4 text-lg leading-relaxed text-gray-800">Industry veterans and market analysts have been quick to weigh in on the implications. "This is a watershed moment for ${displayCat}," noted a leading senior analyst during a morning briefing. "What we are witnessing is the culmination of years of underlying shifts finally breaking the surface. The entities that adapt quickly to this new reality will thrive, while those that hesitate may find themselves permanently disadvantaged." Another expert highlighted the regulatory and ethical considerations, urging a balanced approach to managing the fallout and ensuring sustainable growth moving forward without compromising foundational principles.</p>
    
    <p class="mb-4 text-lg leading-relaxed text-gray-800">In conclusion, today's news regarding the developments in ${displaySub} is not merely a fleeting headline, but a foundational shift in the entire ecosystem. Moving forward, the focus will transition from the initial shock of the event itself to the careful execution and integration of these changes into everyday practices and strategic planning. We will continue to monitor this rapidly evolving story and provide comprehensive, real-time updates as new information becomes available. The coming weeks will undoubtedly be critical in determining the ultimate trajectory of this historic and groundbreaking development.</p>
  `;
}

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

async function seedMassive() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB.");

    const user = await User.findOne();
    if (!user) {
      console.log("No users found. Please sign up a user first.");
      process.exit(1);
    }
    console.log(`Seeding data on behalf of user: ${user.username}`);

    // 1. Delete all current data
    console.log("Deleting all current posts and categories...");
    await Post.deleteMany({});
    await Category.deleteMany({});
    console.log("Old data cleared.");

    // 2. Create Categories
    for (const catData of categoriesData) {
      await Category.create(catData);
      console.log(`Created category: ${catData.name}`);
    }

    // 3. Create Posts (50 posts total, 5 per subcategory)
    let postsInserted = 0;
    for (let i = 0; i < headlines.length; i++) {
      const item = headlines[i];
      const htmlContent = generateContent(item.title, item.cat, item.sub, i);
      const slug = slugify(item.title) + "-" + Date.now().toString().slice(-4);
      
      const mainImageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent("high quality news thumbnail for " + item.title + " realistic")}?width=1260&height=750&nologo=true`;
      
      await Post.create({
        title: item.title,
        category: item.cat,
        subcategory: item.sub,
        image: mainImageUrl,
        content: htmlContent,
        slug: slug,
        userId: user._id,
        status: "approved",
        language: "english"
      });
      postsInserted++;
    }

    console.log(`Successfully inserted ${postsInserted} detailed new posts.`);
    process.exit(0);
  } catch (err) {
    console.error("Error seeding data:", err);
    process.exit(1);
  }
}

seedMassive();
