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
      const xml = await res.text();

      // 🔥 parsing قوي
      const matches = xml.match(/<item[\s\S]*?<\/item>/g) || [];

      matches.slice(0, 10).forEach(item => {
        const titleMatch = item.match(/<title>(.*?)<\/title>/);
        const linkMatch = item.match(/<link>(.*?)<\/link>/);

        const title = titleMatch?.[1];
        const link = linkMatch?.[1];

        if (title && link) {
          articles.push({
            title: title.replace(/<!\[CDATA\[|\]\]>/g, ""),
            link
          });
        }
      });
    }

    // 🔥 إذا ماجاب حتى حاجة
    if (articles.length === 0) {
      return new Response(
        JSON.stringify({
          trend: "Live 🔥",
          news: [
            {
              title: "RSS connected but no items parsed",
              link: "#"
            }
          ]
        }),
        { headers: { "Content-Type": "application/json" } }
      );
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

  } catch (err) {
    return new Response(
      JSON.stringify({
        error: "API crashed",
        details: err.toString()
      }),
      { status: 500 }
    );
  }
}
