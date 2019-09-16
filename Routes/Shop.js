const express = require('express');

const shopController = require('../controllers/shop');

const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/', shopController.getIndex);
router.get('/products', shopController.getProducts);
router.get('/products/:productID', shopController.getProductDetail);
router.post('/delete-product', isAuth, shopController.postDelete)
router.get('/cart', isAuth, shopController.getCart);
router.post('/cart', isAuth, shopController.postCart);
router.post('/create-order', isAuth, shopController.postOrder)
router.get('/orders', isAuth, shopController.getOrders);

module.exports = router;