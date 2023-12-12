import { useEffect, useState } from "react";
import { Web3 } from "web3";
import "./App.css";

function App() {
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState("");
  const [message, setMessage] = useState("");
  const [addressTo, setAddressTo] = useState("");
  const [quantityForTransfer, setQuantityForTransfer] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const GetMetaMaskProvider = async () => {
    // Verifica se há alguma carteira de criptomoedas
    if (!window.ethereum) throw new Error("No MetaMask Found");

    //const web3 = new Web3(new Web3.providers.HttpProvider('https://data-seed-prebsc-1-s1.binance.org:8545/'));

    // Associa Web3 à um provedor Ethereum fornecido pelo navegador
    const web3 = new Web3(window.ethereum);

    // Recupera todos os endereços das contas associadas a carteira
    const accounts = await web3.eth.requestAccounts();

    // Verifica se há alguma conta criada
    if (!accounts || !accounts.length)
      throw new Error("Wallet not found/allowed");
    else setAddress(accounts[0]);
    return {
      web3: web3,
      address: accounts[0],
    };
  };

  const GetEthBalance = async () => {
    const result = await GetMetaMaskProvider();

    // Adquire saldo da conta
    const balance = await result.web3.eth.getBalance(result.address);

    // Faz uma conversão de Wei para ether, unidade mais comum e "amigável" para apresentar ao usuário sobre o saldo de sua conta
    let balanceEther = result.web3.utils.fromWei(balance, "ether");

    setBalance(balanceEther);
    return balanceEther;
  };

  const verifyTransfer = async () => {
    if (!addressTo || !quantityForTransfer)
      return alert(
        "Preencha os campos de endereço de destino e quantidade corretamente."
      );
    if (balance < quantityForTransfer)
      return alert(
        "Você não tem saldo suficiente na conta para realizar esta transferência."
      );

    setIsLoading(true);
    let hash = await TransferEth(quantityForTransfer);
    console.log("Hash da transação: ", hash);
    setIsLoading(false);

    await CheckBalance();
  };

  const TransferEth = async (quantity) => {
    const result = await GetMetaMaskProvider();

    // Converte valor para ether
    const value = result.web3.utils.toWei(quantity, "ether");

    // Adquire o número de transações que a carteira já fez considerando o bloco mais recente (latest)
    const nonce = await result.web3.eth.getTransactionCount(address, "latest");

    // Montagem da transação, padrão do gás base é 21000
    const transaction = {
      from: address,
      to: addressTo,
      value,
      gas: 21000,
      nonce,
    };

    // Envia a transação
    const tx = await result.web3.eth.sendTransaction(transaction);

    // Retorna o hash da transação, que pode ser consultado na Etherscan/BscScan
    return tx.transactionHash;
  };

  const CheckBalance = async () => {
    await GetEthBalance();
  };

  useEffect(() => {
    (async () => {
      await CheckBalance();
    })();
  }, []);

  return (
    <div>
      <h2>Informações da carteira: </h2>
      <b>Endereço da carteira: </b>
      <p> {address} </p>
      <b>Saldo: </b>
      <p> {balance} BNB </p>

      <button onClick={() => CheckBalance()}>Atualizar Saldo</button>
      <hr />

      <h2>Transferência: </h2>
      <b>Quantidade de BNB para transferência: </b>

      <input
        type="number"
        onChange={(e) => setQuantityForTransfer(e.target.value)}
      />

      <br />
      <b>Cole aqui o endereço de destino: </b>

      <input type="text" onChange={(e) => setAddressTo(e.target.value)} />
      <br />

      <button onClick={() => verifyTransfer()}>Transferir</button>
      {isLoading && <div className="loader"></div>}
    </div>
  );
}

export default App;
