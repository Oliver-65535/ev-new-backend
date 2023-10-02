enum measurand {
  SoC = 'SoC',
  PowerActiveImport = 'Power.Active.Import',
  CurrentImport = 'Current.Import',
  Voltage = 'Voltage',
  Temperature = 'Temperature',
  EnergyActiveImportRegister = 'Energy.Active.Import.Register',
  EnergyActiveImportInterval = 'Energy.Active.Import.Interval',
}

enum unit {
  A = 'A',
  V = 'V',
  W = 'W',
  kW = 'kW',
  kWh = 'kWh',
  Wh = 'Wh',
  Celsius = 'Celsius',
  Percent = 'Percent',
}

export const meterValueParser = (data) => {
  const parsed = {
    SoC: null,
    Power: null,
    Voltage: [],
    Amperage: [],
    Temperature: null,
    Energy: null,
    EnergyInteval: null,
    timestamp: null,
  };

  let metervalue = data.params.meterValue;

  if (metervalue?.length > 1 && metervalue[0]?.sampledValue.length == 1) {
    let timestamp;
    console.log('RRRRRRRRRRRRRRRRRREEEEEEEEEEEEEEEEEEEEEEEEEWWWWWWWWWWWWWWWW');
    const sampledValue = metervalue.map((e) => {
      timestamp = e.timestamp;
      return e.sampledValue[0] ?? e.sampled_value[0];
    });
    metervalue = [{ sampledValue, timestamp }];
  } else {
    metervalue = [
      {
        sampledValue: metervalue[0].sampledValue ?? metervalue[0].sampled_value,
        timestamp: metervalue[0].timestamp,
      },
    ];
  }

  const sampledValues = metervalue[0].sampledValue.map((e) => {
    switch (e.measurand) {
      case measurand.SoC:
        parsed['SoC'] = getVal(e);
        break;
      case measurand.PowerActiveImport:
        parsed['Power'] = getVal(e);
        break;
      case measurand.EnergyActiveImportRegister:
        parsed['Energy'] = getVal(e);
        break;
      case measurand.EnergyActiveImportInterval:
        parsed['EnergyInteval'] = getVal(e);
        break;
      case measurand.CurrentImport:
        parsed['Amperage'].push(getVal(e));
        break;
      case measurand.Voltage:
        parsed['Voltage'].push(getVal(e));
        break;
      case measurand.Temperature:
        parsed['Temperature'] = getVal(e);
        break;
      default:
        break;
    }
  });

  return {
    ...parsed,
    Voltage: Math.max.apply(null, parsed.Voltage),
    Amperage: Math.max.apply(null, parsed.Amperage),
    timestamp: metervalue[0].timestamp,
  };
};

const lc = (s) => s.toLowerCase();

const getkWh = () => {};

const getVal = (e) => {
  const value = parseFloat(e.value);
  let v = null;

  //   console.log(')))))))))))))))))))))))))))))))))', e);

  switch (lc(e.unit)) {
    case lc(unit.A):
      v = value;
      break;
    case lc(unit.V):
      v = value;
      break;
    case lc(unit.W):
      v = value / 1000;
      break;
    case lc(unit.kW):
      v = value;
      break;
    case lc(unit.Wh):
      v = value / 1000;
      break;
    case lc(unit.kWh):
      v = value;
      break;
    default:
      v = value;
      break;
  }

  return v;
};

// {
//     "handleReseived": "6/28/2023, 12:43:15 PM",
//     "chargeBoxId": "1102202201000002",
//     "method": "MeterValues",
//     "params": {
//       "connectorId": 1,
//       "transactionId": 1,
//       "meterValue": [
//         {
//           "timestamp": "2023-06-17T12:30:23.017Z",
//           "sampledValue": [
//             {
//               "value": "0.00",
//               "context": "Sample.Periodic",
//               "measurand": "Current.Import",
//               "unit": "A",
//               "location": "Outlet"
//             },
//             {
//               "value": "0.00",
//               "context": "Sample.Periodic",
//               "measurand": "Power.Active.Import",
//               "unit": "kW",
//               "location": "Outlet"
//             },
//             {
//               "value": "33",
//               "context": "Sample.Periodic",
//               "measurand": "Temperature",
//               "unit": "Celsius",
//               "location": "Outlet"
//             },
//             {
//               "value": "117.6",
//               "context": "Sample.Periodic",
//               "measurand": "Voltage",
//               "unit": "V",
//               "location": "Outlet"
//             }
//           ]
//         }
//       ]
//     }
//   },
