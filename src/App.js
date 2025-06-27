import React, { useState } from 'react';
import './App.css';

function App() {
  const [amount, setAmount] = useState('');
  const [coins, setCoins] = useState('');
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult([]);
    setLoading(true);
    // Parse coin denominations
    let coinArr = coins.split(',').map(c => parseFloat(c.trim())).filter(c => !isNaN(c));
    if (!amount || coinArr.length === 0) {
      setError('Please enter a valid amount and coin denominations');
      setLoading(false);
      return;
    }
    try {
      const response = await fetch('https://coin-calculate-backend.onrender.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: parseFloat(amount), coins: coinArr })
      });
      if (!response.ok) throw new Error('Request failed');
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError('Request error, please check if the backend service is running');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App" style={{ maxWidth: 480, margin: '40px auto', padding: 32, background: '#fff', border: '1px solid #e0e0e0', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 32, fontWeight: 700, letterSpacing: 1 }}>Minimum Coin Change Calculator</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontWeight: 500 }}>Target Amount</label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="e.g. 7.03"
            style={{ padding: '10px 14px', border: '1px solid #bdbdbd', borderRadius: 8, fontSize: 16, outline: 'none', transition: 'border 0.2s' }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontWeight: 500 }}>Coin Denominations (comma separated)</label>
          <input
            type="text"
            value={coins}
            onChange={e => setCoins(e.target.value)}
            placeholder="e.g. 0.01, 0.5, 1, 5, 10"
            style={{ padding: '10px 14px', border: '1px solid #bdbdbd', borderRadius: 8, fontSize: 16, outline: 'none', transition: 'border 0.2s' }}
          />
        </div>
        <button type="submit" disabled={loading} style={{ padding: '12px 0', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 18, cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 2px 8px rgba(25,118,210,0.08)', transition: 'background 0.2s' }}>
          {loading ? 'Calculating...' : 'Calculate'}
        </button>
      </form>
      {error && <div style={{ color: '#d32f2f', marginTop: 20, textAlign: 'center', fontWeight: 500 }}>{error}</div>}
      {result.length > 0 && (
        <div style={{ marginTop: 32, background: '#f5f5f5', borderRadius: 10, padding: 18, textAlign: 'center' }}>
          <h4 style={{ margin: 0, marginBottom: 10, fontWeight: 600 }}>Minimum Coin Combination</h4>
          <div style={{ fontSize: 18, color: '#1976d2', fontWeight: 600 }}>{result.join(', ')}</div>
        </div>
      )}
    </div>
  );
}

export default App; 