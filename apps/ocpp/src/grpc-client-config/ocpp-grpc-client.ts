import { ClientOptions, Transport } from '@nestjs/microservices';

// import { join } from 'path';

export const grpcOcppClientOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    url: '0.0.0.0:50052',
    // url: '35.236.79.246:50052',
    package: 'billing',
    protoPath: 'src/proto/billing.proto',
  },
};
