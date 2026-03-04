const fs = require('fs');

async function main() {
  const enData = JSON.parse(fs.readFileSync('messages/en.json', 'utf8'));
  const esData = JSON.parse(fs.readFileSync('messages/es.json', 'utf8'));
  
  // Merge the new missing keys into es.json from en.json
  if (!esData.Blog) esData.Blog = { ...enData.Blog };
  if (!esData.Neighborhoods) esData.Neighborhoods = { ...enData.Neighborhoods };
  if (!esData.MarketReports) esData.MarketReports = { ...enData.MarketReports };
  if (!esData.Legal) esData.Legal = { ...enData.Legal };
  
  // Basic ES translations for the new additions to avoid using API just for 15 strings
  esData.Blog.title = "Noticias y Mercado";
  esData.Blog.subtitle = "Descubra las últimas tendencias del mercado inmobiliario, guías de compra de lujo y actualizaciones exclusivas de República Dominicana.";
  esData.Blog.noArticles = "No hay artículos publicados todavía.";
  esData.Blog.noImage = "Sin Imagen";
  esData.Blog.readArticle = "Leer Más";

  esData.Neighborhoods.title = "Guías de Vecindarios";
  esData.Neighborhoods.subtitle = "Explore las comunidades de lujo más exclusivas de la República Dominicana.";
  esData.Neighborhoods.noGuides = "No hay guías publicadas todavía.";
  esData.Neighborhoods.avgPrice = "Precio promedio: ";
  esData.Neighborhoods.exploreGuide = "Explorar Guía";

  esData.MarketReports.pageTitle = "Informes del Mercado";
  esData.MarketReports.pageSubtitle = "Descargue informes gratuitos sobre el mercado inmobiliario de Punta Cana.";
  esData.MarketReports.r1Title = "Panorama del Mercado de Punta Cana 2026";
  esData.MarketReports.r1Desc = "Análisis integral de valores de propiedades y puntos de inversión clave.";
  esData.MarketReports.r1Cat = "Análisis de Mercado";
  esData.MarketReports.r2Title = "Guía del Comprador Extranjero";
  esData.MarketReports.r2Desc = "Todo lo que necesitas saber: derechos de propiedad, incentivos fiscales y más.";
  esData.MarketReports.r2Cat = "Guía de Compra";
  esData.MarketReports.r3Title = "ROI por Vecindario";
  esData.MarketReports.r3Desc = "Comparación detallada de rendimientos netos de alquiler.";
  esData.MarketReports.r3Cat = "Inversión";
  esData.MarketReports.pages = "Páginas";
  esData.MarketReports.download = "Descargar";
  
  esData.Legal.privacyTitle = "Política de Privacidad";
  esData.Legal.privacyUpdated = "Última actualización: 1 de marzo de 2026";
  esData.Legal.termsTitle = "Términos de Servicio";
  esData.Legal.termsUpdated = "Última actualización: 1 de marzo de 2026";

  fs.writeFileSync('messages/es.json', JSON.stringify(esData, null, 4));
  console.log('es.json synced!');
}

main();
