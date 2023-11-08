import { useEffect } from "react";
import { config, images } from "../../config";
const SiteName = config.SiteName;
export default function Error({ code }) {
  useEffect(
    function () {
      document.title = `${SiteName} Error ${code}`;
    },
    [code]
  );
  return <div>Error Code {code}</div>;
}
