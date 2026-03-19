export default async function handler(req, res) {
  const feeds = [
  // 🏦 بنوك
  "https://news.google.com/rss/search?q=Attijariwafa+bank&hl=fr&gl=MA&ceid=MA:fr",
  "https://news.google.com/rss/search?q=Banque+Populaire+Maroc+BCP&hl=fr&gl=MA&ceid=MA:fr",
  "https://news.google.com/rss/search?q=Bank+of+Africa+Morocco+BMCE&hl=fr&gl=MA&ceid=MA:fr",
  "https://news.google.com/rss/search?q=CIH+Bank+Maroc&hl=fr&gl=MA&ceid=MA:fr",
  "https://news.google.com/rss/search?q=Crédit+du+Maroc&hl=fr&gl=MA&ceid=MA:fr",

  // 📡 اتصالات
  "https://news.google.com/rss/search?q=Maroc+Telecom+IAM&hl=fr&gl=MA&ceid=MA:fr",

  // 🏗️ عقار
  "https://news.google.com/rss/search?q=Addoha+Maroc&hl=fr&gl=MA&ceid=MA:fr",
  "https://news.google.com/rss/search?q=Alliances+Développement+Immobilier&hl=fr&gl=MA&ceid=MA:fr",
  "https://news.google.com/rss/search?q=Résidences+Dar+Saada+Maroc&hl=fr&gl=MA&ceid=MA:fr",

  // 🏭 صناعات
  "https://news.google.com/rss/search?q=LafargeHolcim+Maroc&hl=fr&gl=MA&ceid=MA:fr",
  "https://news.google.com/rss/search?q=Ciments+du+Maroc&hl=fr&gl=MA&ceid=MA:fr",
  "https://news.google.com/rss/search?q=Sonasid+Maroc&hl=fr&gl=MA&ceid=MA:fr",

  // ⚡ طاقة
  "https://news.google.com/rss/search?q=Taqa+Morocco&hl=fr&gl=MA&ceid=MA:fr",
  "https://news.google.com/rss/search?q=Afriquia+Gaz&hl=fr&gl=MA&ceid=MA:fr",
  "https://news.google.com/rss/search?q=Total+Maroc&hl=fr&gl=MA&ceid=MA:fr",

  // 🛒 استهلاك
  "https://news.google.com/rss/search?q=Label+Vie+Maroc&hl=fr&gl=MA&ceid=MA:fr",
  "https://news.google.com/rss/search?q=Cosumar+Maroc&hl=fr&gl=MA&ceid=MA:fr",
  "https://news.google.com/rss/search?q=Lesieur+Cristal&hl=fr&gl=MA&ceid=MA:fr",

  // 💻 تكنولوجيا
  "https://news.google.com/rss/search?q=HPS+Maroc&hl=fr&gl=MA&ceid=MA:fr",
  "https://news.google.com/rss/search?q=Microdata+Maroc&hl=fr&gl=MA&ceid=MA:fr",
  "https://news.google.com/rss/search?q=Disway+Maroc&hl=fr&gl=MA&ceid=MA:fr",

  // 🚗 صناعات وخدمات
  "https://news.google.com/rss/search?q=Auto+Hall+Maroc&hl=fr&gl=MA&ceid=MA:fr",
  "https://news.google.com/rss/search?q=Colorado+Maroc&hl=fr&gl=MA&ceid=MA:fr",
  "https://news.google.com/rss/search?q=Delta+Holding+Maroc&hl=fr&gl=MA&ceid=MA:fr",

  // ✈️ نقل
  "https://news.google.com/rss/search?q=CTM+Maroc&hl=fr&gl=MA&ceid=MA:fr",

  // 🏥 صحة
  "https://news.google.com/rss/search?q=Akdital+Maroc&hl=fr&gl=MA&ceid=MA:fr",

  // 🌍 عربي (باش تزيد coverage)
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
