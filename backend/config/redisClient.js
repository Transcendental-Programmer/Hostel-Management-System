import { createClient } from 'redis';

const client = createClient({
    password: 'Is3JZc6C4ACl9UTmuZKB8CuVMuQuw7Mq',
    socket: {
        host: 'redis-13216.c275.us-east-1-4.ec2.redns.redis-cloud.com',
        port: 13216
    }
});


export default client;