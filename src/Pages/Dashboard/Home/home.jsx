import { HomerData } from "../../../data/data";
import "./Home.css";

const Home = () => {
  return (
    <div className="dash-content content home-content active" id="home">
      <div className="overview">
        <div className="title">
          <i className="uil uil-tachometer-fast-alt" />
          <span className="text">Dashboard</span>
        </div>
        <div className="boxes">
          {HomerData.map((data) => (
            <div key={data.id} className={`box box${data.id}`}>
              <i className="uil uil-thumbs-up" />
              <span className="text">{data.title}</span>
              <span className="number">{data.content}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
