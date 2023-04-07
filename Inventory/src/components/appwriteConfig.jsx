import { Client, Account, Databases} from 'appwrite'

const client = new Client();

client
    .setEndpoint('http://localhost/v1')
    .setProject(`63f95bf820bd02125da3`)
;

export const account = new Account(client);

export const database = new Databases(client);
