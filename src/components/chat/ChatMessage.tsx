import { useMemo } from 'react';
import type { ChatMessage as ChatMessageType } from './types';
import { renderMarkdown } from './markdown';

type Props = {
  message: ChatMessageType;
};

export function ChatMessage({ message }: Props) {
  const isUser = message.role === 'user';
  // renderMarkdown escapes all HTML before applying the markdown grammar,
  // so the assistant's text can never inject executable markup.
  const html = useMemo(
    () => (isUser ? '' : renderMarkdown(message.content)),
    [isUser, message.content],
  );

  return (
    <div
      className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}
      data-role={message.role}
    >
      <div
        className={
          isUser
            ? 'max-w-[85%] rounded-lg border border-border bg-bg-elevated px-3 py-2 text-[14px] leading-relaxed text-text-primary whitespace-pre-wrap break-words'
            : 'max-w-[95%] text-[14px] leading-relaxed text-text-primary [&_p]:mb-2 [&_p:last-child]:mb-0 [&_a]:text-accent [&_strong]:text-text-primary'
        }
      >
        {isUser ? (
          message.content
        ) : (
          <>
            <span
              // Sanitised by renderMarkdown (escapes HTML, allowlists URL schemes).
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: html }}
            />
            {message.pending && (
              <span
                aria-hidden="true"
                className="ml-1 inline-block h-3 w-1.5 animate-pulse bg-accent align-middle"
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
