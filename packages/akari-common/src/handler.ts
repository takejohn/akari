import { Message } from './types.js';

export class Handler {
    async onStart(type: 'Misskey' | 'Discord') {
        console.log(`Akari on ${type} has been booted up!`);
    }

    async onMention(message: Message) {
        if (message.content == null) {
            return;
        }

        const [_mention, command, ...args] = message.content.split(' ');

        switch (command) {
            case 'ping': {
                await message.reply('pong!');
                return;
            }

            case 'mcsrvstat': {
                const address = args[0];
                if (address == null) {
                    await message.reply('サーバーを指定してください！');
                    return;
                }
                const res = await fetch(
                    `https://api.mcsrvstat.us/3/${address}`,
                );
                const resJson = await res.json();
                if (resJson.online) {
                    await message.reply(`${address}はオンラインです！`);
                } else {
                    await message.reply(`${address}はオフラインです！`);
                }
                return;
            }

            case undefined: {
                await message.reply('どうかされましたか？');
                return;
            }

            default: {
                await message.reply('不明なコマンドです。');
                return;
            }
        }
    }
}
