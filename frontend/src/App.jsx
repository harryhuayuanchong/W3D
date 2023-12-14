import "./App.css";
import logo from "./logo.png";
import { Layout } from "antd";
import CurrentBalance from "./components/CurrentBalance";
import RequestAndPay from "./components/RequestAndPay";
import AccountDetails from "./components/AccountDetails";
import RecentActivity from "./components/RecentActivity";
import { MainnetTracker, GasFeeTracker } from "./components/GasFeeTracker";
import { Mempool, MempoolMonitor } from "./components/Mempool";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import ThemeButton from "./components/ThemeButton";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { WalletInformation } from "./components/WalletInformation";
import { useConnect, useAccount, useDisconnect } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";


const { Header, Content } = Layout;

function DisplayElements() {
  return (
    <>
      <div className="firstColumn">
        <CurrentBalance />
        <RequestAndPay />
        <AccountDetails />
      </div>
      <div className="secondColumn">
        <RecentActivity />
      </div>
    </>
  )
}

function App() {
  const [name, setName] = useState("...");
  const [balance, setBalance] = useState("...");
  const [dollars, setDollars] = useState("...");
  const [history, setHistory] = useState(null);
  const [requests, setRequests] = useState({ "1": [0], "0": [] });

  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { connect } = useConnect({
    connector: new MetaMaskConnector()
  })

  const getNameAndBalance = useCallback(async () => {
    const res = await axios.get("http://localhost:3001/sepolia/getNameAndBalance", {
      params: { userAddress: address },
    });
  
    const response = res.data;
    console.log(response);
  
    if (response.name[1]) {
      setName(response.name[0])
    }
    setBalance(String(response.balance));
    setDollars(String(response.dollars));
    setHistory(response.history);
    setRequests(response.requests);
  }, [address]); // 依赖数组包含 address，因为函数内部使用了它
  
  useEffect(() => {
    if (!isConnected) return;
    getNameAndBalance();
  }, [isConnected, getNameAndBalance]); // 添加 getNameAndBalance 作为依赖
  

  function disconnectAndSetNull() {
    disconnect();
    setName("...");
    setBalance("...");
    setDollars("...");
    setHistory("...");
    setRequests({ "1": [0], "0": [] });
  }

  return (
    <Router>
        <div className="App">
          <Layout>
            <Header className="header">
              <div className="headerLeft">
                <span><img src={logo} alt="logo" className="logo" /></span>
                {isConnected && 
                  <>
                    <Link to="/" className="menuOption" style={{ borderBottom: "1.5px solid black" }}>Summary</Link>
                    <Link to="/info" className="menuOption">Info</Link>
                    <Link to="/gas-fee" className="menuOption">Gas Fee</Link>
                    <Link to="/mempool" className="menuOption">Mempool</Link>
                  </>
                }
              </div>

              {/* <Button type={"primary"}>Connect Wallet</Button> */}
              <div><ConnectButton /></div>
              <div><ThemeButton /></div>
            </Header>
            <Content className="content">
              {isConnected ? (
                <Routes>
                  <Route path="/" element={
                    <>
                      <div className="firstColumn">
                        <CurrentBalance dollars={dollars} />
                        <RequestAndPay requests={requests} getNameAndBalance={getNameAndBalance} />
                        <AccountDetails address={address} name={name} balance={balance} />
                      </div>
                      <div className="secondColumn">
                        <RecentActivity />
                      </div>
                    </>
                  } />
                  <Route path="/info" element={<WalletInformation />} />
                  <Route path="/gas-fee" element={<MainnetTracker />} />
                  <Route path="/mempool" element={<Mempool />} />
                </Routes>
              ) : (
                <div>Please Connect Your Wallet!</div>
              )}
            </Content>
          </Layout>
        </div>
    </Router>
  );
}

export default App;
