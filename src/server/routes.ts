import * as express from "express";
const session = require("express-session");
const cheeses = require("./data/cheeses.json");

const router = express.Router();
router.use(
  session({
    secret: "thang",
    resave: false,
    cookie: {
      maxAge: 999999999, // Year
    },
  })
);

router.get("/api/cheeses", (req, res, next) => {
  res.json(cheeses);
});

router.get("/api/cart", (req, res, next) => {
  res.json({
    cart: req.session.cart,
  });
});

router.use(express.json());
router.post("/api/cheeses", (req, res) => {
  if (req.body?.cartItems) {
    if (req.session.cart) {
      req.session.cart = [...req.session.cart, req.body.cartItems];
    } else {
      req.session.cart = [req.body.cartItems];
    }
  }

  res.json({
    message: "success",
  });
});

export default router;
