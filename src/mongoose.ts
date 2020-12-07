import mongoose from "mongoose";

class MongooseController {
	connectionString: string;
	app?: typeof mongoose;
	connected: boolean;

	constructor(connectionString: string) {
		this.connectionString = connectionString;
		this.connected = false;
	}

	async connect(useUnifiedTopology = true): Promise<void> {
		this.connected = true
		this.app = await mongoose.connect(this.connectionString, {
			useNewUrlParser: true,
			useCreateIndex: true,
			useUnifiedTopology: useUnifiedTopology,
		});
	}

	async disconnect(): Promise<void> {
		this.connected = false
		await this.app?.disconnect();
	}
}

export default MongooseController;
