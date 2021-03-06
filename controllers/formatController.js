var Format = require('../models/format');
var Record = require('../models/record');

exports.format_list = function (req, res, next) {
  Format.find()
    .sort([['name', 'ascending']])
    .exec(function (err, list_formats) {
      if (err) {
        return next(err);
      }
      res.render('format_list', { title: 'Formats', format_list: list_formats });
    });
};

exports.format_detail = async function (req, res, next) {
  try {
    const format = await Format.findById(req.params.id);
    const formatsRecords = await Record.find({ format: req.params.id }).populate('artist label genre format condition');
    res.render('format_detail', { title: 'Format Detail', format, format_records: formatsRecords });
  } catch (err) {
    console.error(err);
  }
};
