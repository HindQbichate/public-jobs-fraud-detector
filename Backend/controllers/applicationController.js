const { Application } = require('../models');

exports.createApplication = async (req, res) => {
  try {
    const app = await Application.create(req.body);
    res.status(201).json(app);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllApplications = async (req, res) => {
  try {
    const apps = await Application.findAll();
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getApplicationById = async (req, res) => {
  try {
    const app = await Application.findByPk(req.params.id);
    if (!app) return res.status(404).json({ message: 'Application not found' });
    res.json(app);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateApplication = async (req, res) => {
  try {
    const [updated] = await Application.update(req.body, {
      where: { id: req.params.id }
    });
    if (!updated) return res.status(404).json({ message: 'Application not found' });
    res.json({ message: 'Application updated' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteApplication = async (req, res) => {
  try {
    const deleted = await Application.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: 'Application not found' });
    res.json({ message: 'Application deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
