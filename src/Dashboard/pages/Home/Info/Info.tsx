import "./Info.css";
import { iconsImgs } from "../../../utils/images";
import { info } from "../../../data/data";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { config } from "../../../../../config";
import { Skeleton } from "@mui/material";
import { decrypt } from "../../../../utils/aes";

interface Info {
  id: number;
  title: string;
  count: number;
}

const Info: React.FC = () => {
  const [info, setInfo] = useState<Info[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getInfo = async () => {
      try {
        const response = await axios.get(
          `${config.APIURI}/api/v${config.Version}/public/data/info`
        );
        const data = decrypt(response.data);
        if (data.payload && data.payload.info) {
          setInfo(data.payload.info);
        } else {
          throw new Error("Data was not came from the API");
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getInfo();
  }, []);
  return (
    <div className="info grid-two-item grid-common grid-c4">
      <div className="grid-c-title">
        <h3 className="grid-c-title-text">Info</h3>
        <button className="grid-c-title-icon">
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>
      {loading ? (
        <div className="grid-items g-5 flex-col">
          {[...Array(4)].map((_, index) => (
            <Skeleton
              key={index}
              variant="rounded"
              width={"100%"}
              height={70}
            />
          ))}
        </div>
      ) : (
        <div className="grid-items">
          {info.map((Info, index) => (
            <div key={index} className="box flex-row-aro grid-c4-content">
              <h4 className="title">{Info.title}</h4>
              <span className="count">{Info.count}</span>
            </div>
          ))}
        </div>
      )}{" "}
    </div>
  );
};

export default Info;
