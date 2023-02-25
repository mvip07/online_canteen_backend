const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {

	MongoClient.connect(process.env.MONGOURL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
		.then((client) => {
			_db = client.db();
			callback(client);
		})
		.catch((err) => {
			console.log(err);
		});
};

const getDb = () => {
	if (_db) {
		return _db;
	}
	throw "No Database Found!";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;