import React, { useState, useCallback } from "react";
import Sidebar from "./components/Sidebar";
import OverviewPage from "./pages/OverviewPage";
import ComponentPage from "./pages/ComponentPage";

const App = () => {
  const [activePage, setActivePage] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useCallback((pageId) => {
    setActivePage(pageId);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const renderPage = () => {
    if (activePage === "overview") {
      return <OverviewPage onNavigate={navigate} />;
    }
    return <ComponentPage pageId={activePage} />;
  };

  return (
    <div className="app">
      {/* Mobile hamburger */}
      <button
        className="mobile-toggle"
        onClick={() => setSidebarOpen((o) => !o)}
        aria-label="Toggle navigation"
      >
        {sidebarOpen ? "✕" : "☰"}
      </button>

      {/* Overlay */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? "visible" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      <Sidebar
        activePage={activePage}
        onNavigate={navigate}
        isOpen={sidebarOpen}
      />

      <main className="content-area">
        <div className="content-inner">{renderPage()}</div>
      </main>
    </div>
  );
};

export default App;
