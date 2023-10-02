import { ClientOptions, Transport } from '@nestjs/microservices';

// import { join } from 'path';

export const grpcOcppClientOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    url: '0.0.0.0:50051',
    package: 'ocpp',
    protoPath: 'src/proto/ocpp.proto',
  },
};
