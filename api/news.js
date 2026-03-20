export const dynamic = "force-dynamic";

export default async function handler(req, res) {
  const feeds = [
    "https://www.hespress.com/economie/feed",
    "https://www.boursenews.ma/rss",
    "https://medias24.com/feed"
  ];

  let articles = [];

  for (let url of feeds) {
    try {
      const response = await fetch(url, { cache: "no-store" });
      const text = await response.text();

      // 🔥 طريقة بسيطة (ما كتطيحش)
      const parts = text.split("<item>").slice(1, 15);

      parts.forEach(item => {
        const title = item.split("<title>")[1]?.split("</title>")[0];
        const link = item.split("<link>")[1]?.split("</link>")[0];
        const date = item.split("<pubDate>")[1]?.split("</pubDate>")[0];

        if (title && link) {
          articles.push({
            title,
            link,
            date: date || new Date().toISOString()
          });
        }
      });

    } catch (err) {
      console.log("Error fetching:", url);
    }
  }

  // 🔥 إلا كانو 0 → رجع fallback
  if (articles.length === 0) {
    articles = [
      {
        title: "No news detected - check sources",
        link: "#",
        date: new Date().toISOString()
      }
    ];
  }

  // ترتيب
  articles.sort((a, b) => new Date(b.date) - new Date(a.date));

  res.setHeader("Cache-Control", "no-store");

  res.status(200).json({
    trend: "Live 🔥",
    news: articles.slice(0, 30)
  });
}
