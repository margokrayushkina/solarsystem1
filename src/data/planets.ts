export interface PlanetData {
  name: string;
  nameRu: string;
  diameter: number; // km
  distanceFromSun: number; // million km
  orbitalPeriod: number; // Earth days
  color: string;
  size: number; // visual size in px
  orbitRadius: number; // visual orbit radius in px
  description: string;
}

export const planets: PlanetData[] = [
  {
    name: "Mercury",
    nameRu: "Меркурий",
    diameter: 4879,
    distanceFromSun: 57.9,
    orbitalPeriod: 88,
    color: "#b5b5b5",
    size: 6,
    orbitRadius: 70,
    description: "Самая маленькая и ближайшая к Солнцу планета. Поверхность покрыта кратерами."
  },
  {
    name: "Venus",
    nameRu: "Венера",
    diameter: 12104,
    distanceFromSun: 108.2,
    orbitalPeriod: 225,
    color: "#e8cda0",
    size: 10,
    orbitRadius: 105,
    description: "Самая горячая планета с плотной атмосферой из углекислого газа."
  },
  {
    name: "Earth",
    nameRu: "Земля",
    diameter: 12756,
    distanceFromSun: 149.6,
    orbitalPeriod: 365,
    color: "#4da6ff",
    size: 11,
    orbitRadius: 145,
    description: "Наш дом — единственная известная планета с жизнью и жидкой водой."
  },
  {
    name: "Mars",
    nameRu: "Марс",
    diameter: 6792,
    distanceFromSun: 227.9,
    orbitalPeriod: 687,
    color: "#e07040",
    size: 8,
    orbitRadius: 185,
    description: "Красная планета с самым высоким вулканом в Солнечной системе — Олимп."
  },
  {
    name: "Jupiter",
    nameRu: "Юпитер",
    diameter: 142984,
    distanceFromSun: 778.6,
    orbitalPeriod: 4333,
    color: "#d4a574",
    size: 24,
    orbitRadius: 245,
    description: "Крупнейшая планета — газовый гигант с Большим Красным Пятном."
  },
  {
    name: "Saturn",
    nameRu: "Сатурн",
    diameter: 120536,
    distanceFromSun: 1433.5,
    orbitalPeriod: 10759,
    color: "#e8d5a0",
    size: 20,
    orbitRadius: 310,
    description: "Знаменита своими великолепными кольцами из льда и камней."
  },
  {
    name: "Uranus",
    nameRu: "Уран",
    diameter: 51118,
    distanceFromSun: 2872.5,
    orbitalPeriod: 30687,
    color: "#7de0e0",
    size: 16,
    orbitRadius: 370,
    description: "Ледяной гигант, вращающийся «на боку» — ось наклонена на 98°."
  },
  {
    name: "Neptune",
    nameRu: "Нептун",
    diameter: 49528,
    distanceFromSun: 4495.1,
    orbitalPeriod: 60190,
    color: "#4070e0",
    size: 15,
    orbitRadius: 420,
    description: "Самая далёкая планета с сильнейшими ветрами до 2100 км/ч."
  }
];
