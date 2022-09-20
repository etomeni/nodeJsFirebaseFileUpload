import express from 'express';
import helmet from 'helmet';
import compression from 'compression';

import fileUpload from 'express-fileupload';

import bodyParser from 'body-parser';
import cors from 'cors';

import firebaseRoute from './routes/firebase/firebaseUpload.js';
import { get404, get500 } from './controllers/error.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(compression());

const PORT = process.env.PORT || 5000;
// const PORT = 5000;

app.use(fileUpload());
app.use(bodyParser.json());

app.use('/api/firebaseUpload', firebaseRoute);

app.use(get404);
app.use(get500);

// app.get('/', (req, res) => {
//     res.send('Hello From Home page');
// })

app.listen(PORT, () => {
    console.log(`Server Running on port: http://localhost:${PORT}`);
});