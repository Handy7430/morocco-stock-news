export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const feeds = [
      "https://www.hespress.com/economie/feed",
      "https://www.boursenews.ma/rss"
    ];

    let articles: any[] = [];

    for (let url of feeds) {
      const res = await fetch(url, { cache: "no-store" });
      const text = await res.text();

      const items = text.split("<item>").slice(1, 10);

      items.forEach(item => {
        const title = item.split("<title>")[1]?.split("</title>")[0];
        const link = item.split("<link>")[1]?.split("</link>")[0];

        if (title && link) {
          articles.push({
            title,
            link,
            date: new Date().toISOString()
          });
        }
      });
    }

    // fallback إذا خاوي
    if (articles.length === 0) {
      articles.push({
        title: "API works but no news found",
        link: "#",
        date: new Date().toISOString()
      });
    }

    return new Response(
      JSON.stringify({
        trend: "Live 🔥",
        news: articles
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store"
        }
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "API failed",
        details: error.toString()
      }),
      { status: 500 }
    );
  }
}
