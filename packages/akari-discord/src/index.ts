import { Handler, loadConfig } from 'akari-common';
import {
    createBot,
    DiscordMessageReferenceType,
    GatewayIntents,
} from '@discordeno/bot';

const { discord: config } = await loadConfig();
const handler = new Handler();

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
            handler.onStart('Discord');
        },
        async messageCreate(message) {
            try {
                if (message.mentions?.some((user) => user.id == bot.id)) {
                    handler.onMention({
                        content: message.content,
                        async reply(content) {
                            await bot.helpers.sendMessage(message.channelId, {
                                content: content,
                                messageReference: {
                                    type: DiscordMessageReferenceType.Default,
                                    messageId: message.id,
                                    failIfNotExists: true,
                                },
                            });
                        },
                    });
                }
            } catch (e) {
                console.error(e);
            }
        },
    },
});

await bot.start();
