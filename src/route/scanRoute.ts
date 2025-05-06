import {Router} from "express";
import {ScanController} from "../controller/scanController";


export const scanRoute = Router();
const controller = new ScanController();

scanRoute.post('/scan', controller.post.bind(controller));
