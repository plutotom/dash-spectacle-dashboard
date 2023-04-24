import SideNav from "./components/SideNav";
import Dashboard from "./components/Dashboard";
import "./styles/app.css";

function App() {
  return (
    <body>
      <div className="main-container">
        {/* <SideNav /> */}
        <Dashboard />
      </div>
    </body>
  );
}

export default App;
