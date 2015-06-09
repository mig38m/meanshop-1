var express = require('express');

var routes = function (Product) {
    var productRouter = express.Router();

    // Fetch all products
    productRouter.route('/')
        .get(function (req, res) {
            Product.find({}, function (err, products) {
                if(err) {
                    res.send.err;
                    return;
                }
                res.json(products);
            });
        });

    // Fetch one product
    productRouter.use('/:productId', function (req, res, next) {
        Product.findOne({sku: req.params.productId}, function (err, product) {
            if (err) {
                res.status(500).send(err);
            } else if(product) {
                req.product = product;
                next();
            } else {
                res.status(404).send('Product not found')
            }
        });
    })

    productRouter.route('/:productId')
        .get(function (req, res) {
            res.json(req.product);
        })

    // Add product
    productRouter.route('/addproduct')
        .post(function (req, res) {

            var newProduct = new Product({
                sku: req.body.sku,
                title: req.body.title,
                description: req.body.description,
                brand: req.body.brand,
                type: req.body.type,
                pricing: {
                    price: req.body.price,
                    oldPrice: req.body.oldPrice,
                    inStock: req.body.inStock || 10
                },
                details: {
                    sizes: req.body.sizes,
                    color: req.body.color,
                    structure: req.body.structure
                },
                images: req.body.images
            });

            newProduct.save(function (err) {
                if(err) {
                    throw err;
                }
                else {
                    console.log('New Product has been posted');
                }


                res.json({
                    success: true,
                    pfoduct: newProduct
                });
            });
        });

    return productRouter;
};

module.exports = routes;