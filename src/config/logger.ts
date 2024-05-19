import bunyan from 'bunyan';
import bunyanFormat from 'bunyan-format';

const logger = bunyan.createLogger({
  name: 'clone-rappi-api',
  streams: [
    {
      level: 'info',
      stream: bunyanFormat({ outputMode: 'long' })
    }
  ]
});

export default logger;
