import { Router } from "express";
import { ChannelsController } from "./controllers/ChannelsController";

const router = Router();
const channelsController = new ChannelsController();

router.get('/channels', channelsController.getChannels);
router.get('/data', channelsController.getData);

export {router}