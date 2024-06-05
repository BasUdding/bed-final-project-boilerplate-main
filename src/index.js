import express from 'express';
import * as Sentry from '@sentry/node';
import 'dotenv/config';

import loginRouter from './routes/login.js';
import usersRouter from './routes/users.js';
import hostsRouter from './routes/hosts.js';
import bookingsRouter from './routes/bookings.js';
import propertiesRouter from './routes/properties.js';
import reviewsRouter from './routes/reviews.js';
import amenitiesRouter from './routes/amenities.js';

import log from './middleware/logMiddleware.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

Sentry.init({
  dsn: 'https://9460c73dfc1da772ec3bf4ab7093c26d@o4507293907877888.ingest.de.sentry.io/4507367194034256',
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Sentry.Integrations.Express({ app }),
    // Automatically instrument Node.js libraries and frameworks
    ...Sentry.autoDiscoverNodePerformanceMonitoringIntegrations(),
  ],
  tracesSampleRate: 1.0,
});

// Trace incoming requests
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

app.use(express.json());
app.use(log);
app.get('/', (req, res) => {
  res.send('Hello world!');
});

//Resource routes
app.use('/users', usersRouter);
app.use('/hosts', hostsRouter);
app.use('/bookings', bookingsRouter);
app.use('/properties', propertiesRouter);
app.use('/reviews', reviewsRouter);
app.use('/amenities', amenitiesRouter);

//Login
app.use('/login', loginRouter);

// The error handler must be registered before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

// Error handling
app.use(errorHandler);

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
