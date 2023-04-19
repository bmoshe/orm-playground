export default {
  db: {
    username: "root",
    password: "root",
    host: "localhost",
    port: 3306,
    database: "test",
    pool: {
      max: 20,
      min: 1,
    },
  },
  parallelismDegree: 1_000,
  iterationSize: 5_000,
}