import { useEffect, useState } from 'react';
import { Web3 } from 'web3';

function App() {
  const [address, setAddress] = useState("0x72ad7012771D5A828e7aB604258c06F4D0817525");
  const [balance, setBalance] = useState('');
  const [message, setMessage] = useState('');

  const GetMetaMaskProvider = async () => {
    if(!window.ethereum) throw new Error('No MetaMask Found');

    //const web3 = new Web3(new Web3.providers.HttpProvider('https://data-seed-prebsc-1-s1.binance.org:8545/'));

    const web3 = new Web3(window.ethereum);

    const accounts = await web3.eth.requestAccounts();

    if(!accounts || !accounts.length) throw new Error('Wallet not found/allowed');
    return web3;
  }

  const GetEthBalance = async (address) => {
    const web3 = await GetMetaMaskProvider();
    const balance = await web3.eth.getBalance(address);
    let balanceEther = web3.utils.fromWei(balance, 'ether');
    setBalance(balanceEther);
    return balanceEther;
  }

  const CheckBalance = async () => {
    let balance = await GetEthBalance(address);
    console.log(balance)
  }

  return (
    <>
      <b>Saldo: </b>
      <p> {balance} BNB </p>
     <button onClick={() => CheckBalance()} >Ver Saldo</button> 
    </>
  )
}

export default App
