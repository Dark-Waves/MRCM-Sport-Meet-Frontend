import { useContext, useEffect, useState } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import Content from "./Routes/Routes";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function Dashboard() {
  const { isLoggedIn, setUserRole, isLoading, setIsLoading } =
    useContext(AuthContext);
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      navigate("/auth");
      return;
    }

    const findUser = async () => {
      setIsLoading(true); // Set loading to true at the start of the request
      try {
        const response = await axios.get(
          "http://localhost:8080/api/v1/user/@me",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.status === 200 && response.data.message === "ok") {
          console.log(response.data.userData);
          // setRole("staff");
          const role = "staff";
          setUserRole(role);
          if (!(role === "staff" || role === "admin" || role === "owner")) {
            navigate("/error", {
              state: {
                error: {
                  code: "Permission_Error",
                  message: "You Don't have access to dashboard",
                },
              },
            });
          }
          setReady(true);
        } else {
          // Handle non-200 responses
          console.error("Error: Unexpected response from the server");
          setReady(false);
          navigate("/error", {
            state: {
              error: {
                code: "API_ERROR",
                message: "Failed to fetch user data.",
              },
            },
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate("/error", {
          state: {
            error: {
              code: "400",
              message: "API_ERROR : Failed to fetch user data.",
            },
          },
        });
      } finally {
        setIsLoading(false); // Set loading to false after processing the response or catching an error
      }
    };

    if (isLoggedIn) {
      findUser();
    }
  }, [isLoggedIn, navigate, setUserRole, setIsLoading, setReady]);

  if (isLoading) {
    return <div>Loading...</div>; // Simple loading text, replace with your loader component if needed
  }

  return (
    <>
      {!isLoading && ready && (
        <>
          <Sidebar />
          <Content />
        </>
      )}
    </>
  );
}
