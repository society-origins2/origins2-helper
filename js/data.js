/* =====================================================================
   UPP-DATEN  –  Materialien, Waffen und Upp-Reihen
   ---------------------------------------------------------------------
   Alle Werte stammen aus dem Ingame-Wiki (Screenshots).
   name   = deutscher Tooltip-Name, nameEn = englischer Name
            (fehlt nameEn, wird auf Englisch der deutsche Name gezeigt)
            Geprüft mit englischem Client: Battle Sword, Rune Sword,
            Kyanite Sword, Titanium Dioxide, Partisan, Soul Stealing Blade,
            Solar Blade, Kyanite Blade. Alle anderen nameEn sind
            Übersetzungsvorschläge und werden noch mit dem Client abgeglichen.
   Kürzel (mat-XX, wpn-XX, arm-XX) gehören zu den Icons in assets/items/.
   ===================================================================== */

const ASSET_V = "20261122-21";   // Cache-Buster für Item-Icons (bei Icon-Änderung hochzählen)

const MATERIALS = {
  "mat-01": { name: "Rubin-Gravurmesser", nameEn: "Ruby Engraving Knife", icon: "assets/items/mat-01.png" },
  "mat-02": { name: "Goldschelle", nameEn: "Gold Clasp", icon: "assets/items/mat-02.png" },
  "mat-03": { name: "Rubinverzierung", nameEn: "Ruby Decoration", icon: "assets/items/mat-03.png" },
  "mat-04": { name: "Schmuckelement", nameEn: "Jewellery Element", icon: "assets/items/mat-04.png" },
  "mat-05": { name: "Sand der Elemente", nameEn: "Sands of the Elements", icon: "assets/items/mat-05.png" },
  "mat-06": { name: "Kristall der Elemente", nameEn: "Crystal of the Elements", icon: "assets/items/mat-06.png" },
  "mat-07": { name: "Elementares Fragment", nameEn: "Elemental Fragment", icon: "assets/items/mat-07.png" },
  "mat-08": { name: "Upgrade-Schriftrolle", nameEn: "Scroll of Upgrade", icon: "assets/items/mat-08.png" },
  "mat-09": { name: "Schlangenstein", nameEn: "Serpent Stone", icon: "assets/items/mat-09.png" },
  "mat-10": { name: "Energiesplitter", nameEn: "Energy Fragment", icon: "assets/items/mat-10.png" },
  "mat-11": { name: "Eisrune der Aura", nameEn: "Aura Ice Rune", icon: "assets/items/mat-11.png" },
  "mat-12": { name: "Rotes Drachenhorn", nameEn: "Red Dragon Horn", icon: "assets/items/mat-12.png" },
  "mat-13": { name: "Weißer Drachenkopf", nameEn: "White Dragon Head", icon: "assets/items/mat-13.png" },
  "mat-14": { name: "Schlangenmuster", nameEn: "Serpent Design", icon: "assets/items/mat-14.png" },
  "mat-15": { name: "Balathors Flügel", nameEn: "Balathor's Wing", icon: "assets/items/mat-15.png" },
  "mat-16": { name: "Balathors Auge", nameEn: "Balathor's Eye", icon: "assets/items/mat-16.png" },
  "mat-17": { name: "Spitzige Dornen", nameEn: "Sharp Thorns", icon: "assets/items/mat-17.png" },
  "mat-18": { name: "Hydrakopf", nameEn: "Hydra Head", icon: "assets/items/mat-18.png" },
  "mat-19": { name: "Hydra-Symbol", nameEn: "Hydra Symbol", icon: "assets/items/mat-19.png" },
  "mat-20": { name: "Jia-Insigne", nameEn: "Jia Insignia", icon: "assets/items/mat-20.png" },
  "mat-21": { name: "Insigne des Chen", nameEn: "Chen Insignia", icon: "assets/items/mat-21.png" },
  "mat-22": { name: "Drachenschwingen", nameEn: "Dragon Wings", icon: "assets/items/mat-22.png" },
  "mat-23": { name: "Titandioxid", nameEn: "Titanium Dioxide", icon: "assets/items/mat-23.png" },
  "mat-24": { name: "Weiße Drachenschuppe", nameEn: "White Dragon Scale", icon: "assets/items/mat-24.png" },
  "mat-25": { name: "Schlangenseide", nameEn: "Serpent Silk", icon: "assets/items/mat-25.png" },
  "mat-26": { name: "Schwarzer Farbstoff", nameEn: "Black Dye", icon: "assets/items/mat-26.png" },
  "mat-27": { name: "Geist der Erde", nameEn: "Spirit of the Earth", icon: "assets/items/mat-27.png" },
  "mat-28": { name: "Horn des Razador", nameEn: "Razador's Horn", icon: "assets/items/mat-28.png" },
  "mat-29": { name: "Horn des Nemere", nameEn: "Nemere's Horn", icon: "assets/items/mat-29.png" },
  "mat-30": { name: "Seuchensymbol", nameEn: "Plague Symbol", icon: "assets/items/mat-30.png" },
  "mat-31": { name: "Versteinerte Träne", nameEn: "Fossilised Tear", icon: "assets/items/mat-31.png" },
  "mat-32": { name: "Flammenstein", nameEn: "Flame Stone", icon: "assets/items/mat-32.png" },
  "mat-33": { name: "Eisflammenstein", nameEn: "Ice Flame Stone", icon: "assets/items/mat-33.png" },
  "mat-34": { name: "Schwarze Materie", nameEn: "Black Matter", icon: "assets/items/mat-34.png" },
  "mat-35": { name: "Drachenklaue & Schuppen", nameEn: "Dragon Claw & Scales", icon: "assets/items/mat-35.png" },
  "mat-37": { name: "Drachenschädel", nameEn: "Dragon Skull", icon: "assets/items/mat-37.png" },
  "mat-38": { name: "Prächtiger Chaosstein", nameEn: "Epic Chaos Stone", icon: "assets/items/mat-38.png" },
  "mat-39": { name: "Yohara-Energiefragment", nameEn: "Yohara Energy Fragment", icon: "assets/items/mat-39.png" },
  "mat-40": { name: "Lila SungMa-Rune", nameEn: "Darkness Sung Ma Rune", icon: "assets/items/mat-40.png" },
  "mat-41": { name: "Gelbe SungMa-Rune", nameEn: "Earth Sung Ma Rune", icon: "assets/items/mat-41.png" },
  "mat-42": { name: "Mysteriöser Stein", nameEn: "Mysterious Stone", icon: "assets/items/mat-42.png" },
  "mat-43": { name: "Token des Abgrundkaisers", nameEn: "Emperor Abyss Token", icon: "assets/items/mat-43.png" },
  "mat-44": { name: "Token des uralten Erdwächters", nameEn: "Ancient Earth Guardian Token", icon: "assets/items/mat-44.png" },
  "mat-45": { name: "Splitter des Abgrundkaisers", nameEn: "Abyss Emperor Shard", icon: "assets/items/mat-45.png" },
  "mat-46": { name: "Token des Sturmhautkolosses", nameEn: "Stormhide Colossus Token", icon: "assets/items/mat-46.png" },
  "mat-47": { name: "Auge des Abgrundkaisers", nameEn: "Abyss Emperor Eye", icon: "assets/items/mat-47.png" },
  "mat-48": { name: "Reißzahn des Sturmlords", nameEn: "Storm Lord Fang", icon: "assets/items/mat-48.png" },
  "mat-49": { name: "Token des Flammenkönigs", nameEn: "Blazing King Token", icon: "assets/items/mat-49.png" },
  "mat-50": { name: "Feuerkristall", nameEn: "Crystal of Fire", icon: "assets/items/mat-50.png" },
  "mat-51": { name: "Feuersand", nameEn: "Sands of Fire", icon: "assets/items/mat-51.png" },
  "mat-52": { name: "Seele des Sturmlords", nameEn: "Storm Lord Soul", icon: "assets/items/mat-52.png" },
  "mat-53": { name: "Naga Schlangen Token", nameEn: "Naga Serpent Token", icon: "assets/items/mat-53.png" },
  "mat-54": { name: "Himmelsdonner-Token", nameEn: "Sky Thunder Token", icon: "assets/items/mat-54.png" },
  "mat-55": { name: "Blitzkristall", nameEn: "Crystal of Lightning", icon: "assets/items/mat-55.png" },
  "mat-56": { name: "Blitzsand", nameEn: "Sand of Lightning", icon: "assets/items/mat-56.png" },
  "mat-57": { name: "Token des Chen-Generals", nameEn: "Chen General Token", icon: "assets/items/mat-57.png" },
  "mat-58": { name: "Alastor-Token", nameEn: "Alastor Token", icon: "assets/items/mat-58.png" },
  "mat-59": { name: "Balathor-Token", nameEn: "Balathor Token", icon: "assets/items/mat-59.png" },
  "mat-60": { name: "Windkristall", nameEn: "Crystal of Wind", icon: "assets/items/mat-60.png" },
  "mat-61": { name: "Windsand", nameEn: "Sand of Wind", icon: "assets/items/mat-61.png" },
  "mat-62": { name: "Meisterschriftrolle", nameEn: "Master´s Scroll", icon: "assets/items/mat-62.png" },
  "mat-63": { name: "Blaue SungMa-Rune", nameEn: "Ice Sung Ma Rune", icon: "assets/items/mat-63.png" },
  "mat-64": { name: "Emblem des Frostwächters", nameEn: "Frost Guardian Emblem", icon: "assets/items/mat-64.png" },
  "mat-65": { name: "Token des Frostwächters", nameEn: "Frost Guardian Token", icon: "assets/items/mat-65.png" },
  "mat-66": { name: "Yohara-Elementartoken", nameEn: "Elemental Yohara Token", icon: "assets/items/mat-66.png" },
  "mat-67": { name: "Herz des Erdwächters", nameEn: "Earth Guardian Heart", icon: "assets/items/mat-67.png" },
  "mat-68": { name: "Schimm. blaue Perle", nameEn: "Shimmering Blue Pearl", icon: "assets/items/mat-68.png" },
  "mat-69": { name: "Schimm. weiße Perle", nameEn: "Shimmering White Pearl", icon: "assets/items/mat-69.png" },
  "mat-70": { name: "Schimmernde rote Perle", nameEn: "Shimmering Red Pearl", icon: "assets/items/mat-70.png" },
  "mat-71": { name: "Elementarblüte", nameEn: "Elemental Bloom", icon: "assets/items/mat-71.png" },
  "mat-72": { name: "Weiße Perle", nameEn: "White Pearl", icon: "assets/items/mat-72.png" },
  "mat-73": { name: "Blaue Perle", nameEn: "Blue Pearl", icon: "assets/items/mat-73.png" },
  "mat-74": { name: "Blutrote Perle", nameEn: "Blood-Red Pearl", icon: "assets/items/mat-74.png" },
  "mat-75": { name: "Achat", nameEn: "Agate", icon: "assets/items/mat-75.png" },
  "mat-76": { name: "Mithril", nameEn: "Mithril", icon: "assets/items/mat-76.png" },
  "mat-77": { name: "Eissand", nameEn: "Sands of Ice", icon: "assets/items/mat-77.png" }, // Skilltree
  "mat-78": { name: "Eiskristall", nameEn: "Crystal of Ice", icon: "assets/items/mat-78.png" }, // Skilltree
  "mat-79": { name: "Eis-Elementarfragment", nameEn: "Ice Elemental Fragment", icon: "assets/items/mat-79.png" }, // Skilltree
  "mat-80": { name: "Dunkelsand", nameEn: "Sands of Darkness", icon: "assets/items/mat-80.png" }, // Skilltree
  "mat-81": { name: "Dunkelkristall", nameEn: "Crystal of Darkness", icon: "assets/items/mat-81.png" }, // Skilltree
  "mat-82": { name: "Dunkelheits-Elementarfragment", nameEn: "Dark Elemental Fragment", icon: "assets/items/mat-82.png" }, // Skilltree
  "mat-83": { name: "Erdsand", nameEn: "Sands of Earth", icon: "assets/items/mat-83.png" }, // Skilltree
  "mat-84": { name: "Erdkristall", nameEn: "Crystal of Earth", icon: "assets/items/mat-84.png" }, // Skilltree
  "mat-85": { name: "Erd-Elementarfragment", nameEn: "Earth Elemental Fragment", icon: "assets/items/mat-85.png" }, // Skilltree
  "mat-86": { name: "Wind-Elementarfragment", nameEn: "Wind Elemental Fragment", icon: "assets/items/mat-86.png" }, // Skilltree
  "mat-87": { name: "Blitz-Elementarfragment", nameEn: "Lightning Elemental Fragment", icon: "assets/items/mat-87.png" }, // Skilltree
  "mat-88": { name: "Feuer-Elementarfragment", nameEn: "Fire Elemental Fragment", icon: "assets/items/mat-88.png" }, // Skilltree
  "mat-89": { name: "Handschuh- und Ringfragment", nameEn: "Glove & Ring Fragment", icon: "assets/items/mat-89.png" }, // Skilltree
  "mat-90": { name: "Feuerrune der Aura", nameEn: "Aura Fire Rune", icon: "assets/items/mat-90.png" }, // Skilltree
  "mat-91": { name: "Aura-Kostüm verzaubern", nameEn: "Enchant Aura Outfit", icon: "assets/items/mat-91.png" }, // Skilltree
  "mat-92": { name: "Flammenblatt", nameEn: "Flaming Leaf", icon: "assets/items/mat-92.png" }, // Skilltree
  "mat-93": { name: "Flasche mit Elementaressenz", nameEn: "Elemental Essense Bottle", icon: "assets/items/mat-93.png" }, // Skilltree
  "mat-94": { name: "Stein der Elemente", nameEn: "Stone of the Elements", icon: "assets/items/mat-94.png" }, // Skilltree
  "mat-95": { name: "Cor Draconis (Roh)", nameEn: "Cor Draconis (Rough)", icon: "assets/items/mat-95.png" }, // Skilltree
  "mat-96": { name: "Geist von Naga", nameEn: "Spirit of Naga", icon: "assets/items/mat-96.png" }, // Skilltree
  "mat-97": { name: "Stein von Naga", nameEn: "Stone of Naga", icon: "assets/items/mat-97.png" }, // Skilltree
  "mat-98": { name: "Kyanit-Kern", nameEn: "Kyanite Core", icon: "assets/items/mat-98.png" }, // Skilltree
  "mat-99": { name: "Versiegelter Kyanit-Kern", nameEn: "Sealed Kyanite Core", icon: "assets/items/mat-99.png" }, // Skilltree
  "mat-100": { name: "Kyanit-Halbmond", nameEn: "Kyanite Crescent", icon: "assets/items/mat-100.png" }, // Skilltree + Enigma-Material
  "mat-101": { name: "Energiekristall verzaubern", nameEn: "Enchant Energy Crystal", icon: "assets/items/mat-101.png" }, // Skilltree
  "mat-102": { name: "Cor Daemonis (Roh)", nameEn: "Cor Daemonis (Rough)", icon: "assets/items/mat-102.png" }, // Skilltree
  "mat-103": { name: "Yohara-Essenzflasche", nameEn: "Yohara Essence Bottle", icon: "assets/items/mat-103.png" }, // Skilltree
  "mat-104": { name: "Stück Elementarerz", nameEn: "Piece of Elemental Ore", icon: "assets/items/mat-104.png" }, // Skilltree
  "mat-105": { name: "Kristall der Elemente", nameEn: "Crystal of the Elements", icon: "assets/items/mat-105.png" }, // Skilltree
  "mat-106": { name: "Sand der Elemente", nameEn: "Sands of the Elements", icon: "assets/items/mat-106.png" }, // Skilltree
  "mat-107": { name: "Rote SungMa-Rune", nameEn: "Fire Sung Ma Rune", icon: "assets/items/mat-107.png" }, // Skilltree
  // Skilltree-Schlüssel – deutsche Namen vorläufig übersetzt, Nutzer reicht nach
  "mat-108": { name: "Cor Draconis Truhe", nameEn: "Cor Draconis Chest", icon: "assets/items/mat-108.png" },
  "mat-109": { name: "Aura-Eisrune Truhe", nameEn: "Aura Ice Rune Chest", icon: "assets/items/mat-109.png" },
  "mat-110": { name: "Energiefragment Truhe", nameEn: "Energy Fragment Chest", icon: "assets/items/mat-110.png" },
  "mat-111": { name: "Brennendes Blatt Truhe", nameEn: "Flaming Leaf Chest", icon: "assets/items/mat-111.png" },
  // Enigma-Dungeon (alternatives Upp-Material) – Namen vorläufig, Nutzer reicht die echten nach
  "mat-112": { name: "Kyanit-Seelenstein", nameEn: "Kyanite Soul Stone", icon: "assets/items/mat-112.png" },
  "mat-113": { name: "Kyanit-Tomus", nameEn: "Kyanite Tome", icon: "assets/items/mat-113.png" },
};

const WEAPONS = {
  "wpn-01": { name: "Tritonschwert", nameEn: "Triton Sword", icon: "assets/items/wpn-01.png" },
  "wpn-02": { name: "Halbmenschenklinge", nameEn: "Soul Stealing Blade", icon: "assets/items/wpn-02.png" },
  "wpn-03": { name: "Zodiakschwert", nameEn: "Zodiac Sword", icon: "assets/items/wpn-03.png" },
  "wpn-04": { name: "Zodiakglefe", nameEn: "Zodiac Glaive", icon: "assets/items/wpn-04.png" },
  "wpn-05": { name: "Schlachtschwert", nameEn: "Battle Sword", icon: "assets/items/wpn-05.png" },
  "wpn-06": { name: "Runenschwert", nameEn: "Rune Sword", icon: "assets/items/wpn-06.png" },
  "wpn-07": { name: "Kyanitschwert", nameEn: "Kyanite Sword", icon: "assets/items/wpn-07.png" },
  "wpn-08": { name: "Partisane", nameEn: "Partisan", icon: "assets/items/wpn-08.png" },
  "wpn-09": { name: "Sonnenschwert", nameEn: "Solar Blade", icon: "assets/items/wpn-09.png" },
  "wpn-10": { name: "Kyanitklinge", nameEn: "Kyanite Blade", icon: "assets/items/wpn-10.png" },
  // wpn-11 … wpn-34: englische Namen aus dem Wiki, deutsche vorläufig übersetzt – Nutzer reicht die echten nach
  "wpn-11": { name: "Drachenmesser", nameEn: "Dragon Knife", icon: "assets/items/wpn-11.png" },
  "wpn-12": { name: "Seelenloses Messer", nameEn: "Soulless Knife", icon: "assets/items/wpn-12.png" },
  "wpn-13": { name: "Fünf-Elemente-Klinge", nameEn: "Five Element Blade", icon: "assets/items/wpn-13.png" },
  "wpn-14": { name: "Kyanitdolch", nameEn: "Kyanite Dagger", icon: "assets/items/wpn-14.png" },
  "wpn-15": { name: "Großgelbdrachenbogen", nameEn: "Yellow Dragon Bow", icon: "assets/items/wpn-15.png" },
  "wpn-16": { name: "Großteufelbogen", nameEn: "Giant Devil Bow", icon: "assets/items/wpn-16.png" },
  "wpn-17": { name: "Phönixbogen", nameEn: "Phoenix Bow", icon: "assets/items/wpn-17.png" },
  "wpn-18": { name: "Kyanitbogen", nameEn: "Kyanite Bow", icon: "assets/items/wpn-18.png" },
  "wpn-19": { name: "Himmel-und-Erde-Glocke", nameEn: "Heaven and Earth Bell", icon: "assets/items/wpn-19.png" },
  "wpn-20": { name: "Drachenmaulglocke", nameEn: "Dragon Jaw Bell", icon: "assets/items/wpn-20.png" },
  "wpn-21": { name: "Drachengeist-Glocke", nameEn: "Dragon Ghost Bell", icon: "assets/items/wpn-21.png" },
  "wpn-22": { name: "Kyanitglocke", nameEn: "Kyanite Bell", icon: "assets/items/wpn-22.png" },
  "wpn-23": { name: "Erlösungsfächer", nameEn: "Salvation Fan", icon: "assets/items/wpn-23.png" },
  "wpn-24": { name: "Dämonenfächer", nameEn: "Demon Fan", icon: "assets/items/wpn-24.png" },
  "wpn-25": { name: "Drachenfächer", nameEn: "Lying Dragon Fan", icon: "assets/items/wpn-25.png" },
  "wpn-26": { name: "Kyanitfächer", nameEn: "Kyanite Fan", icon: "assets/items/wpn-26.png" },
  "wpn-27": { name: "Greifenklaue", nameEn: "Griffon Claw", icon: "assets/items/wpn-27.png" },
  "wpn-28": { name: "Grüner Wolfsfang", nameEn: "Green Wolf Fang", icon: "assets/items/wpn-28.png" },
  "wpn-29": { name: "Drachenherrscher", nameEn: "Dragon Lord", icon: "assets/items/wpn-29.png" },
  "wpn-30": { name: "Kyanitkralle", nameEn: "Kyanite Claw", icon: "assets/items/wpn-30.png" },
  "wpn-31": { name: "Geisterzahnklinge", nameEn: "Ghost Fang Blade", icon: "assets/items/wpn-31.png" },
  "wpn-32": { name: "Heiliges Schwert", nameEn: "Holy Sword", icon: "assets/items/wpn-32.png" },
  "wpn-33": { name: "Drachenzahnklinge", nameEn: "Dragon Tooth Blade", icon: "assets/items/wpn-33.png" },
  "wpn-34": { name: "Kyanit-Klinge", nameEn: "Kyanite Edge", icon: "assets/items/wpn-34.png" },
};

const ARMORS = {
  "arm-01": { name: "Zodiakrüstung", nameEn: "Zodiac Armour", icon: "assets/items/arm-01.png" },
  "arm-02": { name: "Dunkeldrachenrüstung", nameEn: "Dark Dragon Armour", icon: "assets/items/arm-02.png" },
  "arm-03": { name: "Teufelshornpanzer", nameEn: "Devil Horn Plate", icon: "assets/items/arm-03.png" },
  "arm-04": { name: "Blaustahl-Panzer", nameEn: "Blue Steel Plate", icon: "assets/items/arm-04.png" },
  "arm-05": { name: "Schlangenmantel", nameEn: "Serpent Mantle", icon: "assets/items/arm-05.png" },
  // Deutsche Namen arm-06 … arm-08 vorläufig übersetzt – Nutzer reicht die echten nach
  "arm-06": { name: "Schwarzstahl-Panzer", nameEn: "Black Steel Armour", icon: "assets/items/arm-06.png" },
  "arm-07": { name: "Magmaglutpanzer", nameEn: "Magma Glow Armour", icon: "assets/items/arm-07.png" },
  "arm-08": { name: "Kyanitrüstung", nameEn: "Kyanite Armour", icon: "assets/items/arm-08.png" },
  // arm-09 … arm-20: englische Namen aus dem Wiki, deutsche vorläufig übersetzt – Nutzer reicht die echten nach
  "arm-09": { name: "Schwarzwindanzug", nameEn: "Black Wind Suit", icon: "assets/items/arm-09.png" },
  "arm-10": { name: "Blutmondanzug", nameEn: "Blood Moon Suit", icon: "assets/items/arm-10.png" },
  "arm-11": { name: "Kyanitanzug", nameEn: "Kyanite Suit", icon: "assets/items/arm-11.png" },
  "arm-12": { name: "Schwarze Kleidung", nameEn: "Black Clothing", icon: "assets/items/arm-12.png" },
  "arm-13": { name: "Kleidung des Feuers", nameEn: "Fire Clothing", icon: "assets/items/arm-13.png" },
  "arm-14": { name: "Kyanitkleidung", nameEn: "Kyanite Clothing", icon: "assets/items/arm-14.png" },
  "arm-15": { name: "Magie-Plattenpanzer", nameEn: "Magic Plate Armour", icon: "assets/items/arm-15.png" },
  "arm-16": { name: "Höllenrittpanzer", nameEn: "Hellrider Armour", icon: "assets/items/arm-16.png" },
  "arm-17": { name: "Kyanitplattenpanzer", nameEn: "Kyanite Plate Armour", icon: "assets/items/arm-17.png" },
  "arm-18": { name: "Nachtschattenpanzer", nameEn: "Nightshade Armour", icon: "assets/items/arm-18.png" },
  "arm-19": { name: "Achatplattenpanzer", nameEn: "Agate Plate Armour", icon: "assets/items/arm-19.png" },
  "arm-20": { name: "Kyanitharnisch", nameEn: "Kyanite Harness", icon: "assets/items/arm-20.png" },
};


/* =====================================================================
   UPP-REIHEN
   ---------------------------------------------------------------------
   category       : "pvp" oder "pvm" (Schalter im Rechner, wie im Wiki 1 | 2)

   Eine Reihe besteht aus mehreren Stufen (Waffen), die nacheinander
   entwickelt werden: Waffe +0 … +9  →  nächste Waffe +0 … +9  usw.

   stage.item     : Kürzel der Waffe/Rüstung
   stage.minLevel : „Ab Level“ laut Wiki
   stage.craft    : Entwicklung aus der vorherigen Waffe (+9)
                    yang = Preis, mats = Materialien, place = Startpunkt
   stage.ups      : Upp-Schritte +0→+1 … +8→+9 (Index 0 = Schritt auf +1)
                    yang   = Kosten pro Versuch
                    chance = Erfolgschance in %
                    pity   = Pity: nach so vielen Fails gelingt der
                             nächste Versuch sicher (null = kein Pity)
                    mats   = Materialien pro Versuch
   stage.alt      : alternative Materialien, z. B. { enigma: [9 × mats] }
                    (wird automatisch über withAlt() gesetzt, siehe unten)

   Regeln (Society): Bei einem Fail sind Material und Yang weg, die Stufe
   bleibt, weil immer ein Magischer Stein benutzt wird. Die Steine selbst
   werden (noch) nicht mitgezählt.
   ===================================================================== */

/* ---------- Klassen & Ausrüstungsarten ----------
   Jede Upp-Reihe bekommt:
     category : "pvp" oder "pvm"
     slot     : Ausrüstungsart (Schlüssel aus EQUIP_SLOTS)
     classes  : Klassen, die das Item tragen können (Schlüssel aus CLASSES)
                – bei Teilen für alle Klassen einfach weglassen
*/
const CLASSES = {
  warrior: { name: "Krieger",  nameEn: "Warrior" },
  ninja:   { name: "Ninja",    nameEn: "Ninja" },
  sura:    { name: "Sura",     nameEn: "Sura" },
  shaman:  { name: "Schamane", nameEn: "Shaman" },
  lycan:   { name: "Lykaner",  nameEn: "Lycan" }
};

/* classBound: true = jede Klasse hat eigene Items */
const EQUIP_SLOTS = {
  weapon:    { name: "Waffe",       nameEn: "Weapon",     classBound: true },
  armor:     { name: "Rüstung",     nameEn: "Armour",     classBound: true },
  helmet:    { name: "Helm",        nameEn: "Helmet",     classBound: true },
  shoulder:  { name: "Schulterband", nameEn: "Sash" },
  talisman:  { name: "Talisman",    nameEn: "Talisman" },
  necklace:  { name: "Kette",       nameEn: "Necklace" },
  bracelet:  { name: "Armband",     nameEn: "Bracelet" },
  shoes:     { name: "Schuhe",      nameEn: "Shoes" },
  earrings:  { name: "Ohrringe",    nameEn: "Earrings" },
  shield:    { name: "Schild",      nameEn: "Shield" },
  belt:      { name: "Gürtel",      nameEn: "Belt" },
  gloves:    { name: "Handschuhe",  nameEn: "Gloves" }
};

const k = 1_000, kk = 1_000_000;

/* ---------- Kosten der PvP-Waffen ----------
   Gilt für ALLE PvP-Waffenarten gleich (Stufe Lv 65 → 80 → 105 → 120).
   Nur hier ändern – alle Waffen-Reihen unten übernehmen diese Werte. */
const PVP_WEAPON_COSTS = [
  { // Stufe 1 · Lv 65
    minLevel: 65,
    craft: null,
    ups: [
      { yang: 500*k,  chance: 100, pity: null, mats: {} },
      { yang: 600*k,  chance: 100, pity: null, mats: {} },
      { yang: 700*k,  chance: 100, pity: null, mats: {} },
      { yang: 800*k,  chance: 100, pity: null, mats: {} },
      { yang: 1*kk,   chance: 90,  pity: 1,    mats: {} },
      { yang: 1.1*kk, chance: 85,  pity: 1,    mats: {} },
      { yang: 1.2*kk, chance: 80,  pity: 2,    mats: { "mat-72": 3 } },
      { yang: 1.3*kk, chance: 75,  pity: 2,    mats: { "mat-73": 3 } },
      { yang: 1.5*kk, chance: 70,  pity: 2,    mats: { "mat-74": 3 } }
    ]
  },
  { // Stufe 2 · Lv 80
    minLevel: 80,
    craft: { yang: 2*kk, mats: { "mat-71": 3, "mat-72": 5, "mat-73": 5, "mat-74": 5 } },
    ups: [
      { yang: 2*kk,   chance: 100, pity: null, mats: {} },
      { yang: 2.2*kk, chance: 100, pity: null, mats: {} },
      { yang: 2.4*kk, chance: 100, pity: null, mats: {} },
      { yang: 2.6*kk, chance: 100, pity: null, mats: {} },
      { yang: 2.8*kk, chance: 90,  pity: 1,    mats: {} },
      { yang: 3*kk,   chance: 85,  pity: 1,    mats: {} },
      { yang: 3.2*kk, chance: 80,  pity: 2,    mats: { "mat-72": 5 } },
      { yang: 3.4*kk, chance: 75,  pity: 2,    mats: { "mat-73": 5 } },
      { yang: 3.5*kk, chance: 70,  pity: 2,    mats: { "mat-74": 5 } }
    ]
  },
  { // Stufe 3 · Lv 105
    minLevel: 105,
    craft: { yang: 5*kk, place: "Seon-Pyeong", mats: { "mat-01": 5, "mat-02": 5, "mat-03": 5, "mat-04": 5 } },
    ups: [
      { yang: 5*kk,   chance: 100, pity: null, mats: { "mat-10": 100 } },
      { yang: 5.2*kk, chance: 100, pity: null, mats: { "mat-10": 100 } },
      { yang: 5.4*kk, chance: 100, pity: null, mats: { "mat-10": 50,  "mat-72": 5 } },
      { yang: 5.6*kk, chance: 100, pity: null, mats: { "mat-10": 75,  "mat-73": 5 } },
      { yang: 5.8*kk, chance: 100, pity: null, mats: { "mat-10": 100, "mat-74": 5 } },
      { yang: 6*kk,   chance: 100, pity: null, mats: { "mat-10": 125, "mat-01": 3, "mat-03": 3 } },
      { yang: 6.3*kk, chance: 100, pity: null, mats: { "mat-10": 150, "mat-02": 3, "mat-04": 3 } },
      { yang: 6.6*kk, chance: 100, pity: null, mats: { "mat-10": 175, "mat-04": 5, "mat-03": 5 } },
      { yang: 7*kk,   chance: 100, pity: null, mats: { "mat-10": 200, "mat-01": 5, "mat-02": 5, "mat-76": 2 } }
    ]
  },
  { // Stufe 4 · Lv 120
    minLevel: 120,
    craft: { yang: 50*kk, mats: { "mat-17": 1, "mat-23": 1, "mat-18": 1, "mat-19": 1, "mat-12": 1, "mat-22": 1, "mat-75": 1, "mat-26": 1 } },
    ups: [
      { yang: 50*kk,  chance: 100, pity: null, mats: { "mat-01": 3, "mat-02": 3, "mat-03": 3, "mat-04": 3 } },
      { yang: 60*kk,  chance: 90,  pity: 2,    mats: { "mat-12": 1, "mat-19": 1 } },
      { yang: 70*kk,  chance: 80,  pity: 2,    mats: { "mat-17": 1, "mat-26": 1 } },
      { yang: 80*kk,  chance: 80,  pity: 2,    mats: { "mat-18": 1, "mat-22": 1 } },
      { yang: 90*kk,  chance: 80,  pity: 2,    mats: { "mat-75": 1, "mat-23": 1 } },
      { yang: 100*kk, chance: 75,  pity: 2,    mats: { "mat-13": 2, "mat-20": 2 } },
      { yang: 110*kk, chance: 70,  pity: 2,    mats: { "mat-15": 2, "mat-25": 2 } },
      { yang: 120*kk, chance: 65,  pity: 2,    mats: { "mat-14": 2, "mat-21": 2 } },
      { yang: 130*kk, chance: 60,  pity: 2,    mats: { "mat-16": 2, "mat-24": 2, "mat-09": 1 } }
    ]
  }
];

/* ---------- Alternatives Material (Enigma-Dungeon) ----------
   Im Wiki Schalter „2“. Yang, Chance und Pity bleiben gleich – nur die Materialien
   pro Versuch sind andere. Gilt für ALLE PvP-Waffen und -Rüstungen gleich.
   Im Rechner pro Stufe wählbar (Standard / Enigma).
   mats = Materialien pro Versuch für +0→+1 … +8→+9 */
const ALT_MATS = {
  enigma: { name: "Enigma", nameEn: "Enigma" }
};
const PVP_ENIGMA_MATS = {
  105: [
    { "mat-10": 100 },
    { "mat-10": 100 },
    { "mat-10": 50,  "mat-72": 5 },
    { "mat-10": 75,  "mat-73": 5 },
    { "mat-10": 100, "mat-74": 5 },
    { "mat-10": 125, "mat-112": 6 },
    { "mat-10": 150, "mat-112": 6 },
    { "mat-10": 175, "mat-112": 10 },
    { "mat-10": 200, "mat-112": 10, "mat-76": 2 }
  ],
  120: [
    { "mat-112": 12 },
    { "mat-113": 2 },
    { "mat-113": 2 },
    { "mat-113": 2 },
    { "mat-113": 2 },
    { "mat-100": 4 },
    { "mat-100": 4 },
    { "mat-100": 4 },
    { "mat-09": 1, "mat-100": 4 }
  ]
};
/* hängt an eine Stufe die Enigma-Variante an (falls es eine gibt) */
function withAlt(stage) {
  const m = PVP_ENIGMA_MATS[stage.minLevel];
  return m ? { ...stage, alt: { enigma: m } } : stage;
}

/* Baut eine PvP-Waffen-Reihe: 4 Waffen (Lv 65, 80, 105, 120) + Kosten von oben */
function pvpWeaponLine(name, nameEn, classes, items) {
  return {
    name, nameEn, category: "pvp", slot: "weapon", classes,
    stages: items.map((item, i) => withAlt({ item, ...PVP_WEAPON_COSTS[i] }))
  };
}

/* Baut eine PvP-Rüstungs-Reihe: 3 Rüstungen (Lv 66, 105, 120).
   Kosten wie bei den Waffen, nur ohne die Lv-80-Stufe; die erste Stufe gilt ab Lv 66. */
function pvpArmorLine(name, nameEn, classes, items) {
  const costs = [{ ...PVP_WEAPON_COSTS[0], minLevel: 66 }, withAlt(PVP_WEAPON_COSTS[2]), withAlt(PVP_WEAPON_COSTS[3])];
  return {
    name, nameEn, category: "pvp", slot: "armor", classes,
    stages: items.map((item, i) => ({ item, ...costs[i] }))
  };
}

/* ---------- Upp-Reihen ----------
   Neue PvP-Waffenart = eine Zeile:
   "schluessel": pvpWeaponLine("Deutscher Name", "English name", [Klassen], [Waffe Lv65, Lv80, Lv105, Lv120]),
   Neue PvP-Rüstung = eine Zeile:
   "schluessel": pvpArmorLine("Deutscher Name", "English name", [Klassen], [Rüstung Lv66, Lv105, Lv120]),
*/
const UPGRADE_LINES = {
  "schwert-1h-pvp": pvpWeaponLine("1-Hand-Schwert", "One-handed sword", ["warrior", "ninja", "sura"],
                      ["wpn-05", "wpn-01", "wpn-06", "wpn-07"]),   // Schlachtschwert, Tritonschwert, Runenschwert, Kyanitschwert
  "klinge-2h-pvp":  pvpWeaponLine("2-Hand-Waffe", "Two-handed weapon", ["warrior"],
                      ["wpn-08", "wpn-02", "wpn-09", "wpn-10"]),   // Partisane, Halbmenschenklinge, Sonnenschwert, Kyanitklinge
  "schwert-sura-pvp": pvpWeaponLine("Sura-Klinge", "Sura blade", ["sura"],
                      ["wpn-31", "wpn-32", "wpn-33", "wpn-34"]),   // Ghost Fang Blade, Holy Sword, Dragon Tooth Blade, Kyanite Edge
  "dolch-pvp":      pvpWeaponLine("Dolch", "Dagger", ["ninja"],
                      ["wpn-11", "wpn-12", "wpn-13", "wpn-14"]),   // Dragon Knife, Soulless Knife, Five Element Blade, Kyanite Dagger
  "bogen-pvp":      pvpWeaponLine("Bogen", "Bow", ["ninja"],
                      ["wpn-15", "wpn-16", "wpn-17", "wpn-18"]),   // Yellow Dragon Bow, Giant Devil Bow, Phoenix Bow, Kyanite Bow
  "glocke-pvp":     pvpWeaponLine("Glocke", "Bell", ["shaman"],
                      ["wpn-19", "wpn-20", "wpn-21", "wpn-22"]),   // Heaven and Earth Bell, Dragon Jaw Bell, Dragon Ghost Bell, Kyanite Bell
  "faecher-pvp":    pvpWeaponLine("Fächer", "Fan", ["shaman"],
                      ["wpn-23", "wpn-24", "wpn-25", "wpn-26"]),   // Salvation Fan, Demon Fan, Lying Dragon Fan, Kyanite Fan
  "kralle-pvp":     pvpWeaponLine("Kralle", "Claw", ["lycan"],
                      ["wpn-27", "wpn-28", "wpn-29", "wpn-30"]),   // Griffon Claw, Green Wolf Fang, Dragon Lord, Kyanite Claw
  "ruestung-krieger-pvp": pvpArmorLine("Krieger-Rüstung", "Warrior armour", ["warrior"],
                      ["arm-06", "arm-07", "arm-08"]),             // Schwarzstahlpanzer, Magmaglutpanzer, Kyanitpanzer
  "ruestung-ninja-pvp":   pvpArmorLine("Ninja-Rüstung", "Ninja armour", ["ninja"],
                      ["arm-09", "arm-10", "arm-11"]),             // Black Wind Suit, Blood Moon Suit, Kyanite Suit
  "ruestung-sura-pvp":    pvpArmorLine("Sura-Rüstung", "Sura armour", ["sura"],
                      ["arm-15", "arm-16", "arm-17"]),             // Magic Plate Armour, Hellrider Armour, Kyanite Plate Armour
  "ruestung-schamane-pvp": pvpArmorLine("Schamanen-Rüstung", "Shaman armour", ["shaman"],
                      ["arm-12", "arm-13", "arm-14"]),             // Black Clothing, Fire Clothing, Kyanite Clothing
  "ruestung-lykaner-pvp": pvpArmorLine("Lykaner-Rüstung", "Lycan armour", ["lycan"],
                      ["arm-18", "arm-19", "arm-20"]),             // Nightshade Armour, Agate Plate Armour, Kyanite Harness
};


/* =====================================================================
   NAMENS-STATUS  –  für das Übersetzer-Tool (uebersetzen/)
   ---------------------------------------------------------------------
   Welche DE/EN-Namen schon mit dem Spiel abgeglichen sind. Alles andere
   zeigt das Tool als „vorläufig“ (oder „fehlt“, wenn kein Name da ist).
   Stand 22.11.: Akrios hat alle vorläufigen DE-Namen geprüft (keine mehr
   offen) und EN für fast alle Items bestätigt/korrigiert.
   Nach weiteren Abgleichen: Kürzel in die passende Liste schreiben.
   ===================================================================== */
/* Englische Namen, die mit dem Client abgeglichen sind */
const NAMES_CHECKED_EN = [
  "arm-01", "arm-02", "arm-03", "arm-04", "arm-05", "arm-06", "arm-07", "arm-08",
  "arm-09", "arm-10", "arm-11", "arm-12", "arm-13", "arm-14", "arm-15", "arm-16",
  "arm-17", "arm-18", "arm-19", "arm-20", "mat-01", "mat-02", "mat-03", "mat-04",
  "mat-05", "mat-06", "mat-07", "mat-08", "mat-09", "mat-10", "mat-100", "mat-101",
  "mat-102", "mat-103", "mat-104", "mat-105", "mat-106", "mat-107", "mat-108", "mat-109",
  "mat-11", "mat-110", "mat-111", "mat-112", "mat-113", "mat-12", "mat-13", "mat-14",
  "mat-15", "mat-16", "mat-17", "mat-18", "mat-19", "mat-20", "mat-21", "mat-22",
  "mat-23", "mat-24", "mat-25", "mat-26", "mat-27", "mat-28", "mat-29", "mat-30",
  "mat-31", "mat-32", "mat-33", "mat-34", "mat-35", "mat-37", "mat-38", "mat-39",
  "mat-40", "mat-41", "mat-42", "mat-43", "mat-44", "mat-45", "mat-46", "mat-47",
  "mat-48", "mat-49", "mat-50", "mat-51", "mat-52", "mat-53", "mat-54", "mat-55",
  "mat-56", "mat-57", "mat-58", "mat-59", "mat-60", "mat-61", "mat-62", "mat-63",
  "mat-64", "mat-65", "mat-66", "mat-67", "mat-68", "mat-69", "mat-70", "mat-71",
  "mat-72", "mat-73", "mat-74", "mat-75", "mat-76", "mat-77", "mat-78", "mat-79",
  "mat-80", "mat-81", "mat-82", "mat-83", "mat-84", "mat-85", "mat-86", "mat-87",
  "mat-88", "mat-89", "mat-90", "mat-91", "mat-92", "mat-93", "mat-94", "mat-95",
  "mat-96", "mat-97", "mat-98", "mat-99", "wpn-01", "wpn-02", "wpn-03", "wpn-04",
  "wpn-05", "wpn-06", "wpn-07", "wpn-08", "wpn-09", "wpn-10", "wpn-11", "wpn-12",
  "wpn-13", "wpn-14", "wpn-15", "wpn-16", "wpn-17", "wpn-18", "wpn-19", "wpn-20",
  "wpn-21", "wpn-22", "wpn-23", "wpn-24", "wpn-25", "wpn-26", "wpn-27", "wpn-28",
  "wpn-29", "wpn-30", "wpn-31", "wpn-32", "wpn-33", "wpn-34"
];
/* Deutsche Namen, die nur vorläufig übersetzt sind (aktuell keine) */
const NAMES_PROVISIONAL_DE = [];
