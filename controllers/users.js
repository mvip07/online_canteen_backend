const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const { ObjectId } = require("mongodb");
const getDb = require("../util/db").getDb;

exports.login = async (req, res, next) => {
    const { username, password } = req.body;

    let currentUser;

    await User.findUser(username).then(user => {
        if (!user) {
            return res.status(401).json({ message: "You did Wrong!" });
        }
        currentUser = user;
        return bcrypt.compare(password, user.password);
    })
        .then(doMatch => {
            if (!doMatch) {
                return res.status(401).json({ message: "You did Wrong!" });
            }

            const token = jwt.sign({
                userId: currentUser?._id,
                user: currentUser?.username,
            },
                "mysecr8yGU&a=?k$&NpQzt9ev&kE=TPB7+HNAf7@kYd=EhUncxKhP&uC4aPN%GwZtM5v4?tWET4yN=Y263V3xd-uZ*EaN%et",
                { expiresIn: "1h" }
            );

            res.status(201).json({
                token: token,
                user: {
                    id: currentUser?._id,
                    rol: currentUser?.rol,
                    job: currentUser?.job,
                    image: currentUser?.image,
                    block: currentUser?.block,
                    username: currentUser?.username,
                    lastname: currentUser?.lastname,
                    firstname: currentUser?.firstname,
                },
            });
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.signup = async (req, res, next) => {
    const { job, rol, block, image, username, password, lastname, firstname, confirmPassword } = req.body;

    await User.findUser(username)
        .then(user => {
            if (!user) {
                if (password == confirmPassword && password.length >= 8) {
                    const user = new User (job, rol, block, image, username, password, lastname, firstname, confirmPassword);
                    user.save();
                    return res.status(200).json({ message: "You did Wrong!" });

                } else return res.status(400).json({ message: "You did Wrong!" });

            } else return res.status(400).json({ message: "You did Wrong!" });

        })
        .catch((err) => { res.status(200).json({ message: "You did Wrong!" }); next(err); })
}

exports.get_forget = (req, res) => {
    const db = getDb();
    const { password, confirmPassword } = req.body;
    return db.collection("Users").updateOne(
        { _id: ObjectId(req.params.id) },
        {
            $set: {
                "password": password,
                "confirmPassword": confirmPassword
            }
        },
    )
        .then((obj) => res.status(200).json({ message: "You are cool!" }))
        .catch((err) => res.status(400).json({ message: "You did Wrong!" }))
}

exports.get_update = (req, res) => {
    const db = getDb();
    const { image, password, rol, firstname, lastname, job, username, } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 12);
    return db.collection("Users").updateOne(
        { _id: ObjectId(req.params.id) },
        
        {
            $set: {
                "job": job,
                "rol": rol,
                "image": image,
                "lastname": lastname,
                "username": username,
                "firstname": firstname,
                "password": hashedPassword,
                "confirmPassword": password,
            }
        },
    )
        .then((obj) => res.status(200).json({ message: "You are cool!" }))
        .catch((err) => res.status(400).json({ message: "You did Wrong!" }))
}

exports.get_block = (req, res) => {
    const db = getDb();
    const { block } = req.body;
    return db.collection("Users").updateOne(
        { _id: ObjectId(req.params.id) },
        {
            $set: {
                "block": block,
            }
        },
    )
        .then((obj) => res.status(200).json({ message: "You are cool!" }))
        .catch((err) => res.status(400).json({ message: "You did Wrong!" }))
}

exports.getUserDetail = (req, res) => {
    User.getUserDetail(req.params?.id)
        .then(user => res.send(user))
        .catch((err) => res.status(400).json({ message: "You did Wrong!" }))
}

exports.getUsers = (req, res) => {
    User.getUsers()
        .then(user => res.send(user))
        .catch((err) => res.status(400).json({ message: "You did Wrong !" }))
}