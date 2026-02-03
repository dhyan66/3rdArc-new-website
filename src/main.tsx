import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { setupPerformanceMonitoring } from "./lib/performance";
import { initializeScrollOptimizations } from "./lib/scrollPerformance";

// Start performance monitoring
setupPerformanceMonitoring();

// Initialize scroll optimizations
initializeScrollOptimizations();

createRoot(document.getElementById("root")!).render(<App />);
