import { Request, Response } from "express";
import { express } from "../../infrastructure/config/app";
const router = express.Router();
const protect = require("../../application/middleware/protect");

/*
    The route is used to sent a message to a user
*/

router.post("/sendMessage", protect, (req: Request, res: Response) => {});

/*
    The route is used to get messages from a given chat
*/
router.post("/getMessages", protect, (req: Request, res: Response) => {});

module.exports = router;
