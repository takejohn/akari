import { Message } from './types.js';

export class Handler {
    async onStart(type: 'Misskey' | 'Discord') {
        console.log(`Akari on ${type} has been booted up!`);
    }

    async onMention(message: Message) {
        if (message.content?.includes('ping')) {
            await message.reply('pong!');
        }
    }
}
