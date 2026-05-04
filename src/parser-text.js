export function parseLooseText(text, sourcePath) {
  const chunks = text.split(/\n{2,}/).map((chunk) => chunk.trim()).filter(Boolean);
  if (chunks.length === 0 && text.trim()) chunks.push(text.trim());
  return chunks.map((chunk, index) => {
    const roleMatch = chunk.match(/^(user|assistant|system|tool|agent|developer)\s*:\s*/i);
    return {
      id: `${sourcePath}#${index + 1}`,
      sourcePath,
      index,
      role: roleMatch ? roleMatch[1].toLowerCase() : 'note',
      content: roleMatch ? chunk.slice(roleMatch[0].length) : chunk,
      createdAt: null,
      toolCalls: []
    };
  });
}
