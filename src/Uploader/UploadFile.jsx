import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useEffect, useRef } from "react";

export default function UploadFile({
  file,
  customFunction,
  onChangeF,
  onRemoveF,
}) {
  const onRemoveRef = useRef(null);
  const onChangeRef = useRef(null);
  const customFunctionRef = useRef(null);
  useEffect(
    function () {
      customFunctionRef.current = customFunction;
    },
    [customFunction]
  );
  useEffect(
    function () {
      onChangeRef.current = onChangeF;
    },
    [onChangeF]
  );
  useEffect(
    function () {
      onRemoveRef.current = onRemoveF;
    },
    [onRemoveF]
  );

  const onRemove = useCallback(
    function () {
      onRemoveRef.current(file);
    },
    [file]
  );
  const onCancle = useCallback(
    function () {
      if (file.status !== "loading") return;
      file.status = "cancelled";
      onChangeRef.current && onChangeRef.current(file);
    },
    [file]
  );
  const onSucess = useCallback(
    function (serverResponse) {
      file.status = "done";
      file.serverResponse = serverResponse;
      onChangeRef.current && onChangeRef.current(file);
    },
    [file]
  );
  const onError = useCallback(
    function (errorName) {
      file.status = "error";
      file.errorName = errorName;
      onChangeRef.current && onChangeRef.current(file);
    },
    [file]
  );
  const onProgress = useCallback(
    function (progress) {
      if (file.status !== "loading") return;
      file.progress = progress;
      onChangeRef.current && onChangeRef.current(file);
    },
    [file]
  );
  useEffect(
    function () {
      const controller = new AbortController();
      const { signal } = controller;
      const sendData = async function () {
        if (file.status !== "loading") return;

        customFunctionRef.current &&
          (await customFunctionRef.current({
            signal,
            file,
            onRemove,
            onCancle,
            onSucess,
            onError,
            onProgress,
          }));
      };
      sendData();
      return function () {
        controller.abort();
      };
    },
    [file, onRemove, onCancle, onSucess, onError, onProgress]
  );

  return (
    <div
      className={`upload-list-item ${
        (file.status === "loading" && "upload-item-uploading") ||
        (file.status === "done" && "upload-item-uploaded") ||
        (file.status === "error" && "upload-item-error")
      }  flex-row-bet`}
    >
      <div className="item-thumbnail flex-col">
        <span
          role="img"
          aria-label="loading"
          className={`icon ${
            (file.status === "loading" && "icon-loading icon-spin") ||
            (file.status === "done" && "icon-loaded")
          }`}
        >
          {(file.status === "done" && (
            <FontAwesomeIcon icon="fa-solid fa-file" />
          )) ||
            (file.status === "loading" && (
              <svg
                viewBox="0 0 1024 1024"
                focusable="false"
                data-icon="loading"
                width="1em"
                height="1em"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 00-94.3-139.9 437.71 437.71 0 00-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z" />
              </svg>
            ))}
        </span>
      </div>

      <span className="upload-item-name" title={file.file.name}>
        {file.file.name}
      </span>
      <span className="upload-list-item-actions picture">
        <span
          title="Remove file"
          type="button"
          className="upload-list-item-action"
        >
          <span className="btn-icon" onClick={() => onRemove()}>
            <span
              role="img"
              aria-label="delete"
              tabIndex={-1}
              className="icon-delete"
            >
              <FontAwesomeIcon icon="fa-regular fa-trash-can" />
            </span>
          </span>
        </span>
      </span>
      {file.status === "loading" && (
        <div className="upload-item-progress">
          <div className="progress-bar" role="progressbar" aria-valuenow={53}>
            <div
              className="progress-outer"
              style={{ width: "100%", height: "2px" }}
            >
              <div className="progress-inner">
                <div
                  className="progress-bg"
                  style={{ width: `${file.progress}%`, height: "2px" }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
