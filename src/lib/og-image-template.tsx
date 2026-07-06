export type OgImageData = {
  title: string;
  description: string;
  author: string;
  date: string;
  topics: string[];
};

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1).trimEnd()}…`;
}

function wrapLines(text: string, maxCharsPerLine: number, maxLines: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length <= maxCharsPerLine) {
      current = next;
      continue;
    }

    if (current) lines.push(current);
    current = word;

    if (lines.length >= maxLines - 1) break;
  }

  if (current && lines.length < maxLines) lines.push(current);

  if (lines.length === maxLines) {
    const usedWords = lines.join(' ').split(/\s+/).length;
    if (usedWords < words.length) {
      lines[maxLines - 1] = truncate(lines[maxLines - 1], maxCharsPerLine);
    }
  }

  return lines;
}

export function OgImageTemplate({ title, description, author, date, topics }: OgImageData) {
  const titleLines = wrapLines(title, 34, 3);
  const displayDescription = truncate(description, 130);
  const displayTopics = topics.slice(0, 4);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        backgroundColor: '#2b2b2b',
        color: '#f9f9f9',
        padding: '64px 72px',
        fontFamily: 'JetBrains Mono',
        justifyContent: 'space-between',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
        }}
      >
        <div
          style={{
            width: '72px',
            height: '4px',
            backgroundColor: '#ffc107',
            marginBottom: '40px',
          }}
        />

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '48px',
            fontSize: '22px',
            letterSpacing: '-0.04em',
          }}
        >
          <span style={{ fontWeight: 700 }}>SAMIUL A.</span>
          <span style={{ color: '#a3a3a3', fontSize: '18px', letterSpacing: '0.08em' }}>BLOG</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
          {titleLines.map((line) => (
            <div
              key={line}
              style={{
                fontSize: '52px',
                fontWeight: 700,
                lineHeight: 1.1,
                letterSpacing: '-0.05em',
              }}
            >
              {line}
            </div>
          ))}

          <div
            style={{
              fontSize: '24px',
              lineHeight: 1.45,
              color: '#d4d4d4',
              marginTop: '8px',
            }}
          >
            {displayDescription}
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          borderTop: '1px solid #525252',
          paddingTop: '28px',
          fontSize: '18px',
        }}
      >
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', maxWidth: '780px' }}>
          {displayTopics.map((topic) => (
            <div
              key={topic}
              style={{
                border: '1px dashed #737373',
                borderRadius: '4px',
                padding: '6px 12px',
                fontSize: '14px',
                textTransform: 'uppercase',
                color: '#f9f9f9',
              }}
            >
              {topic}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
          <span style={{ color: '#a3a3a3', fontSize: '16px' }}>{date}</span>
          <div style={{ display: 'flex', gap: '6px', fontSize: '16px' }}>
            <span>by</span>
            <span style={{ fontWeight: 700 }}>{author}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
