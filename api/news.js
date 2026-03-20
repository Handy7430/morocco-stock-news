export default async function handler(req, res) {
  const feeds = [
    "https://news.google.com/rss/search?q=Attijariwafa+bank&hl=fr&gl=MA&ceid=MA:fr",
    "https://news.google.com/rss/search?q=Maroc+Telecom&hl=fr&gl=MA&ceid=MA:fr",
    "https://news.google.com/rss/search?q=Bank+of+Africa+Morocco&hl=fr&gl=MA&ceid=MA:fr",
    "https://news.google.com/rss/search?q=BCP+Maroc&hl=fr&gl=MA&ceid=MA:fr",
    "https://news.google.com/rss/search?q=CIH+Bank+Maroc&hl=fr&gl=MA&ceid=MA:fr",
    "https://news.google.com/rss/search?q=اتصالات+المغرب&hl=ar&gl=MA&ceid=MA:ar"
  ];

  const positiveWords = [
    "hausse", "croissance", "profit", "bénéfices", "record",
    "ارتفاع", "نمو", "أرباح"
  ];

  const negativeWords = [
    "baisse", "perte", "crise", "chute",
    "انخفاض", "خسارة", "تراجع"
  ];

  let articles = [];

  for (let url of feeds) {
    try {
      // 🔥 FIX cache
      const resFeed = await fetch(url + "&t=" + Date.now(), {
        cache: "no-store"
      });

      const xml = await resFeed.text();

      const items = xml.match(/<item>([\s\S]*?)<\/item>/g) || [];

      items.slice(0, 15).forEach(item => {
        const title = item.match(/<title>(.*?)<\/title>/)?.[1];
        const link = item.match(/<link>(.*?)<\/link>/)?.[1];
        const date = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1];

        if (title && link && date) {
          const lower = title.toLowerCase();

          let sentiment = "Neutral";

          if (positiveWords.some(w => lower.includes(w))) {
            sentiment = "Positive";
          } else if (negativeWords.some(w => lower.includes(w))) {
            sentiment = "Negative";
          }

          articles.push({
            title,
            link,
            date,
            sentiment,
            source: "Google News"
          });
        }
      });

    } catch (e) {
      console.log("Error:", url);
    }
  }

  // 🔥 آخر 7 أيام
  const last7 = new Date();
  last7.setDate(last7.getDate() - 7);

  const filtered = articles.filter(a => new Date(a.date) >= last7);

  // 🔥 remove duplicates
  const unique = Array.from(
    new Map(filtered.map(a => [a.title, a])).values()
  );

  // 🔥 sort
  unique.sort((a, b) => new Date(b.date) - new Date(a.date));

  // 🔥 MARKET PREDICTION
  const positiveCount = unique.filter(a => a.sentiment === "Positive").length;
  const negativeCount = unique.filter(a => a.sentiment === "Negative").length;

  let trend = "Stable ⚖️";

  if (positiveCount > negativeCount) {
    trend = "Bullish 📈";
  } else if (negativeCount > positiveCount) {
    trend = "Bearish 📉";
  }

  res.status(200).json({
    trend,
    news: unique.slice(0, 30)
  });
}
