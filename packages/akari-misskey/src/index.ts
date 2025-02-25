import * as Misskey from 'misskey-js';
import { loadConfig } from 'akari-common';

const { misskey: config } = await loadConfig();
const origin = `${config.origin.protocol}//${config.origin.host}`;
const stream = new Misskey.Stream(origin, { token: config.token });
const apiClient = new Misskey.api.APIClient({
    origin,
    credential: config.token,
});

const channel = stream.useChannel('main');

channel.on('mention', async (payload) => {
    try {
        if (payload.text?.includes('ping')) {
            await Promise.all([
                apiClient.request('notes/reactions/create', {
                    noteId: payload.id,
                    reaction: '❤️',
                }),
                apiClient.request('notes/create', {
                    visibility: payload.visibility,
                    visibleUserIds: payload.visibleUserIds,
                    replyId: payload.id,
                    text: `${Misskey.acct.toString(payload.user)} pong!`,
                }),
            ]);
        }
    } catch (e) {
        console.error(e);
    }
});

console.log('Akari on Misskey has been booted up!');
