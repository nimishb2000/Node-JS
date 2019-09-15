const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false
    });
};

exports.getProducts = (req, res, next) => {
    req.user
        .getProducts()
        .then(products => {
            res.render('admin/products', {
                prods: products,
                pageTitle: 'Admin Products',
                path: '/admin/products'
            });
        })
        .catch(err => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const productID = req.params.productID;
    req.user
        .getProducts({where: {id: productID}})
        .then(products => {
            const product = products[0];
            if (!product) {
                res.redirect('/');
            }
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/edit-product',
                editing: editMode,
                product: product
            });
        })
        .catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
    const productID = req.body.productID;
    const newTitle = req.body.title;
    const newImageURL = req.body.imageURL;
    const newDescription = req.body.description;
    const newPrice = req.body.price;
    Product.findByPk(productID)
        .then(product => {
            product.title = newTitle;
            product.price = newPrice;
            product.imageURL = newImageURL;
            product.description = newDescription;
            return product.save();
        })
        .then(() => {
            console.log("Updated Successfully");
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
};

exports.postAddProducts = (req, res, next) => {
    const title = req.body.title;
    const imageURL = req.body.imageURL;
    const description = req.body.description;
    const price = req.body.price;
    req.user
        .createProduct({
        title: title,
        imageURL: imageURL,
        price: price,
        description: description,
        userId: req.user.id
        })
        .then(() => {
            console.log("Added succesfully");
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
    const id = req.body.productID;
    Product.findByPk(id)
        .then(product => {
            return product.destroy();
        })
        .then(() => {
            console.log("Deleted successfully");
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
};