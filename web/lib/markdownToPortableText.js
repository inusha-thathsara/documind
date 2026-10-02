export function markdownToPortableText(markdown) {
  if (!markdown) return [];

  // Remove frontmatter if present (between --- and ---)
  let content = markdown;
  if (content.startsWith('---')) {
    const end = content.indexOf('---', 3);
    if (end !== -1) {
      content = content.slice(end + 3).trim();
    }
  }

  const blocks = [];
  const lines = content.split('\n');
  let inCodeBlock = false;
  let codeBuffer = [];
  let codeLang = '';
  let paragraphBuffer = [];

  const flushParagraph = () => {
    if (paragraphBuffer.length > 0) {
      const text = paragraphBuffer.join(' ').trim();
      if (text) {
        blocks.push({
          _key: 'p_' + Math.random().toString(36).slice(2, 9),
          _type: 'block',
          style: 'normal',
          children: [{ _key: 's_' + Math.random().toString(36).slice(2, 9), _type: 'span', text }]
        });
      }
      paragraphBuffer = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Check code fence
    if (trimmed.startsWith('```')) {
      if (inCodeBlock) {
        // End code block
        blocks.push({
          _key: 'code_' + Math.random().toString(36).slice(2, 9),
          _type: 'code',
          language: codeLang || 'text',
          code: codeBuffer.join('\n')
        });
        codeBuffer = [];
        codeLang = '';
        inCodeBlock = false;
      } else {
        // Start code block
        flushParagraph();
        inCodeBlock = true;
        codeLang = trimmed.slice(3).trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    // Blank line flushes current paragraph
    if (!trimmed) {
      flushParagraph();
      continue;
    }

    // Heading 1
    if (trimmed.startsWith('# ')) {
      flushParagraph();
      blocks.push({
        _key: 'h1_' + Math.random().toString(36).slice(2, 9),
        _type: 'block',
        style: 'h1',
        children: [{ _key: 's_' + Math.random().toString(36).slice(2, 9), _type: 'span', text: trimmed.slice(2).trim() }]
      });
      continue;
    }

    // Heading 2
    if (trimmed.startsWith('## ')) {
      flushParagraph();
      blocks.push({
        _key: 'h2_' + Math.random().toString(36).slice(2, 9),
        _type: 'block',
        style: 'h2',
        children: [{ _key: 's_' + Math.random().toString(36).slice(2, 9), _type: 'span', text: trimmed.slice(3).trim() }]
      });
      continue;
    }

    // Heading 3 or 4
    if (trimmed.startsWith('### ') || trimmed.startsWith('#### ')) {
      flushParagraph();
      const text = trimmed.replace(/^#+\s+/, '');
      blocks.push({
        _key: 'h3_' + Math.random().toString(36).slice(2, 9),
        _type: 'block',
        style: 'h3',
        children: [{ _key: 's_' + Math.random().toString(36).slice(2, 9), _type: 'span', text }]
      });
      continue;
    }

    // Bullet lists
    if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
      flushParagraph();
      blocks.push({
        _key: 'li_' + Math.random().toString(36).slice(2, 9),
        _type: 'block',
        style: 'normal',
        listItem: 'bullet',
        children: [{ _key: 's_' + Math.random().toString(36).slice(2, 9), _type: 'span', text: trimmed.slice(2).trim() }]
      });
      continue;
    }

    // Blockquote
    if (trimmed.startsWith('> ')) {
      flushParagraph();
      blocks.push({
        _key: 'bq_' + Math.random().toString(36).slice(2, 9),
        _type: 'block',
        style: 'blockquote',
        children: [{ _key: 's_' + Math.random().toString(36).slice(2, 9), _type: 'span', text: trimmed.slice(2).trim() }]
      });
      continue;
    }

    // Regular line in paragraph
    paragraphBuffer.push(trimmed);
  }

  flushParagraph();

  if (inCodeBlock && codeBuffer.length > 0) {
    blocks.push({
      _key: 'code_' + Math.random().toString(36).slice(2, 9),
      _type: 'code',
      language: codeLang || 'text',
      code: codeBuffer.join('\n')
    });
  }

  return blocks;
}
