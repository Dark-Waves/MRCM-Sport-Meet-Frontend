import { createContext, Dispatch } from "react";

interface Profile {
  userName: string;
  id: string;
  name: string;
  role: "owner" | "admin" | "staff" | string;
  editAcessRoles: any[];
}

interface NavigationLink {
  title: string;
  icon: string;
  path: string;
  url: string;
  subMenu: any[];
  _id: string;
}

export interface DashboardState {
  status: "loading" | "error" | "ready";
  navigationLinks: NavigationLink[] | null;
  navigationStatus: "loading" | "error" | "ready";
  profileStatus: "loading" | "error" | "ready";
  profile: Profile | null;
  sidebarOpen: boolean;
  wsShoketAuthenticated: boolean | null;
  socket: any;
  homeData: HomeData[] | null;
}

export type DashboardAction =
  | { type: "setStatus"; payload: "loading" | "error" | "ready" }
  | { type: "toggleSideBar" }
  | { type: "setProfile"; payload: Profile }
  | { type: "setProfileStatus"; payload: "loading" | "error" | "ready" }
  | { type: "setNavigationStatus"; payload: "loading" | "error" | "ready" }
  | { type: "setNavigationLinks"; payload: NavigationLink[] }
  | { type: "setWsAuth"; payload: boolean }
  | { type: "setHomeData"; payload: HomeData[] }
  | { type: "setWs"; payload: any };

interface DashboardContextProps extends DashboardState {
  dispatch: Dispatch<DashboardAction>;
  defaultLogo: string;
  SiteName: string;
}
interface HomeData {
  type: string;
  value: {
    dataType: "image" | "content";
    content?: string;
    image_id?: string;
    url?: string;
  };
}
export const initialState: DashboardState = {
  status: "loading",
  navigationLinks: null,
  navigationStatus: "loading",
  profileStatus: "loading",
  profile: null,
  sidebarOpen: true,
  wsShoketAuthenticated: null,
  socket: null,
  homeData: null,
};

const DashboardContext = createContext<DashboardContextProps>({
  ...initialState,
  defaultLogo: "",
  SiteName: "",
  dispatch: () => null,
});

export default DashboardContext;
