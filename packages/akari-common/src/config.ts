import fs from 'node:fs/promises';
import path from 'node:path';
import yaml from 'yaml';
import { z } from 'zod';

export type Config = z.infer<typeof configSchema>;

const FILENAME_CONFIG = path.resolve(
    import.meta.dirname,
    '..',
    '..',
    '..',
    '..',
    '.config.yaml',
);

const configSchema = z.object({
    misskey: z.object({
        origin: z.object({
            host: z.string(),
            protocol: z
                .literal('https:')
                .or(z.literal('http:'))
                .default('https:'),
        }),
        token: z.string(),
    }),
    discord: z.object({
        token: z.string(),
    }),
});

export async function loadConfig(): Promise<Config> {
    const content = await fs.readFile(FILENAME_CONFIG, 'utf-8');
    const config = yaml.parse(content);
    return configSchema.parse(config);
}
