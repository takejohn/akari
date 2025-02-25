export interface Message {
    content: MessageContent;

    reply(content: ReplyContent): Promise<void>;
}

export type MessageContent = string | null;

export type Reaction = string;

export type ReplyContent = string;
