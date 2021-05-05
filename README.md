# Pluto.tv IPTV Server

Pluto.tv based IPTV HTTP service. Based on [@evoactivity's code](https://github.com/evoactivity/PlutoIPTV).

Primarly, to be used with external players, such as VLC or Kodi's Simple IPTV PVR, serving a local home network.

This server doesn't transmit any video stream. It justs make use of PlutoTV API and organize the response into M3U8 playlist for channels and XMLTV for EPG. To avoid excessive requests, the retrieved data is cached for 30 minutes. 

## Deploying

### Docker

- The easiest and recommended way. Use the provided `Dockerfile` to build and run the container

```sh
docker build -t plutotv_server .
docker run -d -p 3000:3000 plutotv_server
```

You can access `http://localhost:3000` or `http://[MY_NETWORK_IP]:3000`

## Using an external player

To use it, just configure the external player to retrieve the M3U8 and XMLTV from the server URL

- **/channels** - *application/x-mpegurl* - All Pluto.tv channels available in M3U8 format.
- **/epg** - *application/xml* - Electronic Programming Guide for playlist channels with 8-hour schedule

Example: Set playlist URL to `http://localhost:3000/channels`