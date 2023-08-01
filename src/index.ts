import { Kamino } from '@hubbleprotocol/kamino-sdk';
import { Connection } from '@solana/web3.js';
import Decimal from 'decimal.js';

const CLUSTER_URL = 'enter RPC URL here';

async function main() {
    const kamino = new Kamino('mainnet-beta', new Connection(CLUSTER_URL, 'confirmed'));
    const strategies = await kamino.getStrategiesShareData({});
    const msolStrategies = strategies.filter(
        (x) =>
            (x.strategy.tokenAMint.toString() === 'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So' ||
                x.strategy.tokenBMint.toString() ===
                    'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So') &&
            new Decimal(x.strategy.sharesIssued.toString()).greaterThan(0)
    );
    console.log(msolStrategies.length);
    for (const msolStrategy of msolStrategies) {
        const holders = (await kamino.getStrategyHolders(msolStrategy)).filter((x) =>
            x.amount.greaterThan(0)
        );
        if (holders.length > 0) {
            console.log(
                '\nMSOL strategy:',
                msolStrategy.address.toString(),
                'amount of holders:',
                holders.length
            );
            console.log('example stats of one holder: ', holders[0].holderPubkey.toString());
            console.log('qty of ktokens: ', holders[0].amount.toString());
            console.log(
                'position usd value: ',
                holders[0].amount.mul(msolStrategy.shareData.price).toString()
            );
        }
    }
}

(async () => {
    try {
        await main();
    } catch (e) {
        console.error(e);
    }
})();
