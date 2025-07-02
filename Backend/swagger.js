const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Public Roads Fraud Detection API',
      version: '1.0.0',
      description: 'Detect fraud in public road proposals using AI',
    },

    // ✅ Global JWT Security Definition
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        PredictionInput: {
          type: 'object',
          properties: {
            company_experience_years: { type: 'integer' },
            previous_similar_projects: { type: 'integer' },
            total_employees: { type: 'integer' },
            engineers_count: { type: 'integer' },
            machinery_count: { type: 'integer' },
            offered_budget_MAD: { type: 'integer' },
            estimated_budget_MAD: { type: 'integer' },
            budget_difference_ratio: { type: 'number' },
            proposed_duration_days: { type: 'integer' },
            total_length_km: { type: 'integer' },
            road_width_m: { type: 'integer' },
            lanes: { type: 'integer' },
            category: {
              type: 'string',
              enum: ['Autoroute', 'National', 'Regional', 'Provincial']
            },
            road_class: {
              type: 'string',
              enum: ['Primary', 'Secondary']
            },
            terrain_type: { type: 'string' },
            soil_type: { type: 'string' },
            slope: { type: 'string' },
            compliance_issues_count: { type: 'integer' },
            technical_score: { type: 'number' },
            financial_score: { type: 'number' }
          },
          required: [
            "company_experience_years", "previous_similar_projects", "total_employees",
            "engineers_count", "machinery_count", "offered_budget_MAD", "estimated_budget_MAD",
            "budget_difference_ratio", "proposed_duration_days", "total_length_km", "road_width_m",
            "lanes", "category", "road_class", "terrain_type", "soil_type", "slope",
            "compliance_issues_count", "technical_score", "financial_score"
          ]
        }
      }
    },

    // ✅ Apply bearerAuth to all routes by default
    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  apis: ['./routes/*.js'], // Swagger will parse these files for docs
};

module.exports = swaggerJSDoc(options);
 