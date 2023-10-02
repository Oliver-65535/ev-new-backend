export const meter = {
    handleReseived: '6/28/2023, 4:21:31 PM',
    chargeBoxId: 'TESTDC1',
    method: 'MeterValues',
    params: {
      connectorId: 1,
      meterValue: [
        {
          sampledValue: [
            {
              context: 'Sample.Periodic',
              format: 'Raw',
              location: 'Outlet',
              measurand: 'Energy.Active.Import.Register',
              unit: 'Wh',
              value: '960',
            },
          ],
          timestamp: '2023-06-16T19:58:48.561Z',
        },
        {
          sampledValue: [
            {
              context: 'Sample.Periodic',
              format: 'Raw',
              location: 'EV',
              measurand: 'SoC',
              unit: 'Percent',
              value: '0',
            },
          ],
          timestamp: '2023-06-16T19:58:48.562Z',
        },
        {
          sampledValue: [
            {
              context: 'Sample.Periodic',
              format: 'Raw',
              location: 'Outlet',
              measurand: 'Voltage',
              unit: 'V',
              value: '1.4',
            },
          ],
          timestamp: '2023-06-16T19:58:48.563Z',
        },
        {
          sampledValue: [
            {
              context: 'Sample.Periodic',
              format: 'Raw',
              location: 'Outlet',
              measurand: 'Current.Import',
              unit: 'A',
              value: '0.00',
            },
          ],
          timestamp: '2023-06-16T19:58:48.564Z',
        },
        {
          sampledValue: [
            {
              context: 'Sample.Periodic',
              format: 'Raw',
              location: 'Body',
              measurand: 'Temperature',
              unit: 'Celsius',
              value: '33.3',
            },
          ],
          timestamp: '2023-06-16T19:58:48.565Z',
        },
        {
          sampledValue: [
            {
              context: 'Sample.Periodic',
              format: 'Raw',
              location: 'Inlet',
              measurand: 'Temperature',
              unit: 'Celsius',
              value: '31.7',
            },
          ],
          timestamp: '2023-06-16T19:58:48.565Z',
        },
        {
          sampledValue: [
            {
              context: 'Sample.Periodic',
              format: 'Raw',
              location: 'Inlet',
              measurand: 'Temperature',
              unit: 'Celsius',
              value: '32.4',
            },
          ],
          timestamp: '2023-06-16T19:58:48.565Z',
        },
      ],
      transactionId: 1,
    },
  };