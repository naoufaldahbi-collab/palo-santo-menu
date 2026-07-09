/**
 * PALO SANTO BAR — DIGITAL MENU
 * Design: Dark Artisan / Botanical Luxury
 * Tarifa, Calle Carnicería — Nightlife Street
 *
 * Single-page scrollable menu with sticky category nav.
 * Cocktail cards expand on tap to show ingredients.
 * QR code at bottom for sharing.
 */

import { useState, useEffect, useRef } from "react";

// ─── Data ──────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: "signature", label: "Signature", emoji: "🌸" },
  { id: "classics", label: "Clásicos", emoji: "🍸" },
  { id: "crowdpleasers", label: "Top 10", emoji: "⭐" },
  { id: "premium", label: "Premium", emoji: "🥃" },
  { id: "tropical", label: "Tropical", emoji: "🌴" },
  { id: "gt", label: "G&T", emoji: "🫧" },
  { id: "tequila", label: "Tequila", emoji: "🌵" },
  { id: "whisky", label: "Whisky", emoji: "🥃" },
  { id: "rum", label: "Ron", emoji: "🍹" },
  { id: "sparkling", label: "Burbujas", emoji: "🥂" },
  { id: "mocktails", label: "Sin Alcohol", emoji: "🌿" },
  { id: "shots", label: "Shots", emoji: "🔥" },
  { id: "beer", label: "Cerveza", emoji: "🍺" },
  { id: "wine", label: "Vinos", emoji: "🍷" },
  { id: "drinks", label: "Bebidas", emoji: "🥤" },
  { id: "coffee", label: "Café", emoji: "☕" },
  { id: "spirits", label: "Licores", emoji: "🍾" },
];

interface MenuItem {
  name: string;
  price: string;
  desc: string;
  ingredients?: string;
  variants?: string[];
  floral?: boolean;
  signature?: boolean;
}

interface Section {
  id: string;
  title: string;
  emoji: string;
  accentColor?: string;
  subsections?: { label: string; items: MenuItem[] }[];
  items?: MenuItem[];
}

const MENU_SECTIONS: Section[] = [
  {
    id: "signature",
    title: "Signature Cocktails",
    emoji: "🌸",
    accentColor: "#4A7C59",
    items: [
      {
        name: "Palo Santo Garden G&T",
        price: "€12",
        desc: "Nordés Gin · Elderflower Tónica · Floral Ice Cube",
        ingredients: "Nordés Gin 50ml, Royal Bliss Elderflower Tónica, lavender syrup 5ml, floral ice cube (lavender + rose), dried rose garnish",
        floral: true,
        signature: true,
      },
      {
        name: "Palo Santo Sunset Spritz",
        price: "€11",
        desc: "Aperol · Prosecco · Soda · Floral Ice Cube",
        ingredients: "Aperol 50ml, Mionetto Prosecco 90ml, soda 30ml, floral ice cube (marigold + viola), orange slice",
        floral: true,
        signature: true,
      },
    ],
  },
  {
    id: "classics",
    title: "Classic Cocktails",
    emoji: "🍸",
    items: [
      { name: "Mojito", price: "€9", desc: "Bacardí · Lima · Menta · Soda", ingredients: "Bacardí Blanco 50ml, fresh lime juice 25ml, sugar syrup 15ml, fresh mint, soda water", variants: ["Classic", "Fresa +€1", "Maracuyá +€1"] },
      { name: "Cuba Libre", price: "€8", desc: "Bacardí · Coca-Cola · Lima", ingredients: "Bacardí Blanco 50ml, Coca-Cola 150ml, fresh lime wedge" },
      { name: "Piña Colada", price: "€9", desc: "Bacardí · Coco · Piña", ingredients: "Bacardí Blanco 50ml, coconut cream 30ml, pineapple juice 90ml" },
      { name: "Daiquiri", price: "€9", desc: "Bacardí · Lima · Azúcar", ingredients: "Bacardí Blanco 50ml, fresh lime juice 25ml, sugar syrup 15ml", variants: ["Classic", "Fresa +€1", "Mango +€1"] },
      { name: "Aperol Spritz", price: "€9", desc: "Aperol · Prosecco · Soda · Naranja", ingredients: "Aperol 50ml, Prosecco 90ml, soda 30ml, orange slice" },
      { name: "Negroni", price: "€10", desc: "Beefeater · Campari · Vermut Rojo", ingredients: "Beefeater Gin 30ml, Campari 30ml, Martini Rosso 30ml, orange peel" },
      { name: "Martini", price: "€9", desc: "Gin o Vodka · Vermut Seco", ingredients: "Beefeater Gin 50ml or Absolut Vodka 50ml, dry vermouth 10ml, olive or lemon twist", variants: ["Gin", "Vodka", "Dirty"] },
      { name: "Bloody Mary", price: "€9", desc: "Absolut · Tomate · Especias", ingredients: "Absolut Vodka 50ml, tomato juice 90ml, lemon juice 15ml, Worcestershire sauce, Tabasco, celery salt" },
    ],
  },
  {
    id: "crowdpleasers",
    title: "Top 10 Difford's Guide",
    emoji: "⭐",
    items: [
      { name: "Porn Star Martini", price: "€11", desc: "Vodka Vainilla · Maracuyá · Prosecco", ingredients: "Absolut Vanilla Vodka 50ml, passion fruit liqueur 15ml, passion fruit purée 30ml, lime juice 15ml, Prosecco shot (side)" },
      { name: "Espresso Martini", price: "€10", desc: "Absolut · Kahlúa · Espresso Bako", ingredients: "Absolut Vodka 50ml, Kahlúa 20ml, fresh Bako espresso 30ml, sugar syrup 5ml, 3 coffee beans" },
      { name: "Margarita", price: "€10", desc: "Tequila · Cointreau · Lima · Sal", ingredients: "José Cuervo Tequila 50ml, Cointreau 20ml, fresh lime juice 25ml, salt rim", variants: ["Classic", "Mango +€1", "Picante +€1"] },
      { name: "Paloma", price: "€9", desc: "Tequila · Pomelo · Lima · Soda", ingredients: "José Cuervo Tequila 50ml, grapefruit juice 60ml, lime juice 15ml, soda, salt rim" },
      { name: "Gin Basil Smash", price: "€10", desc: "Nordés · Albahaca · Limón · Soda", ingredients: "Nordés Gin 50ml, fresh basil 8 leaves, lemon juice 25ml, sugar syrup 15ml, soda" },
      { name: "Mai Tai", price: "€11", desc: "Bacardí Blanco & Añejo · Orgeat · Lima", ingredients: "Bacardí Blanco 30ml, Bacardí Añejo 20ml, orange liqueur 15ml, orgeat syrup 15ml, lime juice 20ml" },
      { name: "Jungle Bird", price: "€11", desc: "Ron Añejo · Campari · Piña · Lima", ingredients: "Bacardí Añejo 45ml, Campari 20ml, pineapple juice 45ml, lime juice 15ml, sugar syrup 10ml" },
      { name: "Vieux Carré", price: "€11", desc: "Rye Whisky · Cognac · Vermut · Bitters", ingredients: "Jack Daniel's 30ml, brandy 30ml, Martini Rosso 30ml, Angostura bitters 2 dashes, Peychaud's bitters" },
    ],
  },
  {
    id: "premium",
    title: "Classic Premium",
    emoji: "🥃",
    items: [
      { name: "Old Fashioned", price: "€10", desc: "Jack Daniel's · Azúcar · Bitters · Naranja", ingredients: "Jack Daniel's 50ml, sugar cube, Angostura bitters 2 dashes, orange peel" },
      { name: "Manhattan", price: "€11", desc: "Jack Daniel's · Vermut Rojo · Bitters", ingredients: "Jack Daniel's 50ml, Martini Rosso 25ml, Angostura bitters 2 dashes, maraschino cherry" },
      { name: "Cosmopolitan", price: "€10", desc: "Absolut Citron · Cointreau · Arándano · Lima", ingredients: "Absolut Citron Vodka 40ml, Cointreau 15ml, cranberry juice 30ml, lime juice 15ml" },
      { name: "Whiskey Sour", price: "€10", desc: "Jack Daniel's · Limón · Azúcar · Clara", ingredients: "Jack Daniel's 50ml, lemon juice 25ml, sugar syrup 15ml, egg white (optional), Angostura bitters" },
      { name: "Boulevardier", price: "€11", desc: "Bourbon · Campari · Vermut Rojo", ingredients: "Jack Daniel's Bourbon 45ml, Campari 30ml, Martini Rosso 30ml, orange peel" },
    ],
  },
  {
    id: "tropical",
    title: "Fresh & Tropical",
    emoji: "🌴",
    items: [
      { name: "Atlantic Sunset", price: "€11", desc: "Nordés · Maracuyá · Limón · Prosecco", ingredients: "Nordés Gin 40ml, passion fruit purée 30ml, lemon juice 20ml, vanilla syrup 10ml, Prosecco top" },
      { name: "Tarifa Breeze", price: "€10", desc: "Bacardí · Coco · Piña · Lima", ingredients: "Bacardí Blanco 40ml, coconut cream 20ml, pineapple juice 60ml, lime juice 15ml" },
      { name: "Golden Hour", price: "€10", desc: "Tequila · Mango · Chili · Lima", ingredients: "José Cuervo Tequila 40ml, mango purée 30ml, chili syrup 5ml, lime juice 20ml" },
      { name: "Picante de la Casa", price: "€10", desc: "Tequila · Lima · Agave · Jalapeño", ingredients: "José Cuervo Tequila 50ml, lime juice 20ml, agave syrup 10ml, jalapeño slices 3, salt rim" },
      { name: "Zombie", price: "€11", desc: "Bacardí Blanco & Añejo · Piña · Granadina", ingredients: "Bacardí Blanco 30ml, Bacardí Añejo 30ml, lime juice 20ml, pineapple juice 30ml, grenadine 10ml, Angostura bitters" },
      { name: "Painkiller", price: "€10", desc: "Ron Añejo · Piña · Naranja · Coco · Nuez Moscada", ingredients: "Bacardí Añejo 50ml, pineapple juice 60ml, orange juice 30ml, coconut cream 30ml, nutmeg garnish" },
    ],
  },
  {
    id: "gt",
    title: "Gin & Tonic",
    emoji: "🫧",
    items: [
      { name: "Nordés G&T", price: "€10", desc: "Nordés · Elderflower Tónica · Pepino · Pétalos", ingredients: "Nordés Gin 50ml, Royal Bliss Elderflower Tónica, cucumber, rose petals", signature: true },
      { name: "Beefeater G&T", price: "€9", desc: "Beefeater · Indian Tónica · Limón · Enebro", ingredients: "Beefeater Gin 50ml, Royal Bliss Indian Tónica, lemon, juniper berries" },
      { name: "Green Wave G&T", price: "€10", desc: "Nordés · Mediterranean Tónica · Pepino · Menta", ingredients: "Nordés Gin 50ml, Royal Bliss Mediterranean Tónica, cucumber, mint, lime" },
    ],
  },
  {
    id: "tequila",
    title: "Tequila Cocktails",
    emoji: "🌵",
    items: [
      { name: "Tequila Sunrise", price: "€9", desc: "Tequila · Naranja · Granadina", ingredients: "José Cuervo Tequila 50ml, orange juice 90ml, grenadine 10ml" },
      { name: "Tommy's Margarita", price: "€10", desc: "Tequila · Lima · Agave", ingredients: "José Cuervo Tequila 50ml, lime juice 25ml, agave syrup 15ml, salt rim" },
    ],
  },
  {
    id: "whisky",
    title: "Whisky & Bourbon",
    emoji: "🥃",
    items: [
      { name: "Irish Coffee", price: "€9", desc: "Jameson · Café Bako · Nata", ingredients: "Jameson Irish Whiskey 40ml, hot Bako coffee 90ml, brown sugar, lightly whipped cream" },
      { name: "Mint Julep", price: "€9", desc: "Bourbon · Menta · Azúcar · Hielo Picado", ingredients: "Jack Daniel's Bourbon 60ml, fresh mint, sugar syrup 10ml, crushed ice" },
      { name: "Lynchburg Lemonade", price: "€10", desc: "Jack Daniel's · Cointreau · Limón · Soda", ingredients: "Jack Daniel's 40ml, Cointreau 15ml, lemon juice 20ml, soda water, lemon slice" },
      { name: "Americano", price: "€9", desc: "Campari · Vermut Rojo · Soda", ingredients: "Campari 30ml, Martini Rosso 30ml, soda water, orange slice" },
    ],
  },
  {
    id: "rum",
    title: "Ron Cocktails",
    emoji: "🍹",
    items: [
      { name: "Long Island Iced Tea", price: "€11", desc: "Vodka · Gin · Ron · Tequila · Cointreau · Cola", ingredients: "Absolut 15ml, Beefeater 15ml, Bacardí 15ml, Tequila 15ml, Cointreau 15ml, lemon juice 25ml, Coca-Cola top" },
      { name: "Black Russian", price: "€9", desc: "Absolut · Kahlúa", ingredients: "Absolut Vodka 50ml, Kahlúa 20ml" },
    ],
  },
  {
    id: "sparkling",
    title: "Champagne & Vinos",
    emoji: "🥂",
    items: [
      { name: "Bellini", price: "€9", desc: "Prosecco · Melocotón", ingredients: "Mionetto Prosecco 90ml, peach purée 30ml" },
      { name: "Kir Royal", price: "€9", desc: "Prosecco · Crème de Cassis", ingredients: "Mionetto Prosecco 90ml, crème de cassis 15ml" },
      { name: "Sangria", price: "€9 / Jarra €28", desc: "Vino Tinto · Brandy · Frutas · Naranja", ingredients: "Marqués de Cáceres Tinto 150ml, brandy 30ml, orange juice 30ml, fresh fruits, sugar" },
    ],
  },
  {
    id: "mocktails",
    title: "Sin Alcohol — 0%",
    emoji: "🌿",
    accentColor: "#4A7C59",
    items: [
      { name: "Virgin Mojito", price: "€6", desc: "Lima · Menta · Soda", ingredients: "Fresh lime juice 25ml, sugar syrup 15ml, fresh mint, soda water" },
      { name: "Passion Fruit Cooler", price: "€6", desc: "Maracuyá · Lima · Soda · Menta", ingredients: "Passion fruit purée 30ml, lime juice 15ml, soda water, mint" },
      { name: "Mango Wave", price: "€6", desc: "Mango · Cítricos · Fruta Fresca · Soda", ingredients: "Mango purée 40ml, citrus juice 20ml, fresh fruit, soda" },
      { name: "Cucumber Mint Fizz", price: "€6", desc: "Pepino · Menta · Lima · Soda", ingredients: "Cucumber slices, fresh mint, lime juice 20ml, sugar syrup 10ml, soda water" },
      { name: "Berry Lemonade", price: "€6", desc: "Frutos Rojos · Limón · Soda", ingredients: "Mixed berry purée 30ml, lemon juice 20ml, sugar syrup 10ml, soda water" },
    ],
  },
  {
    id: "shots",
    title: "Shots",
    emoji: "🔥",
    items: [
      { name: "B-52", price: "€6", desc: "Kahlúa · Baileys · Grand Marnier (en capas)", ingredients: "Kahlúa 15ml, Baileys 15ml, Grand Marnier 15ml — layered" },
      { name: "Flaming B-52", price: "€7", desc: "B-52 Flameado", ingredients: "Kahlúa 15ml, Baileys 15ml, Grand Marnier 15ml — flamed" },
      { name: "Jägerbomb", price: "€7", desc: "Jägermeister + Monster Energy", ingredients: "Jägermeister 35ml dropped into Monster Energy 150ml" },
      { name: "Cucaracha", price: "€5", desc: "Kahlúa · Tequila — Flameado", ingredients: "Kahlúa 20ml, tequila 20ml — flamed" },
      { name: "Tequila Shot", price: "€4", desc: "José Cuervo · Sal · Lima", ingredients: "José Cuervo Tequila 35ml, salt, lime" },
      { name: "Fireball Shot", price: "€4", desc: "Fireball Cinnamon Whisky", ingredients: "Fireball Cinnamon Whisky 35ml" },
      { name: "Jägermeister Shot", price: "€4", desc: "Jägermeister", ingredients: "Jägermeister 35ml" },
      { name: "Chupito de la Casa", price: "€3", desc: "Chupito sorpresa — cambia cada semana", ingredients: "Rotating house shot — changes weekly. Ask your bartender!" },
    ],
  },
  {
    id: "beer",
    title: "Cerveza",
    emoji: "🍺",
    subsections: [
      {
        label: "🍺 Grifo — Cruzcampo",
        items: [
          { name: "Caña (200ml)", price: "€2.50", desc: "Cruzcampo — grifo exclusivo" },
          { name: "Tubo (330ml)", price: "€3.50", desc: "Cruzcampo — grifo exclusivo" },
          { name: "Jarra (500ml)", price: "€5.00", desc: "Cruzcampo — grifo exclusivo" },
        ],
      },
      {
        label: "🍾 Botella — Española",
        items: [
          { name: "Victoria 1/3", price: "€3.50", desc: "Cerveza local de Málaga" },
          { name: "Estrella Galicia 1/3", price: "€3.50", desc: "Galicia" },
          { name: "Alhambra Reserva 1925", price: "€4.00", desc: "Granada — premium" },
          { name: "Heineken 1/3", price: "€3.50", desc: "Premium lager" },
        ],
      },
      {
        label: "🌍 Botella — Internacional",
        items: [
          { name: "Corona 1/3", price: "€4.00", desc: "México" },
          { name: "Guinness 440ml", price: "€4.50", desc: "Irlanda — stout" },
          { name: "VollDamm 1/3", price: "€4.00", desc: "Barcelona — doble malta 7.2°" },
        ],
      },
      {
        label: "🌿 0.0 & Sin Gluten",
        items: [
          { name: "Cruzcampo 0.0", price: "€3.00", desc: "Sin alcohol" },
          { name: "Victoria 0.0", price: "€3.00", desc: "Sin alcohol" },
          { name: "Victoria Tostada 0.0", price: "€3.50", desc: "Tostada sin alcohol" },
          { name: "Daura Sin Gluten", price: "€3.50", desc: "Damm — sin gluten, premiada mundialmente" },
        ],
      },
    ],
  },
  {
    id: "wine",
    title: "Vinos & Tinto de Verano",
    emoji: "🍷",
    subsections: [
      {
        label: "Copa de Vino",
        items: [
          { name: "Vino Blanco", price: "€4.00", desc: "Marqués de Cáceres Blanco" },
          { name: "Vino Tinto", price: "€4.00", desc: "Marqués de Cáceres Crianza" },
          { name: "Vino Rosado", price: "€4.00", desc: "Marqués de Cáceres Rosado" },
          { name: "Cava", price: "€5.00", desc: "Freixenet Cordon Negro" },
          { name: "Prosecco", price: "€5.00", desc: "Mionetto" },
        ],
      },
      {
        label: "🍷 Tinto de Verano",
        items: [
          { name: "Tinto de Verano Clásico", price: "€3.00", desc: "Vino tinto + La Casera gaseosa" },
          { name: "Tinto de Verano con Limón", price: "€3.00", desc: "Vino tinto + La Casera limón" },
          { name: "Tinto de Verano Rosado", price: "€3.50", desc: "Vino rosado + La Casera limón" },
        ],
      },
    ],
  },
  {
    id: "drinks",
    title: "Bebidas & Refrescos",
    emoji: "🥤",
    subsections: [
      {
        label: "Refrescos",
        items: [
          { name: "Coca-Cola", price: "€3.00", desc: "350ml botella" },
          { name: "Coca-Cola Zero", price: "€3.00", desc: "350ml botella" },
          { name: "Fanta Naranja", price: "€3.00", desc: "350ml botella" },
          { name: "Fanta Limón", price: "€3.00", desc: "350ml botella" },
          { name: "Sprite", price: "€3.00", desc: "350ml botella" },
          { name: "Aquarius Naranja", price: "€3.00", desc: "350ml botella" },
          { name: "Nestea", price: "€2.50", desc: "330ml" },
          { name: "Monster Energy", price: "€3.50", desc: "250ml — fridge dedicado" },
        ],
      },
      {
        label: "Agua & Zumos",
        items: [
          { name: "Agua Fuente Liviana", price: "€2.00", desc: "500ml sin gas" },
          { name: "Agua con Gas", price: "€2.50", desc: "San Pellegrino 250ml" },
          { name: "Zumo de Naranja", price: "€2.50", desc: "Juver 200ml" },
          { name: "Zumo de Piña", price: "€2.50", desc: "Juver 200ml" },
          { name: "Zumo de Melocotón", price: "€2.50", desc: "Juver 200ml" },
        ],
      },
    ],
  },
  {
    id: "coffee",
    title: "Café — Bako Coffee",
    emoji: "☕",
    items: [
      { name: "Café Solo", price: "€1.80", desc: "Espresso Bako" },
      { name: "Café con Leche", price: "€2.20", desc: "Espresso + leche vaporizada" },
      { name: "Café Americano", price: "€2.00", desc: "Espresso + agua caliente" },
      { name: "Cortado", price: "€1.80", desc: "Espresso + toque de leche" },
      { name: "Caramel Latte", price: "€3.50", desc: "Espresso · Leche · Caramelo" },
    ],
  },
  {
    id: "spirits",
    title: "Licores & Espirituosos",
    emoji: "🍾",
    subsections: [
      {
        label: "Ginebra",
        items: [
          { name: "Nordés Gin", price: "€9.00", desc: "Galicia — botánica atlántica" },
          { name: "Beefeater Gin", price: "€7.00", desc: "London Dry" },
        ],
      },
      {
        label: "Vodka",
        items: [
          { name: "Absolut Vodka", price: "€7.00", desc: "Suecia" },
        ],
      },
      {
        label: "Ron",
        items: [
          { name: "Bacardí Blanco", price: "€7.00", desc: "Cuba" },
          { name: "Bacardí Añejo", price: "€8.00", desc: "Añejado" },
        ],
      },
      {
        label: "Whisky & Bourbon",
        items: [
          { name: "Jack Daniel's", price: "€8.00", desc: "Tennessee Whiskey" },
          { name: "Jameson", price: "€8.00", desc: "Irish Whiskey" },
        ],
      },
      {
        label: "Tequila",
        items: [
          { name: "José Cuervo", price: "€7.00", desc: "Silver" },
        ],
      },
      {
        label: "Aperitivos",
        items: [
          { name: "Aperol", price: "€7.00", desc: "Aperitivo italiano" },
          { name: "Campari", price: "€7.00", desc: "Bitter italiano" },
        ],
      },
    ],
  },
];

// ─── Sub-components ────────────────────────────────────────────────────────

function MenuItemRow({ item }: { item: MenuItem }) {
  const [open, setOpen] = useState(false);
  const hasIngredients = !!item.ingredients;

  return (
    <div
      className="menu-item"
      onClick={() => hasIngredients && setOpen(!open)}
      role={hasIngredients ? "button" : undefined}
      aria-expanded={hasIngredients ? open : undefined}
    >
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "0.25rem" }}>
          <span className="item-name">{item.name}</span>
          {item.signature && <span className="signature-badge">★ Signature</span>}
          {item.floral && <span className="floral-badge">🌸 Floral Ice</span>}
        </div>
        <div className="item-desc">{item.desc}</div>
        {item.variants && (
          <div style={{ marginTop: "0.25rem" }}>
            {item.variants.map((v) => (
              <span key={v} className="variant-tag">{v}</span>
            ))}
          </div>
        )}
        {hasIngredients && (
          <div
            className="ingredients-panel"
            style={{ maxHeight: open ? "200px" : "0px" }}
          >
            <div className="ingredients-text">
              {item.ingredients}
            </div>
          </div>
        )}
        {hasIngredients && (
          <div style={{ fontSize: "0.65rem", color: "var(--ps-amber)", marginTop: "0.2rem", opacity: 0.7 }}>
            {open ? "▲ menos" : "▼ ingredientes"}
          </div>
        )}
      </div>
      <div className="item-price">{item.price}</div>
    </div>
  );
}

function MenuSection({ section, isVisible }: { section: Section; isVisible: boolean }) {
  const accentColor = section.accentColor || "var(--ps-amber)";

  return (
    <section
      id={section.id}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 400ms ease, transform 400ms ease",
        paddingBottom: "1.5rem",
      }}
    >
      <div className="section-header">
        <span style={{ fontSize: "1.1rem" }}>{section.emoji}</span>
        <h2 className="section-title" style={{ color: "var(--ps-ivory)" }}>
          {section.title}
        </h2>
        <div className="section-line" style={{
          background: `linear-gradient(to right, ${accentColor}, transparent)`,
        }} />
      </div>

      {section.items && section.items.map((item) => (
        <MenuItemRow key={item.name} item={item} />
      ))}

      {section.subsections && section.subsections.map((sub) => (
        <div key={sub.label}>
          <div className="subsection-label">{sub.label}</div>
          {sub.items.map((item) => (
            <MenuItemRow key={item.name} item={item} />
          ))}
        </div>
      ))}
    </section>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("signature");
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const navRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Intersection observer for section visibility + active nav
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id;
          if (entry.isIntersecting) {
            setVisibleSections((prev) => { const next = new Set(Array.from(prev)); next.add(id); return next; });
            setActiveCategory(id);
          }
        });
      },
      { threshold: 0.15, rootMargin: "-80px 0px -60% 0px" }
    );

    MENU_SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  // Scroll active pill into view
  useEffect(() => {
    const pill = navRef.current?.querySelector(`[data-cat="${activeCategory}"]`);
    pill?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [activeCategory]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--ps-charcoal)" }}>

      {/* ── Hero ── */}
      <div style={{ position: "relative", height: "320px", overflow: "hidden" }}>
        <img
          src="https://d2xsxph8kpxj0f.cloudfront.net/310519663629497413/5pbbczfCmUgjwRnmP9eqcG/palo_santo_hero_bg-7War3gC5EvcubqSFHA3PHG.webp"
          alt="Palo Santo Bar"
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(28,26,23,0.3) 0%, rgba(28,26,23,0.6) 60%, rgba(28,26,23,1) 100%)"
        }} />
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          textAlign: "center", padding: "1.5rem 1rem 2rem"
        }}>
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663629497413/5pbbczfCmUgjwRnmP9eqcG/palo_santo_logo-9LYUZ6Qsgdg5CdpvVp8sQ5.webp"
            alt="Palo Santo Logo"
            style={{ width: "64px", height: "64px", objectFit: "contain", margin: "0 auto 0.75rem", display: "block" }}
          />
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "2rem",
            fontWeight: 700,
            color: "var(--ps-ivory)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            lineHeight: 1.1,
            marginBottom: "0.3rem",
          }}>
            Palo Santo
          </h1>
          <p style={{
            fontFamily: "'Lato', sans-serif",
            fontSize: "0.75rem",
            fontWeight: 300,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--ps-amber)",
          }}>
            Tarifa · Calle Carnicería · Bar & Cocktails
          </p>
        </div>
      </div>

      {/* ── Sticky Category Nav ── */}
      <div style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backgroundColor: "var(--ps-charcoal)",
        borderBottom: "1px solid var(--ps-charcoal-light)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
      }}>
        <div
          ref={navRef}
          style={{
            display: "flex",
            gap: "0.4rem",
            padding: "0.6rem 1rem",
            overflowX: "auto",
            scrollbarWidth: "none",
          }}
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              data-cat={cat.id}
              className={`cat-pill ${activeCategory === cat.id ? "active" : ""}`}
              onClick={() => scrollTo(cat.id)}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Floral Ice Cube Banner ── */}
      <div style={{
        background: "linear-gradient(135deg, rgba(74,124,89,0.15) 0%, rgba(200,135,58,0.1) 100%)",
        borderTop: "1px solid rgba(74,124,89,0.2)",
        borderBottom: "1px solid rgba(200,135,58,0.2)",
        padding: "0.75rem 1rem",
        textAlign: "center",
      }}>
        <p style={{
          fontFamily: "'Lato', sans-serif",
          fontSize: "0.75rem",
          color: "var(--ps-ivory-dim)",
          letterSpacing: "0.04em",
        }}>
          <span style={{ color: "var(--ps-sage-light)" }}>🌸</span>
          {" "}Nuestros cócteles signature llevan un{" "}
          <span style={{ color: "var(--ps-ivory)", fontWeight: 700 }}>cubo de hielo con flor</span>
          {" "}— la flor se revela al derretirse
        </p>
      </div>

      {/* ── Menu Content ── */}
      <div className="container" style={{ paddingTop: "0.5rem", paddingBottom: "4rem" }}>
        {MENU_SECTIONS.map((section) => (
          <MenuSection
            key={section.id}
            section={section}
            isVisible={visibleSections.has(section.id) || section.id === "signature"}
          />
        ))}

        {/* ── Footer ── */}
        <div style={{
          borderTop: "1px solid var(--ps-charcoal-light)",
          paddingTop: "2rem",
          textAlign: "center",
        }}>
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663629497413/5pbbczfCmUgjwRnmP9eqcG/palo_santo_floral_cocktail-RmzJPi4Y7rjfSFonp8QCb8.webp"
            alt="Palo Santo Floral Cocktail"
            style={{
              width: "160px",
              height: "200px",
              objectFit: "cover",
              borderRadius: "80px",
              margin: "0 auto 1.25rem",
              display: "block",
              border: "2px solid var(--ps-amber)",
              opacity: 0.9,
            }}
          />
          <h3 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "1.1rem",
            color: "var(--ps-ivory)",
            marginBottom: "0.4rem",
          }}>
            Palo Santo Bar
          </h3>
          <p style={{ fontSize: "0.75rem", color: "var(--ps-ivory-dim)", marginBottom: "0.25rem" }}>
            Calle Carnicería · Tarifa, Cádiz
          </p>
          <p style={{ fontSize: "0.7rem", color: "var(--ps-amber)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Where every drink tells a story
          </p>
          <div style={{
            marginTop: "1.5rem",
            fontSize: "0.65rem",
            color: "var(--ps-ivory-dim)",
            opacity: 0.5,
          }}>
            Los precios incluyen IVA · Precios sujetos a cambio
          </div>
        </div>
      </div>
    </div>
  );
}
