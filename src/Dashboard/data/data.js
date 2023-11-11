import { useLinkClickHandler } from "react-router-dom";
import { iconsImgs } from "../utils/images";
import { personsImgs } from "../utils/images";

export const user = {
  role: "admin",
};

export const navigationLinks = {
  admin: [
    { id: 1, title: "Home", icon: "fa-house", url: "/Home", path: "/home" },
    {
      id: 2,
      title: "Events",
      icon: "fa-calendar",
      path: "/events/*",
      url: "/Events",
      subMenu: [
        {
          id: 1,
          title: "Event Manager",
          url: "/Events/Manager",
          icon: "fa-bars-progress",
        },
        {
          id: 2,
          title: "Event Controller",
          url: "/Events/Controller",
          icon: "fa-sliders",
        },
      ],
    },
    { id: 3, title: "Broadcast", icon: "fa-bullhorn", url: "/Broadcast" },
    {
      id: 4,
      title: "Users",
      icon: "fa-users",
      path: "/user/*",
      url: "/User",
      subMenu: [
        {
          id: 1,
          title: "User Activities",
          url: "/User/Activity",
          icon: "fa-bars-progress",
        },
        {
          id: 2,
          title: "Ban Users",
          url: "/User/Ban",
          icon: "fa-sliders",
        },
      ],
    },
    {
      id: 5,
      title: "Website",
      icon: "fa-pager",
      path: "/website/*",
      url: "/Website",
      subMenu: [
        {
          id: 1,
          title: "Website Content",
          url: "/Website/Content",
          icon: "fa-bars-progress",
        },
        {
          id: 2,
          title: "Website Settings",
          url: "/Website/Settings",
          icon: "fa-sliders",
        },
        {
          id: 3,
          title: "Website Configuration",
          url: "/Website/Configuration",
          icon: "fa-sliders",
        },
      ],
    },
    {
      id: 6,
      title: "Settings",
      icon: "fa-gear",
      path: "/settings/*",
      url: "/Settings",
    },
    {
      id: 7,
      title: "Server",
      icon: "fa-server",
      path: "/server/*",
      url: "/Server",
    },
    {
      id: 9,
      title: "Account",
      icon: "fa-user",
      path: "/account/*",
      url: "/Account",
    },
  ],
  staff: [
    { id: 1, title: "Home", icon: "fa-house", url: "/Home", path: "/home" },
    {
      id: 2,
      title: "Events",
      icon: "fa-calendar",
      path: "/events/*",
      url: "/Events",
      subMenu: [
        {
          id: 1,
          title: "Event Manager",
          url: "/Events/Manager",
          icon: "fa-bars-progress",
        },
        {
          id: 2,
          title: "Event Controller",
          url: "/Events/Controller",
          icon: "fa-sliders",
        },
      ],
    },
    { id: 3, title: "Broadcast", icon: "fa-bullhorn", url: "/Broadcast" },
  ],
};

export const AdminDetails = { id: 1, name: "Dark Waves" };

export const top_login = [
  {
    id: 11,
    name: "Sarah Parker",
    image: personsImgs.person_four,
    date: "23/12/04",
    grade: 11,
  },
  {
    id: 12,
    name: "Krisitine Carter",
    image: personsImgs.person_three,
    date: "23/07/21",
    grade: 6,
  },
  {
    id: 13,
    name: "Irene Doe",
    image: personsImgs.person_two,
    date: "23/08/25",
    grade: 8,
  },
];

export const UsageData = [
  {
    id: 14,
    month: "Jan",
    value1: 45,
    value2: null,
  },
  {
    id: 15,
    month: "Feb",
    value1: 45,
    value2: 60,
  },
  {
    id: 16,
    month: "Mar",
    value1: 45,
    value2: null,
  },
  {
    id: 17,
    month: "Apr",
    value1: 45,
    value2: null,
  },
  {
    id: 18,
    month: "May",
    value1: 45,
    value2: null,
  },
];

export const info = [
  {
    id: 1,
    title: "Total Users",
    count: 205,
  },
  {
    id: 2,
    title: "Online Users",
    count: 56,
  },
  {
    id: 3,
    title: "Total Events",
    count: 15,
  },
];

export const top_broadcast = [
  {
    id: 1,
    title: "Event Created",
    success: true,
    due_date: "12/1/2023",
  },
  {
    id: 2,
    title: "Event Deleted",
    success: false,
    due_date: "15/2/2023",
  },
  {
    id: 3,
    title: "Event Started",
    success: true,
    due_date: "14/3/2023",
  },
  // {
  //   id:
  // }
];

export const system = [
  {
    id: 1,
    type: "CPU",
    usage: "52%",
    data: [{ _id: 1, title: "No of cors", amount: "8" }],
  },
  {
    id: 2,
    type: "Memory",
    usage: "5%",
    data: [{ _id: 1, title: "Total Memory", amount: "16GB" }],
  },
  {
    id: 3,
    type: "Storange",
    usage: "5%",
    data: [{ _id: 1, title: "Total Storange", amount: "60GB" }],
  },
];

// Event data

export const events = [
  {
    id: 1,
    title: "Event 1",
    pic: "/assets/images/person_four.jpg",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos id nostrum perspiciatis dolorem error? Nostrum, blanditiis sit ipsam, dolore possimus vel quos assumenda accusantium soluta ipsum rem! Molestias, eius reiciendis.",
    started: true,
    appealUsers: [1],
  },
  {
    id: 2,
    title: "Event 2",
    pic: "/assets/images/person_four.jpg",
    description:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iure animi adipisci iusto, modi aliquam nesciunt laboriosam, dolores sint nobis quisquam nostrum molestias reiciendis? Molestias nulla fugit cumque quo quam. Facere labore vitae distinctio, nam molestias est ab ipsa illo voluptatum.",
    started: false,
    apealUsers: [1, 2],
  },
];

// User Data

export const users = [
  {
    id: 1,
    user: "Vimukthi",
    grade: 11,
    school: "MRCM",
    profilePic: "/assets/images/person_three",
    apealEvents: [5, 10, 8, 4],
    associatedEvents: [2, 9, 6, 3],
  },
  {
    id: 2,
    user: "Vimukthi",
    grade: 11,
    school: "MRCM",
    profilePic: "/assets/images/person_three",
    apealEvents: [5, 10, 8, 4],
    associatedEvents: [2, 9, 6, 3],
  },
];

// Messages

export const Broadcast = [
  {
    id: 1,
    message: "message 1",
    filter: [{ grade: [6, 7, 8] }, { events: [2, 6, 3] }, { School: "all" }],
    content:
      "Event , Event 3 ,Event 6, will be satrt after 5 minutes get ready",
  },
];

export const User = [
  {
    _id: {
      $oid: "64a43720ccb6c488e5d7a855",
    },
    userName: "AchiraAdmin",
    name: "Achira Nimnaka",
    password: "Achira@22.66.99",
    school: "MRCM",
    eventIDS: [
      "64ab99ce2567b0c84401857e",
      "64aa81a09638824234a799e2",
      "64acf17a793e1ae66463679d",
      "64ab99e42567b0c844018580",
      "64ab99de2567b0c84401857f",
      "64b2b29b0527372d27a139c5",
      "64b42ad34ca4f83c5f9366ac",
      "64b42c484ca4f83c5f9366ad",
    ],
    profilePicture: "64deea01cd7c204c7ab8df0b",
    Email: "achira8856@gmail.com",
    eventData: [
      {
        eventId: "64ab99de2567b0c84401857f",
        _id: {
          $oid: "64b93cc2503e793f1b7b579c",
        },
        uploads: [
          "64df0437cd7c204c7ab932f0",
          "64df189e2eb6969c5dd4dfa9",
          "64df9fd7674d26b24856f195",
          "64dfa055674d26b248570082",
          "64dfbac5674d26b248576d40",
        ],
      },
      {
        eventId: "64b42c484ca4f83c5f9366ad",
        uploads: [],
        _id: {
          $oid: "64b9457bb3a6f62ea70da413",
        },
      },
      {
        eventId: "64ab99ce2567b0c84401857e",
        _id: {
          $oid: "64b94a86bd486eb2ab4c6946",
        },
        uploads: [],
      },
      {
        eventId: "64aa81a09638824234a799e2",
        uploads: [],
        _id: {
          $oid: "64b94de1ff860e814d9fa3dc",
        },
      },
      {
        eventId: "64ab99e42567b0c844018580",
        uploads: ["64d9be5042bd393b0da48770"],
        _id: {
          $oid: "64b957d5c5c03ef21c5ecaf9",
        },
      },
      {
        eventId: "64acf17a793e1ae66463679d",
        uploads: ["64d9cd295d782678a6356fad", "64d9cd455d782678a63579c9"],
        _id: {
          $oid: "64bcb9318692e6e842fa83d2",
        },
      },
      {
        eventId: "64b2b29b0527372d27a139c5",
        uploads: [],
        _id: {
          $oid: "64bf3730522930db5835675c",
        },
      },
      {
        eventId: "64b42ad34ca4f83c5f9366ac",
        uploads: [],
        _id: {
          $oid: "64bf7ca598a70296c300b6e3",
        },
      },
      {
        eventId: "64b2b35e0527372d27a139c6",
        uploads: [],
        _id: {
          $oid: "64bf7d0398a70296c300e164",
        },
      },
    ],
    tokens: [
      {
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiNjRhNDM3MjBjY2I2YzQ4OGU1ZDdhODU1IiwiaWF0IjoxNjk0MDAyMzAyfQ.hSiqX4PrzIb1za5qeiqPHy1zFlmF7CKW53nyBvWITWw",
        session: {
          userAgent: {
            ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36 OPR/101.0.0.0",
            browser: {
              name: "Opera",
              version: "101.0.0.0",
              major: "101",
            },
            engine: {
              name: "Blink",
              version: "115.0.0.0",
            },
            os: {
              name: "Windows",
              version: "10",
            },
            cpu: {
              architecture: "amd64",
            },
          },
        },
        _id: {
          $oid: "64f86c7f5f4f1b24c699f2c3",
        },
        lastOnline: 1694146748520,
      },
    ],
  },
];

// // Continue repeating the structure for more events
// {
//   id: 3,
//   title: "Event 3",
//   pic: "/assets/images/person_four.jpg",
//   description:
//     "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos id nostrum perspiciatis dolorem error? Nostrum, blanditiis sit ipsam, dolore possimus vel quos assumenda accusantium soluta ipsum rem! Molestias, eius reiciendis.",
// },
// {
//   id: 4,
//   title: "Event 4",
//   pic: "/assets/images/person_four.jpg",
//   description:
//     "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iure animi adipisci iusto, modi aliquam nesciunt laboriosam, dolores sint nobis quisquam nostrum molestias reiciendis? Molestias nulla fugit cumque quo quam. Facere labore vitae distinctio, nam molestias est ab ipsa illo voluptatum.",
// },
// {
//   id: 5,
//   title: "Event 5",
//   pic: "/assets/images/person_four.jpg",
//   description:
//     "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos id nostrum perspiciatis dolorem error? Nostrum, blanditiis sit ipsam, dolore possimus vel quos assumenda accusantium soluta ipsum rem! Molestias, eius reiciendis.",
// },
// {
//   id: 6,
//   title: "Event 6",
//   pic: "/assets/images/person_four.jpg",
//   description:
//     "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iure animi adipisci iusto, modi aliquam nesciunt laboriosam, dolores sint nobis quisquam nostrum molestias reiciendis? Molestias nulla fugit cumque quo quam. Facere labore vitae distinctio, nam molestias est ab ipsa illo voluptatum.",
// },
// {
//   id: 7,
//   title: "Event 7",
//   pic: "/assets/images/person_four.jpg",
//   description:
//     "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos id nostrum perspiciatis dolorem error? Nostrum, blanditiis sit ipsam, dolore possimus vel quos assumenda accusantium soluta ipsum rem! Molestias, eius reiciendis.",
// },
// {
//   id: 8,
//   title: "Event 8",
//   pic: "/assets/images/person_four.jpg",
//   description:
//     "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iure animi adipisci iusto, modi aliquam nesciunt laboriosam, dolores sint nobis quisquam nostrum molestias reiciendis? Molestias nulla fugit cumque quo quam. Facere labore vitae distinctio, nam molestias est ab ipsa illo voluptatum.",
// },
// {
//   id: 9,
//   title: "Event 9",
//   pic: "/assets/images/person_four.jpg",
//   description:
//     "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos id nostrum perspiciatis dolorem error? Nostrum, blanditiis sit ipsam, dolore possimus vel quos assumenda accusantium soluta ipsum rem! Molestias, eius reiciendis.",
// },
// {
//   id: 10,
//   title: "Event 10",
//   pic: "/assets/images/person_four.jpg",
//   description:
//     "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iure animi adipisci iusto, modi aliquam nesciunt laboriosam, dolores sint nobis quisquam nostrum molestias reiciendis? Molestias nulla fugit cumque quo quam. Facere labore vitae distinctio, nam molestias est ab ipsa illo voluptatum.",
// },
// {
//   id: 11,
//   title: "Event 11",
//   pic: "/assets/images/person_four.jpg",
//   description:
//     "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos id nostrum perspiciatis dolorem error? Nostrum, blanditiis sit ipsam, dolore possimus vel quos assumenda accusantium soluta ipsum rem! Molestias, eius reiciendis.",
// },
// {
//   id: 12,
//   title: "Event 12",
//   pic: "/assets/images/person_four.jpg",
//   description:
//     "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iure animi adipisci iusto, modi aliquam nesciunt laboriosam, dolores sint nobis quisquam nostrum molestias reiciendis? Molestias nulla fugit cumque quo quam. Facere labore vitae distinctio, nam molestias est ab ipsa illo voluptatum.",
// },
// {
//   id: 13,
//   title: "Event 13",
//   pic: "/assets/images/person_four.jpg",
//   description:
//     "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos id nostrum perspiciatis dolorem error? Nostrum, blanditiis sit ipsam, dolore possimus vel quos assumenda accusantium soluta ipsum rem! Molestias, eius reiciendis.",
// },
// {
//   id: 14,
//   title: "Event 14",
//   pic: "/assets/images/person_four.jpg",
//   description:
//     "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iure animi adipisci iusto, modi aliquam nesciunt laboriosam, dolores sint nobis quisquam nostrum molestias reiciendis? Molestias nulla fugit cumque quo quam. Facere labore vitae distinctio, nam molestias est ab ipsa illo voluptatum.",
// },
// {
//   id: 15,
//   title: "Event 15",
//   pic: "/assets/images/person_four.jpg",
//   description:
//     "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos id nostrum perspiciatis dolorem error? Nostrum, blanditiis sit ipsam, dolore possimus vel quos assumenda accusantium soluta ipsum rem! Molestias, eius reiciendis.",
// },
// {
//   id: 16,
//   title: "Event 16",
//   pic: "/assets/images/person_four.jpg",
//   description:
//     "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iure animi adipisci iusto, modi aliquam nesciunt laboriosam, dolores sint nobis quisquam nostrum molestias reiciendis? Molestias nulla fugit cumque quo quam. Facere labore vitae distinctio, nam molestias est ab ipsa illo voluptatum.",
// },
// {
//   id: 17,
//   title: "Event 17",
//   pic: "/assets/images/person_four.jpg",
//   description:
//     "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos id nostrum perspiciatis dolorem error? Nostrum, blanditiis sit ipsam, dolore possimus vel quos assumenda accusantium soluta ipsum rem! Molestias, eius reiciendis.",
// },
// {
//   id: 18,
//   title: "Event 18",
//   pic: "/assets/images/person_four.jpg",
//   description:
//     "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iure animi adipisci iusto, modi aliquam nesciunt laboriosam, dolores sint nobis quisquam nostrum molestias reiciendis? Molestias nulla fugit cumque quo quam. Facere labore vitae distinctio, nam molestias est ab ipsa illo voluptatum.",
// },
// {
//   id: 19,
//   title: "Event 19",
//   pic: "/assets/images/person_four.jpg",
//   description:
//     "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos id nostrum perspiciatis dolorem error? Nostrum, blanditiis sit ipsam, dolore possimus vel quos assumenda accusantium soluta ipsum rem! Molestias, eius reiciendis.",
// },
// {
//   id: 20,
//   title: "Event 20",
//   pic: "/assets/images/person_four.jpg",
//   description:
//     "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iure animi adipisci iusto, modi aliquam nesciunt laboriosam, dolores sint nobis quisquam nostrum molestias reiciendis? Molestias nulla fugit cumque quo quam. Facere labore vitae distinctio, nam molestias est ab ipsa illo voluptatum.",
// },
