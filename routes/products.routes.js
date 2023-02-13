import ProductModel from "../models/Products.js";

import { Router } from "express";
const router = Router();

// /api/product
router.post("/create", async (req, res) => {
  const doc = new ProductModel({
    name: req.body.name,
    title: req.body.title,
    avatar: req.body.avatar,
    category: req.body.category,
    address: req.body.address,
    items: req.body.items,
    kinds: req.body.kinds,
    id: req.body.id,
  });

  const establishment = await doc.save();

  res.json(establishment);
});

router.post("/take", async (req, res) => {
  const name = req.body.name;
  const category = req.body.category;
  const id = req.body.id;

  const product = await ProductModel.find(
    id
      ? { id }
      : name || category
      ? { name: new RegExp(name, "i"), category }
      : {},
    { items: 0 }
  );

  res.send(product);
});

router.post("/take/find-items", async (req, res) => {
  const id = req.body.id;

  const product = await ProductModel.find({ id }, { items: 1 });

  res.send(product);
});

router.post("/give-basket", async (req, res) => {
  let basket = [];
  const productsBeginStep = await ProductModel.find(
    {
      id: req.body.cafeId,
    },
    "items -_id"
  );

  productsBeginStep[0]?.items.forEach((elem) => {
    if (req.body.ids.includes(elem.id)) {
      basket.push(elem);
    }
  });

  res.send(basket);
});

export default router;
