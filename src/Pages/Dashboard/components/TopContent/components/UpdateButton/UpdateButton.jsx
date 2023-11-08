export default function UpdateButton() {
  const handleClick = function () {
    if (!window.electron) return;
    window.electronAPI.installUpdates();
  };
  return (
    <button className={"update-client-button"} onClick={handleClick}>
      Update
    </button>
  );
}
