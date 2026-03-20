import { PackingCategory, PackingTemplateType } from '@/types/planning';

interface PackingTemplateItem {
  name: string;
  category: PackingCategory;
  quantity?: number;
}

export interface PackingTemplate {
  type: PackingTemplateType;
  name: string;
  description: string;
  items: PackingTemplateItem[];
}

export const PACKING_TEMPLATES: PackingTemplate[] = [
  {
    type: 'paivaretki',
    name: 'Päiväretki',
    description: 'Perustarvikkeet päiväretkelle luontoon',
    items: [
      { name: 'Reppu (20-30L)', category: 'varusteet' },
      { name: 'Vesipullo', category: 'ruoka-juoma' },
      { name: 'Eväät', category: 'ruoka-juoma' },
      { name: 'Välipala', category: 'ruoka-juoma' },
      { name: 'Vaelluskengät', category: 'vaatteet' },
      { name: 'Sadetakki', category: 'vaatteet' },
      { name: 'Vaihtosukat', category: 'vaatteet' },
      { name: 'Pipo / hattu', category: 'vaatteet' },
      { name: 'Fleece / välikerros', category: 'vaatteet' },
      { name: 'Kartta / GPS', category: 'navigointi' },
      { name: 'Puhelin (ladattu)', category: 'navigointi' },
      { name: 'Varavirtalähde', category: 'navigointi' },
      { name: 'Ensiapupakkaus', category: 'turvallisuus' },
      { name: 'Pilli', category: 'turvallisuus' },
      { name: 'Aurinkovoide', category: 'hygienia' },
      { name: 'Hyttyssuihke', category: 'hygienia' },
      { name: 'Käsidesi', category: 'hygienia' },
      { name: 'Otsalamppu', category: 'varusteet' },
      { name: 'Istumaalusta', category: 'varusteet' },
      { name: 'Puukko', category: 'varusteet' },
      { name: 'Roskapussi', category: 'muut' },
      { name: 'Aurinkolasit', category: 'muut' },
    ],
  },
  {
    type: 'yopyminen',
    name: 'Yöpymisretki',
    description: 'Kaikki tarvittava yön yli -retkelle',
    items: [
      // Majoitus
      { name: 'Teltta / riippumatto', category: 'majoitus' },
      { name: 'Makuupussi', category: 'majoitus' },
      { name: 'Makuualusta', category: 'majoitus' },
      { name: 'Tyyny', category: 'majoitus' },
      // Varusteet
      { name: 'Reppu (50-70L)', category: 'varusteet' },
      { name: 'Retkikeitin', category: 'varusteet' },
      { name: 'Kaasupatruuna', category: 'varusteet' },
      { name: 'Kattila', category: 'varusteet' },
      { name: 'Muki', category: 'varusteet' },
      { name: 'Ruokailuvälineet (lusikka, haarukka)', category: 'varusteet' },
      { name: 'Otsalamppu + varaparistot', category: 'varusteet' },
      { name: 'Istumaalusta', category: 'varusteet' },
      { name: 'Puukko', category: 'varusteet' },
      { name: 'Narua (5m)', category: 'varusteet' },
      // Vaatteet
      { name: 'Vaelluskengät', category: 'vaatteet' },
      { name: 'Sadetakki', category: 'vaatteet' },
      { name: 'Sadehousut', category: 'vaatteet' },
      { name: 'Fleece / välikerros', category: 'vaatteet' },
      { name: 'Vaihtosukat', category: 'vaatteet', quantity: 2 },
      { name: 'Aluskerrastot', category: 'vaatteet' },
      { name: 'Pipo', category: 'vaatteet' },
      { name: 'Hanskat', category: 'vaatteet' },
      // Ruoka ja juoma
      { name: 'Vesipullo / -rakko', category: 'ruoka-juoma' },
      { name: 'Retkiruoka (päivällinen)', category: 'ruoka-juoma' },
      { name: 'Retkiruoka (aamiainen)', category: 'ruoka-juoma' },
      { name: 'Välipalat', category: 'ruoka-juoma' },
      { name: 'Kahvi / tee', category: 'ruoka-juoma' },
      // Navigointi
      { name: 'Kartta', category: 'navigointi' },
      { name: 'Kompassi', category: 'navigointi' },
      { name: 'Puhelin + varavirtalähde', category: 'navigointi' },
      // Turvallisuus
      { name: 'Ensiapupakkaus', category: 'turvallisuus' },
      { name: 'Tulitikut / sytytin', category: 'turvallisuus' },
      { name: 'Pilli', category: 'turvallisuus' },
      // Hygienia
      { name: 'Hammasharja + tahna', category: 'hygienia' },
      { name: 'Pyyhe (mikrokuitu)', category: 'hygienia' },
      { name: 'Hyttyssuihke', category: 'hygienia' },
      { name: 'Aurinkovoide', category: 'hygienia' },
      { name: 'WC-paperi', category: 'hygienia' },
      // Muut
      { name: 'Roskapussi', category: 'muut' },
      { name: 'Aurinkolasit', category: 'muut' },
    ],
  },
  {
    type: 'talviretki',
    name: 'Talviretki',
    description: 'Talviolosuhteisiin varustautuminen',
    items: [
      // Majoitus
      { name: 'Talviteltta / laavu', category: 'majoitus' },
      { name: 'Talvimakuupussi (-20°C)', category: 'majoitus' },
      { name: 'Makuualusta (R-arvo 5+)', category: 'majoitus' },
      // Varusteet
      { name: 'Reppu (50-70L)', category: 'varusteet' },
      { name: 'Lumikengät / sukset', category: 'varusteet' },
      { name: 'Sauvat', category: 'varusteet' },
      { name: 'Ahkio / pulkka', category: 'varusteet' },
      { name: 'Retkikeitin', category: 'varusteet' },
      { name: 'Kaasupatruuna (talvi)', category: 'varusteet' },
      { name: 'Kattila', category: 'varusteet' },
      { name: 'Termos', category: 'varusteet' },
      { name: 'Muki (eristetty)', category: 'varusteet' },
      { name: 'Ruokailuvälineet', category: 'varusteet' },
      { name: 'Otsalamppu + varaparistot', category: 'varusteet' },
      { name: 'Puukko', category: 'varusteet' },
      { name: 'Lumisaha / -lapio', category: 'varusteet' },
      { name: 'Istumaalusta', category: 'varusteet' },
      // Vaatteet
      { name: 'Talvikengät', category: 'vaatteet' },
      { name: 'Lämmin aluskerrastot', category: 'vaatteet', quantity: 2 },
      { name: 'Villasukat', category: 'vaatteet', quantity: 2 },
      { name: 'Fleece-paita', category: 'vaatteet' },
      { name: 'Untuvatakit / toppatakki', category: 'vaatteet' },
      { name: 'Kuoritakki', category: 'vaatteet' },
      { name: 'Toppahousut', category: 'vaatteet' },
      { name: 'Pipo', category: 'vaatteet' },
      { name: 'Kauluri / tuubihuivi', category: 'vaatteet' },
      { name: 'Hanskat (ohut + paksu)', category: 'vaatteet', quantity: 2 },
      { name: 'Laskettelulasit / suojalasit', category: 'vaatteet' },
      // Ruoka
      { name: 'Termos (kuuma juoma)', category: 'ruoka-juoma' },
      { name: 'Retkiruoka', category: 'ruoka-juoma' },
      { name: 'Energiavälipalat', category: 'ruoka-juoma' },
      { name: 'Kahvi / kaakao', category: 'ruoka-juoma' },
      // Navigointi
      { name: 'Kartta + kompassi', category: 'navigointi' },
      { name: 'Puhelin (lämpösuojassa)', category: 'navigointi' },
      { name: 'Varavirtalähde', category: 'navigointi' },
      // Turvallisuus
      { name: 'Ensiapupakkaus', category: 'turvallisuus' },
      { name: 'Tulitikut + sytykkeet', category: 'turvallisuus' },
      { name: 'Avaruuspeite', category: 'turvallisuus' },
      { name: 'Pilli', category: 'turvallisuus' },
      // Hygienia
      { name: 'Hammasharja + tahna', category: 'hygienia' },
      { name: 'Pyyhe', category: 'hygienia' },
      { name: 'Huulirasva (SPF)', category: 'hygienia' },
      { name: 'Aurinkovoide', category: 'hygienia' },
      // Muut
      { name: 'Roskapussi', category: 'muut' },
    ],
  },
];
