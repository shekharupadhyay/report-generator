import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './SurveyForm.css';

// Section definitions and their items
const sections = [
  { key: 'sensorimotor_components', label: 'Sensorimotor Components', items: ['Sensory Awareness'] },
  { key: 'sensory_processing', label: 'Sensory Processing', items: ['Tactile','Vestibular','Proprioceptive','Visual','Auditory','Gustatory','Olfactory'] },
  { key: 'neuromusculoskeletal', label: 'Neuromusculoskeletal', items: ['Reflex','Range of Motion (ROM)','Muscle Tone','Strength','Endurance','Postural Control','Postural Alignment'] },
  { key: 'cognitive', label: 'Cognitive', items: ['Level of Arousal','Attention Span','Initiation of Activity','Termination of Activity','Memory','Sequencing','Sitting Tolerance'] },
  { key: 'motor', label: 'Motor', items: ['Gross Coordination','Crossing the Midline','Bilateral Integration','Motor Control','Praxis','Fine Coordination / Dexterity','Visual-Motor Integration','Oral-Motor Control'] },
  { key: 'speech_communication', label: 'Speech & Communication', items: ['Receptive','Expressive'] },
  { key: 'psychological', label: 'Psychological', items: ['Self-regulation','Eye Contact'] },
  { key: 'social', label: 'Social', items: ['Self-Expression'] }
];

const adlFields = ['Brushing','Bathing','Grooming','Dressing','Eating','Toileting'];
const historyFields = [
  { key: 'natal', label: 'NATAL' },
  { key: 'postnatal', label: 'POSTNATAL' },
  { key: 'developmental_history', label: 'Developmental History' },
  { key: 'family_history', label: 'Family History' },
  { key: 'treatment_history', label: 'Treatment History' },
  { key: 'educational_history', label: 'Educational History' }

];

// Build initial form state
const initialForm = {
  name: '',
  date_of_birth: '',
  age_gender: '',
  primary_language: '',
  informant: '',
  date_of_evaluation: '',
  chief_complaints: '',
  prenatal: '',
  ...historyFields.reduce((acc, field) => { acc[field.key] = ''; return acc; }, {}),
  ...sections.reduce((acc, sec) => {
    sec.items.forEach(item => {
      const slug = item.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
      acc[`${sec.key}_${slug}_res`] = '';
      acc[`${sec.key}_${slug}_cmp`] = '';
    });
    return acc;
  }, {}),
  ...adlFields.reduce((acc, item) => { const slug = item.toLowerCase().replace(/[^a-z0-9]+/g, '_'); acc[slug] = ''; return acc; }, {}),
  remark: '',
  recommendations: ''
};

export default function SurveyForm() {
  const [form, setForm] = useState(initialForm);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
  'http://localhost:5000/api/survey',
  form,
  { responseType: 'blob' }
);
      const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `survey_${form.name || 'report'}.docx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert('Failed to generate document');
    }
  };

  const ratingOptions = ['Poor', 'Fair', 'Good'];

  return (
    <div className="container py-5">
      <div className="card shadow-sm survey-card mx-auto">
        <div className="card-body">
          <h1 className="h3 mb-4 text-center">OT Assessment Survey</h1>
          <form onSubmit={handleSubmit} className="survey-form">
            {/* Patient Info */}
            <div className="mb-3 form-group">
              <label>Name</label>
              <input type="text" className="form-control" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Jane Doe" required />
            </div>
            <div className="mb-3 form-group">
              <label>Date of Birth</label>
              <input type="date" className="form-control" name="date_of_birth" value={form.date_of_birth} onChange={handleChange} required />
            </div>
            <div className="mb-3 form-group">
              <label>Age/Gender</label>
              <input type="text" className="form-control" name="age_gender" value={form.age_gender} onChange={handleChange} placeholder="e.g. 30/F" required />
            </div>
            <div className="mb-3 form-group">
              <label>Primary Language</label>
              <input type="text" className="form-control" name="primary_language" value={form.primary_language} onChange={handleChange} placeholder="e.g. English" required />
            </div>
            <div className="mb-3 form-group">
              <label>Informant</label>
              <input type="text" className="form-control" name="informant" value={form.informant} onChange={handleChange} placeholder="e.g. Family Member" required />
            </div>
            <div className="mb-3 form-group">
              <label>Date of Evaluation</label>
              <input type="date" className="form-control" name="date_of_evaluation" value={form.date_of_evaluation} onChange={handleChange} required />
            </div>
            <div className="mb-3 form-group">
              <label>Chief Complaints</label>
              <textarea className="form-control" name="chief_complaints" value={form.chief_complaints} onChange={handleChange} rows="3" placeholder="Describe chief complaints" required />
            </div>
            <div className="mb-3 form-group">
              <label>PRENATAL</label>
              <textarea className="form-control" name="prenatal" value={form.prenatal} onChange={handleChange} rows="2" placeholder="Enter prenatal history" />
            </div>
            {/* Additional History Fields */}
            {historyFields.map(field => (
              <div className="mb-3 form-group" key={field.key}>
                <label>{field.label}</label>
                <textarea className="form-control" name={field.key} value={form[field.key]} onChange={handleChange} rows="2" placeholder="" />
              </div>
            ))}

            {/* Dynamic Sections */}
            {sections.map(sec => (
              <section key={sec.key} className="mb-4">
                <h5 className="fw-bold mb-3">{sec.label}</h5>
                {sec.items.map(item => {
                  const slug = item.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
                  const resName = `${sec.key}_${slug}_res`;
                  const cmpName = `${sec.key}_${slug}_cmp`;
                  return (
                    <div className="mb-3 form-group" key={resName}>
                      <label className="d-block">{item}</label>
                      <div className="btn-group mb-2" role="group">
                        {ratingOptions.map(opt => (
                          <button key={opt} type="button" className={`btn ${form[resName] === opt ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setForm(prev => ({ ...prev, [resName]: opt }))}>
                            {opt}
                          </button>
                        ))}
                      </div>
                      <textarea className="form-control" name={cmpName} value={form[cmpName]} onChange={handleChange} rows="2" placeholder="Comments" />
                    </div>
                  );
                })}
              </section>
            ))}

            {/* Activities of Daily Living */}
            <section className="mb-4">
              <h5 className="fw-bold mb-3">Activities of Daily Living</h5>
              {adlFields.map(item => {
                const slug = item.toLowerCase().replace(/[^a-z0-9]+/g, '_');
                return (
                  <div className="mb-3 form-group" key={slug}>
                    <label>{item}</label>
                    <textarea className="form-control" name={slug} value={form[slug]} onChange={handleChange} rows="2" placeholder="" />
                  </div>
                );
              })}
              <div className="mb-3 form-group">
                <label>Remark</label>
                <textarea className="form-control" name="remark" value={form.remark} onChange={handleChange} rows="3" placeholder="" />
              </div>
              <div className="mb-3 form-group">
                <label>Recommendations</label>
                <textarea className="form-control" name="recommendations" value={form.recommendations} onChange={handleChange} rows="3" placeholder="" />
              </div>
            </section>

            {/* Submit */}
            <div className="text-center">
              <button type="submit" className="btn btn-success btn-lg">
                Generate DOCX
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
