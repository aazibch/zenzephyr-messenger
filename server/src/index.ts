import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './app';

dotenv.config();

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Listening on port ${port}.`);
});

mongoose
  .connect(process.env.MONGO_CON_STRING)
  .then(() => console.log('Connected to database.'))
  .catch(() => console.log('Unable to connect to the database.'));
