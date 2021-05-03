import { Request, Response } from "express";

class ChannelsController {

    getChannels(request: Request, response: Response) {

        let m3u = "#EXTM3U\n\n";

        response.type('text/plain');
        //response.type('application/x-mpegURL');
        return response.send(m3u);
    }
}

export {ChannelsController}