var assert = require('assert');

const BrandModel = require("../models/brand.model");
const CategoryModel = require("../models/category.model");
const ProductModel = require("../models/product.model");

const TestText = "TEST";

describe('Model Test', function () {
    it('should create brand model', function () {
        let brand = new BrandModel("", "", "");

        assert.equal(brand.name.length, 0);
        assert.equal(brand.prettyName.length, 0);
        assert.equal(brand.url.length, 0);
    });

    it('should create category model', function () {
        let category = new CategoryModel("");

        assert.equal(category.name.length, 0);
    });

    it('should create product model', function () {
        let product = new ProductModel("", "", "");

        assert.equal(product.category.length, 0);
        assert.equal(product.name.length, 0);
        assert.equal(product.price.length, 0);
    });

    it('should value not null for brand model', function () {
        let brand = new BrandModel(TestText, TestText, TestText);

        assert.equal(brand.name, TestText);
        assert.equal(brand.prettyName, TestText);
        assert.equal(brand.url, TestText);
    });

    it('should value not null for category model', function () {
        let category = new CategoryModel(TestText);

        assert.equal(category.name, TestText);
    });

    it('should value not null for product model', function () {
        let product = new ProductModel(TestText, TestText, TestText);

        assert.equal(product.category, TestText);
        assert.equal(product.name, TestText);
        assert.equal(product.price, TestText);
    });
});