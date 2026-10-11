"use client";
import type { RealWatch } from "./realWatches";

/** Rich inferred specs for EVERY watch — brand/type/metal/cost + more. */
export interface EnrichedSpecs {
  type: string;
  metal: string;
  dial: string;
  strap: string;
  water: string;
  power: string;
  frequency: string;
  jewels: number;
  thickness: string;
  glass: string;
  warranty: string;
  description: string;
  features: string[];
  limited: boolean;
  stock: number;
}
function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}
const METALS = [
  "Oystersteel Stainless Steel",
  "316L Stainless Steel",
  "Brushed Titanium",
  "18k Pink Gold + Steel",
  "Bronze + Steel",
  "Carbon Composite + Steel",
];
const DIALS = [
  "Sunburst Blue",
  "Matte Black",
  "Champagne Gold",
  "Ice Blue",
  "Emerald Green",
  "Silver Opaline",
  "Midnight Navy",
  "Bronze Fumé",
];
const STRAPS = [
  "Oystersteel Bracelet",
  "Leather Strap",
  "Titanium Bracelet",
  "Steel Mesh Bracelet",
  "Resin Sport Strap",
  "NATO Fabric Strap",
];
const TYPES = [
  "Automatic Diver",
  "Chronograph",
  "Dress Classic",
  "GMT Dual-Time",
  "Moonphase",
  "Field Watch",
  "Digital Sport",
  "Skeleton Limited",
];

export function enrichWatch(w: RealWatch): EnrichedSpecs {
  const safe = (v: unknown, fb: string) =>
    typeof v === "string" && v.trim() ? v : fb;
  const lower = (v: unknown, fb: string) => safe(v, fb).toLowerCase();
  if (w.description && w.features?.length && w.caseMaterial) {
    return {
      type: w.movement?.includes("Chrono")
        ? "Chronograph"
        : "Automatic Classic",
      metal: w.caseMaterial,
      dial: w.dialColor || "—",
      strap: w.strapMaterial || "—",
      water: w.waterResistance || "—",
      power: w.powerReserve || "—",
      frequency: w.frequency || "—",
      jewels: w.jewels || 0,
      thickness: w.caseThickness || "—",
      glass: "Sapphire Crystal",
      warranty: "5-year warranty + certificate",
      description: w.description,
      features: w.features || [],
      limited: !!w.limitedEdition,
      stock: w.stockQuantity ?? 5,
    };
  }
  const h = hash(w.id || "watch");
  const lux = (w.priceINR || 0) > 500000;
  const movement = safe((w as { movement?: unknown }).movement, "Automatic");
  const caseSize = safe((w as { caseSize?: unknown }).caseSize, "—");
  const type = movement.includes("Chrono")
    ? "Chronograph"
    : movement.includes("Quartz") || movement.includes("Digital")
      ? TYPES[h % 2 === 0 ? 6 : 2]
      : lux
        ? TYPES[h % 5]
        : TYPES[h % TYPES.length];
  const metal =
    safe((w as { caseMaterial?: unknown }).caseMaterial, "") || METALS[h % METALS.length] || "Stainless Steel";
  const dial =
    safe((w as { dialColor?: unknown }).dialColor, "") || DIALS[(h >> 3) % DIALS.length] || "Silver Opaline";
  const strap =
    safe((w as { strapMaterial?: unknown }).strapMaterial, "") || STRAPS[(h >> 5) % STRAPS.length] || "Leather Strap";
  const water =
    safe((w as { waterResistance?: unknown }).waterResistance, "") ||
    (lux
      ? "100m / 10 ATM"
      : ["30m / 3 ATM", "50m / 5 ATM", "100m / 10 ATM", "200m / 20 ATM"][
          (h >> 2) % 4
        ]);
  const power =
    safe((w as { powerReserve?: unknown }).powerReserve, "") ||
    (movement.includes("Quartz") ||
    movement.includes("Digital") ||
    movement.includes("Solar")
      ? "Battery / Solar · 2-yr cell"
      : `${38 + (h % 5) * 8}h power reserve`);
  const jewels =
    (w as { jewels?: number }).jewels ||
    (movement.includes("Quartz") || movement.includes("Digital")
      ? 0
      : 21 + (h % 12));
  return {
    type,
    metal,
    dial,
    strap,
    water,
    power,
    frequency:
      safe((w as { frequency?: unknown }).frequency, "") || (jewels ? "28,800 vph (4 Hz)" : "Quartz 32,768 Hz"),
    jewels,
    thickness: safe((w as { caseThickness?: unknown }).caseThickness, "") || `${8 + (h % 6)}.${h % 9}mm`,
    glass: "Sapphire Crystal (anti-reflective)",
    warranty: lux
      ? "5-year international warranty + certificate"
      : "2-year brand warranty + bill",
    description: `${safe((w as { brand?: unknown }).brand, "Aura")} ${safe((w as { name?: unknown }).name, "Watch")} (${safe((w as { reference?: unknown }).reference, "Ref")} ) — a ${lower(type, "automatic classic")} in ${lower(metal, "stainless steel")} with a ${lower(dial, "silver opaline")} dial on ${lower(strap, "leather strap")}. Powered by ${movement}, sized ${caseSize}, sealed to ${water}. Priced at ₹${(w.priceINR || 0).toLocaleString("en-IN")} India street level.`,
    features: [
      movement,
      `${caseSize} · ${metal}`,
      `${dial} dial · Sapphire Crystal`,
      `${water} · ${power}`,
      strap,
    ],
    limited: lux && h % 3 === 0,
    stock: 2 + (h % 8),
  };
}
