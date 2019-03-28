import * as Ably from 'ably';

let channel;
let clientId = "";
const setCliendId = (id) => clientId = id;

const client = new Ably.Realtime({ key: '9Dakxw.tSDnZA:kRUK23uiauySw7gM', clientId });
channel = client.channels.get('trollmusic');
channel.presence.enter();

export { channel, clientId as user, setCliendId }; 