export enum Method {
  connect = 'connect',
  disconnect = 'disconnect',
  BootNotification = 'BootNotification',
  Heartbeat = 'Heartbeat',
  StatusNotification = 'StatusNotification',
  Authorize = 'Authorize',
  StartTransaction = 'StartTransaction',
  StopTransaction = 'StopTransaction',
  MeterValues = 'MeterValues',
  DataTransfer = 'DataTransfer',
}

export enum MethodCall {
  ChangeConfiguration = 'ChangeConfiguration',
  ClearCache = 'ClearCache',
  GetDiagnostics = 'GetDiagnostics',
  StartTransaction = 'StartTransaction',
  StopTransaction = 'StopTransaction',
  RemoteStartTransaction = 'RemoteStartTransaction',
  RemoteStopTransaction = 'RemoteStopTransaction',
  Reset = 'Reset',
  UnlockConnector = 'UnlockConnector',
  ReserveNow = 'ReserveNow',
  CancelReservation = 'CancelReservation',
  DataTransfer = 'DataTransfer',
  GetConfiguration = 'GetConfiguration',
  GetLocalListVersion = 'GetLocalListVersion',
  SendLocalList = 'SendLocalList',
  TriggerMessage = 'TriggerMessage',
  GetCompositeSchedule = 'GetCompositeSchedule',
  SetChargingProfile = 'SetChargingProfile',
  ClearChargingProfile = 'ClearChargingProfile',
}