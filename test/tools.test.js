var assert = require('assert');

const BrandModel = require("../models/brand.model");
const CategoryModel = require("../models/category.model");
const ProductModel = require("../models/product.model");

const Tools = require("../tools/tools");

describe('Tools Test', async function () {
    it('should getBrand method return value check', async function () {
        let brandList = await Tools.getBrand();

        assert.ok(brandList.length > 0);
    });

    it('should getBrand method return value check for error', async function () {
        let brandList = await Tools.getBrand("-1");

        assert.ok(brandList.length < 1);
    });

    it('should getCategory method return value check', async function () {
        let brandList = await Tools.getBrand();
        let categoryList = await Tools.getCategory(brandList[0].name);

        assert.ok(categoryList.length > 0);
    });

    it('should getCategory method return value check for error', async function () {
        let categoryList = await Tools.getCategory("-1");

        assert.ok(categoryList.length < 1);
    });

    it('should getProduct method return value check', async function () {
        let brandList = await Tools.getBrand();
        let categoryList = await Tools.getCategory(brandList[0].name);
        let productList = await Tools.getProduct(brandList[0].name, categoryList[0].name);

        assert.ok(productList.length > 0);
    });

    it('should getProduct method return value check for error', async function () {
        let productList = await Tools.getProduct("-1", "-1");

        assert.ok(productList.length < 1);
    });
});