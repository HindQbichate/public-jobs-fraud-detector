// Fields expected by the ML model
const MODEL_FEATURES = [
  'company_experience_years',
  'previous_similar_projects',
  'total_employees',
  'engineers_count',
  'machinery_count',
  'offered_budget_MAD',
  'estimated_budget_MAD',
  'budget_difference_ratio',
  'proposed_duration_days',
  'total_length_km',
  'road_width_m',
  'lanes',
  'category',
  'road_class',
  'terrain_type',
  'soil_type',
  'slope',
  'compliance_issues_count',
  'technical_score',
  'financial_score'
];

function sanitizeForModel(input) {
  const output = {};
  for (const key of MODEL_FEATURES) {
    output[key] = input[key];
  }
  return output;
}

module.exports = {
  sanitizeForModel
};
