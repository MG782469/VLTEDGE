import { Queue } from "bullmq";
import { connection } from "./redisdb.js";
export const emailqueue=new Queue("email-queue",{connection,
    defaultJobOptions:{
        removeOnComplete:true,
        attempts:3,
        backoff:{type:"exponential",delay:2000
       }
       
    }
})