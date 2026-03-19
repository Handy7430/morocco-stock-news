export default async function handler(req, res) {
  const feeds = [
    "https://www.hespress.com/economie/feed",
    "https://www.boursenews.ma/rss",
    "https://news.google.com/rss/search?q=bourse+casablanca&hl=fr&gl=MA&ceid=MA:fr",
    "https://news.google.com/rss/search?q=بورصة+الدار+البيضاء&hl=ar&gl=MA&ceid=MA:ar"
  ];

  // 🔥 أسماء الشركات
  const companies = [
    "Attijariwafa", "Attijari", "ATW",
    "Banque Populaire", "BCP",
    "BMCE", "Bank of Africa", "BOA",
    "CIH", "Crédit du Maroc", "CFG Bank",
    "Maroc Telecom", "IAM", "اتصالات المغرب",
    "Addoha", "Alliances",
    "Lafarge", "Ciments du Maroc",
    "Cosumar", "Label Vie",
    "Taqa", "Afriquia", "Total Maroc",
    "Auto Hall", "Delta Holding",
    "HPS", "Microdata", "Disway",
    "CTM", "Mutandis", "Akdital"
  ];

  let articles = [];

  for (let url of feeds) {
    try {
      const resFeed = await fetch(url);
      const xml = await resFeed.text();

      const items = xml.match(/<item>([\s\S]*?)<\/item>/g) || [];

      items.slice(0, 15).forEach(item => {
        const title = item.match(/<title>(.*?)<\/title>/)?.[1];
        const link = item.match(/<link>(.*?)<\/link>/)?.[1];
        const date = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1];

        if (title && link && date) {
          const lower = title.toLowerCase();

          // 🎯 الشرط: فيه اسم شركة
          const hasCompany = companies.some(c =>
            lower.includes(c.toLowerCase())
          );

          if (hasCompany) {
            articles.push({
              title,
              link,
              date
            });
          }
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
