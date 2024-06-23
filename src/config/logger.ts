import bunyan from 'bunyan';
import bunyanFormat from 'bunyan-format';

// Create a logger instance with the name 'clone-rappi-api'
const logger = bunyan.createLogger({
  name: 'rangos-api',
  // Define the log streams for the logger
  streams: [
    {
      // Set the log level to 'info'
      level: 'info',
      // Use the 'bunyan-format' library to format the output in 'long' mode
      stream: bunyanFormat({ outputMode: 'long' })
    }
  ]
});

export default logger;
