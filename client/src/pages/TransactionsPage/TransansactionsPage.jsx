import React, { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import { connect } from 'react-redux';
import { getTransactions } from '../../store/slices/transactionsSlice';

function TransansactionsPage ({ transactions, isFetching, error, get }) {
  useEffect(() => {
    get();
  }, []);

  return (
    <div>
      <Header />
      <main>
        TransansactionsPage
        {error && <div>Error</div>}
        {isFetching && <div>Loading...</div>}
        {!isFetching && !error && (
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
                  <td>{t.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}

const mapStateToProps = ({ transactionsStore }) => transactionsStore;

const mapDispatchToProps = dispatch => ({
  get: () => dispatch(getTransactions()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TransansactionsPage);
