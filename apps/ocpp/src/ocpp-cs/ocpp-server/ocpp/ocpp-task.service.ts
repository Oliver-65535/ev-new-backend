import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Observable, ReplaySubject, Subject } from 'rxjs';

import { Cron } from '@nestjs/schedule';
import { OcppPythonServerService } from '../ocpp-cs-python.service';
import { MethodCall as m } from '@app/common';
import { updateTransactionFromResponse } from './ocpp-transaction.service';

const MAXMUM_LOG_LENGTH = 500;

export const taskSubject = new Subject<{ tasks: string }>();

export let chargepointsTime = [];
export let chargepoints = [];
export const transactions = [];
export let logs = [];

export const updateLog = (log) => {
  // console.log('INPUT UPDATE LOG', log);
  if (logs.length > MAXMUM_LOG_LENGTH) {
    logs.shift();
    logs.push(log);
  } else logs.push(log);

  // console.log('OUTPUT UPDATE LOG', logs);
};

// export const transactions = [];

@Injectable()
export class OcppTaskService {
  constructor(
    private readonly ocppServerService: OcppPythonServerService, // private readonly ocppTransactionService: OcppTransactionService,
  ) {}

  getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  tasks = [];

  @Cron('5 * * * * *')
  handleCron() {
    const cleanedTasks = this.tasks.filter(
      (e) => new Date().valueOf() - e.created_at < 36000,
    );
    // console.log('CLEAN TASKS', cleanedTasks);
    if (cleanedTasks) this.tasks = cleanedTasks;
    // console.log('CLEAN TASKS@@@@', cleanedTasks);

    const cleanedChargePoints = chargepointsTime.filter(
      (e) => new Date().valueOf() - e.time < 82000,
    );

    chargepoints = cleanedChargePoints.map((e) => e.id);
    console.log('leanedChargePoints', chargepoints);
  }

  getData(): any {
    // console.log('GET DATA AAAAAAAAAAAAAAAAAAAA', {
    //   chargepoints,
    //   tasks: this.tasks ?? [],
    //   transactions,
    // });

    return {
      chargepoints,
      tasks: this.tasks ?? [],
      transactions,
    };
  }

  getLogs(): any {
    return {
      logs: logs,
    };
  }

  clearLogs(): any {
    logs = [];
    return {
      logs: logs,
    };
  }

  async runTaskCall({ chargePointId, methodCall, params }): Promise<any> {
    try {
      // console.log('JJJJJJJJJJJJJJJОООООООООООООООООООООООООО', { chargePointId, methodCall, params });

      const payload = { chargePointId, methodCall, params };

      let data;

      const rand = this.getRandomInt(10000000000);
      this.newTask({ ...payload, rand });

      if (methodCall == m.RemoteStartTransaction) {
        params = { connectorId: params.connectorId, idTag: params.idTag };
        console.log('m.RemoteStartTransaction', { ...payload, params });
        data = await this.ocppServerService.runMethodCall({
          ...payload,
          params,
        });
        updateTransactionFromResponse({ ...payload, data });
      } else if (methodCall != m.RemoteStartTransaction) {
        data = await this.ocppServerService.runMethodCall(payload);
      }

      // if (methodCall == m.RemoteStartTransaction) {
      //   this.updateTransaction(params.transactionId, data, true);
      // } else if (methodCall == m.RemoteStopTransaction) {
      //   this.updateTransaction(params.transactionId, data, false);
      // }

      this.updateTask({
        id: `${chargePointId}${methodCall}${rand}`,
        response: data,
      });

      return { HttpStatus: HttpStatus.OK, data, errors: [] };
    } catch (error) {
      console.log(error);
      return {
        HttpStatus: HttpStatus.BAD_REQUEST,
        errors: [JSON.stringify(error)],
      };
    }
  }

  newTask({ chargePointId, rand, methodCall, params }) {
    this.tasks.push({
      id: `${chargePointId}${methodCall}${rand}`,
      created_at: new Date().valueOf(),
      chargePointId,
      methodCall,
      params,
      response: null,
    });

    this.sendTasksToStream();
  }

  updateTask({ id, response }) {
    const index = this.tasks.findIndex((e) => e.id == id);
    // console.log(index);
    // if(index)
    this.tasks[index]['response'] = response;
    setTimeout(() => {
      this.deleteTask(index);
    }, 15000);

    this.sendTasksToStream();
  }

  deleteTask(index: number) {
    this.tasks.splice(index, 1);

    this.sendTasksToStream();
  }

  private sendTasksToStream() {
    // console.log('TASK', this.tasks);
    taskSubject.next({ tasks: JSON.stringify(this.tasks) });
  }
}
