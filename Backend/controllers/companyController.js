const { Company } = require('../models');

// ➕ Create Company
exports.createCompany = async (req, res) => {
  try {
    const company = await Company.create(req.body);
    res.status(201).json(company);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 📄 Get All Companies
exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.findAll();
    res.json(companies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔍 Get Company by ID
exports.getCompanyById = async (req, res) => {
  try {
    const company = await Company.findByPk(req.params.id);
    if (!company) return res.status(404).json({ message: 'Company not found' });
    res.json(company);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔄 Update Company
exports.updateCompany = async (req, res) => {
  try {
    const [updated] = await Company.update(req.body, {
      where: { id: req.params.id }
    });
    if (!updated) return res.status(404).json({ message: 'Company not found' });
    res.json({ message: 'Company updated' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ❌ Delete Company
exports.deleteCompany = async (req, res) => {
  try {
    const deleted = await Company.destroy({
      where: { id: req.params.id }
    });
    if (!deleted) return res.status(404).json({ message: 'Company not found' });
    res.json({ message: 'Company deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
