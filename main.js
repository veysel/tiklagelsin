#!/usr/bin/env node

const config = require("./tools/config.json");
const tools = require("./tools/tools");
const inquirer = require('inquirer');

let selectedBrand = "";
let selectedCategory = "";
let selectedProduct = "";

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
                choices: [config.backText, ...productList.map(x => x.name + " - " + x.price)],
            },
        ])
        .then(answersProduct => {
            if (answersProduct.product == config.backText) {
                console.clear();
                askCategory();
            }
            else {
                selectedProduct = answersProduct.product;
            }
        });
}

askBrand();