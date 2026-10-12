export default async function handler(request, context) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // 1. Skip static assets, bundles, images, icons, and API requests immediately
  if (
    pathname.includes(".") ||
    pathname.startsWith("/assets/") ||
    pathname.startsWith("/api/")
  ) {
    return context.next();
  }

  // 2. Identify Social Media Crawlers / Bots & Preview requests
  const userAgent = (request.headers.get("user-agent") || "").toLowerCase();
  const isBot = /bot|crawl|spider|facebookexternalhit|whatsapp|twitterbot|telegrambot|linkedinbot|slackbot|discordbot|pinterest|skypeuripreview|applebot/i.test(userAgent);
  const isPreview = url.searchParams.get("bot") === "1" || url.searchParams.get("preview") === "1";

  // Regular browsers get the static SPA page immediately with 0ms latency
  if (!isBot && !isPreview) {
    return context.next();
  }

  // 3. Extract article slug from URL patterns:
  // - /post/:slug
  // - /news/:category/article/:slug
  // - /news/:category/:subcategory/article/:slug
  // - /:slug (clean slug fallback)
  let slug = null;
  const postMatch = pathname.match(/^\/post\/([^\/]+)/i);
  const articleMatch = pathname.match(/\/article\/([^\/]+)/i);

  if (postMatch) {
    slug = postMatch[1];
  } else if (articleMatch) {
    slug = articleMatch[1];
  } else {
    const singleMatch = pathname.match(/^\/([^\/]+)$/);
    if (singleMatch) {
      const candidate = singleMatch[1].toLowerCase();
      const reserved = [
        "about", "sign-in", "sign-up", "dashboard", "create-post",
        "update-post", "search", "news", "page", "publisher", "admin"
      ];
      if (!reserved.includes(candidate)) {
        slug = singleMatch[1];
      }
    }
  }

  if (!slug) {
    return context.next();
  }

  try {
    // 4. Fetch article data from backend API
    const apiUrl = `https://newsapi.newpulse.in/api/post/getposts?slug=${encodeURIComponent(slug)}`;
    const res = await fetch(apiUrl, {
      signal: AbortSignal.timeout(4000),
      headers: { "Accept": "application/json" }
    });

    if (!res.ok) {
      return context.next();
    }

    const data = await res.json();
    const post = data?.posts?.[0];

    if (!post) {
      return context.next();
    }

    // 5. Get base index.html from Netlify
    const response = await context.next();
    let html = await response.text();

    const title = post.metaTitle || post.title || "News Pulse";
    const cleanTitle = title.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const desc = post.metaDescription || (post.content ? post.content.replace(/<[^>]*>/g, "").slice(0, 160).trim() : "Read the latest news on News Pulse.");
    const cleanDesc = desc.replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const imageUrl = post.image || "";
    const canonicalUrl = `https://newpulse.in/post/${encodeURIComponent(post.slug || slug)}`;

    // Replace <title>
    html = html.replace(/<title>.*?<\/title>/i, `<title>${cleanTitle} | News Pulse</title>`);

    // Remove any hardcoded default og and twitter meta tags
    html = html.replace(/<meta\s+property=["']og:[^"']*["'][^>]*>/gi, "");
    html = html.replace(/<meta\s+name=["']twitter:[^"']*["'][^>]*>/gi, "");

    // Inject exact article Open Graph & Twitter meta tags with the post's main image
    let newMetaTags = `
    <!-- Dynamic Article Meta Tags for WhatsApp & Social Sharing -->
    <meta property="og:title" content="${cleanTitle} | News Pulse" />
    <meta property="og:description" content="${cleanDesc}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="News Pulse" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${cleanTitle} | News Pulse" />
    <meta name="twitter:description" content="${cleanDesc}" />`;

    if (imageUrl) {
      newMetaTags += `
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:image:secure_url" content="${imageUrl}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${cleanTitle}" />
    <meta name="twitter:image" content="${imageUrl}" />`;
    }

    html = html.replace("</head>", `${newMetaTags}\n  </head>`);

    return new Response(html, {
      status: 200,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "public, max-age=60, s-maxage=300"
      }
    });
  } catch (error) {
    console.error("Error generating dynamic OG tags:", error);
    return context.next();
  }
}

export const config = {
  path: "/*"
};
