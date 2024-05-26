import { addAlias } from 'module-alias';
import { resolve } from 'path';
import { env } from './index';

// Set up an alias '@' to point to either the 'src' or 'dist' directory
// depending on the value of the NODE_ENV environment variable.
// If NODE_ENV is 'development' or undefined, use the 'src' directory.
// Otherwise, use the 'dist' directory.
addAlias('@', resolve(env.nodeEnv === undefined || env.nodeEnv === 'development' ? 'src' : 'dist'));
