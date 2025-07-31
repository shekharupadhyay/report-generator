const express = require('express');
const fs = require('fs');
const path = require('path');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');

const router = express.Router();

router.post('/', (req, res) => {
  const data = req.body;
  console.log('Received data:', data);

  try {
    // Load the DOCX template
    const templatePath = path.join(__dirname, '../templates/test_with_tags.docx');
    const content = fs.readFileSync(templatePath, 'binary');
    const zip = new PizZip(content);

    // Initialize Docxtemplater with the template
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
      nullGetter: () => ''
    });

    // Render the template with data (internal compile is automatic)
    doc.render(data);

    // Generate the updated document buffer
    const buffer = doc.getZip().generate({ type: 'nodebuffer' });

    // Ensure 'output' directory exists
    const outputDir = path.join(__dirname, '../output');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

    // Write the file and send it
    const filename = `report-${Date.now()}.docx`;
    const outputPath = path.join(outputDir, filename);
    fs.writeFileSync(outputPath, buffer);

    // Send file for download
    res.download(outputPath, filename);

  } catch (error) {
    console.error('Docxtemplater Error:', error);
    return res.status(500).send('Error generating document');
  }
});

module.exports = router;
