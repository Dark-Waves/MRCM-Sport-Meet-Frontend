import { createContext, Dispatch } from "react";
import { Socket } from "socket.io-client";

export type State = {
  status: string;
  publicDataStatus: string;
  socket: Socket | null;
  soketStatus: string;
  houseData: HouseData[] | null;
  eventData: EventData[] | null;
  memberData: MemberData[] | null;
  scoreData: ScoreData | null;
  homeData: HomeData[] | null;
};

interface ScoreData {
  scoreBoard: {
    eventName: string;
    state: string;
    eventType: {
      option: string;
    }[];
    inputType: string;
    places: {
      house: string;
      score: number;
      member: string;
      MemberID: string;
      place: number;
    }[];
  }[];
  eventTypes: {
    _id: string;
    name: string;
    options: {
      _id: string;
      option: string;
    }[];
  }[];
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

interface MemberData {
  _id: string;
  Name: string;
  House: string;
  Grade: string;
  MemberID: number;
}

interface EventData {
  _id: string;
  name: string;
  description: string;
  types: {
    _id: string;
    option: string;
    selection: string;
  }[];
  state: string;
  places: any[];
}

interface HouseData {
  _id: string;
  houseScore: number;
  members: {
    _id: string;
    admissionID: number;
  }[];
  eventData: {
    _id: string;
    eventId: string;
    participants: {
      marks: number;
      place: number;
      userAdmissionId: string;
      userName: string;
    }[];
  }[];
  Name: string;
  description: string;
}

export type Action =
  | { type: "setStatus"; payload: string }
  | { type: "setPublicDataStatus"; payload: string }
  | { type: "setSoketStatus"; payload: string }
  | { type: "setHouseData"; payload: HouseData[] }
  | { type: "setEventData"; payload: EventData[] }
  | { type: "setMemberData"; payload: MemberData[] }
  | { type: "setScoreData"; payload: ScoreData }
  | { type: "setHomeData"; payload: HomeData[] }
  | { type: "setWs"; payload: Socket };

const initialValue: State = {
  status: "loading",
  publicDataStatus: "loading",
  socket: null,
  soketStatus: "loading",
  houseData: null,
  eventData: null,
  memberData: null,
  scoreData: null,
  homeData: null,
};

const HomeContext = createContext<{
  state: State;
  dispatch: Dispatch<Action>;
}>({ state: initialValue, dispatch: () => null });

export default HomeContext;
