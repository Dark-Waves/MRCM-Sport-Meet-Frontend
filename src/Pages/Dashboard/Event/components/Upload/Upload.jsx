import { useReducer } from "react";
import "./Upload.css";
import dayjs from "dayjs";
import Uploader from "../../../../../Uploader/Uploader";
import Button from "../../../../../Uploader/UploadButton";
import axios from "axios";
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
    case "setOnAdd": {
      return {
        ...state,
        fileList: [...state.fileList, action.payload],
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

export default function UploadComponent({ eventData, socket }) {
  const [state, dispatch] = useReducer(reducer, initialValue);
  const { fileList, draggingOver } = state;
  const customFunction = async function ({
    signal,
    file,
    onSucess,
    onError,
    onProgress,
  }) {
    const reader = new FileReader();
    reader.readAsDataURL(file.file);
    reader.onload = async function () {
      try {
        let { data = null } = await axios.post(
          `/api/event/uploadFile`,
          {
            eventId: eventData._id,
            file: { file: reader.result.split(",")[1], name: file.file.name },
          },
          {
            signal,
            onUploadProgress: async (progressEvent) => {
              const progress =
                (progressEvent.loaded / progressEvent.total) * 100;
              onProgress(progress);
            },
          }
        );
        if (!data) return;
        if (data.error) throw new Error(data.error);
        onSucess("Sucessfully uploaded");
        dispatch({ type: "setOnRemove", payload: file });
        socket &&
          socket.emit("server-message", {
            type: "notificationUpdate",
            payload: {
              success: true,
              save: false,
              message: {
                timestamp: dayjs().valueOf(),
                message: `File Uploaded Sucessfully`,
                path: `/dashboard/event/${eventData._id.toString()}`,
              },
            },
          });
      } catch (error) {
        if (signal.aborted) return;
        onError(error.name);
      }
    };
  };
  const props = {
    fileList,
    onAdd: (file) => {
      dispatch({ type: "setOnAdd", payload: { ...file, status: "loading" } });
    },
    onChange: (file) => {
      dispatch({ type: "setOnChange", payload: file });
    },
    onRemove: (file) => {
      dispatch({ type: "setOnRemove", payload: file });
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
          <Uploader {...props}>
            <Button className="UploadButton">Upload</Button>
          </Uploader>
        </div>
      </>
    </div>
  );
}
