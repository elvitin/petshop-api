const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const config = require('config');
const router = require('./routes/supplier');
const AbstractError = require('./errors/AbstractError');
const { acceptedFormats, ErrorSerializer } = require('./Serializer');

// app.use(bodyParser.json());
app.use(express.json());

app.use((req, res, next) => {
  let requestedFormat = req.header('Accept');

  if (requestedFormat === '*/*') {
    requestedFormat = 'application/json';
  }

  if (!acceptedFormats.includes(requestedFormat)) {
    res.status(406).end();
    return;
  }

  res.setHeader('Content-Type', requestedFormat);
  next();
});

app.use('/api/supplier', router);

app.use((error, req, res, next) => {
  if (error instanceof AbstractError) {
    // res
    //   .status(error.statusCode)
    //   .json({ httpInternalErrorID: error.idError, error: error.message });

    const errorSerializer = new ErrorSerializer(res.getHeader('Content-Type'));
    res.status(error.statusCode).send(
      errorSerializer.serialize({
        id: error.idError,
        message: error.message
      })
    );
    return;
  }
  res.status(400).json({ error: error.message });
});

app.listen(config.get('api.port'), _ => {
  console.log('Petshop API is running...');
});
