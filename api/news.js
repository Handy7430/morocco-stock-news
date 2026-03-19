export default async function handler(req, res) {
  const feeds = [
    "https://www.hespress.com/economie/feed",
    "https://www.boursenews.ma/rss",
    "https://news.google.com/rss/search?q=bourse+casablanca&hl=fr&gl=MA&ceid=MA:fr",
    "https://news.google.com/rss/search?q=بورصة+الدار+البيضاء&hl=ar&gl=MA&ceid=MA:ar"
  ];

  // 🔥 KEYWORDS قوية (شركات + سوق)
  const keywords = [
    // FR عام
    "bourse", "casablanca", "MASI", "marché", "actions",
    "IPO", "résultats", "dividende", "bénéfices",

    // AR عام
    "بورصة", "الدار البيضاء", "أسهم", "نتائج", "أرباح", "توزيعات",

    // بنوك
    "Attijariwafa", "Attijari", "BCP", "Banque Populaire",
    "BMCE", "Bank of Africa", "CIH", "Crédit du Maroc",

    // اتصالات
    "Maroc Telecom", "IAM", "اتصالات المغرب",

    // عقار
    "Addoha", "Alliances", "Résidences Dar Saada",

    // صناعات
    "LafargeHolcim", "Ciments du Maroc", "Colorado", "Delta Holding",

    // طاقة
    "Total Maroc", "Afriquia Gaz", "Taqa Morocco",

    // استهلاك
    "Label Vie", "Cosumar", "Lesieur Cristal",

    // نقل
    "CTM"
  ];

  let articles = [];

  for (let url of feeds) {
    try {
      const response = await fetch(url);
      const text = await response.text();

      const items = text.split("<item>").slice(1, 20);

      items.forEach(item => {
        const title = item.split("<title>")[1]?.split("</title>")[0];
        const link = item.split("<link>")[1]?.split("</link>")[0];
        const date = item.split("<pubDate>")[1]?.split("</pubDate>")[0];

        if (title && link && date) {
          const lowerTitle = title.toLowerCase();

          // 🎯 فلترة بالكلمات المفتاحية
          const isRelevant = keywords.some(k =>
            lowerTitle.includes(k.toLowerCase())
          );

          if (isRelevant && title.length > 20) {
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
        }
      });
    } catch (e) {
      console.error("Error fetching:", url);
    }
  }

  // ⏱️ آخر 7 أيام فقط
  const last7Days = new Date();
  last7Days.setDate(last7Days.getDate() - 7);

  const filtered = articles.filter(a => new Date(a.date) >= last7Days);

  // 🧹 حذف التكرار (حسب title)
  const unique = Array.from(
    new Map(filtered.map(item => [item.title, item])).values()
  );

  // 📊 ترتيب حسب الأحدث
  unique.sort((a, b) => new Date(b.date) - new Date(a.date));

  // 🔚 limit
  res.status(200).json(unique.slice(0, 30));
}
