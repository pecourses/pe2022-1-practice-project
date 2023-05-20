import React from 'react';
import Header from '../../components/Header/Header';

function TransansactionsPage () {
  const transactions = [
    { amount: 10, operationType: 'INCOME', date: '2023-01-01' },
    { amount: 10, operationType: 'INCOME', date: '2023-01-01' },
  ];

  return (
    <div>
      <Header />
      <main>
        TransansactionsPage
        <table>
          <caption>Finance Operations</caption>
          <thead>
            <tr>
              <th key={1}>Amount</th>
              <th key={2}>Operation Type</th>
              <th key={3}>Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(t => (
              <tr key={t.id}>
                <td>{t.amount}</td>
                <td>{t.operationType}</td>
                <td>{t.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}

export default TransansactionsPage;
