import { Response } from "express";
import { setDislike, setMatch } from "../../application/match/match_utils";
import { formatJsonError } from "../../application/utils/errors";
import { formatResponse } from "../../application/utils/helpers";
import { express } from "../../infrastructure/config/app";
const router = express.Router();
const protect = require("../../application/middleware/protect");

/*

    The addMatch route is used to set a match to the user's list of matches

*/
router.post("/addMatch", protect, async (req: any, res: Response) => {
	const { matchID } = req.body;
	const userID = req.user.id;

	if (!matchID || !userID) {
		return res
			.status(400)
			.json(formatJsonError("Either the user id or the match id is missing"));
	}

	try {
		const result = await setMatch(userID, matchID);
		console.log("RESULT:" + result);

		return res.status(201).json(formatResponse(result));
	} catch (error) {
		return res
			.status(500)
			.json(formatJsonError("An error occurred while matching with the user"));
	}
});

/*

    The addDislike route is used to set a dislike to the user's list of dislikes

*/
router.post("/addDislike", protect, async (req: any, res: Response) => {
	const { dislikeID } = req.body;
	const userID = req.user.id;

	if (!dislikeID || !userID) {
		return res
			.status(400)
			.json(formatJsonError("Either the user id or the dislike id is missing"));
	}

	try {
		const result = await setDislike(userID, dislikeID);
		return res.status(201).json(formatResponse(result));
	} catch (error) {
		return res
			.status(500)
			.json(formatJsonError("An error occurred while disliking the user"));
	}
});

module.exports = router;
