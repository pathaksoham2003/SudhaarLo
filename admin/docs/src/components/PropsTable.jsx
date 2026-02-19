import React from "react";

/**
 * PropsTable
 *
 * Renders a formatted table of component props.
 *
 * @param {Array} props — [{ name, type, default, required, description }]
 */
const PropsTable = ({ props = [] }) => {
  if (!props.length) return null;

  return (
    <div className="props-table-wrap">
      <table className="props-table">
        <thead>
          <tr>
            <th>Prop</th>
            <th>Type</th>
            <th>Default</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {props.map((p) => (
            <tr key={p.name}>
              <td>
                <span className="prop-name">{p.name}</span>
                {p.required && <span className="prop-required">Required</span>}
              </td>
              <td>
                <span className="prop-type">{p.type}</span>
              </td>
              <td>
                <span className="prop-default">{p.default || "—"}</span>
              </td>
              <td>{p.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/**
 * NoteBox
 *
 * Renders a callout box for tips, info, or warnings.
 *
 * @param {"info"|"tip"|"warning"} variant
 * @param {React.ReactNode}       children
 */
export const NoteBox = ({ variant = "info", children }) => {
  const icons = { info: "ℹ️", tip: "💡", warning: "⚠️" };
  return (
    <div className={`note-box ${variant}`}>
      <span className="note-icon">{icons[variant]}</span>
      <div>{children}</div>
    </div>
  );
};

export default PropsTable;
