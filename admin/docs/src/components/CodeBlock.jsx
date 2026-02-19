import React, { useState, useCallback } from "react";

/**
 * CodeBlock
 *
 * Renders a styled code block with an optional label and copy button.
 *
 * @param {string} code  — source code string
 * @param {string} label — optional header label (e.g. "JSX", "Import")
 */
const CodeBlock = ({ code, label }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [code]);

  return (
    <div className="code-block-wrapper">
      {label && (
        <div className="code-block-header">
          <span className="code-block-label">{label}</span>
          <button
            className={`code-copy-btn ${copied ? "copied" : ""}`}
            onClick={handleCopy}
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      )}
      <code className="code-block">{code}</code>
    </div>
  );
};

export default CodeBlock;
