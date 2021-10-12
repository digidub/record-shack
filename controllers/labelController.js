var Label = require('../models/label');
var Record = require('../models/record');

exports.label_list = function (req, res, next) {
  Label.find()
    .sort([['name', 'ascending']])
    .exec(function (err, list_labels) {
      if (err) {
        return next(err);
      }
      res.render('label_list', { title: 'Label List', label_list: list_labels });
    });
};

exports.label_detail = async function (req, res, next) {
  try {
    const label = await Label.findById(req.params.id);
    const labelsRecords = await Record.find({ label: req.params.id }).populate('artist label genre format condition');
    res.render('label_detail', { title: 'Label Detail', label, label_records: labelsRecords });
  } catch (err) {
    console.error(err);
  }
};
