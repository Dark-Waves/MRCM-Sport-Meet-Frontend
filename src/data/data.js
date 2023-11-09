export const HomerData = [
  { id: 1, title: "Events", content: "12", icon: "fa-calender" },
  { id: 2, title: "Students", content: "702", icon: "fa-users-rectangle " },
  { id: 3, title: "Schools", content: "9", icon: "fa-school" },
];

export const navLinks = [
  {
    topNav: [
      {
        id: 1,
        title: "Dashboard",
        url: "home",
        icon: "fa-house",
      },
      {
        id: 2,
        title: "Competitions",
        url: "competitions",
        icon: "fa-book",
        submenu: [
          {
            id: 1,
            title: "Live",
            url: "competitions/live",
            icon: "fa-bezier-curve",
          },
          {
            id: 2,
            title: "Associated",
            url: "competitions/associated",
            icon: "fa-link",
          },
        ],
      },
      {
        id: 3,
        title: "Calendar",
        url: "calendar",
        icon: "fa-calendar",
      },
      {
        id: 4,
        title: "Share",
        url: "/login",
        icon: "fa-share-from-square",
      },
    ],
    bottomNav: [
      {
        id: 1,
        title: "Profile",
        url: "profile",
        icon: "fa-user",
        submenu: [
          {
            id: 2,
            title: "Devices",
            url: "profile/devices",
            icon: "fa-laptop",
          },
          {
            id: 3,
            title: "Password",
            url: "profile/password",
            icon: "fa-lock",
          },
          {
            id: 4,
            title: "Settings",
            url: "profile/settings",
            icon: "fa-gear",
          },
        ],
      },
      {
        id: 2,
        title: "Log out",
        url: "../logout",
        icon: "fa-right-from-bracket",
      },
    ],
  },
];

export const profileLinks = [
  {
    id: 1,
    title: "Profile",
    url: "profile",
    icon: "fa-user",
  },
  {
    id: 2,
    title: "Password",
    url: "profile/password",
    icon: "fa-lock",
  },
  {
    id: 3,
    title: "Settings",
    url: "profile/settings",
    icon: "fa-gear",
  },
  {
    id: 4,
    title: "Log out",
    url: "../logout",
    icon: "fa-right-from-bracket",
  },
];

export const paths = {
  path: "admin",
  adminPaths: [{ path: "home", element: "Home" }],
};
