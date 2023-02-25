const getDb = require("../util/db").getDb;
const { ObjectId } = require("mongodb");
class Food {
    constructor(day, name, price, description, image) {
        this.day = day;
        this.name = name;
        this.price = price,
        this.image = image;
        this.description = description;
        this.create_date = new Date();
    }

    static get_food () {
        const db = getDb();
        return db.collection("Foods").find({}).toArray()
            .then(foods => {
                return foods.map(food => {
                    return {
                        _id: food._id,
                        day: food.day,
                        name: food.name,
                        price: food.price,
                        description: food.description,
                        image: food.image,
                        create_date: food.create_date 
                    }
                })
            })
            .catch(err =>
                res.status().json({ message: "You did Wrong" }))
    };

    static get_food_detail (id) {
        const db = getDb();
        return db.collection("Foods").findOne({ _id: ObjectId(id) })
            .then(food => food)
            .catch(err => res.status().json({message: "You did wrong"}))
    };

    static get_food_today(day) {
        const db = getDb();
        return db.collection("Foods").findOne({ day: day })
            .then(food => food)
            .catch(err => res.status().json({message: "You did wrong"}))
    };

    create_food() {
        const db = getDb();
        return db.collection("Foods").insertOne(this);
    }
};

module.exports = Food;