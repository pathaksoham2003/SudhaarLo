import React from "react";
import CodeBlock from "../components/CodeBlock";
import PropsTable, { NoteBox } from "../components/PropsTable";
import { componentDocs } from "../data/componentData";

/**
 * ComponentPage
 *
 * Generic page that renders documentation for any component
 * by looking up its data from componentDocs using the pageId.
 */
const ComponentPage = ({ pageId }) => {
  const doc = componentDocs[pageId];

  if (!doc) {
    return (
      <div>
        <h1 className="page-title">Component Not Found</h1>
        <p className="doc-text">
          No documentation exists for <code>{pageId}</code>.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Badge */}
      {doc.badge && (
        <span className={`component-badge ${doc.badge}`}>
          {doc.badge}
        </span>
      )}

      {/* Title & description */}
      <h1 className="page-title">{doc.name}</h1>
      <p className="page-subtitle">{doc.description}</p>

      {/* Import */}
      <div className="section">
        <h2 className="section-title">Import</h2>
        <CodeBlock code={doc.importCode} label="Import" />
      </div>

      {/* Props */}
      {doc.props && doc.props.length > 0 && (
        <div className="section">
          <h2 className="section-title">Props</h2>
          <PropsTable props={doc.props} />
        </div>
      )}

      {/* Extra tables (e.g. responsive breakpoints) */}
      {doc.extras &&
        doc.extras.map((extra, idx) => (
          <div className="section" key={idx}>
            {extra.title && <h2 className="section-title">{extra.title}</h2>}
            {extra.type === "table" && (
              <div className="responsive-table">
                <table>
                  <thead>
                    <tr>
                      {extra.headers.map((h) => (
                        <th key={h}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {extra.rows.map((row, ri) => (
                      <tr key={ri}>
                        {row.map((cell, ci) => (
                          <td key={ci}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}

      {/* Examples */}
      {doc.examples && doc.examples.length > 0 && (
        <div className="section">
          <h2 className="section-title">Examples</h2>
          {doc.examples.map((ex, idx) => (
            <div key={idx} style={{ marginBottom: 28 }}>
              {ex.title && <h3 className="subsection-title">{ex.title}</h3>}
              <CodeBlock code={ex.code} label="JSX" />
            </div>
          ))}
        </div>
      )}

      {/* Notes */}
      {doc.notes && doc.notes.length > 0 && (
        <div className="section">
          <h2 className="section-title">Notes</h2>
          <ul className="feature-list">
            {doc.notes.map((note, idx) => (
              <li key={idx}>{note}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Interaction flow for filter chips */}
      {pageId === "filter-chips" && (
        <div className="section">
          <h2 className="section-title">Interaction Flow</h2>
          <NoteBox variant="tip">
            <strong>Select:</strong> User clicks a bar / slice / row in a tile
            → <code>onLabelSelectedChanged</code> fires → page updates items
            state → chip appears → table data filters.
          </NoteBox>
          <NoteBox variant="tip">
            <strong>Unselect one:</strong> User clicks chip delete icon →{" "}
            <code>onUnselectLabel</code> fires → page resets that item's
            selected → chip disappears → table re-expands.
          </NoteBox>
          <NoteBox variant="tip">
            <strong>Clear all:</strong> User clicks "Clear all" →{" "}
            <code>onUnselectAllLabels</code> fires → all items reset → all
            chips disappear → table shows full data.
          </NoteBox>
        </div>
      )}

      {/* Carousel-specific info */}
      {pageId === "carousel" && (
        <div className="section">
          <NoteBox variant="info">
            After <strong>5 tiles</strong> on desktop (2 on tablet, 1 on
            mobile), the carousel activates pagination. Add as many tiles as
            needed for your dashboard.
          </NoteBox>
        </div>
      )}

      {/* Multi-tile specific info */}
      {pageId === "multi-tile" && (
        <div className="section">
          <NoteBox variant="info">
            <strong>Tip:</strong> Treat each child tile exactly as you would a
            standalone tile. Give it all regular props (title, items,
            onLabelSelectedChanged). The multi-tile simply wraps them in a
            tabbed interface.
          </NoteBox>
        </div>
      )}
    </>
  );
};

export default ComponentPage;
