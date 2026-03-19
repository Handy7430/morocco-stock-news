export default async function handler(req, res) {
  const feeds = [
    "https://www.hespress.com/economie/feed",
    "https://www.boursenews.ma/rss",
    "https://news.google.com/rss/search?q=bourse+casablanca&hl=fr&gl=MA&ceid=MA:fr",
    "https://news.google.com/rss/search?q=بورصة+الدار+البيضاء&hl=ar&gl=MA&ceid=MA:ar"
  ];

  // 🔥 كلمات السوق (عام)
  const stockKeywords = [
    "bourse", "casablanca", "MASI", "marché", "actions",
    "IPO", "résultats", "dividende", "bénéfices",
    "marché financier",
    "بورصة", "الدار البيضاء", "أسهم", "نتائج", "أرباح", "توزيعات"
  ];

  // 🔥 جميع الشركات المهمة فالبورصة
  const companyKeywords = [
    // بنوك
    "Attijariwafa", "Attijari", "ATW",
    "BCP", "Banque Populaire",
    "BMCE", "Bank of Africa", "BOA",
    "CIH", "Crédit du Maroc",
    "CFG Bank",

    // اتصالات
    "Maroc Telecom", "IAM", "اتصالات المغرب",

    // عقار
    "Addoha", "Alliances", "Résidences Dar Saada",

    // صناعات و مواد
    "LafargeHolcim", "Ciments du Maroc", "Sonasid",

    // طاقة
    "Taqa Morocco", "Afriquia Gaz", "Total Maroc",

    // استهلاك
    "Label Vie", "Cosumar", "Lesieur Cristal",

    // خدمات و أخرى
    "Auto Hall", "Colorado", "Delta Holding",
    "HPS", "Microdata", "Disway",

    // نقل و سياحة
    "CTM", "Air Arabia Maroc",

    // إضافات
    "Mutandis", "Saham", "Akdital"
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

          const isStock = stockKeywords.some(k =>
            lowerTitle.includes(k.toLowerCase())
          );

          const isCompany = companyKeywords.some(k =>
            lowerTitle.includes(k.toLowerCase())
          );

          // 🎯 فلترة ذكية
          const isRelevant = isStock || isCompany;

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
      console.error("Error:", url);
    }
  }

  // ⏱️ آخر 7 أيام
  const last7Days = new Date();
  last7Days.setDate(last7Days.getDate() - 7);

  const filtered = articles.filter(a => new Date(a.date) >= last7Days);

  // 🧹 حذف التكرار
  const unique = Array.from(
    new Map(filtered.map(item => [item.title, item])).values()
  );

  // 📊 ترتيب
  unique.sort((a, b) => new Date(b.date) - new Date(a.date));

  res.status(200).json(unique.slice(0, 30));
}
