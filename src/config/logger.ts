import * as bunyan from 'bunyan';
import bunyanFormat from 'bunyan-format';
import { Writable } from 'stream';

const logger = bunyan.createLogger({
  name: 'rangos-api',
  streams: [
    {
      level: 'info',
      stream: bunyanFormat({ outputMode: 'long' }) as Writable
    }
  ]
});

export default logger;
