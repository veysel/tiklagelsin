var assert = require('assert');

const config = require("../tools/config.json");

describe('Config Test', async function () {
    it('should value not null for config props', async function () {
        assert.ok(config.baseUrl.length > 0);
        assert.ok(config.backText.length > 0);
        assert.ok(config.brandText.length > 0);
        assert.ok(config.categoryText.length > 0);
        assert.ok(config.productText.length > 0);
    });
});