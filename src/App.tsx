import SideNav from "./components/SideNav";
import Dashboard from "./components/Dashboard";
import "./styles/app.css";
import cupule from "./assets/looking-together.jpg";
function App() {
  return (
    <body>
      <div className="main-container">
        {/* <SideNav /> */}
        {/* <Dashboard /> */}
        <div
          className="imageFull"
          style={{ backgroundImage: `url(${cupule})` }}
        ></div>
      </div>
    </body>
  );
}

export default App;
