import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./favicon";

// Add meta tags dynamically for SEO
document.title = "PriorityParcel - Betrouwbare transportdiensten en internationale bezorging";

// Render the app
createRoot(document.getElementById("root")!).render(<App />);
