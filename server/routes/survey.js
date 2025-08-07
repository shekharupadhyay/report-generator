// routes/survey.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');

const router = express.Router();

router.post('/', (req, res) => {
  const data = req.body;

  try {
    // 1) Load .docx template
    const templatePath = path.join(__dirname, '../templates/report-template.docx');
    const content = fs.readFileSync(templatePath, 'binary');
    const zip = new PizZip(content);

    // 2) Create Docxtemplater instance
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
      nullGetter: () => ''
    });

    // 3) Render with incoming JSON
    doc.render(data);

    // 4) Generate a nodebuffer
    const buffer = doc.getZip().generate({ type: 'nodebuffer' });

    // 5) Set response headers so browser downloads it
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': `attachment; filename="report-${Date.now()}.docx"`,
      'Content-Length': buffer.length
    });

    // 6) Send the buffer directly
    return res.send(buffer);

  } catch (error) {
    console.error('Docxtemplater error:', error);
    return res.status(500).send('Error generating document');
  }
});

module.exports = router;
