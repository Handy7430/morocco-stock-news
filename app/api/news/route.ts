export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const sources = [
      {
        url: "https://www.hespress.com/economie",
        name: "Hespress"
      },
      {
        url: "https://www.boursenews.ma/",
        name: "Boursenews"
      }
    ];

    let articles: any[] = [];

    for (let source of sources) {
      try {
        // 🔥 PROXY هنا
        const proxyUrl =
          "https://api.allorigins.win/raw?url=" +
          encodeURIComponent(source.url);

        const res = await fetch(proxyUrl);
        const html = await res.text();

        const matches = html.match(/<h2.*?>(.*?)<\/h2>/g) || [];

        matches.slice(0, 10).forEach(item => {
          const clean = item.replace(/<[^>]+>/g, "");

          if (clean.length > 20) {
            articles.push({
              title: clean,
              link: source.url,
              source: source.name
            });
          }
        });

      } catch (err) {
        console.log("Error scraping:", source.name);
      }
    }

    // 🔥 fallback
    if (articles.length === 0) {
      articles.push({
        title: "Scraper working but sites blocked",
        link: "#"
      });
    }

    return new Response(
      JSON.stringify({
        trend: "Live 🔥",
        news: articles.slice(0, 20)
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
      JSON.stringify({ error: "Scraper crashed" }),
      { status: 500 }
    );
  }
}
