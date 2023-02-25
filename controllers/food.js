const getDb = require("../util/db").getDb;
const { ObjectId } = require("mongodb");
const Food = require("../models/food");

exports.get_foods = (req, res) => {
    Food.get_food()
        .then(foods => res.json(foods))
        .catch(err => res.status(400).json({ message: "You did wrong" }))
};

exports.get_food_detail = (req, res) => {
    Food.get_food_detail(req.params.id)
        .then(food => res.send(food))
        .catch(err => res.status(400).json({ message: "You did wrong" }))
}

exports.create_food = (req, res) => {
    const {day, name, price, description, image} = req.body;

    try {
        const food = new Food(day, name, price, description, image);
        food.create_food();
        return res.status(200).json({ message: "You did successfully" });
    } catch (err) {
        return res.status().json({ err: err, message: "You did wrong" });
    }
};

exports.update_food = (req, res) => {
    const db = getDb();
    const { day, name, price, description, image } = req.body;
        return db.collection("Foods").updateOne(
            { _id: ObjectId(req.params.id) },
            {
                $set: {
                "day": day,
                "name": name,
                "price": price,
                "description": description,
                "image": image,
            } },
        )
        .then((obj) => res.status(200).json({ message: "You did successfully" }))
        .catch((err) => res.status().json({message: "You did wrong"}))    
}

exports.delete_food = (req, res) => {
    const db = getDb();
    return db.collection("Foods")
        .deleteOne({ _id: ObjectId(req.params.id) })
        .then(() => res.status(200).json({ message: "You did successfully" }))
        .catch(() => res.status(400).json({ message: "You did wrong" }));
};

exports.get_food_today = (req, res) => {
    Food.get_food_today(req.params.day)
        .then(food => res.send(food))
        .catch(err => res.status(400).json({ message: "You did wrong" }))
}