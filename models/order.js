const getDb = require("../util/db").getDb;
class Order {
    constructor(user, food) {
        this.food = food;
        this.user = user;
        this.create_date = new Date();
    }

    static get_order() {
        const db = getDb();
        return db.collection("Orders").find({}).toArray()
            .then(orders => {
                return orders.map(order => {
                    return {
                        _id: order._id,
                        food: order.food,
                        user: order.user,
                        create_date: order.create_date
                    }
                })
            })
            .catch(err =>
                res.status(400).json({ message: "You did Wrong !" }))
    };

    static get_today_order() {
        const db = getDb();
        const date = String(new Date())
        return db.collection("Orders").find({}).toArray()
            .then(orders => {
                return orders.filter(({ create_date }) => String(create_date).substring(0, 10) == String(date).substring(0, 10)).map((data) => {
                    return data
                }) 
            });
    }

    static get_user_order(id) {
        const db = getDb();
        return db.collection("Orders").find({}).toArray()
            .then(orders => {
                return orders.filter(({ user }) => user.id == id).map(order => {
                    return {
                        _id: order._id,
                        food: order.food,
                        user: order.user,
                        create_date: order.create_date
                    }
                })

            })
            .catch(err =>
                res.status(400).json({ message: "You did Wrong !" }))
    };

    static get_order_detail(id) {
        const db = getDb();
        return db.collection("Orders").findOne({ userId: id })
            .then(order => order)
            .catch(err => res.status().json({ message: "You did wrong" }))
    };

    create_order() {
        const db = getDb();
        return db.collection("Orders").insertOne(this);
    }
};

module.exports = Order;