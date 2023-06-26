require("dotenv").config();
const api = require("./app");

api.listen(process.env.PORT, () => {
  console.log(`api listening on PORT ${process.env.PORT}`);
});
