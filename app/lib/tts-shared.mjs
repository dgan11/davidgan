export const SPEECHIFY_API_URL = 'https://api.sws.speechify.com/v1/audio/speech';
export const SPEECHIFY_VOICE_ID = '38c70d56-1551-4019-af88-96d614837dd7';

function stripOuterQuotes(value) {
  return value.replace(/^['"](.*)['"]$/, '$1');
}

export function parseFrontmatter(fileContent) {
  const frontmatterRegex = /---\s*([\s\S]*?)\s*---/;
  const match = frontmatterRegex.exec(fileContent);

  if (!match) {
    return { metadata: {}, content: fileContent.trim() };
  }

  const frontMatterBlock = match[1];
  const content = fileContent.replace(frontmatterRegex, '').trim();
  const metadata = {};

  for (const line of frontMatterBlock.trim().split('\n')) {
    const [key, ...valueParts] = line.split(': ');
    if (!key) {
      continue;
    }

    metadata[key.trim()] = stripOuterQuotes(valueParts.join(': ').trim());
  }

  return { metadata, content };
}

export function mdxToPlainText(mdx) {
  return mdx
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^>\s?/gm, '')
    .replace(/^#{1,6}\s*/gm, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function buildSpeechifySsml(text) {
  return `<speak><prosody rate="-4%" pitch="-4%">${text}</prosody></speak>`;
}
