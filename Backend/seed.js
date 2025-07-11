const faker = require('faker');
const {
  sequelize,
  User,
  Company,
  ImportedTender,
  Application,
  Prediction
} = require('./models');

// Moroccan data
const MOROCCAN_REGIONS = [
  'Tanger-Tétouan',
  'Gharb-Chrarda-Beni Hssen',
  'Taza-Al Hoceima-Taounate',
  "L'Oriental",
  'Fès-Boulemane',
  'Meknès-Tafilalet',
  'Rabat-Salé-Zemmour-Zaer',
  'Grand Casablanca',
  'Chaouia-Ouardigha',
  'Doukhala-Abda',
  'Marrakech-Tensift-Al Haouz',
  'Tadla-Azilal',
  'Souss-Massa-Drâa',
  'Laâyoune-Boujdour-Sakia el Hamra',
  'Guelmim-Es Smara',
  'Oued ed Dahab-Lagouira'
];

const MOROCCAN_CITIES = {
  'Tanger-Tétouan': ['Tanger', 'Tétouan', 'Larache', 'Chefchaouen', 'Fnideq'],
  'Gharb-Chrarda-Beni Hssen': ['Kénitra', 'Sidi Kacem', 'Sidi Slimane'],
  'Taza-Al Hoceima-Taounate': ['Al Hoceïma', 'Taza', 'Taounate', 'Guercif'],
  "L'Oriental": ['Oujda', 'Nador', 'Berkane', 'Taourirt', 'Jerada'],
  'Fès-Boulemane': ['Fès', 'Sefrou', 'Boulemane'],
  'Meknès-Tafilalet': ['Meknès', 'Errachidia', 'Midelt', 'El Hajeb', 'Ifrane'],
  'Rabat-Salé-Zemmour-Zaer': ['Rabat', 'Salé', 'Témara', 'Skhirat', 'Khemisset'],
  'Grand Casablanca': ['Casablanca', 'Mohammedia'],
  'Chaouia-Ouardigha': ['Settat', 'Benslimane', 'Berrechid', 'Khouribga'],
  'Doukhala-Abda': ['El Jadida', 'Safi', 'Youssoufia', 'Sidi Bennour'],
  'Marrakech-Tensift-Al Haouz': ['Marrakech', 'Essaouira', 'Chichaoua', 'El Kelaa des Sraghna'],
  'Tadla-Azilal': ['Béni Mellal', 'Azilal', 'Fquih Ben Salah'],
  'Souss-Massa-Drâa': ['Agadir', 'Taroudant', 'Tiznit', 'Tata', 'Zagora'],
  'Laâyoune-Boujdour-Sakia el Hamra': ['Laâyoune', 'Boujdour', 'Es-Semara', 'Tarfaya'],
  'Guelmim-Es Smara': ['Guelmim', 'Tan-Tan', 'Sidi Ifni', 'Assa-Zag'],
  'Oued ed Dahab-Lagouira': ['Dakhla', 'Aousserd', 'Lagouira']
};

const MOROCCAN_COMPANY_NAMES = [
  'Groupe OCP', 'Maroc Telecom', 'Attijariwafa Bank', 'ONEE', 'Royal Air Maroc',
  'Yazaki Maroc', 'SOMED', 'Managem', 'Cosumar', 'Saham Assurance',
  'Afriquia Gaz', 'Marjane Holding', 'BMCE Bank', 'Risma', 'Label Vie',
  'Auto Nejma', 'SODEP-Marsa Maroc', 'Sonasid', 'Lesieur Cristal', 'Delattre Levivier Maroc'
];

function roundBudgetRealistically(value) {
  const base = Math.floor(value / 1000000) * 1000000;
  const remainder = value % 1000000;
  if (remainder < 250000) return base;
  else if (remainder < 750000) return base + 500000;
  else return base + 1000000;
}

const terrainMultipliers = {
  "Flat": 1.0,
  "Mixed": 1.1,
  "Coastal": 1.15,
  "Mountainous": 1.3,
  "Desert": 1.05
};

const slopeMultipliers = {
  "Low": 1.0,
  "Moderate": 1.1,
  "High": 1.25
};

const baseCostPerLane = {
  "Autoroute": [1200000, 1500000],
  "National": [800000, 1200000],
  "Regional": [500000, 800000],
  "Provincial": [300000, 600000]
};

function generateDate(year) {
  const month = faker.datatype.number({ min: 1, max: 12 });
  const day = faker.datatype.number({ min: 1, max: 28 });
  const hour = faker.datatype.number({ min: 0, max: 23 });
  const minute = faker.datatype.number({ min: 0, max: 59 });
  const second = faker.datatype.number({ min: 0, max: 59 });
  return new Date(year, month - 1, day, hour, minute, second);
}

function getRandomYear() {
  // Weighted distribution - more recent years are more likely
  const rand = Math.random();
  if (rand < 0.5) return 2025; // 50% chance for 2025
  if (rand < 0.8) return 2024; // 30% chance for 2024
  return 2023; // 20% chance for 2023
}

async function seed() {
  try {
    await sequelize.sync({ force: true });

    // Create users with creation dates spread across years
    const users = [];
    for (let i = 0; i < 5; i++) {
      const userYear = 2022 + Math.floor(i / 2); // Spread users across 2022 and 2023
      users.push(await User.create({
        fullName: faker.name.findName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: 'admin',
        createdAt: generateDate(userYear),
        updatedAt: generateDate(userYear)
      }));
    }

    // Create companies with foundation dates in past years
    const companies = [];
    for (let i = 0; i < 20; i++) {
      const isLarge = faker.datatype.boolean(0.3);
      const foundationYear = faker.datatype.number({ min: 1990, max: 2020 });
      const company = await Company.create({
        name: i < MOROCCAN_COMPANY_NAMES.length ? MOROCCAN_COMPANY_NAMES[i] : `${faker.company.companyName()} Maroc`,
        foundation_date: generateDate(foundationYear),
        previous_similar_projects: isLarge ? faker.datatype.number({ min: 5, max: 20 }) : faker.datatype.number({ min: 0, max: 5 }),
        total_employees: isLarge ? faker.datatype.number({ min: 200, max: 1000 }) : faker.datatype.number({ min: 30, max: 200 }),
        engineers_count: faker.datatype.number({ min: 1, max: 30 }),
        machinery_count: faker.datatype.number({ min: 3, max: 15 }),
        compliance_issues_count: faker.datatype.number({ min: 0, max: 2 }),
        createdAt: generateDate(foundationYear + faker.datatype.number({ min: 1, max: 3 })),
        updatedAt: generateDate(foundationYear + faker.datatype.number({ min: 1, max: 3 }))
      });
      companies.push(company);
    }

    const tenders = [];
    const categories = ['Autoroute', 'National', 'Regional', 'Provincial'];
    const terrains = ['Flat', 'Mixed', 'Coastal', 'Mountainous', 'Desert'];
    const soils = ['Sandy', 'Clay', 'Rocky'];
    const slopes = ['High', 'Moderate', 'Low'];

    for (let i = 0; i < 50; i++) {
      const region = faker.random.arrayElement(MOROCCAN_REGIONS);
      const city = faker.random.arrayElement(MOROCCAN_CITIES[region]);
      const category = faker.random.arrayElement(categories);
      const lanes = category === 'Autoroute' ? 4 : faker.datatype.number({ min: 1, max: 3 });
      const width = lanes * 3.5;
      const length = faker.datatype.number({ min: 5, max: 250 });
      const terrain = faker.random.arrayElement(terrains);
      const slope = faker.random.arrayElement(slopes);
      const soil = faker.random.arrayElement(soils);

      const [minCost, maxCost] = baseCostPerLane[category];
      const baseCost = faker.datatype.number({ min: minCost, max: maxCost });
      const estimated = roundBudgetRealistically(length * lanes * baseCost * terrainMultipliers[terrain] * slopeMultipliers[slope]);

      const tenderYear = getRandomYear();
      const tenderDate = generateDate(tenderYear);

      const tender = await ImportedTender.create({
        source_id: faker.datatype.uuid(),
        title: `Route ${category} à ${city}`,
        region,
        province: city,
        category,
        road_class: category === 'Autoroute' || category === 'National' ? 'Primary' : 'Secondary',
        total_length_km: length,
        road_width_m: width,
        lanes,
        terrain_type: terrain,
        soil_type: soil,
        slope,
        estimated_budget_MAD: estimated,
        source_url: faker.internet.url(),
        createdAt: tenderDate,
        updatedAt: tenderDate
      });
      tenders.push(tender);
    }

    const applications = [];
    const usedPairs = new Set();
    const total = 250;
    const fraudCount = Math.floor(total * 0.3);

    for (let i = 0; i < total; i++) {
      let company, tender, pairKey;
      do {
        company = faker.random.arrayElement(companies);
        tender = faker.random.arrayElement(tenders);
        pairKey = `${company.id}-${tender.id}`;
      } while (usedPairs.has(pairKey));
      usedPairs.add(pairKey);

      const isFraud = i < fraudCount;
      const offeredRatio = isFraud
        ? faker.datatype.boolean() ? faker.datatype.float({ min: 0.5, max: 0.7 }) : faker.datatype.float({ min: 1.3, max: 1.6 })
        : faker.datatype.float({ min: 0.9, max: 1.1 });
      const offered = roundBudgetRealistically(tender.estimated_budget_MAD * offeredRatio);
      const financial = Math.min(100, (tender.estimated_budget_MAD / offered) * 100);
      const technical = isFraud ? faker.datatype.float({ min: 30, max: 55 }) : faker.datatype.float({ min: 70, max: 100 });
      const duration = Math.round(tender.total_length_km * faker.datatype.float({ min: 2, max: 6 }));
      
      // Application date should be after tender creation date
      const appYear = tender.createdAt.getFullYear();
      const appDate = generateDate(appYear + faker.datatype.number({ min: 0, max: 1 })); // Within 1 year of tender

      const app = await Application.create({
        tender_id: tender.id,
        company_id: company.id,
        company_experience_years: faker.datatype.number({ min: 1, max: 20 }),
        previous_similar_projects: company.previous_similar_projects,
        total_employees: company.total_employees,
        engineers_count: company.engineers_count,
        machinery_count: company.machinery_count,
        offered_budget_MAD: offered,
        estimated_budget_MAD: tender.estimated_budget_MAD,
        budget_difference_ratio: (offered - tender.estimated_budget_MAD) / tender.estimated_budget_MAD,
        proposed_duration_days: duration,
        total_length_km: tender.total_length_km,
        road_width_m: tender.road_width_m,
        lanes: tender.lanes,
        category: tender.category,
        road_class: tender.road_class,
        terrain_type: tender.terrain_type,
        soil_type: tender.soil_type,
        slope: tender.slope,
        compliance_issues_count: isFraud ? faker.datatype.number({ min: 2, max: 3 }) : faker.datatype.number({ min: 0, max: 1 }),
        technical_score: technical,
        financial_score: parseFloat(financial.toFixed(2)),
        status: faker.random.arrayElement(['pending', 'approved', 'rejected']),
        is_fraud: isFraud,
        createdAt: appDate,
        updatedAt: appDate
      });

      // Prediction date should be after application date
      const predictionDate = generateDate(appYear + faker.datatype.number({ min: 0, max: 1 }));
      const user = faker.random.arrayElement(users);
      await Prediction.create({
        application_id: app.id,
        user_id: user.id,
        prediction: isFraud,
        result: isFraud ? "Fraudulent" : "Legitimate",
        createdAt: predictionDate,
        updatedAt: predictionDate
      });

      applications.push(app);
    }

    console.log(`✅ Seeded ${applications.length} applications and predictions.`);
    await sequelize.close();
    console.log("🌱 Done!");
  } catch (err) {
    console.error("❌ Seed error:", err);
    await sequelize.close();
  }
}

seed();