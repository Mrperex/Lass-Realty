const fs = require('fs');

const file = 'messages/en.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

data.Blog = {
  title: "Market Insights & News",
  subtitle: "Discover the latest real estate market trends, luxury buying guides, and exclusive updates from the Dominican Republic.",
  noArticles: "No articles published yet.",
  noImage: "No Image",
  readArticle: "Read Article"
};

data.Neighborhoods = {
  title: "Neighborhood Guides",
  subtitle: "Explore the most exclusive luxury communities in the Dominican Republic. Each guide includes average prices, key highlights, and active property listings.",
  noGuides: "No neighborhood guides published yet.",
  avgPrice: "Avg. price: ",
  exploreGuide: "Explore Guide"
};

data.MarketReports = {
  pageTitle: "Market Reports",
  pageSubtitle: "Download free Punta Cana real estate market reports. Trends, rental yields, and guides for foreign buyers.",
  r1Title: "Punta Cana Market Overview 2026",
  r1Desc: "Comprehensive analysis of property values, appreciation rates (8.4% CAGR), tourism growth (12M+ visitors), and investment hotspots across the Punta Cana corridor.",
  r1Cat: "Market Analysis",
  r2Title: "Foreign Buyer's Guide to Dominican Republic Real Estate",
  r2Desc: "Everything you need to know: Law 16-95 ownership rights, CONFOTUR tax incentives, financing options, closing costs (4.5-7%), and step-by-step buying process.",
  r2Cat: "Buying Guide",
  r3Title: "ROI by Neighborhood: Rental Yield Report",
  r3Desc: "Detailed comparison of net rental yields across 5 key neighborhoods: Bávaro (9-11%), Cap Cana (7-9%), Cana Bay (8-10%), Downtown (6-8%), and Vista Cana (6-7%).",
  r3Cat: "Investment Analysis",
  pages: "Pages",
  download: "Download"
};

data.Legal = {
  privacyTitle: "Privacy Policy",
  privacyUpdated: "Last updated: March 1, 2026",
  termsTitle: "Terms of Service",
  termsUpdated: "Last updated: March 1, 2026"
};

fs.writeFileSync(file, JSON.stringify(data, null, 4));
console.log("en.json updated!");
