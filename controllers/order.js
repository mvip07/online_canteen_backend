const getDb = require("../util/db").getDb;
const { ObjectId } = require("mongodb");
const Order = require("../models/order");

exports.get_orders = (req, res) => {
    Order.get_order()
        .then(orders => res.json(orders))
        .catch(err => res.status(400).json({ message: "You did wrong" }))
};

exports.get_today_orders = (req, res) => {
    Order.get_today_order()
        .then(orders => res.json(orders))
        .catch(err => res.json(err))
};

exports.get_user_orders = (req, res) => {
    Order.get_user_order(req.params.userId)
        .then(orders => res.json(orders))
        .catch(err => res.status(400).json({ message: "You did wrong" }))
};

exports.get_order_detail = (req, res) => {
    Order.get_order_detail(req.params.userId)
        .then(order => res.send(order))
        .catch(err => res.send(err))
}

exports.create_order = (req, res) => {
    const { user, food, } = req.body;

    try {
        const orders = new Order(user, food);
        orders.create_order();
        return res.status(200).json({ message: "You did successfully" });
    } catch (err) {
        return res.status().json({ err: err, message: "You did wrong" });
    }
};

exports.delete_order = (req, res) => {
    const db = getDb();
    return db.collection("Orders")
        .deleteOne({ _id: ObjectId(req.params.id) })
            .then(() => res.status(200).json({ message: "You did successfully" }))
            .catch(() => res.status(400).json({ message: "You did Wrong!" }));
};
