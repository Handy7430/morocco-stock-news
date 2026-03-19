export default async function handler(req, res) {
  const feeds = [
    "https://www.hespress.com/economie/feed",
    "https://www.boursenews.ma/rss",
    "https://news.google.com/rss/search?q=bourse+casablanca&hl=fr&gl=MA&ceid=MA:fr",
    "https://news.google.com/rss/search?q=بورصة+الدار+البيضاء&hl=ar&gl=MA&ceid=MA:ar"
  ];

  let articles = [];

  for (let url of feeds) {
    try {
      const response = await fetch(url);
      const text = await response.text();

      const items = text.split("<item>").slice(1, 10);

      items.forEach(item => {
        const title = item.split("<title>")[1]?.split("</title>")[0];
        const link = item.split("<link>")[1]?.split("</link>")[0];
        const date = item.split("<pubDate>")[1]?.split("</pubDate>")[0];

        if (title && link && date) {
          articles.push({
            title,
            link,
            date,
            source: url.includes("hespress")
              ? "Hespress"
              : url.includes("boursenews")
              ? "Boursenews"
              : "Google News"
          });
        }
      });
    } catch (e) {}
  }

  // فلترة 7 أيام
  const last7Days = new Date();
  last7Days.setDate(last7Days.getDate() - 7);

  const filtered = articles.filter(a => new Date(a.date) >= last7Days);

  res.status(200).json(filtered.slice(0, 30));
}
