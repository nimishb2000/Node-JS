const fs = require('fs');
const path = require('path');

const cart = require('./cart');

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'products.json'
);

const getproductsfromFile = cb => {
    fs.readFile(p, (err, fileContent) => {
        if (err) {
            cb([]);
        }
        else {
            cb(JSON.parse(fileContent));
        }
    });
};

module.exports = class Product {
    constructor(id, title, imageURL, description, price) {
        this.id = id;
        this.title = title;
        this.imageURL = imageURL;
        this.description = description;
        this.price = price;
    }

    save() {
        getproductsfromFile(products => {
            if (this.id) {
                const productIndex = products.findIndex(prod => prod.id === this.id);
                const updatedProduct = [...products];
                updatedProduct[productIndex] = this;
                fs.writeFile(p, JSON.stringify(updatedProduct), err => {
                    console.log(err);
                });
            }
            else {
                this.id = Math.random().toString();
                products.push(this);
                fs.writeFile(p, JSON.stringify(products), err => {
                    console.log(err);
                });
            }
        });
    }

    static delete(id) {
        getproductsfromFile(products => {
            const product = products.find(prod => prod.id === id);
            const updatedProducts = products.filter(prod => prod.id !== id);
            fs.writeFile(p, JSON.stringify(updatedProducts), err => {
                if (!err) {
                    cart.deleteProduct(id, product.price);
                }
            });
        });
    }

    static fetchAll(cb) {
        getproductsfromFile(cb);
    }

    static findbyID(id, cb) {
        getproductsfromFile(products => {
            const prod = products.find(p => p.id === id);
            cb(prod);
        });
    }
};