const getDb = require("../util/db").getDb;
const { ObjectId } = require("mongodb");

class Message {
    constructor(user, message) {
        this.user = user;
        this.message = message;
        this.create_date = new Date();
    }

    static get_message () {
        const db = getDb();
        return db.collection("Messages").find({}).toArray()
            .then(messages => {
                return messages.map(message => {
                    return {
                        _id: message._id,
                        user: message.user,
                        message: message.message,
                        create_date: message.create_date,
                    }
                })

            })
            .catch(err =>
                res.status(400).json({ message: "You did Wrong !" }))
    };

    static get_user_message(id) {
        const db = getDb();
        return db.collection("Messages").find({}).toArray()
            .then(messages => {
                return messages.filter(({ user }) => user.id == id).map(message => {
                    return {
                        _id: message._id,
                        user: message.user,
                        message: message.message,
                        create_date: message.create_date,
                    }
                })
            })
            .catch(err =>
                res.status(400).json({ message: "You did Wrong !" }))
    };

    static get_message_detail(id) {
        const db = getDb();
        return db.collection("Messages").findOne({ _id: ObjectId(id) })
            .then(messages => messages)
            .catch(err => res.status().json({ message: "You did wrong" }))
    };

    create_message () {
        const db = getDb();
        return db.collection("Messages").insertOne(this);
    }
};

module.exports = Message;