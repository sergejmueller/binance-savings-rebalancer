<p align="center">
    <b>Binance Savings Rebalancer</b>
    <br>
    A 🤖 for transfers between Binance Savings for higher interest rates
    <br>
    Activities ↔ Flexible Savings ↔ Locked Savings
</p>

Binance offers 3 types of savings accounts: *Flexible Savings* (deposit and redeem anytime), *Locked Savings* (flexible deposits, higher profits) and *Activities* (limited supply, higher demand).
Savings accounts are unpredictable: different projects for different coins for different durations for different interest rates. 

🤖 checks the Binance API for new financial products and moves coins from account balances into available Savings projects. If necessary, the 🤖 redeems coins from *Flexible Savings* to invest the assets in possible *Locked Savings* or *Activities* with higher interest rates.

The priority of investments: Higher profit first! If available, the coins will be moved to *Activities* first, then to *Locked Savings*. Finally, there is *Flexible Savings*. 


#### Requirements
* Binance API Key (Can Read / Enable Spot Trading)
* Binance API Secret
* Node.js instance (14.x)
* Cron job for periodic checks

#### Install
* No dependencies existing
* Provide `API_KEY` & `API_SECRET` as `process.env` variables
* Try `yarn start`

#### Warning
Use the 🤖 at your own risk.

#### Icon
Made by [Skyclick](https://www.flaticon.com/authors/skyclick) from [Flaticon](https://www.flaticon.com)
