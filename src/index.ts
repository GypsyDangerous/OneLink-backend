  
import app from "./app"

const port = process.env.PORT || 1800;
app.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`Listening on port:${port}`);
  /* eslint-enable no-console */
});