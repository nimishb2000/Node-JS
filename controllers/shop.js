const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
        .then(([rows, ,fieldData]) => {
            res.render('shop/product-list', {
                prods: rows,
                pageTitle: 'All Products',
                path: '/products'
            });
        })
        .catch(err => console.log(err));
};

exports.getProductDetail = (req, res, next) => {
    const id = req.params.productID;
    Product.findbyID(id, product => {
        res.render('shop/product-detail', {
            path: '/products',
            pageTitle: product.title,
            product: product
        });
    });
};

exports.getIndex = (req, res, next) => {
    Product.fetchAll()
        .then(([rows, fieldData]) => {
            res.render('shop/index', {
                prods: rows,
                pageTitle: 'Shop',
                path: '/'
            });
        })
        .catch(err => console.log(err));
};

exports.getCart = (req, res, next) => {
    Cart.getCart(cart => {
        Product.fetchAll(products => {
            const cartProducts = [];
            for (product of products) {
                const cartProduct = cart.products.find(prod => prod.id === product.id);
                if (cartProduct) {
                    cartProducts.push({ productData: product, qty: cartProduct.qty });
                }
            }
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: cartProducts
            });
        });
    });
};

exports.postDelete = (req, res, next) => {
    const id = req.body.productID;
    Product.findbyID(id, product => {
        Cart.deleteProduct(id, product.price);
        res.redirect('/cart');
    });
};

exports.postCart = (req, res, next) => {
    const ID = req.body.productID;
    Product.findbyID(ID, product => {
        Cart.addProduct(ID, product.price);
    });
    res.redirect('/cart');
};

exports.getOrders = (req, res, next) => {
    res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders'
    });
};

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout'
    });
};