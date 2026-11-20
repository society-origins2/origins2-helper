/* =====================================================================
   SKILLTREE (Fertigkeitsbaumsystem)  –  Daten
   ---------------------------------------------------------------------
   Drei Zweige: I = PvM (orange), II = PvP (türkis), III = Yohara (lila).
   Boni werden in fester Reihenfolge 1 → 9 freigeschaltet (keine Sprünge).
   Zweig II: braucht aus Zweig I nur die „Heilfähigkeit“  → requires.
   Zweig III: braucht Zweig I vollständig                → requires.
   x/y  = Position im Baum (Koordinaten wie im Spiel-Fenster, 440×320)
   mats = benötigte Items für die Lieferung dieser Stufe (Ingame-Tabelle)
   bonus/bonusEn = Name des Bonus (Tooltip im Spiel) – noch offen
   ===================================================================== */

/* Schlüssel zum Freischalten + Yang pro Stufe – Angaben folgen */
const SKILL_KEY = { icon: "assets/skill/key.png", perNode: null };
const SKILL_YANG = null;   // z. B. [1000000, 2000000, …] pro Stufe, sobald bekannt

const SKILL_TREE = {
  pvm: {
    name: "PvM-Zweig", nameEn: "PvM branch", roman: "I", color: "#e2622f",
    requires: null,
    edges: [[1, 2], [2, 3], [2, 4], [3, 5], [4, 6], [6, 7], [6, 8], [8, 9]],
    nodes: [
      { x: 55, y: 275, icon: "assets/skill/pvm-1.png", bonus: "", bonusEn: "",
        mats: { "mat-01": 25, "mat-02": 25, "mat-03": 25, "mat-04": 25 } },
      { x: 150, y: 279, icon: "assets/skill/pvm-2.png", bonus: "", bonusEn: "",
        mats: { "mat-77": 2, "mat-78": 2, "mat-79": 250, "mat-14": 2, "mat-25": 2, "mat-89": 2500, "mat-11": 2500, "mat-71": 100 } },
      { x: 85, y: 222, icon: "assets/skill/pvm-3.png", bonus: "", bonusEn: "",
        mats: { "mat-80": 2, "mat-81": 2, "mat-82": 250, "mat-21": 2, "mat-20": 2, "mat-89": 2500, "mat-90": 250, "mat-91": 2500 } },
      { x: 162, y: 210, icon: "assets/skill/pvm-4.png", bonus: "", bonusEn: "",
        mats: { "mat-83": 2, "mat-84": 2, "mat-85": 250, "mat-24": 2, "mat-13": 2, "mat-89": 2500, "mat-92": 2500, "mat-71": 100 } },
      { x: 45, y: 165, icon: "assets/skill/pvm-5.png", bonus: "", bonusEn: "",
        mats: { "mat-76": 2, "mat-27": 2, "mat-93": 2000, "mat-94": 500, "mat-95": 10000, "mat-10": 2500, "mat-62": 1 } },
      { x: 108, y: 152, icon: "assets/skill/pvm-6.png", bonus: "", bonusEn: "",
        mats: { "mat-61": 2, "mat-60": 2, "mat-86": 250, "mat-15": 2, "mat-16": 2, "mat-89": 2500, "mat-11": 2500, "mat-71": 100 } },
      { x: 56, y: 93, icon: "assets/skill/pvm-7.png", bonus: "", bonusEn: "",
        mats: { "mat-56": 2, "mat-55": 2, "mat-87": 250, "mat-89": 2500, "mat-90": 250, "mat-91": 2500, "mat-95": 5000 } },
      { x: 148, y: 115, icon: "assets/skill/pvm-8.png", bonus: "", bonusEn: "",
        mats: { "mat-51": 2, "mat-50": 2, "mat-88": 500, "mat-89": 2500, "mat-92": 2500, "mat-71": 250 } },
      { x: 119, y: 52, icon: "assets/skill/pvm-9.png", bonus: "", bonusEn: "",
        mats: { "mat-09": 1, "mat-96": 6, "mat-97": 6, "mat-62": 5, "mat-95": 10000 } }
    ]
  },
  pvp: {
    name: "PvP-Zweig", nameEn: "PvP branch", roman: "II", color: "#38c9c9",
    requires: null /* Zweig I bis „Heilfähigkeit“ – Stufe folgt */,
    edges: [[1, 2], [2, 3], [2, 4], [4, 5], [4, 6], [6, 7], [7, 8], [7, 9]],
    nodes: [
      { x: 210, y: 300, icon: "assets/skill/pvp-1.png", bonus: "", bonusEn: "",
        mats: { "mat-98": 1, "mat-99": 1, "mat-100": 4, "mat-01": 10, "mat-02": 10, "mat-03": 10, "mat-04": 10 } },
      { x: 190, y: 245, icon: "assets/skill/pvp-2.png", bonus: "", bonusEn: "",
        mats: { "mat-98": 1, "mat-99": 1, "mat-100": 4, "mat-96": 1, "mat-97": 1, "mat-89": 2500, "mat-11": 1000, "mat-71": 100 } },
      { x: 248, y: 232, icon: "assets/skill/pvp-3.png", bonus: "", bonusEn: "",
        mats: { "mat-98": 1, "mat-99": 1, "mat-100": 5, "mat-96": 1, "mat-97": 1, "mat-89": 2500, "mat-101": 2500 } },
      { x: 212, y: 194, icon: "assets/skill/pvp-4.png", bonus: "", bonusEn: "",
        mats: { "mat-98": 1, "mat-99": 1, "mat-100": 6, "mat-96": 1, "mat-97": 1, "mat-89": 2500, "mat-92": 2500, "mat-71": 100 } },
      { x: 186, y: 148, icon: "assets/skill/pvp-5.png", bonus: "", bonusEn: "",
        mats: { "mat-98": 2, "mat-99": 2, "mat-100": 6, "mat-96": 1, "mat-97": 1, "mat-76": 2, "mat-10": 5000, "mat-95": 10000 } },
      { x: 248, y: 136, icon: "assets/skill/pvp-6.png", bonus: "", bonusEn: "",
        mats: { "mat-98": 2, "mat-99": 2, "mat-100": 7, "mat-96": 1, "mat-97": 1, "mat-89": 2500, "mat-11": 1000, "mat-71": 100 } },
      { x: 212, y: 91, icon: "assets/skill/pvp-7.png", bonus: "", bonusEn: "",
        mats: { "mat-98": 2, "mat-99": 2, "mat-100": 8, "mat-96": 1, "mat-97": 1, "mat-89": 2500, "mat-90": 100, "mat-95": 10000 } },
      { x: 176, y: 48, icon: "assets/skill/pvp-8.png", bonus: "", bonusEn: "",
        mats: { "mat-98": 2, "mat-99": 2, "mat-100": 9, "mat-96": 1, "mat-97": 1, "mat-89": 2500, "mat-92": 2500, "mat-71": 100 } },
      { x: 267, y: 48, icon: "assets/skill/pvp-9.png", bonus: "", bonusEn: "",
        mats: { "mat-98": 3, "mat-99": 3, "mat-100": 10, "mat-96": 1, "mat-97": 1, "mat-95": 10000, "mat-09": 1 } }
    ]
  },
  yohara: {
    name: "Yohara-Zweig", nameEn: "Yohara branch", roman: "III", color: "#a463e8",
    requires: { branch: "pvm", upto: 9 },
    edges: [[1, 2], [2, 3], [2, 4], [4, 5], [4, 6], [6, 7], [6, 8], [8, 9]],
    nodes: [
      { x: 265, y: 287, icon: "assets/skill/yohara-1.png", bonus: "", bonusEn: "",
        mats: { "mat-07": 200, "mat-95": 10000, "mat-89": 2500, "mat-93": 2500, "mat-71": 100, "mat-76": 1 } },
      { x: 335, y: 275, icon: "assets/skill/yohara-2.png", bonus: "", bonusEn: "",
        mats: { "mat-40": 250, "mat-41": 250, "mat-39": 1000, "mat-102": 1000, "mat-95": 10000, "mat-89": 2500, "mat-103": 500, "mat-104": 500 } },
      { x: 400, y: 278, icon: "assets/skill/yohara-3.png", bonus: "", bonusEn: "",
        mats: { "mat-40": 100, "mat-41": 100, "mat-46": 1, "mat-43": 1, "mat-42": 10, "mat-105": 1, "mat-106": 1, "mat-97": 3, "mat-96": 3, "mat-62": 1 } },
      { x: 306, y: 231, icon: "assets/skill/yohara-4.png", bonus: "", bonusEn: "",
        mats: { "mat-40": 250, "mat-41": 250, "mat-39": 1000, "mat-102": 1000, "mat-95": 10000, "mat-103": 500, "mat-89": 2500, "mat-104": 500 } },
      { x: 357, y: 196, icon: "assets/skill/yohara-5.png", bonus: "", bonusEn: "",
        mats: { "mat-40": 100, "mat-41": 100, "mat-46": 1, "mat-43": 1, "mat-42": 10, "mat-105": 1, "mat-106": 1, "mat-97": 3, "mat-96": 3, "mat-62": 1 } },
      { x: 309, y: 157, icon: "assets/skill/yohara-6.png", bonus: "", bonusEn: "",
        mats: { "mat-107": 250, "mat-63": 250, "mat-62": 1, "mat-39": 2500, "mat-102": 2500, "mat-103": 500, "mat-89": 2500, "mat-104": 500 } },
      { x: 379, y: 117, icon: "assets/skill/yohara-7.png", bonus: "", bonusEn: "",
        mats: { "mat-107": 100, "mat-63": 100, "mat-44": 2, "mat-46": 2, "mat-43": 2, "mat-42": 10, "mat-105": 1, "mat-106": 1, "mat-97": 4, "mat-96": 4 } },
      { x: 294, y: 91, icon: "assets/skill/yohara-8.png", bonus: "", bonusEn: "",
        mats: { "mat-107": 250, "mat-63": 250, "mat-62": 1, "mat-39": 2500, "mat-102": 2500, "mat-89": 2500, "mat-103": 500, "mat-104": 500 } },
      { x: 351, y: 52, icon: "assets/skill/yohara-9.png", bonus: "", bonusEn: "",
        mats: { "mat-107": 100, "mat-63": 100, "mat-44": 2, "mat-46": 2, "mat-43": 2, "mat-42": 10, "mat-105": 1, "mat-106": 1, "mat-97": 4, "mat-96": 4 } }
    ]
  }
};
