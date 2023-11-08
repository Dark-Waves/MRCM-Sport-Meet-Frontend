import "./InnerUpdatesLoader.css";

export default function InnerUpdatesLoader() {
  return (
    <div id="loader-inner" className="loader-inner display-none">
      <div className="box">
        <div className="spinner">
          <div className="rect1"></div>
          <div className="rect2"></div>
          <div className="rect3"></div>
          <div className="rect4"></div>
          <div className="rect5"></div>
        </div>
      </div>
    </div>
  );
}
