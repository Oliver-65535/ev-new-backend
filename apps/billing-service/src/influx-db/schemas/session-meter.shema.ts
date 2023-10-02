import * as Influx from 'influx';

export const sessionMeter = {
  measurement: 'sessionMeter',
  fields: {
    // power_usage: Influx.FieldType.FLOAT,
    // power_spend: Influx.FieldType.FLOAT,
    // battery: Influx.FieldType.INTEGER,
    SoC: Influx.FieldType.FLOAT,
    Power: Influx.FieldType.FLOAT,
    Voltage: Influx.FieldType.FLOAT,
    Amperage: Influx.FieldType.FLOAT,
    Temperature: Influx.FieldType.FLOAT,
    Energy: Influx.FieldType.FLOAT,
    EnergyInteval: Influx.FieldType.FLOAT,
  },
  tags: ['transactionId'],
};

// SoC: null,
// Power: 0,
// Voltage: 117.1,
// Amperage: 0,
// Temperature: null,
// Energy: 0,
// EnergyInteval: null,
// timestamp: '2023-06-19T11:17:12.039Z'
