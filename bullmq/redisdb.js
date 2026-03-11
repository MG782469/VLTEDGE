import IORedis from "ioredis";
export const connection = new IORedis({
  username: "default",
  password: "ityo48BBNacS66Owi8vmet4WISZdxke5",
  host: "redis-11478.c52.us-east-1-4.ec2.cloud.redislabs.com",
  port: 11478,
  ttl:{},
maxRetriesPerRequest: null,
});
// redis-cli -u redis://default:ityo48BBNacS66Owi8vmet4WISZdxke5@redis-11478.c52.us-east-1-4.ec2.cloud.redislabs.com:11478