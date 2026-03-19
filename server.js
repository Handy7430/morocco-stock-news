const Parser = require("rss-parser");
const parser = new Parser();

async function getNews() {
  const feeds = [
    "https://www.hespress.com/economie/feed",
    "https://www.boursenews.ma/rss",
    "https://news.google.com/rss/search?q=bourse+casablanca&hl=fr&gl=MA&ceid=MA:fr",
    "https://news.google.com/rss/search?q=بورصة+الدار+البيضاء&hl=ar&gl=MA&ceid=MA:ar"
  ];

  let articles = [];

  for (let url of feeds) {
    try {
      const feed = await parser.parseURL(url);
      articles = articles.concat(feed.items);
    } catch (e) {}
  }

  const last7Days = new Date();
  last7Days.setDate(last7Days.getDate() - 7);

  return articles
    .filter(a => new Date(a.pubDate) >= last7Days)
    .slice(0, 30);
}

getNews().then(data => console.log(data));
