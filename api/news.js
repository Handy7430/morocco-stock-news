export const dynamic = "force-dynamic"; // 🔥 مهم بزاف

export default async function handler(req, res) {
  const feeds = [
    "https://www.hespress.com/economie/feed",
    "https://www.boursenews.ma/rss",
    "https://medias24.com/feed"
  ];

  let articles = [];

  for (let url of feeds) {
    try {
      const resFeed = await fetch(url, {
        cache: "no-store"
      });

      const xml = await resFeed.text();

      const items = xml.match(/<item>([\s\S]*?)<\/item>/g) || [];

      items.slice(0, 20).forEach(item => {
        const title = item.match(/<title>(.*?)<\/title>/)?.[1];
        const link = item.match(/<link>(.*?)<\/link>/)?.[1];
        const date = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1];

        if (title && link && date) {
          articles.push({
            title,
            link,
            date
          });
        }
      });

    } catch (e) {
      console.log("Error:", url);
    }
  }

  // 🔥 ترتيب
  articles.sort((a, b) => new Date(b.date) - new Date(a.date));

  res.setHeader("Cache-Control", "no-store"); // 🔥 مهم
  res.status(200).json({
    trend: "Live 🔥",
    news: articles.slice(0, 30)
  });
}
