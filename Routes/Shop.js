const express = require('express');

const shopController = require('../controllers/shop');

const router = express.Router();

router.get('/', shopController.getIndex);
router.get('/products', shopController.getProducts);
router.get('/products/:productID', shopController.getProductDetail);
router.post('/delete-product', shopController.postDelete)
router.get('/cart', shopController.getCart);
router.post('/cart', shopController.postCart);
router.post('/create-order', shopController.postOrder)
router.get('/orders', shopController.getOrders);

module.exports = router;