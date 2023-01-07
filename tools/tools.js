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
        const { data } = await axios.get(config.brandDataUrl.replace("{brand}", brand));
        let categoryList = data?.result?.data?.allApiProduct?.nodes[0]?.products.find(x => x.categoryName == category)?.subcategories;

        let listProduct = [];
        categoryList.forEach(elementCategory => {
            elementCategory?.products?.forEach(elementProduct => {
                let product = new ProductModel(
                    category,
                    elementProduct?.name,
                    elementProduct?.price
                );
    
                listProduct.push(product);
            });
        });

        return listProduct;
    } catch (err) {
        return [];
    }
}

async function getProductUrl(brand, category, product) {
    try {
        const { data } = await axios.get(config.brandDataUrl.replace("{brand}", brand));

        let brandId = data?.result?.data?.allApiProduct?.nodes[0]?.brandId;
        let categoryList = data?.result?.data?.allApiProduct?.nodes[0]?.products.find(x => x.categoryName == category)?.subcategories;

        let productList = [];
        categoryList.forEach(element => {
            productList.push(...element.products);
        });

        let productId = productList.find(x => x.name == product).value;
        let productUrl = config.productUrl.replace("{brandId}", brandId).replace("{productId}", productId);

        return productUrl;
    } catch (err) {
        return config.baseUrl;
    }
}

async function getProductImageUrl(brand, category, product) {
    try {
        const { data } = await axios.get(config.brandDataUrl.replace("{brand}", brand));

        let categoryList = data?.result?.data?.allApiProduct?.nodes[0]?.products.find(x => x.categoryName == category)?.subcategories;

        let productList = [];
        categoryList.forEach(element => {
            productList.push(...element.products);
        });

        let productImageUrl = productList.find(x => x.name == product).productImage.Media.Url;

        return productImageUrl;
    } catch (err) {
        return config.baseUrl;
    }
}

module.exports = {
    getBrand: getBrand,
    getCategory: getCategory,
    getProduct: getProduct,
    getProductUrl: getProductUrl,
    getProductImageUrl: getProductImageUrl
}