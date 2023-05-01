export default {
  db: {
    username: "root",
    password: "root",
    host: "localhost",
    port: 3306,
    database: "test",
    pool: {
      max: 100,
      min: 1,
    },
  },
  parallelismDegree: 100,
  iterationSize: 1000,
}
