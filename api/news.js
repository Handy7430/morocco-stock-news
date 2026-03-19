export default async function handler(req, res) {
  const feeds = [
    // 🔥 شركات مباشرة (مهم)
    "https://news.google.com/rss/search?q=Attijariwafa+bank&hl=fr&gl=MA&ceid=MA:fr",
    "https://news.google.com/rss/search?q=Maroc+Telecom&hl=fr&gl=MA&ceid=MA:fr",
    "https://news.google.com/rss/search?q=Bank+of+Africa+Morocco&hl=fr&gl=MA&ceid=MA:fr",
    "https://news.google.com/rss/search?q=BCP+Maroc&hl=fr&gl=MA&ceid=MA:fr",
    "https://news.google.com/rss/search?q=CIH+Bank+Maroc&hl=fr&gl=MA&ceid=MA:fr",

    // عربي
    "https://news.google.com/rss/search?q=اتصالات+المغرب&hl=ar&gl=MA&ceid=MA:ar",
    "https://news.google.com/rss/search?q=التجاري+وفا+بنك&hl=ar&gl=MA&ceid=MA:ar",
    "https://news.google.com/rss/search?q=بنك+أفريقيا+المغرب&hl=ar&gl=MA&ceid=MA:ar"
  ];

  let articles = [];

  for (let url of feeds) {
    try {
      const resFeed = await fetch(url);
      const xml = await resFeed.text();

      const items = xml.match(/<item>([\s\S]*?)<\/item>/g) || [];

      items.slice(0, 10).forEach(item => {
        const title = item.match(/<title>(.*?)<\/title>/)?.[1];
        const link = item.match(/<link>(.*?)<\/link>/)?.[1];
        const date = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1];

        if (title && link && date) {
          articles.push({ title, link, date });
        }
      });

    } catch (e) {
      console.log("Error:", url);
    }
  }

  // ⏱️ آخر 7 أيام
  const last7 = new Date();
  last7.setDate(last7.getDate() - 7);

  const filtered = articles.filter(a => new Date(a.date) >= last7);

  // 🧹 حذف التكرار
  const unique = Array.from(
    new Map(filtered.map(a => [a.title, a])).values()
  );

  // ترتيب
  unique.sort((a, b) => new Date(b.date) - new Date(a.date));

  res.status(200).json(unique.slice(0, 30));
}
