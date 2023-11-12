import Header from "./Common/Header/Header";
import Footer from "./Common/Footer/Footer";
import "./Home.css";
import { Route, Routes } from "react-router-dom";
import Main from "./Main/Main";
import Live from "./Live/Live";
import Events from "./Events/Events";
import Houses from "./Houses/Houses";
import ErrorPage from "../Error/Error";

export default function Home() {
  return (
    <div className="flex-col landing-page">
      <Header />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/live" element={<Live />} />
        <Route path="/events" element={<Events />} />
        <Route path="/houses" element={<Houses />} />
        <Route path={"*"} element={<ErrorPage />} />
      </Routes>
      <Footer />
    </div>
  );
}
