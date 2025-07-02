const faker = require('faker');
const {
  sequelize,
  User,
  Company,
  ImportedTender,
  Application
} = require('./models');

async function seed() {
  try {
    await sequelize.sync({ force: true }); // WARNING: Wipes all data

    // --- Seed Users ---
    const users = [];
    for (let i = 0; i < 5; i++) {
      const user = await User.create({
        fullName: faker.name.findName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: 'contractor'
      });
      users.push(user);
    }
    console.log(`✅ Seeded ${users.length} users.`);

    // --- Seed Companies ---
    const companies = [];
    for (let i = 0; i < 10; i++) {
      const company = await Company.create({
        name: faker.company.companyName(),
        foundation_date: faker.date.past(20),
        previous_similar_projects: faker.datatype.number({ min: 0, max: 20 }),
        total_employees: faker.datatype.number({ min: 5, max: 300 }),
        engineers_count: faker.datatype.number({ min: 1, max: 50 }),
        machinery_count: faker.datatype.number({ min: 1, max: 100 }),
        compliance_issues_count: faker.datatype.number({ min: 0, max: 10 }),
      });
      companies.push(company);
    }
    console.log(`✅ Seeded ${companies.length} companies.`);

    // --- Seed Imported Tenders ---

    // --- Seed Imported Tenders ---
    const tenderCategories = ['Autoroute', 'National', 'Regional', 'Provincial'];
    const roadClasses = ['Primary', 'Secondary'];
    const terrainTypes = ['Flat', 'Mixed', 'Coastal', 'Mountainous', 'Desert'];
    const soilTypes = ['Sandy', 'Clay', 'Rocky'];
    const slopeTypes = ['High', 'Moderate', 'Low'];
    const tenders = [];

    for (let i = 0; i < 20; i++) {
      const tender = await ImportedTender.create({
        source_id: faker.datatype.uuid(),
        title: faker.company.catchPhrase(),
        region: faker.address.state(),
        province: faker.address.county(),
        category: faker.random.arrayElement(tenderCategories),
        road_class: faker.random.arrayElement(roadClasses),
        total_length_km: faker.datatype.number({ min: 5, max: 100 }),
        road_width_m: faker.datatype.number({ min: 5, max: 20 }),
        lanes: faker.datatype.number({ min: 1, max: 4 }),
        terrain_type: faker.random.arrayElement(terrainTypes),
        soil_type: faker.random.arrayElement(soilTypes),
        slope: faker.random.arrayElement(slopeTypes),
        estimated_budget_MAD: faker.datatype.number({ min: 1_000_000, max: 50_000_000 }),
        source_url: faker.internet.url()
      });
      tenders.push(tender);
    }

    console.log(`✅ Seeded ${tenders.length} imported tenders.`);




    // --- Seed Applications ---
    const statuses = ['pending', 'approved', 'rejected'];
    const applications = [];

    for (let i = 0; i < 40; i++) {
      const company = faker.random.arrayElement(companies);
      const tender = faker.random.arrayElement(tenders);
      const offered = faker.datatype.number({ min: 1_000_000, max: 60_000_000 });
      const estimated = tender.estimated_budget_MAD;
      const diff = ((offered - estimated) / estimated).toFixed(3);

      const application = await Application.create({
        tender_id: tender.id,
        company_id: company.id,
        company_experience_years: faker.datatype.number({ min: 1, max: 30 }),
        previous_similar_projects: company.previous_similar_projects,
        total_employees: company.total_employees,
        engineers_count: company.engineers_count,
        machinery_count: company.machinery_count,
        offered_budget_MAD: offered,
        estimated_budget_MAD: estimated,
        budget_difference_ratio: parseFloat(diff),
        proposed_duration_days: faker.datatype.number({ min: 30, max: 360 }),

        total_length_km: tender.total_length_km,
        road_width_m: tender.road_width_m,
        lanes: tender.lanes,
        category: tender.category,
        road_class: tender.road_class,
        terrain_type: tender.terrain_type,
        soil_type: tender.soil_type,
        slope: tender.slope,

        compliance_issues_count: company.compliance_issues_count,
        technical_score: parseFloat(faker.datatype.float({ min: 50, max: 100 }).toFixed(2)),
        financial_score: parseFloat(faker.datatype.float({ min: 50, max: 100 }).toFixed(2)),
        status: faker.random.arrayElement(statuses),
        is_fraud: null,
      });

      applications.push(application);
    }

    console.log(`✅ Seeded ${applications.length} applications.`);

    await sequelize.close();
    console.log('🌱 Seeding complete. Database connection closed.');
  } catch (error) {
    console.error('❌ Seeding error:', error);
    await sequelize.close();
  }
}

seed();
