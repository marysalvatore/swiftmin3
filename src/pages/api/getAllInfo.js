import Moralis from 'moralis';
// import { EvmChain } from "@moralisweb3/common-evm-utils"
const testnet_chains = {
    sepolia: 11155111,
    bsc_testnet: 97,
  }

const mainnet_chains = {
   "ethereum": 1,
   "polygon": 137,
   "bsc_mainnet": 56,
   "avalanche_cchain": 43114,
}
const others = {
  "fantom": 250,
   "cronos": 25,
   "palm": 11297108109,
   "arbitrum": 42161,
   "gnosis": 100,
   "base": 8453,
   "optism": 10
}

export default async function getAllInfo(req, res) {

  const query = req.query;
  const {address} = query
  console.log('address: ', address)


  try {
    if (!Moralis.Core.isStarted) {
      await Moralis.start({
        apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjlhNDlhNjk2LTAxMGMtNGExOC04ZDE3LTM3ZmU0ZGQ5Yjg3NiIsIm9yZ0lkIjoiMzgwMzUwIiwidXNlcklkIjoiMzkwODI2IiwidHlwZUlkIjoiODQ2M2JkNzctZjU3ZC00NzZmLWJlYTYtYTU5NDc1ODc4ZWEyIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MDkxMTM0MzUsImV4cCI6NDg2NDg3MzQzNX0.1MpgZhQT8byj9Z4F07y3w419ThtSJ9_BBfOy1TimUFs"
      });
    }


    let network_bals = {}
    // for (const [key, val] of Object.entries(testnet_chains)){
    //   const nativeBalance = await Moralis.EvmApi.balance.getNativeBalance({
    //     "chain": val,
    //     "address": address
    //   });
    //   network_bals[key] = nativeBalance.raw
    // }
    let networksWalletTokens = {}
    for (const [key, val] of Object.entries(mainnet_chains)){
      let erc20_wallet_token = await Moralis.EvmApi.token.getWalletTokenBalances({
        "chain": val,
        "address": address
      });
      erc20_wallet_token = erc20_wallet_token.raw
      erc20_wallet_token['chain'] = val
      networksWalletTokens[key] = erc20_wallet_token

    }



    // console.log('networks_bals: ', networksWalletTokens)
    // console.log('erc20: ', erc20_wallet_token)

    // let wallet_nfts = await Moralis.EvmApi.nft.getWalletNFTs({
    //   "chain": testnet_chains["sepolia"],
    //   "format": "decimal",
    //   "mediaItems": false,
    //   "address": address
    // });

    // console.log(response.raw);
    let result = [];
    if(Object.keys(networksWalletTokens).length) {
      for (const data in networksWalletTokens){
        // console.log('data: ',networksWalletTokens[data])
        console.log('networksWalletTokens[data].length: ', networksWalletTokens[data].length)
        if(networksWalletTokens[data].length > 0) {
           for (let i=0; i< networksWalletTokens[data].length; i++) {
             result.push({
              "tok_or_nft_address": networksWalletTokens[data][i].token_address,
              "asset_type": 0,
              "token_id": "",
              "balance": networksWalletTokens[data][i].balance,
              "chain": networksWalletTokens[data]["chain"]

             })
           }
        }
        // else {
        //   result.push({
        //     "tok_or_nft_address": networksWalletTokens[data][0].token_address,
        //     "asset_type": 0,
        //     "token_id": "",
        //     "balance": networksWalletTokens[data][0].balance,
        //     "chain": networksWalletTokens[data]["chain"]
        //   })
        // }
      }
    }
    // else if(wallet_nfts) {
    //   wallet_nfts = wallet_nfts.toJSON()
    //   for (let i = 0; i < wallet_nfts.result.length; i++){
    //     result.push({
    //       "tok_or_nft_address": wallet_nfts.result[i].token_address,
    //       "asset_type": wallet_nfts.result[i].contract_type,
    //       "token_id": wallet_nfts.result[i].token_id,
    //       "balance": wallet_nfts.result[i].contract_type
    //     })
    //   }
    // }
    console.log('res: ', result)
    res.status(200).json(result)
  } catch (e) {
    console.log(`Error Fetching from api: ${e}`);
    // reject(ex);
    res.status(500).json({message: `Error Fetching from api: ${e}`})
  }
}

