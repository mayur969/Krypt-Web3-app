import './App.css';
import { Navbar, Welcome, Services, Transactions, Footer } from './components';
import { TransactionProvider } from './context/TransactionContext';

function App() {
  return (
    <TransactionProvider>
    <div className="min-h-screen">
      <div className="gradient-bg-welcome">
        <Navbar />
        <Welcome />
      </div>
      <Services />
      <Transactions />
      <Footer />
    </div>
    </TransactionProvider>
  );
}

export default App;
