import { uuid } from 'uuidv4';
import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const balance = this.transactions.reduce(
      (accumulator, currentTransaction) => {
        if (currentTransaction.type === 'income') {
          return {
            income: accumulator.income + currentTransaction.value,
            outcome: accumulator.outcome,
            total:
              accumulator.income +
              currentTransaction.value -
              accumulator.outcome,
          };
        }
        return {
          income: accumulator.income,
          outcome: accumulator.outcome + currentTransaction.value,
          total:
            accumulator.income -
            (accumulator.outcome + currentTransaction.value),
        };
      },
      { income: 0, outcome: 0, total: 0 },
    );

    return balance;
  }

  public create({ title, value, type }: Omit<Transaction, 'id'>): Transaction {
    const transaction = {
      id: uuid(),
      title,
      value,
      type,
    };
    this.transactions.push(transaction);
    return transaction;
  }
}

export default TransactionsRepository;
