from docx import Document
from docx.shared import Inches, Pt
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

doc = Document("report-template.docx")

for table in doc.tables:
    table.style = 'Table Grid'
    # Shade header row
    for cell in table.rows[0].cells:
        tc = cell._tc
        shading = OxmlElement('w:shd')
        shading.set(qn('w:fill'), 'D9D9D9')  # light grey
        tc.get_or_add_tcPr().append(shading)
    # Set column widths
    widths = [Inches(0.5), Inches(2.5), Inches(2.0), Inches(2.5)]
    for col, width in zip(table.columns, widths):
        for cell in col.cells:
            cell.width = width

doc.save("report-template-formatted.docx")
