/**
 * Required module
 */
const helpers = require('./helpers')

/** Flexible Savings API Wrapper */
module.exports = class Flexible {
    /**
     * Create a Flexible Savings Client
     * @param {Object} binanceApiClient - Binance API Client
     * @param {Array.<Object>} accountBalances - Account Balances
     * @param {Array.<Object>} flexibleBalances - Flexible Savings Balances
     */
    constructor(binanceApiClient, accountBalances, flexibleBalances) {
        this.binanceApiClient = binanceApiClient
        this.accountBalances = helpers.stripLendingPrefix(accountBalances)
        this.flexibleBalances = helpers.stripLendingPrefix(flexibleBalances)
    }

    /**
     * Get available Flexible Savings products
     * @return {Array.<Object>} Available products
     */
    async getAvailableProducts() {
        const products = await this.binanceApiClient.fetchApi(
            '/sapi/v1/lending/daily/product/list',
            { status: 'SUBSCRIBABLE' }
        )

        return helpers.filterEqualAssetsByAmount(
            this.accountBalances,
            helpers.filterDifferentAssets(this.flexibleBalances, products)
        )
    }

    /**
     * Purchase Flexible Savings products
     * @param {Array.<Object>} products - Flexible Savings products to purchase
     */
    async purchaseProducts(products) {
        await Promise.all(
            products.map(async product => {
                const { productId, free, upLimitPerUser } = product
                const amount = Math.min(free, upLimitPerUser)

                await this.binanceApiClient.fetchApi(
                    '/sapi/v1/lending/daily/purchase',
                    { productId, amount },
                    { method: 'POST' }
                )

                helpers.log('Purchase a Flexible Savings product', [product])
            })
        )
    }

    /**
     * Redeem Flexible Savings products
     * @param {Array.<Object>} products - Flexible Savings products to redeem
     */
    async redeemProducts(products) {
        await Promise.all(
            products.map(async product => {
                const { asset } = product

                const position = await this.binanceApiClient.fetchApi(
                    '/sapi/v1/lending/daily/token/position',
                    { asset }
                )

                const type = 'FAST'
                const amount = position[0]['freeAmount']
                const productId = position[0]['productId']

                await this.binanceApiClient.fetchApi(
                    '/sapi/v1/lending/daily/redeem',
                    { productId, amount, type },
                    { method: 'POST' }
                )

                helpers.log('Redeem a Flexible Savings product', [product])
            })
        )
    }
}
