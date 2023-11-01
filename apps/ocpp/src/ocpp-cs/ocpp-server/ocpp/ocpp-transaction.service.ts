import { Method as m, MethodCall as mc } from '@app/common';

import { Status as s } from '@app/common';
import { transactions } from './ocpp-task.service';

export const findTransaction = params => {
  const index = transactions.findIndex(e => {
    // console.log(
    //   'FIND TRANSACTION',
    //   params.connectorId
    //     ? e.connectorId == params.connectorId
    //     : 1 && params.idTag
    //     ? e.idTag == params.idTag
    //     : 1 && params.transactionId
    //     ? e.transactionId == params.transactionId
    //     : 1 && e.chargePointId == params.chargePointId,
    // );

    //  if(chargePointId && connectorId) return

    return params.connectorId
      ? e.connectorId == params.connectorId
      : 1 && params.idTag
      ? e.idTag == params.idTag
      : 1 && params.transactionId
      ? e.transactionId == params.transactionId
      : 1 && e.chargePointId == params.chargePointId;
  });
  //   console.log('FIND TRANSACTION', index, transactions);
  return index;
};

export const createTransaction = ({ chargePointId, params, reason }) => {
  const transaction = {
    chargePointId,
    connectorId: params.connectorId,
    transactionId: params.transactionId,
    idTag: params.idTag ?? null,
    reasonStart: reason,
    reasonStop: null,
    meterStart: params.meterStart ?? null,
    meterStop: null,
    reservationId: params.reservationId ?? null,
    started_at: params.timestamp ?? null,
    stopped_at: null,
    authorize: null,
    start: null,
    stop: null,
    status: null,
  };

  transactions.push(transaction);
};

export const updateTransaction = (index, params) => {
  transactions[index].reasonStop =
    params.reasonStop ?? transactions[index].reasonStop;
  transactions[index].meterStart =
    params.meterStart ?? transactions[index].meterStart;
  transactions[index].meterStop =
    params.meterStop ?? transactions[index].meterStop;
  transactions[index].reservationId =
    params.reservationId ?? transactions[index].reservationId;
  //   transactions[index].started_at =
  //     params.started_at ?? transactions[index].started_at;
  transactions[index].stopped_at =
    params.stopped_at ?? transactions[index].stopped_at;
  transactions[index].authorize =
    params.authorize ?? transactions[index].authorize;
  transactions[index].start = params.start ?? transactions[index].start;
  transactions[index].stop = params.stop ?? transactions[index].stop;
  transactions[index].status = params.status ?? transactions[index].status;
};

export const delTransaction = index => {
  setTimeout(() => {
    transactions.splice(index, 1);
  }, 3000);
};

// export const addTransactionToList = ({
//   chargePointId,
//   methodCall,
//   params,
// }): any => {
//   const i = findTransaction({ chargePointId, connectorId: params.connectorId });

//   if (i < 0) {
//     console.log('CREATE TRANSACTION');
//     createTransaction({ chargePointId, params, reason: 'Remote' });
//     return true;
//   } else if (i >= 0 && transactions[i].start != s.Accepted) {
//     transactions.splice(i, 1);
//     createTransaction({ chargePointId, params, reason: 'Remote' });
//     return true;
//   } else return false;
// };

export const updateTransactionFromResponse = (payload): any => {
  const { chargePointId, methodCall, params, data } = payload;

  //   console.log('updateTransactionFromResponse', payload);

  const i: number = findTransaction({
    chargePointId,
    transactionId: params.transactionId,
  });
  if (i >= 0) {
    if (methodCall == mc.RemoteStartTransaction)
      updateTransaction(i, { start: data.status });
    if (methodCall == mc.RemoteStopTransaction)
      updateTransaction(i, { stop: data.status });
  }
};
