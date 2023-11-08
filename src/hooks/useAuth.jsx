// AuthCheck.js
import { useEffect, useReducer } from "react";

import axios from "axios";

import { config } from "../config";
const initialValue = {
  status: "loading",
  // loading , error ,ready
  authenticated: null,
};
const reducer = function (state, action) {
  switch (action.type) {
    case "setStatus": {
      return { ...state, status: action.payload };
    }
    case "setAuthenticated": {
      return { ...state, authenticated: action.payload };
    }
    default:
      return new Error("method not found");
  }
};

export default function useAuth() {
  const [state, dispatch] = useReducer(reducer, initialValue);
  const { status } = state;
  useEffect(
    function () {
      const checkLoginStatus = async () => {
        if (status !== "loading") return;
        try {
          const { data } = await axios.post(`/api/common/checkLogin`, {});
          dispatch({ type: "setStatus", payload: "ready" });
          if (data.error)
            dispatch({ type: "setAuthenticated", payload: false });
          else dispatch({ type: "setAuthenticated", payload: true });
        } catch (error) {
          dispatch({ type: "setStatus", payload: "error" });
        }
      };

      checkLoginStatus();
    },
    [status]
  );

  return [state, dispatch];
}
