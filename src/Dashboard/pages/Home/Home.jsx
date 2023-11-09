import "./Home.css";
import Intro from "./Intro/Intro";
import Top_login from "./Top_login/Top_login";
import Report from "./Usage/Usage";
import Info from "./Info/Info";
import Broadcast from "./Broadcast/Broadcast";
import System from "./System/System";
import Loans from "./Loans/Loans";
import Financial from "./Financial/Financial";

const Home = () => {
  return (
    <div className="main-content-holder">
      <div className="content-grid-one">
        <Intro />
        <Top_login />
        <Report />
      </div>
      <div className="content-grid-two">
        <Info />
        <div className="grid-two-item">
          <div className="subgrid-two">
            <Broadcast />
            <Financial />
          </div>
        </div>

        <div className="grid-two-item">
          <div className="subgrid-two">
            <System />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
