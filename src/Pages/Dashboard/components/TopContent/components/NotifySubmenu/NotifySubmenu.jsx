import { useEffect, useReducer } from "react";
import "./NotifySubmenu.css";

const initialValue = {
  filter: "unread",
  //  none ,loading , ready ,error
};
const reducer = function (state, action) {
  switch (action.type) {
    case "setFilter": {
      return { ...state, filter: action.payload };
    }
    default:
      return new Error("method not found");
  }
};
export default function NotifySubmenu({ stateNav, dispatchNav }) {
  const [state, dispatch] = useReducer(reducer, initialValue);
  const { filter } = state;
  const { notifications, status } = stateNav;

  useEffect(
    function () {
      const notificationsContainer = document.querySelector(
        "#subMenuNotify .notifications"
      );
      const handlerRead = function () {
        if (filter !== "unread") return;
        const scrollPosition = notificationsContainer.scrollTop;
        const containerHeight = notificationsContainer.clientHeight;
        const childElements = notificationsContainer.children;

        const containerTop = notificationsContainer.offsetTop;
        const containerBottom = containerTop + containerHeight;

        for (const element of childElements) {
          const elementTop = element.offsetTop;
          const elementBottom = elementTop + element.clientHeight;
          if (
            containerTop <= elementTop &&
            containerBottom >= Math.floor(elementBottom - scrollPosition)
          ) {
            dispatchNav({
              type: "addReadNotification",
              payload: element.getAttribute("uid"),
            });
          }
        }
      };
      notificationsContainer.scroll({ top: 0, behavior: "instant" });
      handlerRead();
      notificationsContainer.addEventListener("scroll", handlerRead);
      return function () {
        notificationsContainer.removeEventListener("scroll", handlerRead);
      };
    },
    [filter, dispatchNav]
  );
  return (
    <div className="notify-submenu-wrap" id="subMenuNotify">
      <div className="submenu">
        <div className="selection">
          <div
            className={`all ${filter === "all" ? "active" : ""}`}
            onClick={() => dispatch({ type: "setFilter", payload: "all" })}
          >
            <i className="fa-regular fa-circle-check"></i>
            <span>All</span>
          </div>
          <div
            className={`unread ${filter === "unread" ? "active" : ""}`}
            onClick={() => dispatch({ type: "setFilter", payload: "unread" })}
          >
            <i className="fa-regular fa-circle-question"></i>
            <span>UnRead</span>
          </div>
        </div>
        <div className="notifications">
          {/* Render notifications based on the selected filter */}
          {status === "loading" && (
            <>
              <p>Loading...</p>
            </>
          )}
          {status === "error" && (
            <>
              <p>Faild when fetching notifications</p>
            </>
          )}
          {status === "ready" && notifications && (
            <>
              {notifications[filter] ? (
                notifications[filter].map((notification) => (
                  <div key={notification._id} uid={notification._id}>
                    <p>{notification.message}</p>
                    <p>{notification.timestamp}</p>
                    {/* You can add more content here */}
                  </div>
                ))
              ) : (
                <p>No notifications available for this filter.</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
