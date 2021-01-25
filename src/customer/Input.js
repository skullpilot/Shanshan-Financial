import React from "react";

export default function Input({ title, value = "", onChange, placeholder, error, helperText }) {
  const inputClass = error ? "w-64 h-12 pl-4 border border-red-500 rounded" : "w-64 h-12 pl-4 border rounded"
  return (
    <div className="flex flex-col items-start">
      <label className="mt-4 text-xs">{title}</label>
      <input
        className={inputClass}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {error ?  <label className="mt-2 text-xs text-red-500">{helperText}</label> : null}
    </div>
  );
}
