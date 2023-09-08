import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';

import { InjectQueryService, QueryService } from '@nestjs-query/core';

import { ChargePointEntity, ConnectorEntity, SiteEntity } from '@app/entities';

@Injectable()
export class CustomSiteGraphQLService {
  constructor(
    @InjectQueryService(ChargePointEntity)
    private chargePointService: QueryService<ChargePointEntity>,
    @InjectQueryService(SiteEntity)
    private siteService: QueryService<SiteEntity>,
    @InjectQueryService(ConnectorEntity)
    private connectorService: QueryService<ConnectorEntity>,
  ) {}

  async createOrUpdateSiteWithChargePoints(input, user): Promise<any> {
    const site = await this.createOrUpdateSite(input.data, user.id);

    const chargePointsWithIds = await this.createOrUpdateChargePoints(
      input.data,
      site.id,
      user.id,
    );

    const connectors = await this.createOrUpdateConnectors(
      chargePointsWithIds,
      site.id,
      user.id,
    );

    console.log('FFFFF', connectors);
    return await { siteId: site.id };
  }

  async createOrUpdateSite(data, userId): Promise<any> {
    if (data.id && data.id > 0)
      return await this.siteService.updateOne(
        data.id,
        this.getSiteInput(data, userId),
      );
    else
      return await this.siteService.createOne(this.getSiteInput(data, userId));
  }

  async createOrUpdateChargePoints(data, siteId, userId): Promise<any> {
    const arrayCreateChargePoints = data.chargepoints.map((e) => {
      if (e.id && e.id > 0) {
        return this.chargePointService.updateOne(
          parseInt(e.id),
          this.getInputChargePoint({ ...e, siteId, userId }),
        );
      } else
        return this.chargePointService.createOne(
          this.getInputChargePoint({ ...e, siteId, userId }),
        );
    });

    const chargePoints = await Promise.all(arrayCreateChargePoints);

    // console.log('ARG CHARGEPOINTS', chargePoints);

    const chargePointsWithIds = data.chargepoints.map((e, i) => {
      return { ...e, chargePointId: chargePoints[i].id };
    });

    return chargePointsWithIds;
  }

  async createOrUpdateConnectors(data, siteId, userId): Promise<any> {
    const connectors = [];

    data.map((e) => {
      if (e.connectors)
        e.connectors.map((j) => {
          connectors.push({
            ...j,
            chargePointId: e.chargePointId,
            siteId,
            ownerId: userId,
          });
        });
    });

    console.log('ARG CONNECTORS', connectors);

    const arrayFuncConnectors = connectors.map((e) => {
      if (e.id && e.id > 0) {
        return this.connectorService.updateOne(
          parseInt(e.id),
          this.getInputConnector(e),
        );
      } else return this.connectorService.createOne(this.getInputConnector(e));
    });

    const connectorsRes = await Promise.all(arrayFuncConnectors);

    console.log('ARG CONNECTORS', connectorsRes);

    return connectorsRes;
  }

  getSiteInput(data, userId) {
    return {
      name: data.name ?? '',
      location: data.location ?? { type: 'Point', coordinates: [0, 0] },
      zip_code: data.zip_code ?? '',
      phone_number: data.phone_number ?? '',
      default_price: data.default_price ?? '',
      site: '',
      site_area: '',
      address: data.address ?? '',
      information: '',
      battery: '',
      asset_type: '',
      instant_power: 0,
      dynamic_asset: '',
      ownerId: userId,
      organizationId: data.organizationId ?? null,
    };
  }

  getInputChargePoint(e) {
    return {
      chargePointHardwareId: e.chargePointHardwareId,
      chargePointName: e.chargePointName ?? '',
      instantPower: e.instantPower ?? 0,
      power: e.power ?? 0,
      siteId: e.siteId,
      ownerId: e.userId,
    };
  }

  getInputConnector(e) {
    console.log(
      'FFFFFFFFFFFFFFFFFFFFFJHFGFGGHSASASASASASASASASASASASASASASASA',
      e,
    );

    return {
      label: e.label ?? null,
      connectorId: e.connectorId ?? null,
      chargePointHardwareId: e.chargePointHardwareId ?? null,
      connectorTypeName: e.connectorTypeName ?? '',
      connectorTypeId: e.connectorTypeId ?? null,
      power: e.power ?? 0,
      maxPower: e.maxPower ?? 0,
      price: e.price ?? 0,
      priceUnit: e.priceUnit ?? '$/kWh',
      chargePointId: parseInt(e.chargePointId),
      siteId: e.siteId,
      ownerId: e.ownerId,
    };
  }
}
