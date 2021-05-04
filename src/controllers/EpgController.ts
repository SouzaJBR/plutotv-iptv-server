import { PlutoTvClient } from "../plutotv"
import moment from 'moment';
import jsontoxml from 'jsontoxml';
import { Request, Response } from "express";
import  url  from 'url';

class EpgController {

    async getEpg(request: Request, response: Response) {
        const plutoTvClient = new PlutoTvClient();
        const channels = await plutoTvClient.getData();

        const channelsData: any[] = [];

        //////////////
        // Channels //
        //////////////
        channels.forEach((channel) => {
            if (channel.isStitched) {
                channelsData.push({
                    name: 'channel',
                    attrs: { id: channel.slug },
                    children: [
                        { name: 'display-name', text: channel.name },
                        { name: 'display-name', text: channel.number },
                        { name: 'desc', text: channel.summary },
                        { name: 'icon', attrs: { src: channel.solidLogoPNG.path } },
                    ],
                });

                //////////////
                // Episodes //
                //////////////
                if (channel.timelines) {
                    channel.timelines.forEach((programme: any) => {
                        console.log(
                            '[INFO] Adding instance of ' +
                            programme.title +
                            ' to channel ' +
                            channel.name +
                            '.'
                        );

                        channelsData.push({
                            name: 'programme',
                            attrs: {
                                start: moment(programme.start).format('YYYYMMDDHHmmss ZZ'),
                                stop: moment(programme.stop).format('YYYYMMDDHHmmss ZZ'),
                                channel: channel.slug,
                            },
                            children: [
                                { name: 'title', attrs: { lang: 'en' }, text: programme.title },
                                {
                                    name: 'sub-title',
                                    attrs: { lang: 'en' },
                                    text:
                                        programme.title == programme.episode.name
                                            ? ''
                                            : programme.episode.name,
                                },
                                {
                                    name: 'desc',
                                    attrs: { lang: 'en' },
                                    text: programme.episode.description,
                                },
                                {
                                    name: 'date',
                                    text: moment(programme.episode.firstAired).format('YYYYMMDD'),
                                },
                                {
                                    name: 'category',
                                    attrs: { lang: 'en' },
                                    text: programme.episode.genre,
                                },
                                {
                                    name: 'category',
                                    attrs: { lang: 'en' },
                                    text: programme.episode.subGenre,
                                },
                                {
                                    name: 'episode-num',
                                    attrs: { system: 'onscreen' },
                                    text: programme.episode.number,
                                },
                            ],
                        });
                    });
                }
            }
        });

        const epgData = [{
            name: 'tv',
            attrs: {
                    'source-info-url': request.protocol + "://" + request.headers.host + request.originalUrl,
                    'source-info-name': 'PlutoTV Schedulings',
                }
            ,
            children: channelsData
        }]

        const epg = jsontoxml(epgData, {
            prettyPrint: true,
            escape: true
        });

        response.type('application/xml');
        return response.send(epg);
    }
}

export { EpgController }