const express = require('express');

const router = express.Router();

const productsController = require('../controllers/product');

router.get('/add-product', productsController.getAddPorduct);

router.post('/add-product', productsController.postAddProducts);

exports.routes = router;