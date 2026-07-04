// Lots de ventes aux enchères - chaque lot référence une PIÈCE UNIQUE réelle du
// catalogue (products), donc AUCUNE nouvelle image n'est introduite (règle stricte
// « pas d'image réutilisée » respectée : on affiche la photo propre à l'œuvre).

export type AuctionLot = {
  id: string;
  productId: string;
  /** Mise de départ en Fcfa */
  startBid: number;
  /** Incrément minimum entre deux mises */
  minIncrement: number;
  /** Durée de la vente, en heures, à partir de la première visite (démo localStorage) */
  durationHours: number;
  /** Estimation basse / haute pour la documentation du lot */
  estimateLow: number;
  estimateHigh: number;
  provenance: string;
};

export const auctionLots: AuctionLot[] = [
  {
    id: "lot-01",
    productId: "p33",
    startBid: 450000,
    minIncrement: 25000,
    durationHours: 96,
    estimateLow: 520000,
    estimateHigh: 780000,
    provenance: "Atelier Sénoufo - collection privée, acquise directement auprès du maître sculpteur.",
  },
  {
    id: "lot-02",
    productId: "p27",
    startBid: 400000,
    minIncrement: 25000,
    durationHours: 120,
    estimateLow: 450000,
    estimateHigh: 700000,
    provenance: "Pays Dogon - pièce documentée, transmission familiale sur trois générations.",
  },
  {
    id: "lot-03",
    productId: "p21",
    startBid: 360000,
    minIncrement: 20000,
    durationHours: 72,
    estimateLow: 420000,
    estimateHigh: 620000,
    provenance: "Fonte à la cire perdue Yoruba - signature d'atelier, provenance certifiée.",
  },
  {
    id: "lot-04",
    productId: "p5",
    startBid: 320000,
    minIncrement: 20000,
    durationHours: 60,
    estimateLow: 380000,
    estimateHigh: 560000,
    provenance: "Tradition Ifé-Bénin - bronze coulé, documentation historique complète.",
  },
  {
    id: "lot-05",
    productId: "p1",
    startBid: 250000,
    minIncrement: 10000,
    durationHours: 48,
    estimateLow: 295000,
    estimateHigh: 450000,
    provenance: "Lignée Mensah (Togoville) - masque cérémoniel, taille directe sur iroko.",
  },
  {
    id: "lot-06",
    productId: "p29",
    startBid: 220000,
    minIncrement: 10000,
    durationHours: 36,
    estimateLow: 265000,
    estimateHigh: 400000,
    provenance: "Masque Gélédé Yoruba - patrimoine cérémoniel, pièce unique documentée.",
  },
];
