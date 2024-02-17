import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { SidebarProvider } from "./Dashboard/context/sidebarContext.tsx";
import { BrowserRouter as Router } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <SidebarProvider>
    <Router>
      <App />
    </Router>
  </SidebarProvider>
);
