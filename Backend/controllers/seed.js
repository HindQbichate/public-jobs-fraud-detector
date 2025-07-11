const faker = require('faker');
const {
  sequelize,
  User,
  Company,
  ImportedTender,
  Application
} = require('../models');

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

  if (remainder < 250000) {
    return base;
  } else if (remainder < 750000) {
    return base + 500000;
  } else {
    return base + 1000000;
  }
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

async function seed() {
  try {
    await sequelize.sync({ force: false }); 

    // --- Seed Users ---
    const users = [];
    for (let i = 0; i < 5; i++) {
      const user = await User.create({
        fullName: `${faker.name.firstName()} ${faker.name.lastName()}`,
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: 'Admin'
      });
      users.push(user);
    }
    console.log(`✅ Seeded ${users.length} users.`);

    // --- Seed Companies ---
    const companies = [];
    for (let i = 0; i < 20; i++) {
      const isLarge = faker.datatype.boolean(0.3);
      
      let experience, similarProjects, employees, engineers, machinery;
      
      if (isLarge) {
        experience = faker.datatype.number({ min: 10, max: 30 });
        similarProjects = faker.datatype.number({ min: 5, max: 20 });
        employees = faker.datatype.number({ min: 200, max: 1000 });
        engineers = faker.datatype.number({ min: 5, max: employees / 20 });
        machinery = faker.datatype.number({ min: 10, max: employees / 10 });
      } else {
        experience = faker.datatype.number({ min: 1, max: 10 });
        similarProjects = faker.datatype.number({ min: 0, max: 5 });
        employees = faker.datatype.number({ min: 30, max: 200 });
        engineers = faker.datatype.number({ min: 1, max: 5 });
        machinery = faker.datatype.number({ min: 3, max: 10 });
      }

      const company = await Company.create({
        name: i < MOROCCAN_COMPANY_NAMES.length 
          ? MOROCCAN_COMPANY_NAMES[i] 
          : `${faker.company.companyName()} Maroc`,
        foundation_date: faker.date.past(experience),
        previous_similar_projects: similarProjects,
        total_employees: employees,
        engineers_count: engineers,
        machinery_count: machinery,
        compliance_issues_count: faker.datatype.number({ min: 0, max: 2 })
      });
      companies.push(company);
    }
    console.log(`✅ Seeded ${companies.length} companies.`);

    // --- Seed Imported Tenders ---
    const tenderCategories = ['Autoroute', 'National', 'Regional', 'Provincial'];
    const terrainTypes = ['Flat', 'Mixed', 'Coastal', 'Mountainous', 'Desert'];
    const soilTypes = ['Sandy', 'Clay', 'Rocky'];
    const slopeTypes = ['High', 'Moderate', 'Low'];
    const tenders = [];

    for (let i = 0; i < 50; i++) {
      const region = faker.random.arrayElement(MOROCCAN_REGIONS);
      const city = faker.random.arrayElement(MOROCCAN_CITIES[region]);
      const category = faker.random.arrayElement(tenderCategories);
      const roadClass = category === 'Autoroute' || category === 'National' ? 'Primary' : 'Secondary';
      
      let lanes;
      if (category === 'Autoroute') {
        lanes = 4;
      } else if (category === 'National') {
        lanes = faker.random.arrayElement([2, 2, 2, 4]);
      } else if (category === 'Regional') {
        lanes = faker.random.arrayElement([1, 2]);
      } else {
        lanes = 1;
      }

      const roadWidth = lanes * 3.5;
      const totalLengthKm = faker.datatype.number({ min: 5, max: 250 });
      const terrain = faker.random.arrayElement(terrainTypes);
      const slope = faker.random.arrayElement(slopeTypes);
      const soil = faker.random.arrayElement(soilTypes);

      // Calculate estimated budget realistically
      const [baseMin, baseMax] = baseCostPerLane[category];
      const baseCost = faker.datatype.float({ min: baseMin, max: baseMax });
      let estimatedBudget = totalLengthKm * lanes * baseCost * terrainMultipliers[terrain] * slopeMultipliers[slope];
      estimatedBudget = roundBudgetRealistically(estimatedBudget);

      const tender = await ImportedTender.create({
        source_id: faker.datatype.uuid(),
        title: `Construction de ${category === 'Autoroute' ? 'l\'Autoroute' : 'la Route'} ${category} à ${city}`,
        region: region,
        province: city,
        category: category,
        road_class: roadClass,
        total_length_km: totalLengthKm,
        road_width_m: roadWidth,
        lanes: lanes,
        terrain_type: terrain,
        soil_type: soil,
        slope: slope,
        estimated_budget_MAD: estimatedBudget,
        source_url: faker.internet.url()
      });
      tenders.push(tender);
    }
    console.log(`✅ Seeded ${tenders.length} imported tenders.`);

    // --- Seed Applications ---
    const applications = [];
    const nApplications = 200;
    const fraudRatio = 0.3;
    const nFraud = Math.floor(nApplications * fraudRatio);

    // Track which companies have applied to which tenders
    const companyTenderPairs = new Set();

    for (let i = 0; i < nApplications; i++) {
      const isFraud = i < nFraud;
      let company, tender;
      let pairKey;

      // Ensure unique company-tender pair
      do {
        company = faker.random.arrayElement(companies);
        tender = faker.random.arrayElement(tenders);
        pairKey = `${company.id}-${tender.id}`;
      } while (companyTenderPairs.has(pairKey));

      companyTenderPairs.add(pairKey);

      // Calculate offered budget based on fraud status
      let offeredBudget;
      if (isFraud) {
        if (faker.datatype.boolean()) {
          // Underbid
          offeredBudget = tender.estimated_budget_MAD * faker.datatype.float({ min: 0.5, max: 0.7 });
        } else {
          // Overbid
          offeredBudget = tender.estimated_budget_MAD * faker.datatype.float({ min: 1.3, max: 1.6 });
        }
      } else {
        // Normal bid
        offeredBudget = tender.estimated_budget_MAD * faker.datatype.float({ min: 0.9, max: 1.1 });
      }
      offeredBudget = roundBudgetRealistically(offeredBudget);

      // Calculate financial score
      const financialScore = Math.min(100, (tender.estimated_budget_MAD / offeredBudget) * 100);
      
      // Set technical score based on fraud status
      const technicalScore = isFraud 
        ? faker.datatype.float({ min: 30, max: 55, precision: 0.01 })
        : faker.datatype.float({ min: 70, max: 100, precision: 0.01 });

      // Calculate proposed duration
      const proposedDuration = Math.round(tender.total_length_km * faker.datatype.float({ min: 2, max: 6 }));

      const application = await Application.create({
        tender_id: tender.id,
        company_id: company.id,
        company_experience_years: company.experience || faker.datatype.number({ min: 1, max: 30 }),
        previous_similar_projects: company.previous_similar_projects,
        total_employees: company.total_employees,
        engineers_count: company.engineers_count,
        machinery_count: company.machinery_count,
        offered_budget_MAD: offeredBudget,
        estimated_budget_MAD: tender.estimated_budget_MAD,
        budget_difference_ratio: (offeredBudget - tender.estimated_budget_MAD) / tender.estimated_budget_MAD,
        proposed_duration_days: proposedDuration,
        total_length_km: tender.total_length_km,
        road_width_m: tender.road_width_m,
        lanes: tender.lanes,
        category: tender.category,
        road_class: tender.road_class,
        terrain_type: tender.terrain_type,
        soil_type: tender.soil_type,
        slope: tender.slope,
        compliance_issues_count: isFraud 
          ? faker.datatype.number({ min: 2, max: 3 })
          : faker.datatype.number({ min: 0, max: 1, precision: 1 }),
        technical_score: technicalScore,
        financial_score: parseFloat(financialScore.toFixed(2)),
        status: faker.random.arrayElement(['pending', 'approved', 'rejected']),
        is_fraud: isFraud
      });

      applications.push(application);
    }

    console.log(`✅ Seeded ${applications.length} applications (${nFraud} fraudulent).`);

  } catch (error) {
    console.error('❌ Seeding error:', error);
    await sequelize.close();
  }
}

module.exports = { seed };
