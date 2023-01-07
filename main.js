#!/usr/bin/env node

const config = require("./tools/config.json");
const tools = require("./tools/tools");
const inquirer = require('inquirer');
const open = require('open');

let selectedBrand = "";
let selectedCategory = "";
let selectedProduct = "";
let selectedProductForDisplay = "";

async function askBrand() {
    let brandList = await tools.getBrand();

    inquirer
        .prompt([
            {
                type: 'list',
                name: 'brand',
                message: config.brandText,
                choices: brandList.map(x => x.name),
            },
        ])
        .then(answersBrand => {
            selectedBrand = answersBrand.brand;
            askCategory();
        });
}

async function askCategory() {
    let categoryList = await tools.getCategory(selectedBrand);

    inquirer
        .prompt([
            {
                type: 'list',
                name: 'category',
                message: config.categoryText,
                choices: [config.backText, ...categoryList.map(x => x.name)],
            },
        ])
        .then(answersCategory => {
            if (answersCategory.category == config.backText) {
                console.clear();
                askBrand();
            }
            else {
                selectedCategory = answersCategory.category;
                askProduct();
            }
        });
}

async function askProduct() {
    let productList = await tools.getProduct(selectedBrand, selectedCategory);

    inquirer
        .prompt([
            {
                type: 'list',
                name: 'product',
                message: config.productText,
                choices: [config.backText, ...productList.map(x => x.name + " - " + x.price + " TL")],
            },
        ])
        .then(answersProduct => {
            if (answersProduct.product == config.backText) {
                console.clear();
                askCategory();
            }
            else {
                selectedProductForDisplay = answersProduct.product;
                selectedProduct = productList.find(x => x.name + " - " + x.price + " TL" == answersProduct.product);
                askGoToProduct();
            }
        });
}

async function askGoToProduct() {
    let productUrl = await tools.getProductUrl(selectedBrand, selectedCategory, selectedProduct.name);
    let productImageUrl = await tools.getProductImageUrl(selectedBrand, selectedCategory, selectedProduct.name);

    inquirer
        .prompt([
            {
                type: 'list',
                name: 'product',
                message: config.productDetailText,
                choices: [config.backText, config.goToProductText, config.goToProductImageText, config.exit],
            },
        ])
        .then(answersProduct => {
            if (answersProduct.product == config.backText) {
                console.clear();
                askProduct();
            }
            else if (answersProduct.product == config.goToProductText) {
                open(productUrl);
                console.clear();
                askGoToProduct();
            }
            else if (answersProduct.product == config.goToProductImageText) {
                open(productImageUrl);
                console.clear();
                askGoToProduct();
            }
            else if (answersProduct.product == config.exit) {

            }
        });
}

askBrand();