const app = require('./app');
import dotenv from 'dotenv';

dotenv.config({ path: './config.env' });

app.listen(process.env.PORT || 5000, () => {
  console.log(`listening to port`);
});
