import mongoose from "mongoose"
import dotenv from "dotenv"
import bcryptjs from "bcryptjs"
import User from "./models/user.model.js"
import Post from "./models/post.model.js"
import Comment from "./models/comment.model.js"
import Category from "./models/category.model.js"
import SEO from "./models/seo.model.js"

dotenv.config()

const seedData = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error("Error: MONGO_URI is not defined in .env")
      process.exit(1)
    }

    console.log("Connecting to database...")
    await mongoose.connect(process.env.MONGO_URI)
    console.log("Connected to MongoDB successfully.")

    // Clear existing data
    console.log("Clearing existing users, posts, categories, and comments...")
    await User.deleteMany({})
    await Post.deleteMany({})
    await Comment.deleteMany({})
    await Category.deleteMany({})
    await SEO.deleteMany({})
    console.log("Database cleared.")

    // Create Admin User
    console.log("Creating Admin User...")
    const hashedPassword = bcryptjs.hashSync("admin123", 10)
    const adminUser = new User({
      username: "admin",
      email: "admin@news18.com",
      password: hashedPassword,
      isAdmin: true,
      profilePicture: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
    })
    const savedAdmin = await adminUser.save()
    console.log(`Admin User created: ${savedAdmin.email} (Password: admin123)`)

    // Seed Categories
    console.log("Creating Categories & Subcategories...")
    const categoriesData = [
      {
        name: "World News",
        slug: "worldnews",
        subcategories: [
          { name: "Asia", slug: "asia" },
          { name: "Europe", slug: "europe" },
          { name: "Americas", slug: "americas" },
        ],
      },
      {
        name: "Sports News",
        slug: "sportsnews",
        subcategories: [
          { name: "Cricket", slug: "cricket" },
          { name: "Football", slug: "football" },
          { name: "Olympics", slug: "olympics" },
        ],
      },
      {
        name: "Local News",
        slug: "localnews",
        subcategories: [
          { name: "Metro & Traffic", slug: "metro-and-traffic" },
          { name: "Culture", slug: "culture" },
          { name: "Environment", slug: "environment" },
        ],
      },
    ]

    await Category.insertMany(categoriesData)
    console.log("Categories and subcategories seeded successfully.")

    // Create Dummy Posts
    console.log("Creating News Articles...")
    const dummyPosts = [
      {
        userId: savedAdmin._id.toString(),
        title: "India Establishes New Strategic Trade Corridor with European Union",
        category: "worldnews",
        subcategory: "europe",
        image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=800&q=80",
        content: "<p>India and the European Union have finalized a landmark bilateral trade corridor agreement aimed at enhancing supply chain resilience and reducing tariffs on key technology and agricultural exports.</p><p>The corridor, which includes major shipping and digital infrastructure components, is expected to boost annual trade by over 15% and create thousands of new jobs across the continent.</p>",
        slug: "india-establishes-new-strategic-trade-corridor-with-european-union",
        status: "approved",
      },
      {
        userId: savedAdmin._id.toString(),
        title: "Global Tech Summit 2026: AI Innovations Lead the Future of Industry",
        category: "worldnews",
        subcategory: "asia",
        image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80",
        content: "<p>The Global Tech Summit 2026 opened in New Delhi today, bringing together leaders from major tech organizations to discuss the evolution of artificial intelligence.</p><p>Speakers highlighted the role of AI in streamlining enterprise workflows and developing sustainable green energy grids. Startups presented futuristic models for automation and machine learning.</p>",
        slug: "global-tech-summit-2026-ai-innovations-lead-the-future-of-industry",
        status: "approved",
      },
      {
        userId: savedAdmin._id.toString(),
        title: "UN Climate Conference Proposes Strict Emission Limits by 2030",
        category: "worldnews",
        subcategory: "americas",
        image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
        content: "<p>In an emergency session, the United Nations Climate Committee proposed a new resolution mandating an immediate 25% reduction in industrial carbon emissions for developed economies by the end of the decade.</p><p>The proposal has received mixed reactions from global industrial hubs, who cite concerns over transition costs but acknowledge the urgency of global warming.</p>",
        slug: "un-climate-conference-proposes-strict-emission-limits-by-2030",
        status: "approved",
      },
      {
        userId: savedAdmin._id.toString(),
        title: "India Wins Historic Cricket Test Series in Australia",
        category: "sportsnews",
        subcategory: "cricket",
        image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=800&q=80",
        content: "<p>The Indian cricket team registered a memorable 3-1 series victory on Australian soil, sealing the final Test match in Melbourne.</p><p>A brilliant century by the captain on the final day guided the chase through a challenging pitch, earning praise from fans worldwide and securing their spot at the top of the Test championship rankings.</p>",
        slug: "india-wins-historic-cricket-test-series-in-australia",
        status: "approved",
      },
      {
        userId: savedAdmin._id.toString(),
        title: "National Games 2026: Opening Week Showcases Exceptional Athletic Talent",
        category: "sportsnews",
        subcategory: "olympics",
        image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80",
        content: "<p>The National Games began with a spectacular ceremony in Mumbai. Over the first week, several national records were broken in swimming, track events, and weightlifting.</p><p>Athletes from all regions are competing with high spirits, setting new benchmarks for the next generation of sports stars.</p>",
        slug: "national-games-2026-opening-week-showcases-exceptional-athletic-talent",
        status: "approved",
      },
      {
        userId: savedAdmin._id.toString(),
        title: "Olympic Prep: Indian Archery and Shooting Teams Begin Advanced Training",
        category: "sportsnews",
        subcategory: "olympics",
        image: "https://images.unsplash.com/photo-1511886929837-354d827aae26?auto=format&fit=crop&w=800&q=80",
        content: "<p>To ensure maximum medal prospects at the upcoming Summer Olympics, the Sports Authority of India has launched a state-of-the-art training camp.</p><p>International coaches have been brought in to refine techniques in archery and shooting, focusing on mental conditioning and physical fitness.</p>",
        slug: "olympic-prep-indian-archery-and-shooting-teams-begin-advanced-training",
        status: "approved",
      },
      {
        userId: savedAdmin._id.toString(),
        title: "New Metro Line Project Approved for Capital City Expansion",
        category: "localnews",
        subcategory: "metro-and-traffic",
        image: "https://images.unsplash.com/photo-1541417904950-b855846fe074?auto=format&fit=crop&w=800&q=80",
        content: "<p>The state cabinet has greenlit a budget of 4,500 crores for Phase 3 of the Capital Metro line expansion.</p><p>The expansion will add 12 new stations, linking the outer suburbs directly to the central commercial district and easing traffic bottlenecks during rush hours.</p>",
        slug: "new-metro-line-project-approved-for-capital-city-expansion",
        status: "approved",
      },
      {
        userId: savedAdmin._id.toString(),
        title: "Annual Cultural Festival Draws Thousands to Historic Central Ground",
        category: "localnews",
        subcategory: "culture",
        image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80",
        content: "<p>The city's historic Central Ground came alive with music, traditional dance, and food stalls as the annual cultural festival began yesterday.</p><p>Visitors enjoyed local delicacies and crafts from artisans representing different provinces, celebrating regional diversity and talent.</p>",
        slug: "annual-cultural-festival-draws-thousands-to-historic-central-ground",
        status: "approved",
      },
      {
        userId: savedAdmin._id.toString(),
        title: "Local Community Drives Greening Initiative to Plant 50,000 Trees",
        category: "localnews",
        subcategory: "environment",
        image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80",
        content: "<p>Led by youth volunteers and local environmental non-profits, a massive afforestation drive commenced this weekend.</p><p>The team successfully planted 10,000 saplings on the first day and hopes to reach their target of 50,000 trees by next month to restore local forest reserves.</p>",
        slug: "local-community-drives-greening-initiative-to-plant-50000-trees",
        status: "approved",
      },
    ]

    await Post.insertMany(dummyPosts)
    console.log("Dummy news articles seeded successfully.")

    // Seed SEO Data
    console.log("Creating SEO Data...")
    const seoData = [
      {
        pageIdentifier: "home",
        metaTitle: "News18 India | Reliable & Breaking News",
        metaDescription: "News18 India delivers the latest breaking news, reliable reporting, and in-depth analysis from across the globe.",
        keywords: "news, breaking news, india news, world news",
        canonicalUrl: "https://www.news18india.com/",
        schemaScript: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "News18 India",
          "url": "https://www.news18india.com/",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://www.news18india.com/search?searchTerm={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        }),
      },
      {
        pageIdentifier: "about",
        metaTitle: "About Us | News18 India",
        metaDescription: "Learn more about News18 India, our mission, and our commitment to providing accurate and prompt news reporting.",
        keywords: "about news18 india, journalism, accurate reporting",
        canonicalUrl: "https://www.news18india.com/about",
        schemaScript: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "AboutPage",
          "name": "About Us | News18 India",
          "description": "Learn more about News18 India, our mission, and our commitment to providing accurate and prompt news reporting."
        }),
      },
      {
        pageIdentifier: "search",
        metaTitle: "Search News & Articles | News18 India",
        metaDescription: "Search the latest news articles and explore different categories on News18 India.",
        keywords: "search news, explore news, news18 search",
        canonicalUrl: "https://www.news18india.com/search",
        schemaScript: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SearchResultsPage",
          "name": "Search News & Articles | News18 India",
          "description": "Search the latest news articles and explore different categories on News18 India."
        }),
      },
      {
        pageIdentifier: "category_worldnews",
        metaTitle: "World News | News18 India",
        metaDescription: "Stay updated with the latest international breaking news and global events from News18 India.",
        keywords: "world news, international news, global events",
        canonicalUrl: "https://www.news18india.com/news/worldnews",
        schemaScript: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "World News | News18 India",
          "description": "Stay updated with the latest international breaking news and global events from News18 India.",
          "url": "https://www.news18india.com/news/worldnews"
        }),
      },
      {
        pageIdentifier: "category_sportsnews",
        metaTitle: "Sports News | News18 India",
        metaDescription: "Get the latest sports news, live scores, match highlights, and updates on your favorite teams.",
        keywords: "sports news, live scores, cricket news, football news",
        canonicalUrl: "https://www.news18india.com/news/sportsnews",
        schemaScript: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Sports News | News18 India",
          "description": "Get the latest sports news, live scores, match highlights, and updates on your favorite teams.",
          "url": "https://www.news18india.com/news/sportsnews"
        }),
      },
      {
        pageIdentifier: "category_localnews",
        metaTitle: "Local News | News18 India",
        metaDescription: "Catch up on local news, regional events, and community updates near you.",
        keywords: "local news, regional news, community events",
        canonicalUrl: "https://www.news18india.com/news/localnews",
        schemaScript: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Local News | News18 India",
          "description": "Catch up on local news, regional events, and community updates near you.",
          "url": "https://www.news18india.com/news/localnews"
        }),
      },
    ]
    await SEO.insertMany(seoData)
    console.log("SEO data seeded successfully.")

    console.log("Seeding process finished successfully.")
    process.exit(0)
  } catch (error) {
    console.error("Seeding failed with error: ", error)
    process.exit(1)
  }
}

seedData()
