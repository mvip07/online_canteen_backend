const { ObjectId } = require("mongodb");
const getDb = require("../util/db").getDb;
const Message = require("../models/messages");

exports.get_messages = (req, res) => {
    Message.get_message ()
        .then(messages => res.json(messages))
        .catch(err => res.status().json({ err: err, message: "You did wrong" }))
};

exports.get_user_messages = (req, res) => {
    Message.get_user_message (req.params.userId)
        .then(messages => res.json(messages))
        .catch(err => res.status().json({ err: err, message: "You did wrong" }))
};

exports.get_message_detail = (req, res) => {
    Message.get_message_detail(req.params.id)
        .then(message => res.send(message));
}

exports.create_message= (req, res) => {
    const {user, message} = req.body;

    try {
        const messages = new Message (user, message);
        messages.create_message();
        return res.status(200).json({ message: "You did successfully" });
    } catch (err) {
        return res.status().json({ err: err, message: "You did wrong" });
    }
};

exports.update_message = (req, res) => {
    const db = getDb();
    const { message } = req.body;
        return db.collection("Messages").updateOne(
            { _id: ObjectId(req.params.id) },
            { $set: {
                "message": message,
            } },
        )
            .then((obj) =>
                res.status(200).json({ message: "You did successfully" }))
            .catch((err) =>
                res.status().json({ message: "You did wrong" }))    
}

exports.delete_message = (req, res) => {
    const db = getDb();
    return db.collection("Messages")
        .deleteOne({ _id: ObjectId(req.params.id) })
        .then(() => res.status(200).json({ message: "You did successfully" }))
        .catch(() => res.status().json({ message: "You did wrong" }));
};