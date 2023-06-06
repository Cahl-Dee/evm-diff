import { arbitrum as arbitrumMetadata } from '@wagmi/chains';
import { Chain, Precompile, Predeploy } from '@/chains';
import { precompiles as mainnetPrecompiles } from '@/chains/mainnet';

// https://developer.arbitrum.io/useful-addresses#arbitrum-precompiles-l2-same-on-all-arb-chains
const precompiles: (Precompile | Predeploy)[] = [
  ...mainnetPrecompiles,
  {
    address: '0x5288c571Fd7aD117beA99bF60FE0846C4E84F933',
    name: 'L2 Gateway Router',
    description:
      'Handles withdrawals from Ethereum into Arbitrum. Tokens are routed to their appropriate L2 gateway (Router itself also conforms to the Gateway interface).',
    deprecated: false,
    references: ['https://developer.arbitrum.io/for-devs/useful-addresses'],
  },
  {
    address: '0x09e9222E96E7B4AE2a407B98d48e330053351EEe',
    name: 'L2 ERC20 Gateway',
    description: 'TODO',
    deprecated: false,
    references: ['https://developer.arbitrum.io/for-devs/useful-addresses'],
  },
  {
    address: '0x096760F208390250649E3e8763348E783AEF5562',
    name: 'L2 Arb-Custom Gateway',
    description: 'TODO',
    deprecated: false,
    references: ['https://developer.arbitrum.io/for-devs/useful-addresses'],
  },
  {
    address: '0x6c411aD3E74De3E7Bd422b94A27770f5B86C623B',
    name: 'L2 Weth Gateway',
    description: 'TODO',
    deprecated: false,
    references: ['https://developer.arbitrum.io/for-devs/useful-addresses'],
  },
  {
    address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
    name: 'L2 Weth',
    description: 'TODO',
    deprecated: false,
    references: ['https://developer.arbitrum.io/for-devs/useful-addresses'],
  },
  {
    address: '0xd570aCE65C43af47101fC6250FD6fC63D1c22a86',
    name: 'L2 Proxy Admin',
    description: 'TODO',
    deprecated: false,
    references: ['https://developer.arbitrum.io/for-devs/useful-addresses'],
  },
  {
    address: '0x467194771dAe2967Aef3ECbEDD3Bf9a310C76C65',
    name: 'L2 Dai Gateway',
    description: 'TODO',
    deprecated: false,
    references: ['https://developer.arbitrum.io/for-devs/useful-addresses'],
  },
  {
    address: '0x6D2457a4ad276000A615295f7A80F79E48CcD318',
    name: 'L2 Livepeer Gateway',
    description: 'TODO',
    deprecated: false,
    references: ['https://developer.arbitrum.io/for-devs/useful-addresses'],
  },
  {
    address: '0x0000000000000000000000000000000000000064',
    name: 'ArbSys',
    description: 'TODO',
    deprecated: false,
    references: ['https://developer.arbitrum.io/for-devs/useful-addresses'],
  },
  {
    address: '0x000000000000000000000000000000000000006E',
    name: 'ArbRetryableTx',
    description: 'TODO',
    deprecated: false,
    references: ['https://developer.arbitrum.io/for-devs/useful-addresses'],
  },
  {
    address: '0x000000000000000000000000000000000000006C',
    name: 'ArbGasInfo',
    description: 'TODO',
    deprecated: false,
    references: ['https://developer.arbitrum.io/for-devs/useful-addresses'],
  },
  {
    address: '0x0000000000000000000000000000000000000066',
    name: 'ArbAddressTable',
    description: 'TODO',
    deprecated: false,
    references: ['https://developer.arbitrum.io/for-devs/useful-addresses'],
  },
  {
    address: '0x000000000000000000000000000000000000006F',
    name: 'ArbStatistics',
    description: 'TODO',
    deprecated: false,
    references: ['https://developer.arbitrum.io/for-devs/useful-addresses'],
  },
  {
    address: '0x00000000000000000000000000000000000000C8',
    name: 'NodeInterface',
    description: 'TODO',
    deprecated: false,
    references: ['https://developer.arbitrum.io/for-devs/useful-addresses'],
  },
  {
    address: '0x0000000000000000000000000000000000000067',
    name: 'ArbBLS',
    description: 'TODO',
    deprecated: false,
    references: ['https://developer.arbitrum.io/for-devs/useful-addresses'],
  },
  {
    address: '0x0000000000000000000000000000000000000065',
    name: 'ArbInfo',
    description: 'TODO',
    deprecated: false,
    references: ['https://developer.arbitrum.io/for-devs/useful-addresses'],
  },
  {
    address: '0x000000000000000000000000000000000000006D',
    name: 'ArbAggregator',
    description: 'TODO',
    deprecated: false,
    references: ['https://developer.arbitrum.io/for-devs/useful-addresses'],
  },
  {
    address: '0x0000000000000000000000000000000000000068',
    name: 'ArbFunctionTable',
    description: 'TODO',
    deprecated: false,
    references: ['https://developer.arbitrum.io/for-devs/useful-addresses'],
  },
  {
    address: '0x7eCfBaa8742fDf5756DAC92fbc8b90a19b8815bF',
    name: 'L2 Multicall',
    description: 'TODO',
    deprecated: false,
    references: ['https://developer.arbitrum.io/for-devs/useful-addresses'],
  },
];

export const arbitrum: Chain = {
  metadata: arbitrumMetadata,
  precompiles,
};
