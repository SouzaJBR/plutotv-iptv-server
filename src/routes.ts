import { Router } from "express";
import { ChannelsController } from "./controllers/ChannelsController";
import { EpgController } from "./controllers/EpgController";

const router = Router();
const channelsController = new ChannelsController();
const epgController = new EpgController();

router.get('/channels', channelsController.getChannels);
router.get('/data', channelsController.getData);
router.get('/epg', epgController.getEpg);

export {router}