import axios from "axios";
import { promises as fs } from "fs";
import moment from "moment";

class PlutoTvClient {
  async getData() : Promise<any[]> {
    // check for cache

    const cacheStatData = await fs.stat("cache.json");

    // if the cache exists, use it
    if (cacheStatData) {
      let now = new Date().getTime() / 1000;
      let mtime = new Date(cacheStatData.mtime).getTime() / 1000;

      // it's under 30 mins old
      if (now - mtime <= 1800) {
        console.debug("[DEBUG] Using cache.json, it's under 30 minutes old.");
        const cacheFile = await fs.readFile("cache.json");
        const cachedData = JSON.parse(cacheFile.toString());
        return cachedData;
      }
    }

    // if dont, create it
    // 2020-03-24%2021%3A00%3A00.000%2B0000
    let startTime = encodeURIComponent(
      moment().format("YYYY-MM-DD HH:00:00.000ZZ")
    );

    // 2020-03-25%2005%3A00%3A00.000%2B0000
    let stopTime = encodeURIComponent(
      moment().add(8, "hours").format("YYYY-MM-DD HH:00:00.000ZZ")
    );

    let url = `http://api.pluto.tv/v2/channels?start=${startTime}&stop=${stopTime}`;

    console.info('[INFO] Downloading updated info from PlutoTV Servers')

    const response = await axios.get(url);
    const data = response.data;

    await fs.writeFile('cache.json', JSON.stringify(data));

    return data;
  }
}

export { PlutoTvClient };
