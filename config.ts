export default {
  db: {
    username: "root",
    password: "root",
    host: "localhost",
    port: 3306,
    database: "test",
    pool: {
      max: 50,
      min: 1,
    },
  },
  parallelismDegree: 50,
  iterationSize: 10000,
}