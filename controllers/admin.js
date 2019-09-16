const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false
    });
};

exports.postAddProducts = (req, res, next) => {
    const title = req.body.title;
    const imageURL = req.body.imageURL;
    const description = req.body.description;
    const price = req.body.price;
    const product = new Product({
        title: title,
        price: price,
        description: description,
        imageURL: imageURL,
        userId: req.session.userId
    });
    product
        .save()
        .then(() => {
            console.log('Added Successfully');
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const productID = req.params.productID;
    Product.findByPk(productID)
        .then(product => {
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

exports.getProducts = (req, res, next) => {
    Product.findAll({where: {userId: req.session.userId}})
        .then(products => {
            res.render('admin/products', {
                prods: products,
                pageTitle: 'Admin Products',
                path: '/admin/products'
            });
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