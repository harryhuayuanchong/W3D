import "./App.css";
import { Layout } from "antd";
import CurrentBalance from "./components/CurrentBalance";
import RequestAndPay from "./components/RequestAndPay";
import AccountDetails from "./components/AccountDetails";
import RecentActivity from "./components/RecentActivity";
import { MainnetTracker, GasFeeTracker } from "./components/GasFeeTracker";
import { Mempool, MempoolMonitor } from "./components/Mempool";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import ThemeButton from "./components/ThemeButton";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import { WalletInformation } from "./components/WalletInformation";
import { useAccount } from "wagmi";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const { Header, Content } = Layout;

function App() {
  const [name, setName] = useState("...");
  const [balance, setBalance] = useState("...");
  const [dollars, setDollars] = useState("...");
  const [history, setHistory] = useState(null);
  const [requests, setRequests] = useState({ "1": [0], "0": [] });

  const { address, isConnected } = useAccount();

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
  }, [address]);
  
  useEffect(() => {
    if (!isConnected) return;
    getNameAndBalance();
  }, [isConnected, getNameAndBalance]);

  return (
    <Router>
        <div className="App">
          <Layout>
            <Header className="header">
              <div className="headerLeft">
                {isConnected && 
                  <>
                    <NavLink to="/" className={({ isActive }) => isActive ? "menuOption active" : "menuOption"} end>Summary</NavLink>
                    <NavLink to="/info" className={({ isActive }) => isActive ? "menuOption active" : "menuOption"}>Info</NavLink>
                    <NavLink to="/gas-fee" className={({ isActive }) => isActive ? "menuOption active" : "menuOption"}>Gas Fee</NavLink>
                    <NavLink to="/mempool" className={({ isActive }) => isActive ? "menuOption active" : "menuOption"}>Mempool</NavLink>
                  </>
                }
              </div>

              <div className="headerRight">
                <ConnectButton />
                <ThemeButton />
              </div>
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
