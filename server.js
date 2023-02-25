const express = require("express");

const isAuth = require("./util/isAuth")
const food = require("./controllers/food")
const user = require("./controllers/users")
const order = require("./controllers/order")
const message = require("./controllers/messages")

const mongoConnect = require("./util/db").mongoConnect;

const app = express();
require("dotenv").config();

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader(
		"Access-Control-Allow-Methods",
		"OPTIONS, GET, POST, PUT, PATCH, DELETE"
	);
	res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
	if (req.method === "OPTIONS") {
		return res.sendStatus(200);
	}
	next();
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/all/food", isAuth, food.get_foods);
app.post("/create/food", isAuth, food.create_food);
app.post("/update/food/:id", isAuth, food.update_food);
app.delete("/delete/food/:id", isAuth, food.delete_food);
app.post("/today/food/:day", isAuth, food.get_food_today);
app.get("/selected/food/:id", isAuth, food.get_food_detail);

app.get("/all/messages", isAuth, message.get_messages);
app.post("/create/message", isAuth, message.create_message);
app.post("/update/message/:id", isAuth, message.update_message);
app.delete("/delete/message/:id", isAuth, message.delete_message);
app.get("/user/message/:userId", isAuth, message.get_user_messages);
app.get("/selected/message/:id", isAuth, message.get_message_detail);

app.get("/all/orders", isAuth, order.get_orders);
app.post("/create/order", isAuth, order.create_order);
app.get("/today/orders", isAuth, order.get_today_orders);
app.delete("/delete/order/:id", isAuth, order.delete_order);
app.get("/user/order/:userId", isAuth, order.get_user_orders);
app.get("/selected/order/:id", isAuth, order.get_order_detail);

app.post("/user/login", user.login);
app.post("/user/register", user.signup);
app.get("/user/all/", isAuth, user.getUsers);
app.post("/user/block/:id", isAuth, user.get_block);
app.post("/user/update/:id", isAuth, user.get_update);
app.post("/user/password/forget/:id", user.get_forget);
app.get("/user/selected/:id", isAuth, user.getUserDetail);


mongoConnect(() => {
	app.listen(process.env.PORT || 8000, () => console.log("Server Started!"));
});