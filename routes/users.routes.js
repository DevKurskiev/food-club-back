import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";
import { Router } from "express";

import UsersModel from "../models/Users.js";

const router = Router();

let salt = bcrypt.genSaltSync(10);

// /api/users
router.post("/create", async (req, res) => {
  const unique_id = uuid();
  const passLengthSuccess = req.body.password.length >= 6;

  const doc = new UsersModel({
    userId: unique_id,
    lastName: req.body.lastName,
    firstName: req.body.firstName,
    email: req.body.email.toLowerCase(),
    password: bcrypt.hashSync(req.body.password, salt),
    roles: ["user"],
    basket: { cafeId: null, items: [] },
  });

  passLengthSuccess && (await doc.save());

  res.json(
    passLengthSuccess
      ? "success"
      : "Длина пароля должна быть не менее 6 символов"
  );
});

router.post("/login", async (req, res) => {
  const user = await UsersModel.findOne(
    {
      email: req.body.email,
    },
    "-__v -_id"
  );

  let passwordIsRight = user
    ? bcrypt.compareSync(req.body.password, user?.password)
    : false;
  console.log(passwordIsRight);

  res.send({
    userId: passwordIsRight ? user.userId : null,
    error: !passwordIsRight ? "Ваша почта и/или email введены неверно" : null,
  });
});

router.post("/take", async (req, res) => {
  const user = await UsersModel.findOne(
    {
      userId: req.body.userId,
    },
    "-__v -_id -password"
  );

  res.send(user);
});

//Работа с корзиной

// Добавление определенного продукта
router.put("/added-to-basket", async (req, res) => {
  const basket = await UsersModel.findOneAndUpdate(
    { userId: req.body.userId },
    {
      $push: {
        "basket.items": {
          id: req.body.id,
          payment: +req.body.payment,
          quantity: 1,
        },
      },
      $set: { "basket.cafeId": req.body.cafeId },
    },
    { returnOriginal: false }
  );

  res.send(basket);
});

// Очищение корзины
router.put("/clear-basket", async (req, res) => {
  const basket = await UsersModel.findOneAndUpdate(
    { userId: req.body.userId },
    { $set: { "basket.cafeId": null, "basket.items": [] } },
    { returnOriginal: false }
  );

  res.send(basket);
});

// Обновление количества определенного продукта
router.put("/update-quantity", async (req, res) => {
  const document = await UsersModel.findOneAndUpdate(
    { userId: req.body.userId, "basket.items.id": req.body.id },
    {
      $inc: {
        "basket.items.$.quantity": req.body.quantity,
      },
    },
    { returnOriginal: false }
  );

  const quantities = document.basket.items.map((item) => item.quantity);
  const newBasket = [];

  quantities.forEach((item, i) => {
    if (item > 0) {
      newBasket.push(document.basket.items[i]);
    }
  });

  document.basket = { ...document.basket, items: newBasket };

  await UsersModel.updateOne(
    { userId: req.body.userId },
    {
      $set: {
        "basket.items": newBasket,
      },
    }
  );

  res.send(document);
});

export default router;
