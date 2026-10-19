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

  // 3. Extract slug and type from URL patterns:
  let slug = null;
  let isPage = false;
  const pageMatch = pathname.match(/^\/page\/([^\/]+)/i);
  const postMatch = pathname.match(/^\/post\/([^\/]+)/i);
  const articleMatch = pathname.match(/\/article\/([^\/]+)/i);

  if (pageMatch) {
    slug = pageMatch[1];
    isPage = true;
  } else if (postMatch) {
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
    let post = null;

    if (isPage) {
      // Fetch Page metadata from backend
      const apiUrl = `https://newsapi.newpulse.in/api/page/getPage/${encodeURIComponent(slug)}`;
      const res = await fetch(apiUrl, {
        signal: AbortSignal.timeout(4000),
        headers: { "Accept": "application/json" }
      });
      if (res.ok) {
        post = await res.json();
      }
    } else {
      // Fetch Article data from backend API
      const apiUrl = `https://newsapi.newpulse.in/api/post/getposts?slug=${encodeURIComponent(slug)}`;
      const res = await fetch(apiUrl, {
        signal: AbortSignal.timeout(4000),
        headers: { "Accept": "application/json" }
      });
      if (res.ok) {
        const data = await res.json();
        post = data?.posts?.[0];
      }
    }

    if (!post) {
      return context.next();
    }

    // 5. Get base index.html from Netlify
    const response = await context.next();
    let html = await response.text();

    let title = post.metaTitle || post.title || "";
    title = title.replace(/^[•\s\-\*|:]+/, "").trim();
    const cleanTitle = title.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const desc = post.metaDescription || post.seoDescription || "";
    const cleanDesc = desc.replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    let ogImage = post.ogImage || post.image || "";
    if (ogImage && ogImage.includes("res.cloudinary.com")) {
      // WhatsApp strictly requires JPEG/PNG; convert Cloudinary WebP to high-quality JPG
      ogImage = ogImage.replace(/\.webp($|\?)/i, ".jpg$1");
      if (!ogImage.includes("/f_jpg") && ogImage.includes("/upload/")) {
        ogImage = ogImage.replace("/upload/", "/upload/f_jpg,w_1200,h_630,c_fill/");
      }
    }
    const defaultCanonical = isPage
      ? `https://newpulse.in/page/${encodeURIComponent(post.slug || slug)}`
      : `https://newpulse.in/post/${encodeURIComponent(post.slug || slug)}`;
    const canonicalUrl = post.canonicalUrl || defaultCanonical;

    // Sanitize metaRobots: ensure it is a valid directive and not accidental keywords
    let metaRobots = (post.metaRobots || "").trim();
    if (!metaRobots || (!metaRobots.toLowerCase().includes("index") && !metaRobots.toLowerCase().includes("noindex"))) {
      metaRobots = "index, follow, max-image-preview:large";
    }

    // Replace <title>
    if (cleanTitle) {
      html = html.replace(/<title>.*?<\/title>/i, `<title>${cleanTitle} | Newpulse</title>`);
    }

    // Remove any hardcoded default og and twitter meta tags, descriptions, robots, and schemas to avoid duplicates
    html = html.replace(/<meta\s+property=["']og:[^"']*["'][^>]*>/gi, "");
    html = html.replace(/<meta\s+name=["']twitter:[^"']*["'][^>]*>/gi, "");
    html = html.replace(/<meta\s+name=["']description["'][^>]*>/gi, "");
    html = html.replace(/<meta\s+name=["']robots["'][^>]*>/gi, "");
    html = html.replace(/<meta\s+name=["']keywords["'][^>]*>/gi, "");
    html = html.replace(/<link\s+rel=["']canonical["'][^>]*>/gi, "");
    html = html.replace(/<script\s+type=["']application\/ld\+json["'][\s\S]*?<\/script>/gi, "");

    // Inject exact article/page Open Graph & Twitter meta tags from backend admin
    let newMetaTags = `\n    <!-- Dynamic Meta Tags from Backend Admin -->`;
    if (cleanTitle) {
      newMetaTags += `\n    <meta property="og:title" content="${cleanTitle} | Newpulse" />`;
      newMetaTags += `\n    <meta name="twitter:title" content="${cleanTitle} | Newpulse" />`;
    }
    newMetaTags += `\n    <meta property="og:site_name" content="Newpulse" />`;
    if (metaRobots) {
      newMetaTags += `\n    <meta name="robots" content="${metaRobots}" />`;
    }
    if (cleanDesc) {
      newMetaTags += `\n    <meta property="og:description" content="${cleanDesc}" />`;
      newMetaTags += `\n    <meta name="twitter:description" content="${cleanDesc}" />`;
      newMetaTags += `\n    <meta name="description" content="${cleanDesc}" />`;
    }
    if (canonicalUrl) {
      newMetaTags += `\n    <meta property="og:url" content="${canonicalUrl}" />`;
      newMetaTags += `\n    <link rel="canonical" href="${canonicalUrl}" />`;
    }
    newMetaTags += `\n    <meta property="og:type" content="${isPage ? "website" : "article"}" />`;
    if (ogImage) {
      newMetaTags += `\n    <meta name="twitter:card" content="summary_large_image" />`;
      newMetaTags += `
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:image:secure_url" content="${ogImage}" />
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${cleanTitle}" />
    <meta name="twitter:image" content="${ogImage}" />`;
    }

    if (post.schemaScript) {
      newMetaTags += `\n    <script type="application/ld+json">\n${post.schemaScript.replace(/<\/?script[^>]*>/gi, "").trim()}\n    </script>`;
    } else if (isPage) {
      // Auto WebPage & Breadcrumb Schema
      const webPageSchema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": canonicalUrl,
        "name": post.title,
        "headline": cleanTitle,
        "description": desc,
        "url": canonicalUrl,
        "datePublished": post.createdAt || new Date().toISOString(),
        "dateModified": post.updatedAt || post.createdAt || new Date().toISOString(),
        "publisher": {
          "@type": "NewsMediaOrganization",
          "name": "Newpulse",
          "url": "https://newpulse.in",
          "logo": {
            "@type": "ImageObject",
            "url": "https://newpulse.in/rectangular-logo.png"
          }
        }
      };

      const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://newpulse.in"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": post.title || "Page",
            "item": canonicalUrl
          }
        ]
      };

      newMetaTags += `\n    <script type="application/ld+json">\n${JSON.stringify(webPageSchema)}\n    </script>`;
      newMetaTags += `\n    <script type="application/ld+json">\n${JSON.stringify(breadcrumbSchema)}\n    </script>`;
    } else {
      // Auto NewsArticle Schema for Google News
      const newsSchema = {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": canonicalUrl
        },
        "headline": title,
        "description": desc,
        "image": ogImage ? [ogImage] : ["https://newpulse.in/rectangular-logo.png"],
        "datePublished": post.createdAt || new Date().toISOString(),
        "dateModified": post.updatedAt || post.createdAt || new Date().toISOString(),
        "author": [{
          "@type": "Person",
          "name": "Editorial Team",
          "url": "https://newpulse.in"
        }],
        "publisher": {
          "@type": "NewsMediaOrganization",
          "name": "Newpulse",
          "url": "https://newpulse.in",
          "logo": {
            "@type": "ImageObject",
            "url": "https://newpulse.in/rectangular-logo.png"
          }
        },
        "articleSection": post.category || "News"
      };

      const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://newpulse.in"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": post.category || "News",
            "item": `https://newpulse.in/news/${post.category || "all"}`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": title,
            "item": canonicalUrl
          }
        ]
      };

      newMetaTags += `\n    <script type="application/ld+json">\n${JSON.stringify(newsSchema)}\n    </script>`;
      newMetaTags += `\n    <script type="application/ld+json">\n${JSON.stringify(breadcrumbSchema)}\n    </script>`;
    }

    html = html.replace("</head>", `${newMetaTags}\n  </head>`);

    // For bots (Googlebot, Bing, social crawlers), inject semantic article fallback inside <div id="root">
    if (isBot) {
      const botArticleHtml = `
      <div id="root">
        <article style="max-width:800px;margin:20px auto;padding:16px;font-family:system-ui,sans-serif;">
          <h1 style="font-size:28px;margin-bottom:12px;">${cleanTitle}</h1>
          <p style="color:#64748b;font-size:14px;margin-bottom:16px;">Published: ${post.createdAt || ''} | Category: ${post.category || 'News'}</p>
          ${ogImage ? `<img src="${ogImage}" alt="${cleanTitle}" style="max-width:100%;height:auto;border-radius:8px;margin-bottom:20px;" />` : ''}
          <div style="line-height:1.7;color:#1e293b;">${post.content || ''}</div>
        </article>
      </div>`;
      html = html.replace(/<div id="root">[\s\S]*?<\/div>\s*<\/body>/i, `${botArticleHtml}\n  </body>`);
    }

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
