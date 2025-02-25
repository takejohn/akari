import { loadConfig } from 'akari-common';
import {
    createBot,
    DiscordMessageReferenceType,
    GatewayIntents,
} from '@discordeno/bot';

const { discord: config } = await loadConfig();

const bot = createBot({
    token: config.token,
    intents: GatewayIntents.GuildMessages | GatewayIntents.MessageContent,
    desiredProperties: {
        message: {
            channelId: true,
            content: true,
            id: true,
            mentions: true,
        },
        user: {
            id: true,
        },
    },
    events: {
        ready() {
            console.log('Akari on Discord has been booted up!');
        },
        async messageCreate(message) {
            try {
                if (
                    message.mentions?.some((user) => user.id == bot.id) &&
                    message.content.includes('ping')
                ) {
                    await Promise.all([
                        bot.helpers.sendMessage(message.channelId, {
                            content: 'pong!',
                            messageReference: {
                                type: DiscordMessageReferenceType.Default,
                                messageId: message.id,
                                failIfNotExists: true,
                            },
                        }),
                    ]);
                }
            } catch (e) {
                console.error(e);
            }
        },
    },
});

await bot.start();
