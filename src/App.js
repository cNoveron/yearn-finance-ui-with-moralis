import React, { useEffect } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import {
  Switch,
  Route
} from "react-router-dom";
import { useMoralis } from "react-moralis";
import IpfsRouter from 'ipfs-react-router'

import './i18n';
import interestTheme from './theme';

// import APR from './components/apr';
// import InvestSimple from './components/investSimple';
// import Manage from './components/manage';
// import Performance from './components/performance';
// import Zap from './components/zap';
// import IDai from './components/idai';
import Footer from './components/footer';
import Home from './components/home';
import Header from './components/header';
import Vaults from './components/vault';
// import Dashboard from './components/dashboard';
// import Experimental from './components/experimental';
// import Lending from './components/lending';
// import Cover from './components/cover';
// import Firehose from './components/firehose';
import SEO from './components/seo';

import { injected } from "./stores/connectors";

import {
  CONNECTION_CONNECTED,
} from './constants'

import Store from "./stores";
const emitter = Store.emitter
const store = Store.store

const App = ({}) => {

  const { enableWeb3, isWeb3Enabled, isAuthenticated, isWeb3EnableLoading, Moralis, } = useMoralis()

  function updateAccount() {
    window.ethereum.on('accountsChanged', function (accounts) {
      store.setStore({
        account: { address: accounts[0] },
        moralis: Moralis,
      })

      const web3context = store.getStore('web3context')
      if(web3context) {
        emitter.emit(CONNECTION_CONNECTED)
      }
    })
  }

  useEffect(() => {
    injected.isAuthorized().then(isAuthorized => {
      if (isAuthorized) {
        injected.activate()
          .then((a) => {
            store.setStore({
              account: { address: a.account },
              web3context: { library: { provider: a.provider } },
              moralis: Moralis,
            })
            emitter.emit(CONNECTION_CONNECTED)
            // store.connectToFirehose(a.account)
          })
          .catch((e) => {
            console.log(e)
          })
      } else {

      }
    });

    if (window.ethereum) {
      updateAccount()
    } else {
      window.addEventListener('ethereum#initialized', updateAccount, {
        once: true,
      });
    }
  }, [])

  useEffect(() => {
    const connectorId = window.localStorage.getItem("connectorId");
    if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading) enableWeb3({ provider: connectorId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isWeb3Enabled]);

  return (
    <MuiThemeProvider theme={ createMuiTheme(interestTheme) }>
      <CssBaseline />
      <IpfsRouter>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          alignItems: 'center',
          background: "#f9fafb"
        }}>
          <SEO />
          <Switch>
            {/* <Route path="/stats">
              <Header />
              <APR />
            </Route>
            <Route path="/earn">
              <Header />
              <InvestSimple />
            </Route>
            <Route path="/zap">
              <Header />
              <Zap />
            </Route>
            <Route path="/idai">
              <IDai />
            </Route>
            <Route path="/performance">
              <Header />
              <Performance />
            </Route>
            <Route path="/manage">
              <Header />
              <Manage />
            </Route> */}
            <Route path="/vaults">
              <Header />
              <Vaults />
            </Route>
            {/* <Route path='/dashboard'>
              <Header />
              <Dashboard />
            </Route>
            <Route path='/experimental'>
              <Header />
              <Experimental />
            </Route>
            <Route path='/lending'>
              <Header />
              <Lending />
            </Route>
            <Route path='/cover'>
              <Header />
              <Cover />
            </Route>
            <Route path='/firehose'>
              <Header />
              <Firehose />
            </Route> */}
            <Route path="/">
              <Home />
            </Route>
          </Switch>
          <Footer />
        </div>
      </IpfsRouter>
    </MuiThemeProvider>
  );

}

export default App;
