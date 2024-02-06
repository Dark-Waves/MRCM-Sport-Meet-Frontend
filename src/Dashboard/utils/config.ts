import configJS, { ConfigJS } from "../../../config";

export const config: ConfigJS["config"] = {
  SiteName: configJS.config.SiteName,
  APIURI: configJS.config.APIURI,
  Version: configJS.config.Version,
};
