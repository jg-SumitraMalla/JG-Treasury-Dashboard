import ReactDOM from "react-dom/client";
import App from "./App";

// Import component library custom styles (use source SCSS during dev)
import "@apac-ui-warehouse/component-warehouse/styles.scss";
// AG Grid styles are loaded via <link> in index.html (public/ag-grid)
import React from "react";

// Initialize Datadog RUM before rendering
import { initDatadog } from "./common/config/datadog";
initDatadog();

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
