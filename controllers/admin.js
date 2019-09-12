const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false
    });
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin Products',
            path: '/admin/products'
        });
    });
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const productID = req.params.productID;
    Product.findbyID(productID, product => {
        if (!product) {
            res.redirect('/');
        }
        res.render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            editing: editMode,
            product: product
        });
    });
};

exports.postEditProduct = (req, res, next) => {
    const newId = req.body.productID;
    const newTitle = req.body.title;
    const newImageURL = req.body.imageURL;
    const newDescription = req.body.description;
    const newPrice = req.body.price;
    const product = new Product(newId, newTitle, newImageURL, newDescription, newPrice);
    product.save();
    res.redirect('/admin/products');
};

exports.postAddProducts = (req, res, next) => {
    const title = req.body.title;
    const imageURL = req.body.imageURL;
    const description = req.body.description;
    const price = req.body.price;
    const product = new Product(null, title, imageURL, description, price);
    product.save();
    res.redirect('/');
};

exports.postDeleteProduct = (req, res, next) => {
    const id = req.body.productID;
    Product.delete(id);
    res.redirect('/admin/products');
};