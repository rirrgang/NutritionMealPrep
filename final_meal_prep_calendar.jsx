import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const categoryColors = {
  Frühstück: 'bg-yellow-100 text-yellow-800',
  Mittagessen: 'bg-green-100 text-green-800',
  Abendbrot: 'bg-red-100 text-red-800',
  Snack: 'bg-blue-100 text-blue-800',
};

const parseAmount = (amount) => {
  const [value, ...unitParts] = amount.split(' ');
  const numeric = parseFloat(value.replace(',', '.'));
  const unit = unitParts.join(' ');
  return { numeric, unit };
};

const scaleText = (text, scale) => {
  return text.replace(/(\d+,?\d*)\s?(g|ml|Stück|EL|TL)/g, (match, p1, p2) => {
    const num = parseFloat(p1.replace(',', '.'));
    const scaled = Math.round(num * scale * 100) / 100;
    return `${scaled} ${p2}`;
  });
};

const recipes = [
  { id: 1, title: 'Breakfast Burrito', category: 'Frühstück', image: 'https://source.unsplash.com/featured/?breakfast-burrito', description: 'Ei, Käse und Spinat in einer handlichen Tortilla, ideal zum Vorbereiten und Mitnehmen.', ingredients: [{ name: 'Eier', amount: '2 Stück' }, { name: 'Spinat', amount: '50 g' }, { name: 'Tortilla', amount: '1 große (8-inch)' }, { name: 'Geriebener Käse', amount: '15 g' }, { name: 'Olivenöl', amount: '1 TL' }], macros: { calories: 297, protein: '19g', carbs: '20g', fat: '15g' }, steps: ['Nimm 2 Stück Eier und verquirle sie mit 1 Prise Salz und Pfeffer.', 'Erhitze 1 TL Olivenöl in einer Pfanne und brate 50 g Spinat 1–2 Min. an.', 'Gieße die verquirlten Eier hinzu und lasse sie unter Rühren 5 Min. stocken.', 'Lege 1 große Tortilla flach und verteile die Eier-Spinat-Mischung auf einem Drittel der Fläche.', 'Streue 15 g geriebenen Käse darüber und rolle die Tortilla fest ein.', 'Verpacke das Burrito in Folie und friere es ein. Zum Aufwärmen entferne die Folie und erhitze es in der Mikrowelle: zuerst 1–2 Min. bei 50 % Leistung, dann 2 Min. bei voller Leistung.'] },
  { id: 2, title: 'Blueberry Baked Oatmeal', category: 'Frühstück', image: 'https://source.unsplash.com/featured/?baked-oatmeal', description: 'Warmer Haferauflauf mit frischen Blaubeeren, perfekt portioniert für die ganze Woche.', ingredients: [{ name: 'Haferflocken', amount: '50 g' }, { name: 'Milch', amount: '120 ml' }, { name: 'Ei', amount: '1 Stück' }, { name: 'Blaubeeren', amount: '50 g' }, { name: 'Brauner Zucker', amount: '1 EL' }, { name: 'Butter', amount: '5 g' }], macros: { calories: 184, protein: '5g', carbs: '28g', fat: '6g' }, steps: ['Heize den Ofen auf 190 °C vor und fette eine Auflaufform mit 5 g Butter ein.', 'Vermische 50 g Haferflocken, 120 ml Milch und 1 Ei in einer Schüssel.', 'Rühre 1 EL braunen Zucker unter und hebe 50 g Blaubeeren vorsichtig unter.', 'Fülle die Masse in die Form und streue etwas Zucker darüber.', 'Backe das Ganze für 40 Min. und lasse es danach 10–30 Min. abkühlen, bevor du es portionierst.'] },
  { id: 3, title: 'Mocha Overnight Oats', category: 'Frühstück', image: 'https://source.unsplash.com/featured/?overnight-oats-coffee', description: 'Kühle Haferflocken mit Kaffee, Kakao und Ahornsirup – fertig am Morgen.', ingredients: [{ name: 'Haferflocken', amount: '50 g' }, { name: 'Milch', amount: '100 ml' }, { name: 'Kaffee', amount: '50 ml' }, { name: 'Ahornsirup', amount: '1 EL' }, { name: 'Chiasamen', amount: '1 TL' }, { name: 'Kakaopulver', amount: '1 TL' }], macros: { calories: 379, protein: '13g', carbs: '53g', fat: '15g' }, steps: ['Gib 50 g Haferflocken, 100 ml Milch und 50 ml gekühlten Kaffee in ein Glas.', 'Rühre 1 EL Ahornsirup, 1 TL Chiasamen und 1 TL Kakaopulver unter.', 'Deckel auf das Glas setzen und über Nacht (>8 Std.) im Kühlschrank ziehen lassen.', 'Vor dem Servieren mit Walnüssen oder Kakaonibs garnieren.'] },
  { id: 4, title: 'Brown Rice Power Bowl', category: 'Mittagessen', image: 'https://source.unsplash.com/featured/?rice-bowl', description: 'Vollkornreis mit Bohnen, Gemüse und Avocado für nachhaltige Energie.', ingredients: [{ name: 'Brauner Reis (gekocht)', amount: '100 g' }, { name: 'Schwarze Bohnen', amount: '50 g' }, { name: 'Mais', amount: '50 g' }, { name: 'Cherrytomaten', amount: '50 g' }, { name: 'Avocado', amount: '50 g' }, { name: 'Limettensaft', amount: '1 EL' }, { name: 'Olivenöl', amount: '1 TL' }], macros: { calories: 262, protein: '8g', carbs: '38g', fat: '10.6g' }, steps: ['Erhitze 1 TL Olivenöl in einer Schüssel.', 'Füge 100 g gekochten Reis, 50 g Bohnen und 50 g Mais hinzu.', 'Schneide 50 g Cherrytomaten und 50 g Avocado in Stücke und gib sie dazu.', 'Vermische alles mit 1 EL Limettensaft, Salz und Pfeffer.', 'In einer Schüssel anrichten.'] },
  { id: 5, title: 'Tomato Basil Baked Orzo', category: 'Mittagessen', image: 'https://source.unsplash.com/featured/?orzo-pasta', description: 'Ein Pfannengericht aus Orzo, Tomaten, Basilikum und Mozzarella – schnell und lecker.', ingredients: [{ name: 'Orzo', amount: '100 g' }, { name: 'Tomaten', amount: '150 g' }, { name: 'Spinat', amount: '50 g' }, { name: 'Mozzarella', amount: '30 g' }, { name: 'Olivenöl', amount: '1 EL' }, { name: 'Brühe', amount: '200 ml' }], macros: { calories: 430, protein: '16.9g', carbs: '52.8g', fat: '18g' }, steps: ['Heize den Ofen auf 200 °C vor.', 'Erhitze 1 EL Olivenöl in einer ofenfesten Pfanne und brate 150 g Tomaten 2 Min. an.', 'Gib 100 g Orzo und 200 ml Brühe hinzu und lasse es köcheln (10–12 Min.).', 'Rühre 50 g Spinat und 30 g Mozzarella unter und backe weitere 5 Min.', 'Mit frischem Basilikum bestreuen.'] },
  { id: 6, title: 'Honey Lemon Salmon', category: 'Abendbrot', image: 'https://source.unsplash.com/featured/?salmon', description: 'Zarter Lachs mit Honig-Zitronen-Glasur zusammen mit Broccolini vom Blech.', ingredients: [{ name: 'Lachsfilet', amount: '150 g' }, { name: 'Broccolini', amount: '100 g' }, { name: 'Honig', amount: '1 EL' }, { name: 'Zitronensaft', amount: '1 EL' }, { name: 'OliverOil', amount: '1 TL' }], macros: { calories: 454, protein: '30g', carbs: '34g', fat: '23g' }, steps: ['Heize den Ofen auf 220 °C vor.', 'Lege 150 g Lachs und 100 g Broccolini auf ein Backblech.', 'Vermische 1 EL Honig, 1 EL Zitronensaft und 1 TL Olivenöl zu einer Marinade.', 'Bestreiche Lachs und Broccolini damit und backe 12–15 Min.', 'Mit Zitronenscheiben servieren.'] },
  { id: 7, title: 'Chickpea Curry Bowl', category: 'Abendbrot', image: 'https://source.unsplash.com/featured/?chickpea-curry', description: 'Geröstete Kichererbsen und Blumenkohl in aromatischer Currysauce.', ingredients: [{ name: 'Kichererbsen', amount: '100 g' }, { name: 'Blumenkohl', amount: '100 g' }, { name: 'Olivenöl', amount: '1 EL' }, { name: 'Currypulver', amount: '1 TL' }, { name: 'Quinoa', amount: '50 g' }], macros: { calories: 337, protein: '13g', carbs: '43g', fat: '15g' }, steps: ['Heize den Ofen auf 220 °C vor.', 'Vermische 100 g Blumenkohl und 100 g Kichererbsen mit 1 EL Olivenöl und 1 TL Currypulver.', 'Röste das Gemüse 20 Min. im Ofen.', 'Koche 50 g Quinoa nach Packungsanweisung.', 'Richte Quinoa und Gemüse zusammen an und serviere.'] }
];

const weekPlan = [
  { day: 'Montag', meals: { breakfast: 1, lunch: 4, dinner: 6, snack: 2 } },
  { day: 'Dienstag', meals: { breakfast: 2, lunch: 5, dinner: 7, snack: 3 } },
  { day: 'Mittwoch', meals: { breakfast: 3, lunch: 4, dinner: 6, snack: 2 } },
  { day: 'Donnerstag', meals: { breakfast: 1, lunch: 5, dinner: 7, snack: 3 } },
  { day: 'Freitag', meals: { breakfast: 2, lunch: 4, dinner: 6, snack: 3 } }
];

function MealPrepCalendar() {
  const [expandedId, setExpandedId] = useState(null);
  const [scale, setScale] = useState(1);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Meal Prep Wochenplan</h1>
      <div className="mb-6 px-4">
        <label className="font-medium">Portionsfaktor: {scale}</label>
        <input type="range" min="1" max="7" value={scale} onChange={e => setScale(parseInt(e.target.value, 10))} className="w-full mt-2" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
        {weekPlan.map(({ day, meals }) => (
          <div key={day} className="bg-white rounded-2xl shadow p-3">
            <h2 className="text-lg font-semibold mb-2 text-center">{day}</h2>
            {['breakfast','lunch','dinner','snack'].map(key => {
              const labels = { breakfast:'Frühstück', lunch:'Mittagessen', dinner:'Abendbrot', snack:'Snack' };
              const recipe = recipes.find(r => r.id === meals[key]);
              if (!recipe) return null;
              const id = `${day}-${key}`;
              const colorClass = categoryColors[recipe.category] || '';

              return (
                <div key={key} className="mb-3 border-b pb-2">
                  <h3 className={`inline-block px-2 py-1 rounded ${colorClass}`}>{labels[key]}</h3>
                  <div className="flex justify-between items-center mt-1">
                    <span className="font-medium">{recipe.title}</span>
                    <button onClick={() => setExpandedId(expanded => expanded === id ? null : id)} className="text-blue-600 focus:outline-none">
                      {expandedId === id ? 'Schließen' : 'Mehr'}
                    </button>
                  </div>
                  <AnimatePresence>
                    {expandedId === id && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="mt-2 overflow-hidden">
                        <img src={recipe.image} alt={recipe.title} className="w-full h-32 object-cover rounded mb-2" />
                        <p className="text-gray-600 text-sm mb-1">{recipe.description}</p>
                        <div className="bg-gray-50 p-2 rounded mb-2">
                          <h4 className="font-medium">Zutaten</h4>
                          <ul className="list-disc list-inside text-sm">
                            {recipe.ingredients.map((ing, i) => {
                              const { numeric, unit } = parseAmount(ing.amount);
                              return <li key={i}>{numeric*scale} {unit} {ing.name}</li>;
                            })}
                          </ul>
                        </div>
                        <div className="bg-gray-50 p-2 rounded mb-2">
                          <h4 className="font-medium">Makronährstoffe</h4>
                          <ul className="list-disc list-inside text-sm">
                            <li>{recipe.macros.calories*scale} kcal</li>
                            <li>Eiweiß: {parseFloat(recipe.macros.protein)*scale}g</li>
                            <li>Kohlenhydrate: {parseFloat(recipe.macros.carbs)*scale}g</li>
                            <li>Fett: {parseFloat(recipe.macros.fat)*scale}g</li>
                          </ul>
                        </div>
                        <div className="bg-gray-50 p-2 rounded">
                          <h4 className="font-medium">Zubereitungsschritte</h4>
                          <ol className="list-decimal list-inside text-sm space-y-1">
                            {recipe.steps.map((step,i) => <li key={i}>{scaleText(step,scale)}</li>)}
                          </ol>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
