export const config = {
  SiteName: "MRCM SPORTS MEET",
  APIURI: "http://199.127.63.2:8080",
  Version: 2,
  // APIURI: "http://localhost:8080",
};

export const images = {
  Banner: "/assets/img/Home/Main/banner.png",
  Logo: "/assets/logo/logo.png",
  SubLogo: "/assets/img/Logo2.png",
  ProfileBannner: "/assets/img/Dashboard/Profile/ProfileBannner.jpg",
  loginBG: "/assets/img/Login/LogginBG.jpg",
};

export const icons = {};

interface Config {
  SiteName: string;
  APIURI: string;
  Version: number;
}

interface Images {
  Banner: string;
  Logo: string;
  SubLogo: string;
  ProfileBannner: string;
  loginBG: string;
}

export interface ConfigJS {
  config: Config;
  images: Images;
  icons: Record<string, never>;
}

const configJS: ConfigJS = { config, images, icons };
export default configJS;
