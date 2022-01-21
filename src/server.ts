import { db } from "./infrastructure/config/db";
import { express } from "./infrastructure/config/app";
const app = express();
require("dotenv").config();

const port: any = process.env.PORT || 3000;

app.use(express.json());

//Auth Endpoint
app.use("/api/", require("./presentation/auth/authRoutes"));

// start the Express server
db.connect(process.env.MONGO_DB_URI, {}).then((_con: any) => {
	app.listen(port, () => {
		console.log(`Server started at http://localhost:${port}`);
	});
	console.log("DB connection successful");
});
