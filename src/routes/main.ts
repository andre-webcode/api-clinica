import { Router } from "express";
import * as pingController from '../controllers/ping.js'


export const mainRouter = Router();

mainRouter.get('/ping', pingController.ping);

