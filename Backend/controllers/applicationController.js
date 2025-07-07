const { Application, Company, ImportedTender, Prediction } = require('../models');

exports.createApplication = async (req, res) => {
  try {
    const app = await Application.create(req.body);
    res.status(201).json(app);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const groupByTenderId = (apps) => {
  const grouped = {};

  for (const app of apps) {
    const tenderId = app.tender_id;

    if (!grouped[tenderId]) {
      grouped[tenderId] = {
        tender_id: tenderId,
        tender_info: app.ImportedTender, // same for all apps with same tender_id
        applications: []
      };
    }

    grouped[tenderId].applications.push(app);
  }

  return Object.values(grouped);
};

exports.getAllApplications = async (req, res) => {
  try {
    const apps = await Application.findAll({
      include: [
        {
          model: Company,
          attributes: ['id', 'name']
        },
        {
          model: ImportedTender, // this should be properly associated
          attributes: ['region', 'province', 'category','total_length_km','road_width_m','lanes','road_class','terrain_type','soil_type','slope']
        },
        {
          model:Prediction,
          attributes: ['result']
        }
      ]
    });

    const grouped = groupByTenderId(apps);

    res.json(grouped);
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
