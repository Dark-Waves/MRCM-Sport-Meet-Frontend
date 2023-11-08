import { useEffect, useLayoutEffect, useState } from "react";

export default function Changes({
  changedElements,
  dispatch,
  profileDashboard,
  customFunction,
}) {
  const [isUpdating, setUpdating] = useState(false);

  useEffect(function () {
    const element = document.querySelector(`#update-changes-profile`);
    element.classList.add("popdown-animation-start");
  }, []);

  useEffect(
    function () {
      const element = document.querySelector(`#update-changes-profile`);
      if (Object.keys(changedElements).length !== 0) {
        element.classList.add("popup-animation");
        element.classList.remove("popdown-animation");
        element.classList.remove("popdown-animation-start");
      }
      /**In here we check if its the start or not */
      if (
        Object.keys(changedElements).length === 0 &&
        !element.classList.contains("popdown-animation-start")
      ) {
        element.classList.remove("popup-animation");

        element.classList.add("popdown-animation");
      }
    },
    [changedElements]
  );
  const onReset = function () {
    if (isUpdating) return;
    if (Object.keys(changedElements).length === 0) return;
    dispatch({ type: "setProfile", payload: profileDashboard });
  };
  const onSubmit = async function () {
    if (isUpdating) return;
    if (Object.keys(changedElements).length === 0) return;
    setUpdating(true);
    await customFunction(changedElements);
    setUpdating(false);
  };
  return (
    <div className="update" id="update-changes-profile">
      <span className="message">Careful - You have unsaved Changes</span>
      <div className="changed-buttons">
        <button onClick={onReset}>Reset</button>
        <button onClick={onSubmit} className={isUpdating ? "loading" : ""}>
          Save
        </button>
      </div>
    </div>
  );
}
