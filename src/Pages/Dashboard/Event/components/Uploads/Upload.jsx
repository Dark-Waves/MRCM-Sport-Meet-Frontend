import { useEffect, useReducer } from "react";
import "./Upload.css";
import Uploader from "../../../../../Uploader/Uploader";
import axios from "axios";
import dayjs from "dayjs";
import { config } from "../../../../../config";

const initialValue = {
  fileList: [],
  draggingOver: false,
};

const reducer = function (state, action) {
  switch (action.type) {
    case "setOnChange": {
      return {
        ...state,
        fileList: state.fileList.find((file) => file.uid === action.payload.uid)
          ? state.fileList.map((file) =>
              file.uid === action.payload.uid ? action.payload : file
            )
          : [
              ...state.fileList.filter(
                (file) => file.uid !== action.payload.uid
              ),
              action.payload,
            ],
      };
    }
    case "setOnRemove": {
      return {
        ...state,
        fileList: [
          ...state.fileList.filter((file) => file.uid !== action.payload.uid),
        ],
      };
    }

    case "setDraggingOver": {
      return { ...state, draggingOver: action.payload };
    }
    default:
      throw new Error("Method not found");
  }
};

export default function UploadComponent({ eventData, uploads, socket }) {
  const [state, dispatch] = useReducer(reducer, initialValue);
  const { fileList, draggingOver } = state;
  const customFunction = async function ({
    signal,
    file,
    onSucess,
    onError,
    onProgress,
  }) {
    if (!eventData.started) {
      socket &&
        socket.emit("server-message", {
          type: "notificationUpdate",
          payload: {
            success: false,
            save: false,
            message: {
              timestamp: dayjs().valueOf(),
              message: `Event is not live.`,
              path: `/dashboard/event/${eventData._id.toString()}`,
            },
          },
        });
      return;
    }
    try {
      let { data = null } = await axios.post(
        `/api/event/deleteFile`,
        {
          eventId: eventData._id,
          file: file.uid,
        },
        {
          signal,
          onUploadProgress: async (progressEvent) => {
            const progress = (progressEvent.loaded / progressEvent.total) * 100;
            onProgress(progress);
          },
        }
      );
      if (!data) return;
      if (data.error) throw new Error(data.error);
      onSucess("Sucessfully Deleted");
      dispatch({ type: "setOnRemove", payload: file });
      socket &&
        socket.emit("server-message", {
          type: "notificationUpdate",
          payload: {
            success: true,
            save: false,
            message: {
              timestamp: dayjs().valueOf(),
              message: `File Deleted Sucessfully`,
              path: `/dashboard/event/${eventData._id.toString()}`,
            },
          },
        });
    } catch (error) {
      if (signal.aborted) return;
      onError(error.name);
    }
  };
  useEffect(
    function () {
      for (const x of uploads) {
        const data = {
          file: { name: x._doc.FileName },
          uid: x._doc._id,
          status: "done",
          url: x.link,
          progress: 100,
          errorName: null,
          serverResponse: null,
        };
        dispatch({ type: "setOnChange", payload: data });
      }
    },
    [uploads]
  );
  const props = {
    fileList,
    onChange: (file) => {
      dispatch({ type: "setOnChange", payload: file });
    },
    onRemove: (file) => {
      if (file.status === "loading") return;
      dispatch({
        type: "setOnChange",
        payload: { ...file, status: "loading" },
      });
    },
    customFunction,
  };
  return (
    <div
      className={`flex-col upload_section ${draggingOver && "drag-over"}`}
      onDragOver={(e) => {
        e.preventDefault();
        dispatch({ type: "setDraggingOver", payload: true });
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        dispatch({ type: "setDraggingOver", payload: false });
      }}
      onDrop={() => {
        dispatch({ type: "setDraggingOver", payload: false });
      }}
    >
      <>
        <div className="upload-container">
          <Uploader {...props}></Uploader>
        </div>
      </>
    </div>
  );
}
