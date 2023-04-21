import SideNav from "./components/SideNav";
import Dashboard from "./components/Dashboard";
import "./css/app.css";

function App() {
  return (
    <body>
      <SideNav />
      <div className="container bg-defaultBackgroundColor">
        <div className="row child1">
          <h1>React TypeScript Starter</h1>
          <br />
          <Dashboard />
          <p>here is somthing new</p>
        </div>
        {/* end main container */}
      </div>
    </body>
  );
}

export default App;
