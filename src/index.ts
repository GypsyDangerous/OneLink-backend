import app from "./app";
import Controller from "./mongoose";

const uri = process.env.ATLAS_URI;

if (!uri) {
	throw new Error("Missing mongoose connection string");
}
const mongoose = new Controller(uri);


const port = process.env.PORT || 3000;
app.listen(port, () => {
	/* eslint-disable no-console */
	console.log(`Listening on port:${port}`);
	/* eslint-enable no-console */
});
mongoose.connect().then(() => {
	mongoose.app?.connection.once("open", () => {
		console.log("MongoDB database connection successful");
	});
}).catch(err => console.log(err.message));


