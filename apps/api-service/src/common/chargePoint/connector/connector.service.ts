import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Repository } from 'typeorm';
import { ConnectorEntity } from './connector.entity';
// import { Client, ClientGrpc } from '@nestjs/microservices';
// import { grpcBillingClientOptions } from '../../../modules-microservices/grpc-client-config/ocpp-grpc-client';
import { ocpp } from 'src/proto/ocpp';
import { OCPPService } from 'src/modules-microservices/ocpp-cs-service/ocpp-cs.service';

@Injectable()
export class ConnectorService {
  private readonly cache: Map<number, ConnectorEntity>;
  // protected billingService: billing.BillingService;

  // @Client(grpcBillingClientOptions)
  // private readonly clientBilling: ClientGrpc;
  // private readonly ocppEvent;
  // onModuleInit() {
  //   this.billingService =
  //     this.clientBilling.getService<billing.BillingService>('BillingService');
  //   console.log(`The module has been initialized.`);
  // }

  constructor(
    @InjectRepository(ConnectorEntity)
    private readonly connectorRepository: Repository<ConnectorEntity>,
    private readonly ocppService: OCPPService,
  ) {
    this.cache = new Map<number, ConnectorEntity>();
  }

  async runStartTransaction(
    id,
    userId,
  ): Promise<ocpp.RemoteStartTransactionResponse> {
    const connector = await this.connectorRepository.findOneByOrFail({ id });

    const transaction = await this.ocppService.runStartTransactionByUser({
      chargePointId: connector.chargePointHardwareId,
      connectorId: connector.connectorId,
      idTag: userId,
    });

    // console.log(
    //   'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
    //   transaction,
    // );

    return transaction;
  }

  async runStopTransaction(id, userId): Promise<any> {
    const connector = await this.connectorRepository.findOneByOrFail({ id });

    const transaction = this.ocppService.runStopTransactionByUser({
      chargePointId: connector.chargePointHardwareId,
      transactionId: connector.connectorId,
    });

    // console.log(
    //   'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
    //   transaction,
    // );
    return transaction;
  }

  async bookedConnector(id) {
    const connector = await this.connectorRepository.update(
      { id },
      { statusName: 'Reserved' },
    );
    setTimeout(() => {
      this.connectorRepository.update({ id }, { statusName: 'Available' });
    }, 90000);
    console.log(connector);
    // const { statusName } = connector;
    return { status: connector.affected > 0 ? 'Reserved' : 'Failed' };
  }

  async cancelBookConnector(id) {
    const connector = await this.connectorRepository.update(
      { id },
      { statusName: 'Available' },
    );
    return { status: connector.affected > 0 ? 'Available' : 'Failed' };
  }

  private async findOrGetFromCache(id: number): Promise<ConnectorEntity> {
    if (this.cache.has(id)) {
      return this.cache.get(id);
    }

    const connector = await this.connectorRepository.findOne({ where: { id } });
    if (connector) {
      this.cache.set(id, connector);
    }
    return connector;
  }

  private async removeFromCache(id: number): Promise<void> {
    if (this.cache.has(id)) {
      this.cache.delete(id);
    }
  }

  async isBooked(id: number): Promise<boolean> {
    const connector = await this.findOrGetFromCache(id);
    if (connector) {
      return connector.booked;
    }
    return false;
  }

  async isSoftBooked(id: number): Promise<boolean> {
    const connector = await this.findOrGetFromCache(id);
    if (connector) {
      return connector.softBooked;
    }
    return false;
  }

  async isBookedBy(id: number, userId: number): Promise<boolean> {
    const connector = await this.findOrGetFromCache(id);
    if (connector) {
      return connector.bookedBy === userId;
    }
    return false;
  }

  async moveExpiredBookingsToSoftBookings(): Promise<void> {
    const expiredBookings = await this.connectorRepository.find({
      where: {
        booked: true,
        bookedUntil: LessThanOrEqual(new Date()),
      },
    });

    for (const expiredBooking of expiredBookings) {
      expiredBooking.booked = false;
      expiredBooking.softBooked = true;
      expiredBooking.bookedBy = null;
      expiredBooking.bookedAt = new Date();
      // Booked for 3 minutes
      expiredBooking.bookedUntil = new Date(
        new Date().getTime() + 3 * 60 * 1000,
      );
      this.removeFromCache(expiredBooking.id);
      await this.connectorRepository.save(expiredBooking);
    }
  }

  async moveExpiredSoftBookingsToAvailable(): Promise<void> {
    const expiredSoftBookings = await this.connectorRepository.find({
      where: {
        softBooked: true,
        bookedUntil: LessThanOrEqual(new Date()),
      },
    });

    for (const expiredSoftBooking of expiredSoftBookings) {
      expiredSoftBooking.booked = false;
      expiredSoftBooking.softBooked = false;
      expiredSoftBooking.bookedBy = null;
      expiredSoftBooking.bookedAt = null;
      expiredSoftBooking.bookedUntil = null;
      this.removeFromCache(expiredSoftBooking.id);
      await this.connectorRepository.save(expiredSoftBooking);
    }
  }

  async book(id: number, userId: number): Promise<ConnectorEntity> {
    const connector = await this.findOrGetFromCache(id);
    if (!connector) {
      throw new Error('Connector not found');
    }

    connector.booked = true;
    connector.softBooked = false;
    connector.bookedBy = userId;
    connector.bookedAt = new Date();
    // Booked for 7 minutes
    connector.bookedUntil = new Date(new Date().getTime() + 7 * 60 * 1000);
    this.removeFromCache(id);
    return this.connectorRepository.save(connector);
  }

  async softBook(id: number, userId: number): Promise<ConnectorEntity> {
    const connector = await this.findOrGetFromCache(id);
    if (!connector) {
      throw new Error('Connector not found');
    }

    connector.booked = false;
    connector.softBooked = true;
    connector.bookedBy = userId;
    connector.bookedAt = new Date();
    // Booked for 3 minutes
    connector.bookedUntil = new Date(new Date().getTime() + 3 * 60 * 1000);
    this.removeFromCache(id);
    return this.connectorRepository.save(connector);
  }
}
