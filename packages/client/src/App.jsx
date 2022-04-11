import "./styles/App.css";
import twitterLogo from "./assets/twitter-logo.svg";
import React, { useEffect } from "react";
import { useState } from "react";
import { ethers } from "ethers";
import contracts from "./contracts/hardhat_contracts.json";
import config from "./config.json";

// Constants
const TWITTER_HANDLE = "diegoalzate00";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const TOTAL_MINT_COUNT = 50;
const chainId = Number(config.rinkeby.id);
const contractAddress = contracts[chainId][0].contracts.RadNFT.address;
const contractABI = contracts[chainId][0].contracts.RadNFT.abi;
const rinkebyChainId = "0x4";
const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [openseaLink, setOpenSeaLink] = useState("");
  const [totalTokens, setTotalTokens] = useState(0);
  const [loading, setLoading] = useState(false);
  const [notOnNetwork, setNotOnNetwork] = useState(false);
  useEffect(() => {
    checkifWalletIsConnected();
  }, []);

  useEffect(() => {
    getTotalTokens();
  }, []);

  useEffect(() => {
    checkNetwork();
  }, []);

  const getTotalTokens = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        console.log("Going to pop wallet now to pay gas...");
        let totalTokens = await connectedContract.getTotalMinted();

        setTotalTokens(totalTokens);

        console.log(`total tokens: ${totalTokens}`);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkifWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
    } else {
      console.log("We have an ethereum object", ethereum);
    }

    /*
     * Check if we're authorized to access the user's wallet
     */

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an aouthorized account:", account);
      setCurrentAccount(account);
      setupEventListener();
    } else {
      console.log("Not authorized");
    }
  };

  const setupEventListener = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have an ethereum object", ethereum);
    }

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const connectedContract = new ethers.Contract(
      contractAddress,
      contractABI,
      signer
    );

    if (connectedContract) {
      connectedContract.on("NewRadNFTMinted", (from, tokenId) => {
        console.log(from, tokenId.toNumber());
        setOpenSeaLink(
          `https://testnets.opensea.io/assets/${contractAddress}/${tokenId.toNumber()}`
        );
        setLoading(false);
        getTotalTokens();
      });
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("You need metamask to access this site");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("connected", accounts.at(-1));
      setCurrentAccount(accounts.at(-1));
      setupEventListener();
    } catch (error) {
      console.log(error);
    }
  };

  const checkNetwork = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
    } else {
      console.log("We have an ethereum object", ethereum);
    }

    let chainId = await ethereum.request({ method: "eth_chainId" });

    // String, hex code of the chainId of the Rinkebey test network
    if (chainId !== rinkebyChainId) {
      alert("You are not connected to the Rinkeby Test Network!");
      setNotOnNetwork(true);
    }
  };

  const askContractToMintNft = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        setLoading(true);
        setOpenSeaLink("");
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        console.log("Going to pop wallet now to pay gas...");
        let nftTxn = await connectedContract.makeARadNFT();
        console.log("Mining...please wait.");
        await nftTxn.wait();
        console.log(
          `Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`
        );
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const changeNetworkToRinkeby = async () => {
    const { ethereum } = window;

    if (ethereum) {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: rinkebyChainId }],
      });
      setNotOnNetwork(false);
    } else {
      alert("Install Metamask to interact with this site");
    }
  };

  const renderNotConnectedContainer = () => (
    <button
      onClick={connectWallet}
      className="cta-button connect-wallet-button"
    >
      Connect to Wallet
    </button>
  );

  const renderMintUI = () => (
    <button
      onClick={askContractToMintNft}
      className="cta-button mint-button"
      disabled={loading}
    >
      {loading ? "Minting..." : "Mint NFT"}
    </button>
  );

  const renderConnectToNetwork = () =>
    notOnNetwork && (
      <button
        onClick={changeNetworkToRinkeby}
        className="cta-button connect-wallet-button connect-network"
        disabled={loading}
      >
        Connect to Rinkeby network
      </button>
    );

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">Rad NFT Collection</p>
          <p className="mint-count">{`Total Minted: ${totalTokens}/${TOTAL_MINT_COUNT}`}</p>
          <p className="sub-text">Unique NFTs with F1 drivers and companies.</p>
          {notOnNetwork
            ? renderConnectToNetwork()
            : !currentAccount
            ? renderNotConnectedContainer()
            : renderMintUI()}
          
          <div>
          <a href="https://testnets.opensea.io/collection/radnft-a8tgxbnjp2">
            <button className="cta-button opensea-button">
            Check out the collection on Opensea</button>
          </a>
          </div>
          {openseaLink && (
            <div className="gradient-text">
              <a href={openseaLink}> Check out the nft here </a>
            </div>
          )}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built by @${TWITTER_HANDLE}`}</a>
        </div>
        <p className="footer-text">
          {" "}
          No rights are reserved, this is only for fun
        </p>
      </div>
    </div>
  );
};

export default App;
