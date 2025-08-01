import React from 'react';

export default function TextAreaField({
  label,
  name,
  value,
  onChange,
  rows = 2,
  placeholder
}) {
  return (
    <div className="mb-3">
      <label className="form-label">{label}</label>
      <textarea
        className="form-control"
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder}
      />
    </div>
  );
}
