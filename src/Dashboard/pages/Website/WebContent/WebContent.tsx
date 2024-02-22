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

interface HomeImage {
  type: string;
  image_id?: string;
  url?: string;
}

interface LoadingHomeImage {
  type: string;
  loading: boolean;
}

const WebContent: React.FC<WebContentProps> = ({ dispatch, homeData }) => {
  const [tempHomeImages, setTempHomeImages] = useState<HomeImage[]>([]);
  const [imageUploadLoading, setImageUploadLoading] = useState<
    LoadingHomeImage[]
  >([]);
  console.log(imageUploadLoading);
  useEffect(() => {
    if (!homeData) return;
    const convoArr: HomeImage[] = Object.entries(homeData)
      .filter(([key, value]) => typeof value === "object" && value !== null)
      .map(([key, value]) => ({ type: key, ...value }));
    setTempHomeImages(convoArr);
  }, [homeData]);

  useEffect(() => {
    if (!tempHomeImages) return;
    setImageUploadLoading(
      tempHomeImages.map((data, index) => ({ type: data.type, loading: false }))
    );
  }, [tempHomeImages]);

  const handleLogoChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    image_id: string | null | undefined,
    type: string
  ) => {
    if (!homeData) return;
    setImageUploadLoading((prev) =>
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
      let response: AxiosResponse;
      if (!image_id) {
        response = await axios.post(
          `${config.APIURI}/api/v${config.Version}/public/image/${type}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const newHomeData: HomeData = {
          SiteName: homeData?.SiteName,
          AboutText: homeData?.AboutText,
          HeroImage: type === "HeroImage" ? response.data : homeData.HeroImage,
          BackgroundImage:
            type === "BackgroundImage"
              ? response.data
              : homeData.BackgroundImage,
          AboutImage:
            type === "AboutImage" ? response.data : homeData.AboutImage,
          SiteLogo: type === "SiteLogo" ? response.data : homeData.SiteLogo,
        };
        dispatch({ type: "setHomeData", payload: newHomeData });
      } else {
        response = await axios.patch(
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
      console.log(response.data);
      setImageUploadLoading((prev) =>
        prev.map((item) =>
          item.type === type ? { ...item, loading: false } : item
        )
      );
    } catch (error) {
      console.log(error);
      setImageUploadLoading((prev) =>
        prev.map((item) =>
          item.type === type ? { ...item, loading: false } : item
        )
      );
    }
  };

  return (
    <div className="web-content-section grid-common">
      <h1>Website Images Upload Section</h1>

      {tempHomeImages.map((data, index) => (
        <div className="logo-and-name p-4" key={index}>
          <h3>{data.type} Upload</h3>
          {data.url ? (
            <img
              src={`${data.url}?${new Date().getTime()}`}
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
                imageUploadLoading.find((item) => item.type === data.type)
                  ?.loading || false
              }
            >
              Upload file
              <VisuallyHiddenInput
                type="file"
                accept="image/*"
                onChange={(e) => handleLogoChange(e, data.image_id, data.type)}
              />
            </LoadingButton>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WebContent;
