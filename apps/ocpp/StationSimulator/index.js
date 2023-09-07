const { RPCClient } = require('ocpp-rpc');

const connectorId = {
  1: { status: 'Faulted' },
  2: { status: 'Faulted' },
};

let transactionId = 123455;

const cli = new RPCClient({
  // endpoint: 'ws://localhost:11180', // the OCPP endpoint URL
  endpoint: 'ws://34.94.253.188:11180', // the OCPP endpoint URL
  identity: 'EXAMPLE', // the OCPP identity
  protocols: ['ocpp1.6'], // client understands ocpp1.6 subprotocol
  strictMode: true, // enable strict validation of requests & responses
});

async function main() {
  // connect to the OCPP server
  await cli.connect();

  // send a BootNotification request and await the response
  const bootResponse = await cli.call('BootNotification', {
    chargePointVendor: 'ocpp-rpc',
    chargePointModel: 'ocpp-rpc',
  });

  // check that the server accepted the client
  if (bootResponse.status === 'Accepted') {
    // send a Heartbeat request and await the response
    const heartbeatResponse = await cli.call('Heartbeat', {});
    // read the current server time from the response
    console.log('Server time is:', heartbeatResponse.currentTime);

    setInterval(async()=>{
      const heartbeatResponse = await cli.call('Heartbeat', {});
    },5000)

    // send a StatusNotification request for the controller
    await cli.call('StatusNotification', {
      connectorId: 1,
      errorCode: 'NoError',
      status: 'Available',
    });
  }

  cli.handle('Reset', ({ reply }) => {
    console.log('RESET', reply);
    reply({ status: 'Accepted' });
  });

  cli.handle('RemoteStartTransaction', async ({ params, reply }) => {
    // This handler will be called if the incoming method cannot be handled elsewhere.
    console.log(
      `Server got RemoteStartTransaction from ${cli.identity}:`,
      params,
    );

    const authorizeResponse = await cli.call('Authorize', {
      idTag: 'test-id-tag',
    });

    const startTransactionResponse = await cli.call('StartTransaction', {
      connectorId: 1,
      idTag: 'test-id-tag',
      meterStart: 0,
      reservationId:1,
      transactionId:transactionId,
      timestamp: new Date().toISOString(),
    });

    console.log('authorizeRespons', authorizeResponse);
    console.log('startTransactionResponse', startTransactionResponse);

    reply({ status: 'Accepted' });
    // throw an RPC error to inform the server that we don't understand the request.
    // throw createRPCError("NotImplemented");
  });

  cli.handle('RemoteStopTransaction', async ({ params, reply }) => {
    // This handler will be called if the incoming method cannot be handled elsewhere.
    console.log(
      `Server got RemoteStopTransaction from ${cli.identity}:`,
      params,
    );

    const stopTransactionResponse = await cli.call('StopTransaction', {
      idTag: '1',
      meterStop: 1080,
      reason: 'Remote',
      timestamp: new Date().toISOString(),
      transactionData: [
        {
          sampledValue: [
            {
              context: 'Sample.Periodic',
              format: 'Raw',
              location: 'Outlet',
              measurand: 'Energy.Active.Import.Register',
              unit: 'Wh',
              value: '1080',
            },
          ],
          timestamp: new Date().toISOString(),
        },
      ],
      transactionId: 1,
    });

    console.log('stopTransactionResponse', stopTransactionResponse);
    reply({ status: 'Accepted' });
    // throw an RPC error to inform the server that we don't understand the request.
    // throw createRPCError("NotImplemented");
  });

  cli.handle((reply) => {
    // This handler will be called if the incoming method cannot be handled elsewhere.
    console.log(`Server got from ${cli.identity}:`, reply);
    reply({ status: 'Accepted' });
    // throw an RPC error to inform the server that we don't understand the request.
    // throw createRPCError("NotImplemented");
  });
}

main();
