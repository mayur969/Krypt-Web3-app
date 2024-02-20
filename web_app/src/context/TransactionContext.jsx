import React, { useEffect, useState} from 'react';
import { ethers } from 'ethers';
import { contractABI, contractAddress } from "../utils/constants";

export const TransactionContext = React.createContext();

const { ethereum } = window;

const createEthereumContract = async () => {
    const provider = new ethers.BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const transactionsContract = new ethers.Contract(contractAddress, contractABI, signer);

    return transactionsContract;
};

export const TransactionProvider = ({ children }) => {

    const [currentAccount, setCurrentAccount] = useState("");
    const [transactions, setTransactions] = useState([]);
    const [formData, setFormdata] = useState({ addreessTo: "", amount: "", keyword: "", message: "" });
    const [isLoding, setIsLoading] = useState(false);
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem("transactionCount"));

    const handleChange = (e, name) => {
        setFormdata((prev) => ({ ...prev, [name]: e.target.value }));
    };

    const getAllTransactions = async () => {
        try {
            if (ethereum) {
                const transactionsContract = await createEthereumContract();

                const availableTransactions = await transactionsContract.getAllTransactions();

                const struscturedTransactions = availableTransactions.map((transaction) => ({
                    addressTo: transaction.receiver,
                    addressFrom: transaction.sender,
                    timestamp: new Date(Number(transaction.timeStamp)* 1000).toLocaleString(),
                    message: transaction.message,
                    keyword: transaction.keyword,
                    amount: parseInt(transaction.amount) / (10 ** 18)
                }));

                setTransactions(struscturedTransactions);

            } else {
                console.log("Ethereum is not present");

            }
        } catch (error) {
            console.log(error);
        }
    };

    const checkIfWalletIsConnected = async () => {
        try {
            if (!ethereum) return alert("Please Install Metamask.");

            const accounts = await ethereum.request({ method: "eth_accounts" });

            if (accounts.length) {
                setCurrentAccount(accounts[0]);
                getAllTransactions();

            }
            else {
                console.log("No accounts found");
            }
        } catch (error) {
            console.log(error);
        }
    }

    const connectWallet = async () => {
        try {
            if (!ethereum) return alert("please install Metamask.");

            const accounts = await ethereum.request({ method: "eth_requestAccounts" });

            setCurrentAccount(accounts[0]);
            window.location.reload();
        } catch (error) {
            console.log(error);

            throw new Error("No Ethereum Object");
        }
    };

    const sendTransaction = async () => {
        try {
            if (ethereum) {
                const { addressTo, amount, keyword, message } = formData;

                const transactionsContract = await createEthereumContract();
                const parsedAmount = ethers.parseEther(amount);

                console.log(addressTo);
                await ethereum.request({
                    method: 'eth_sendTransaction',
                    params: [{
                        from: currentAccount,
                        to: addressTo,
                        gas: '0x5208',
                        value: parsedAmount._hex,

                    }]

                })
                const transactonHash = await transactionsContract.addToBlockchain(addressTo, parsedAmount, message, keyword);

                setIsLoading(true);
                console.log(`Loading - ${transactonHash.hash}`);
                await transactonHash.wait();
                setIsLoading(false);
                console.log(`Success - ${transactonHash.hash}`);

                const transactionCount = await transactionsContract.getTransactionCount();

                setTransactionCount(transactionCount.toNumber);
                window.location.reload();
            }else {
                console.log("No ethereum object");
              }

        } catch (error) {
            console.log(error);

            throw new Error("NO Ethereum object");

        }
    }

    const checkIfTransactionsExists = async () => {
        try {
            if (ethereum) {
                const transactionsContract = await createEthereumContract();
                const currentTransactionCount = await transactionsContract.getTransactionCount();

                window.localStorage.setItem("transactionCount", currentTransactionCount);
            }
        } catch (error) {
            console.log(error);

            throw new Error("No Ethereum Object");
        }
    }

    useEffect(() => {
        checkIfWalletIsConnected();
        checkIfTransactionsExists();
    }, [transactionCount]);

    return (
        <TransactionContext.Provider value={{ connectWallet, currentAccount, formData, setFormdata, handleChange, sendTransaction, transactions, isLoding }}>
            {children}
        </TransactionContext.Provider>
    )
}