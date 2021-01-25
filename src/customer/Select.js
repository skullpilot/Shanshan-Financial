import React from "react";

export default function Select({ title, children, value="", onChange, error, helperText }) {
  const inputClass = error ? "w-64 h-12 pl-4 border border-red-500 rounded text-center" : "w-64 h-12 pl-4 border rounded text-center"
  return (
    <div className="flex flex-col items-start">
      <label className="mt-4 text-xs">{title}</label>
      <select
        className={inputClass}
        value={value}
        onChange={onChange}
        required
      >
        {children}
      </select>
      {error ?  <label className="mt-2 text-xs text-red-500">{helperText}</label> : null}
    </div>
  );
}
