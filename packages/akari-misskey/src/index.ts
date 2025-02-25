import * as Misskey from 'misskey-js';
import { Handler, loadConfig } from 'akari-common';

const { misskey: config } = await loadConfig();
const origin = `${config.origin.protocol}//${config.origin.host}`;
const stream = new Misskey.Stream(origin, { token: config.token });
const apiClient = new Misskey.api.APIClient({
    origin,
    credential: config.token,
});
const handler = new Handler();

const channel = stream.useChannel('main');

channel.on('mention', async (payload) => {
    try {
        handler.onMention({
            content: payload.text,
            async reply(content) {
                apiClient.request('notes/create', {
                    visibility: payload.visibility,
                    visibleUserIds: payload.visibleUserIds,
                    replyId: payload.id,
                    text: `@${Misskey.acct.toString(payload.user)} ${content}`,
                });
            },
        });
    } catch (e) {
        console.error(e);
    }
});

handler.onStart('Misskey');
