import { Request, Response } from "express";
import { PlutoTvClient } from "../plutotv";
import { v1 as uuid1, v4 as uuid4 } from "uuid";
import url from "url";

class ChannelsController {

    async getData(request: Request, response: Response) {

        const plutoTvClient = new PlutoTvClient();
        const data = await plutoTvClient.getData();

        return response.json(data);
    }

    async getChannels(request: Request, response: Response) {
        let m3u8 = "#EXTM3U\n";

        const plutoTvClient = new PlutoTvClient();
        const channels = await plutoTvClient.getData();

        channels.forEach((channel) => {
            let deviceId = uuid1();
            let sid = uuid4();

            if (channel.isStitched) {
                const m3uUrl = new URL(channel.stitched.urls[0].url);
                let queryString = m3uUrl.search;
                let params = new URLSearchParams(queryString);

                // set the url params
                params.set("advertisingId", "");
                params.set("appName", "web");
                params.set("appVersion", "unknown");
                params.set("appStoreUrl", "");
                params.set("architecture", "");
                params.set("buildVersion", "");
                params.set("clientTime", "0");
                params.set("deviceDNT", "0");
                params.set("deviceId", deviceId);
                params.set("deviceMake", "Chrome");
                params.set("deviceModel", "web");
                params.set("deviceType", "web");
                params.set("deviceVersion", "unknown");
                params.set("includeExtendedEvents", "false");
                params.set("sid", sid);
                params.set("userId", "");
                params.set("serverSideAds", "true");

                m3uUrl.search = params.toString();
                const channelUrl = m3uUrl.toString();

                const slug = channel.slug;
                const logo = channel.solidLogoPNG.path;
                const group = channel.category;
                const name = channel.name;
                const number = channel.number;

                m3u8 +=
                    `#EXTINF:0 channel-id="${slug}" tvg-chno="${number}" tvg-logo="${logo}" group-title="${group}", ${name}` +
                    "\n";
                m3u8 += channelUrl + "\n\n";

                console.debug("[DEBUG] Adding " + channel.name + " channel.");
            } else {
                console.debug("[DEBUG] Skipping 'fake' channel " + channel.name + ".");
            }
        });

        response.type("text/plain");
        return response.send(m3u8);
    }

}
export { ChannelsController };
