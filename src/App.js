import React, { useState, useEffect } from 'react';
import './App.css';

// Список валют
const currencies = [
  { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', flag: '🇬🇧' },
  { code: 'RUB', name: 'Russian Ruble', flag: '🇷🇺' },
  { code: 'KGS', name: 'Kyrgyz Som', flag: '🇰🇬' },
  { code: 'KZT', name: 'Kazakhstan Tenge', flag: '🇰🇿' },
  { code: 'CNY', name: 'Chinese Yuan', flag: '🇨🇳' },
  { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵' },
  { code: 'TRY', name: 'Turkish Lira', flag: '🇹🇷' },
  { code: 'AED', name: 'UAE Dirham', flag: '🇦🇪' }
];

function App() {
  const [amount, setAmount] = useState('100');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('KGS');
  const [result, setResult] = useState(null);
  const [rate, setRate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Получение флага валюты
  const getCurrencyFlag = (code) => {
    const currency = currencies.find(c => c.code === code);
    return currency ? currency.flag : '💱';
  };

  // Форматирование числа
  const formatNumber = (num) => {
    return parseFloat(num).toLocaleString('ru-RU', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Конвертация валют
  const convertCurrency = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Введите корректную сумму');
      setResult(null);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`
      );

      if (!response.ok) {
        throw new Error('Ошибка сети');
      }

      const data = await response.json();

      if (!data.rates[toCurrency]) {
        throw new Error('Валюта не найдена');
      }

      const exchangeRate = data.rates[toCurrency];
      setRate(exchangeRate);

      const convertedAmount = (parseFloat(amount) * exchangeRate).toFixed(2);
      setResult(convertedAmount);

    } catch (err) {
      console.error('Ошибка:', err);
      setError('Не удалось получить курс валют. Попробуйте снова.');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  // Автоматическая конвертация при изменении
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (amount && parseFloat(amount) > 0) {
        convertCurrency();
      }
    }, 500);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line
  }, [amount, fromCurrency, toCurrency]);

  // Обмен валют местами
  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setResult(null);
    setError('');
  };

  return (
    <div className="container">
      <div className="content">
        {/* Header */}
        <div className="header">
          <div className="icon-wrapper">
            <svg className="dollar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </div>
          <h1>Currency Converter</h1>
          <p className="subtitle">Конвертер валют в реальном времени</p>
        </div>

        {/* Main Card */}
        <div className="card">
          {/* Amount Input */}
          <div className="input-group">
            <label className="label">Сумма для конвертации</label>
            <input
              type="number"
              placeholder="Введите сумму..."
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="amount-input"
            />
          </div>

          {/* Currency Selection */}
          <div className="currency-grid">
            {/* From Currency */}
            <div className="currency-select-wrapper">
              <label className="label">Из валюты</label>
              <div className="select-container">
                <span className="flag-icon">{getCurrencyFlag(fromCurrency)}</span>
                <select
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                  className="currency-select"
                >
                  {currencies.map(currency => (
                    <option key={currency.code} value={currency.code}>
                      {currency.code} - {currency.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Swap Button */}
            <div className="swap-container">
              <button onClick={swapCurrencies} className="swap-btn" title="Поменять валюты местами">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 16l-4-4m0 0l4-4m-4 4h18M17 8l4 4m0 0l-4 4m4-4H3"></path>
                </svg>
              </button>
            </div>

            {/* To Currency */}
            <div className="currency-select-wrapper">
              <label className="label">В валюту</label>
              <div className="select-container">
                <span className="flag-icon">{getCurrencyFlag(toCurrency)}</span>
                <select
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                  className="currency-select"
                >
                  {currencies.map(currency => (
                    <option key={currency.code} value={currency.code}>
                      {currency.code} - {currency.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Convert Button */}
          <button
            onClick={convertCurrency}
            disabled={loading}
            className={`convert-btn ${loading ? 'loading' : ''}`}
          >
            {loading ? (
              <>
                <svg className="loading-icon" style={{ width: '1.25rem', height: '1.25rem' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="23 4 23 10 17 10"></polyline>
                  <polyline points="1 20 1 14 7 14"></polyline>
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                </svg>
                Загрузка...
              </>
            ) : (
              'Конвертировать'
            )}
          </button>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          {/* Result */}
          {result && !error && (
            <div className="result-container">
              <div className="result-content">
                <p className="result-label">Результат конвертации</p>

                {/* From Amount */}
                <div className="result-row">
                  <span className="result-flag">{getCurrencyFlag(fromCurrency)}</span>
                  <p className="result-amount">{formatNumber(amount)} {fromCurrency}</p>
                </div>

                {/* Arrow */}
                <div className="arrow">↓</div>

                {/* To Amount */}
                <div className="result-row">
                  <span className="result-flag-large">{getCurrencyFlag(toCurrency)}</span>
                  <p className="result-amount-large">{formatNumber(result)} {toCurrency}</p>
                </div>

                {/* Exchange Rate */}
                {rate && (
                  <div className="rate-container">
                    <p className="rate-label">Обменный курс</p>
                    <p className="rate-value">1 {fromCurrency} = {rate.toFixed(4)} {toCurrency}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Info */}
          <div className="info-box">
            <svg className="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
            <div>
              <p className="info-text">
                <strong>Совет:</strong> Курсы валют обновляются автоматически при выборе валюты.
                Данные предоставляются в реальном времени.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="footer">
          <p>Powered by ExchangeRate-API</p>
          <p className="footer-small">Курсы валют обновляются ежедневно</p>
        </div>
      </div>
    </div>
  );
}

export default App;
