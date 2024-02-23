import React, { useEffect, useState } from "react";
import "./WebContent.css";
import { Action, HomeData, State } from "../Website";
import { Button, styled } from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import Cookies from "js-cookie";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios, { AxiosResponse } from "axios";
import { LoadingButton } from "@mui/lab";
import { config } from "../../../../../config";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

interface WebContentProps extends State {
  dispatch: React.Dispatch<Action>;
}

interface LoadingHomeContent {
  type: string;
  loading: boolean;
}

const WebContent: React.FC<WebContentProps> = ({ dispatch, homeData }) => {
  const [contentLoading, setContentLoading] = useState<LoadingHomeContent[]>(
    []
  );

  // SetupImages

  useEffect(() => {
    if (!homeData) return;
    setContentLoading(
      homeData.map((data, index) => ({ type: data.type, loading: false }))
    );
  }, [homeData]);

  const handleLogoChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    image_id: string | null | undefined,
    type: string,
    dataType: string
  ) => {
    if (!homeData) return;
    setContentLoading((prev) =>
      prev.map((item) =>
        item.type === type ? { ...item, loading: true } : item
      )
    );
    if (!event.target.files) {
      console.log("Please upload the image");
      return;
    }
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = Cookies.get("token");
      switch (dataType) {
        case "image":
          if (!image_id) {
            const response = await axios.post(
              `${config.APIURI}/api/v${config.Version}/public/${dataType}/${type}`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            const newHomeData: HomeData[] = homeData.map((data) =>
              data.type === type
                ? {
                    ...data,
                    value: {
                      ...data.value,
                      image_id: response.data.image_id,
                      url: response.data.url,
                    },
                  }
                : data
            );

            dispatch({ type: "setHomeData", payload: newHomeData });
          } else {
            const response = await axios.patch(
              `${config.APIURI}/api/v${config.Version}/public/image/${type}`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                  Authorization: `Bearer ${token}`,
                },
              }
            );
          }
          break;
        case "content":
          break;
        default:
          break;
      }
      setContentLoading((prev) =>
        prev.map((item) =>
          item.type === type ? { ...item, loading: false } : item
        )
      );
    } catch (error) {
      console.log(error);
      setContentLoading((prev) =>
        prev.map((item) =>
          item.type === type ? { ...item, loading: false } : item
        )
      );
    }
  };

  return (
    <div className="web-content-section grid-common">
      <h1>Website Images Upload Section</h1>

      {homeData &&
        homeData.map((data, index) =>
          data.value.dataType === "image" ? (
            <div className="logo-and-name p-4" key={index}>
              <h3>{data.type} Upload</h3>
              {data.value.url ? (
                <img
                  src={`${data.value.url}?${new Date().getTime()}`}
                  alt={`${data.type} Logo`}
                  className="logo"
                  width={400}
                />
              ) : (
                "No Image Uploaded"
              )}
              <div className="logo-upload">
                <LoadingButton
                  component="label"
                  role={undefined}
                  variant="contained"
                  tabIndex={-1}
                  startIcon={<CloudUploadIcon />}
                  loading={
                    contentLoading.find((item) => item.type === data.type)
                      ?.loading || false
                  }
                >
                  Upload file
                  <VisuallyHiddenInput
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleLogoChange(
                        e,
                        data.value.image_id,
                        data.type,
                        data.value.dataType
                      )
                    }
                  />
                </LoadingButton>
              </div>
            </div>
          ) : (
            "method not dound"
          )
        )}
    </div>
  );
};

export default WebContent;
