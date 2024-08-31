/* eslint-disable @typescript-eslint/no-var-requires */
const cluster = require('node:cluster');
import * as process from 'process';
const os = require('node:os');

export default class ClusterService {
  static clusterize(callback: () => void) {
    const processNumber: number =
      Number(process.env.PROCESS_NUMBER) || os.availableParallelism();

    if (cluster.isPrimary) {
      console.log(`MASTER PROCESS (${process.pid}) IS RUNNING `);

      for (let i = 0; i < processNumber; i++) {
        cluster.fork();
      }

      cluster.on('exit', (worker) => {
        console.log(`worker ${worker.process.pid} died`);
      });
    } else {
      console.log(`Worker ${process.pid} started`);
      callback();
    }
  }
}
