import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';

import { InjectQueryService, QueryService } from '@nestjs-query/core';

import { ChargePointEntity } from '../chargePoint/chargePoint/chargePoint.entity';
import { ConnectorEntity } from '../chargePoint/connector/connector.entity';
import { filter } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

type markerType = {
  siteid: number;
  location: any;
  available: number;
  total: number;
};

type siteType = {
  connector_type: string;
  power: number;
  price: number;
  site_name: string;
  site_address: string;
  available: number;
  available_ids: number[];
  total: number;
};

@Injectable()
export class MapsApiService {
  constructor(
    @InjectQueryService(ChargePointEntity)
    private chargePointService: QueryService<ChargePointEntity>,
    @InjectRepository(ConnectorEntity)
    private connectorRepository: Repository<ConnectorEntity>,
    private dataSource: DataSource,
  ) {}

  async getFilteredSite(input: any): Promise<siteType[]> {
    try {
      const {
        siteId, // connectorStatusSelected = ['Available'],
        connectorTypesSelected = [
          'Type 1',
          'Type 2',
          'Tesla',
          'CCS1',
          'CCS2',
          'CHAdeMO',
        ],
        minPower = 0,
        maxPower = 300,
        minPrice = 0,
        maxPrice = 300,
      } = input;

      console.log('INNNPUTTT:', input);

      const site2 = await this.dataSource.query(
        `select 
        c."connectorTypeName"  as connector_type,
        c."power" as power, 
        c."price" as price ,
        (select s."name"  from "Site" s where s.id = $1) as site_name,
        (select s."address"  from "Site" s where s.id = $1) as site_address,
        count(*) FILTER (WHERE c."statusName" = 'Available' or c."statusName" = 'Preparing') as available,
        count(*) as total,
        array_agg(c.id order by c.id) 
        FILTER (WHERE c."statusName" = 'Available' or c."statusName" = 'Preparing')  as available_ids 
        from "Connector" c 
            where c."siteId" = $1 
            and c."connectorTypeName" = any ($2) 
            and c.price between  $3 and $4 
            and c.power between $5 and $6
            group by c."connectorTypeName", c."power", c."price"`,
        [
          siteId, // connectorStatusSelected,
          connectorTypesSelected,
          minPrice,
          maxPrice,
          minPower,
          maxPower,
        ],
      );

      // console.log(site2);

      return site2;
    } catch (e) {
      console.log(e);
      // throw new UnauthorizedException();
    }
  }

  async getFilteredMarkers(input: any): Promise<markerType[]> {
    try {
      const {
        connectorTypesSelected = [
          'Type 1',
          'Type 2',
          'Tesla',
          'CCS1',
          'CCS2',
          'CHAdeMO',
        ],
        minPower = 0,
        maxPower = 1000,
        minPrice = 0,
        maxPrice = 1000,
      } = input;

      const sites = await this.dataSource.query(
        `select COUNT(*) FILTER (WHERE c."statusName" = 'Available' or c."statusName" = 'Preparing') as available,
        COUNT(*) as total,
        ST_AsGeoJSON(s.location)::json as location,
        s.id as siteId
        from "Site" s 
            inner join "Connector" c on c."siteId" = s.id
            where c."connectorTypeName" = any ($1)
            and c.price between $2 and $3
            and c.power between $4 and $5
            group by s.id`,
        [connectorTypesSelected, minPrice, maxPrice, minPower, maxPower],
      );

      // const sites = await this.dataSource.query(
      //   `select  siteId,ST_AsGeoJSON(location)::json as location, available,total from
      //   (select  "location" as location,COUNT(*) as total,s.id as siteId  from "Site" s
      //   inner join "Connector" c on c."siteId" = s.id  where c."connectorTypeName" = any ($1)
      //   and c.price between  $2 and $3 and c.power between $4 and $5 group by s.id) t1
      //   left join
      //   (select  COUNT(*) as available,s.id as connSiteId  from "Site" s
      //   inner join "Connector" c on c."siteId" = s.id  where c."connectorTypeName" = any ($1)
      //   and c.price between  $2 and $3 and c.power between $4 and $5
      //   and c."statusName" = 'Available' group by s.id)
      //    t2 on t1.siteId = t2.connSiteId order by t1.siteId ASC;`,
      //   [connectorTypesSelected, minPrice, maxPrice, minPower, maxPower],
      // );

      console.log(sites);
      return sites;
    } catch (e) {
      console.log(e);
      // throw new UnauthorizedException();
    }
  }

  // login(user: AuthenticatedUser): Promise<LoginResponseDto> {
  //   const payload: JwtPayload = {
  //     sub: user.id,
  //     firstname: user.firstname,
  //     lastname: user.lastname,
  //     role: user.role,
  //     wallet_eth: user.wallet_eth,
  //     //is_active: user.is_active,
  //   };
  //   return Promise.resolve({
  //     // eslint-disable-next-line @typescript-eslint/naming-convention
  //     accessToken: this.jwtService.sign(payload),
  //   });
  // }

  // getAddressFromSignature(
  //   publicAddress: string,
  //   msg: string,
  //   signature: string,
  // ): string {
  //   console.log({ msg, signature });
  //   const recoveredAddr = recoverPersonalSignature({
  //     data: msg,
  //     signature: signature,
  //   });
  //   console.log({ recoveredAddr });

  //   return recoveredAddr; //== publicAddress ? recoveredAddr : null;
  // }

  // generateString(size: number): string {
  //   return randomBytes(size).toString('hex');
  // }
}
