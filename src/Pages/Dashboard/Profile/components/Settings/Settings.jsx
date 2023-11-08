import Theme from "./components/Theme";
import "./Settings.css";
export default function Settings({ dashboardDispatch, themeType }) {
  return (
    <div
      className="tab-pane fade active"
      id="app-settings"
      role="tabpanel"
      aria-labelledby="app-settings-tab"
    >
      <h3 className="profile_title">Settings</h3>
      <div className="app-settings">
        <Theme dashboardDispatch={dashboardDispatch} themeType={themeType} />
      </div>
    </div>
  );
}
