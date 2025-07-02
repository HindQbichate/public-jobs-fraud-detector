const { ImportedTender } = require('../models');

exports.createTender = async (req, res) => {
  try {
    const tender = await ImportedTender.create(req.body);
    res.status(201).json(tender);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllTenders = async (req, res) => {
  try {
    const tenders = await ImportedTender.findAll();
    res.json(tenders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTenderById = async (req, res) => {
  try {
    const tender = await ImportedTender.findByPk(req.params.id);
    if (!tender) return res.status(404).json({ message: 'Tender not found' });
    res.json(tender);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateTender = async (req, res) => {
  try {
    const [updated] = await ImportedTender.update(req.body, {
      where: { id: req.params.id }
    });
    if (!updated) return res.status(404).json({ message: 'Tender not found' });
    res.json({ message: 'Tender updated' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteTender = async (req, res) => {
  try {
    const deleted = await ImportedTender.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: 'Tender not found' });
    res.json({ message: 'Tender deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
