// AuthCheck.js
import { useEffect, useReducer } from "react";

import axios from "axios";
import Cookies from "js-cookie";
import { config } from "../../config";
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
          const token = Cookies.get("token");
          if (!token) {
            dispatch({ type: "setStatus", payload: "error" });
            return;
          }

          await axios.get(`${config.APIURI}/api/v${config.Version}/user/@me`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          dispatch({ type: "setStatus", payload: "ready" });
          dispatch({ type: "setAuthenticated", payload: true });
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
