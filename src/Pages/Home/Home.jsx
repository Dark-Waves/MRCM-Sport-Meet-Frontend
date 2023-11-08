import "./Home.css";
import NavBar from "./components/NavBar/Navbar";
import Main from "./components/Main/Main";
import Events from "./components/Events/Events";
import ErrorPage from "./components/Error/Error";
import Prizes from "./components/Prizes/Prizes";
import Conditions from "./components/Conditions/Conditions";
import Contact from "./components/Contact/Contact";
import Footer from "./components/Footer/Footer";
import useAuth from "../../hooks/useAuth";
import { useEffect, useReducer } from "react";
import Loader from "../../loader/Loader";
import { config, images } from "../../config";
const SiteName = config.SiteName;
const initialValue = {
  status: "loading",
  theme: "light",
  themeType: localStorage.getItem("theme") || "System",
  // loading , error ,ready
};
const reducer = function (state, action) {
  switch (action.type) {
    case "setStatus": {
      return { ...state, status: action.payload };
    }
    case "setTheme": {
      return { ...state, theme: action.payload };
    }
    case "setThemeType": {
      return { ...state, themeType: action.payload };
    }
    default:
      return new Error("method not found");
  }
};

export default function Home() {
  const [state, dispatch] = useReducer(reducer, initialValue);
  const [{ authenticated, status: authStatus }, dipatchAuth] = useAuth();
  const { status, themeType, theme } = state;
  useEffect(function () {
    document.title = `${SiteName} Home`;
  }, []);
  useEffect(
    function () {
      if (!authenticated) return;
      dispatch({ type: "setStatus", payload: "ready" });
    },
    [authenticated]
  );
  useEffect(
    function () {
      if (!window.matchMedia) return;
      const system = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = function () {
        switch (themeType) {
          case "System": {
            localStorage.setItem("theme", "System");
            dispatch({
              type: "setTheme",
              payload: system.matches ? "dark" : "light",
            });
            return;
          }
          case "Light": {
            localStorage.setItem("theme", "Light");
            dispatch({ type: "setTheme", payload: "light" });
            return;
          }
          case "Dark": {
            localStorage.setItem("theme", "Dark");
            dispatch({ type: "setTheme", payload: "dark" });
            return;
          }
        }
      };
      handleChange();
      system.addEventListener("change", handleChange);
      return function () {
        system.removeEventListener("change", handleChange);
      };
    },
    [themeType]
  );
  useEffect(
    function () {
      document.body.classList = theme;
    },
    [theme]
  );

  return (
    <div className="Home root">
      {status === "loading" && <Loader />}
      {status === "error" && <ErrorPage code={400} />}
      {status === "ready" && (
        <>
          <NavBar authenticated={authenticated} />
          <main>
            <Main authenticated={authenticated} />
            <Events authenticated={authenticated} />
            <Prizes authenticated={authenticated} />
            <Conditions authenticated={authenticated} />
            <Contact authenticated={authenticated} />
            <Footer authenticated={authenticated} />
          </main>
        </>
      )}
    </div>
  );
}
