const config = require("./config.json");
const axios = require("axios");
const cheerio = require("cheerio");

const BrandModel = require("../models/brand.model");
const CategoryModel = require("../models/category.model");
const ProductModel = require("../models/product.model");

async function getBrand(path = "") {
    try {
        const { data } = await axios.get(config.baseUrl + path);
        const $ = cheerio.load(data);

        const listItems = $(".restaurant-box-link");

        let listBrand = [];
        listItems.each((idx, el) => {
            let brand = new BrandModel(
                $(el).attr('href'),
                $(el).attr('href').replace("/", "").replace("-", " ").replace("-", " ").replace("-", " "),
                config.baseUrl + $(el).attr('href')
            );
            listBrand.push(brand);
        });

        return listBrand;
    } catch (err) {
        return [];
    }
}

async function getCategory(brand) {
    try {
        const { data } = await axios.get(config.baseUrl + brand);
        const $ = cheerio.load(data);

        const listItems = $(".products-tabs-container > .products-tabs > .nav-item");

        let listCategory = [];
        listItems.each((idx, el) => {
            let category = new CategoryModel(
                $(el).children("h1, span").text()
            );
            listCategory.push(category);
        });

        return listCategory;
    } catch (err) {
        return [];
    }
}

async function getProduct(brand, category) {
    try {
        const { data } = await axios.get(config.baseUrl + brand);
        const $ = cheerio.load(data);

        const listItems = $(".product-card-body");

        let listProduct = [];
        listItems.each((idx, el) => {
            let product = new ProductModel(
                $(el).parent().parent().parent().parent().parent().parent().attr("title") || $(el).parent().parent().parent().parent().parent().attr("title"),
                $(el).children(".product-content").text(),
                $(el).children(".bottom-wrapper").children("span").children("span").html()
            );

            listProduct.push(product);
        });

        listProduct = listProduct.filter(x => x.category == category);
        return listProduct;
    } catch (err) {
        return [];
    }
}

module.exports = {
    getBrand: getBrand,
    getCategory: getCategory,
    getProduct: getProduct
}