import { Kamino } from '@hubbleprotocol/kamino-sdk';
import { Connection } from '@solana/web3.js';

const CLUSTER_URL = 'https://api.mainnet-beta.solana.com';

async function main() {
    console.log('hello');
    const kamino = new Kamino('mainnet-beta', new Connection(CLUSTER_URL, 'confirmed'));
    const strategies = await kamino.getAllStrategiesWithFilters({});
    const msolStrategies = strategies.filter(
        (x) =>
            x.strategy.tokenAMint.toString() === 'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So' ||
            x.strategy.tokenBMint.toString() === 'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So'
    );
    for (const msolStrategy of msolStrategies) {
        const holders = await kamino.getStrategyHolders(msolStrategy);
        console.log(
            'MSOL strategy:',
            msolStrategy.address.toString(),
            'amount of holders:',
            holders.length
        );
    }
}

(async () => {
    try {
        await main();
    } catch (e) {
        console.error(e);
    }
})();
