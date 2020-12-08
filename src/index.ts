import app from "./app";
import Controller from "./mongoose";

const uri = process.env.ATLAS_URI;

if (!uri) {
	throw new Error("Missing mongoose connection string");
}
const mongoose = new Controller(uri);


mongoose.connect().then(() => {
	const port = process.env.PORT || 3000;
	mongoose.app?.connection.once("open", () => {
		console.log("MongoDB database connection successful");
	});
	app.listen(port, () => {
		/* eslint-disable no-console */
		console.log(`Listening on port:${port}`);
		/* eslint-enable no-console */
	});
});


