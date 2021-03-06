/**
 * Required modules
 */
const crypto = require('crypto')
const https = require('https')

/** Binance API Wrapper */
module.exports = class BinanceApi {
    /**
     * Create a Binance API Client
     * @param {String} apiKey - Binance API Key
     * @param {String} apiSecret - Binance API Secret
     */
    constructor(apiKey, apiSecret) {
        this.apiKey = apiKey
        this.apiSecret = apiSecret
    }

    /**
     * Build a query/search string from key/value pairs
     * @param {Object} paramPairs - URL parameters as key/value pairs
     * @return {String} Query/Search string built from key/value pairs
     */
    buildQueryString(paramPairs) {
        const searchParams = new URLSearchParams()

        Object.keys(paramPairs).forEach(paramKey => {
            searchParams.append(paramKey, paramPairs[`${paramKey}`].toString())
        })

        return searchParams.toString()
    }

    /**
     * Build a signed URL for API requests
     * @param {String} pathName - API pathname
     * @param {Object} paramPairs - URL parameters as key/value pairs
     * @return {Object} Signed (new) URL for API requests
     */
    buildUrl(pathName, paramPairs) {
        const fullUrl = new URL(pathName, this.apiEndpoint)
        const queryString = this.buildQueryString(paramPairs)
        const querySignature = this.buildSignature(queryString)

        fullUrl.search = this.buildQueryString({...paramPairs, signature: querySignature})

        return fullUrl
    }

    /**
     * Build a signature based on API Secret and URL query/search string
     * @param {String} queryString - URL query/search string
     * @return {String} Signature based on API Secret and URL query/search string
     */
    buildSignature(queryString) {
        return crypto
            .createHmac('sha256', this.apiSecret)
            .update(queryString)
            .digest('hex')
    }

    /**
     * Fetch Binance API
     * @param {String} pathName - API pathname
     * @param {Object} paramPairs - URL parameters as key/value pairs
     * @param {Object} requestOptions - Request options as key/value pairs
     * @return {Promise} A promise to fetchApi
     */
    async fetchApi(pathName, paramPairs= {}, requestOptions = { method: 'GET' }) {
        return new Promise( (resolve, reject) => {
            if (!this.apiKey || !this.apiSecret) {
                reject(new Error('API Key and API Secret are required'))
            }

            paramPairs = {
                ...paramPairs,
                timestamp: Date.now()
            }

            requestOptions = {...requestOptions,
                json: true,
                headers: {'X-MBX-APIKEY': this.apiKey}
            }

            https.get(this.buildUrl(pathName, paramPairs), requestOptions, response => {
                let body = ''

                response.on('data', chunk => body += chunk)
                response.on('end', () => resolve(JSON.parse(body)))

            }).on('error', (error) => {
                reject(new Error(`Fetch error: ${error}`))
            })
        })
    }

    /**
     * Return Binance API endpoint
     * @return {String} Binance API endpoint
     */
    get apiEndpoint() {
        return 'https://api.binance.com'
    }
}
