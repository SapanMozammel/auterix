/**
 * Auterix Database Schema-to-Context Extractor
 * Parses Drizzle ORM, Prisma, and SQL DDL schemas into token-optimized Markdown tables
 * for zero-hallucination query authoring across all 21 AI coding assistants.
 */

import fs from 'node:fs';

/**
 * Extracts schema information from Drizzle ORM TypeScript code
 */
export function extractDrizzleSchema(content) {
  const tables = [];
  // Find each export const <varName> = pgTable('<tableName>'
  const headerRegex = /export\s+const\s+(\w+)\s*=\s*pgTable\s*\(\s*['"`]([^'"`]+)['"`]\s*,\s*\{/g;
  let headerMatch;

  while ((headerMatch = headerRegex.exec(content)) !== null) {
    const varName = headerMatch[1];
    const dbTableName = headerMatch[2];
    const startIndex = headerMatch.index + headerMatch[0].length;

    // Balance braces to find the end of the schema object
    let depth = 1;
    let endIndex = startIndex;
    while (endIndex < content.length && depth > 0) {
      if (content[endIndex] === '{') depth++;
      else if (content[endIndex] === '}') depth--;
      endIndex++;
    }

    const body = content.slice(startIndex, endIndex - 1);
    const columns = [];
    const lines = body.split('\n');

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line || line.startsWith('//')) continue;

      // Matches: propName: colType('db_name', ...).modifier().modifier()
      const lineMatch = /^(\w+)\s*:\s*(\w+)\s*\((.*?)\)(.*)$/.exec(line);
      if (lineMatch) {
        const [, propName, colType, args, chained] = lineMatch;
        const nameMatch = /['"`]([^'"`]+)['"`]/.exec(args);
        const dbName = nameMatch ? nameMatch[1] : propName;
        const fullModifiers = `${args} ${chained}`;

        const flags = [];
        if (fullModifiers.includes('primaryKey')) flags.push('PK');
        if (fullModifiers.includes('unique')) flags.push('UNIQUE');
        if (fullModifiers.includes('notNull')) flags.push('NOT NULL');
        if (fullModifiers.includes('references')) flags.push('FK');

        columns.push({
          name: dbName,
          type: colType.toUpperCase(),
          flags: flags.length ? `[${flags.join(', ')}]` : '',
        });
      }
    }

    tables.push({
      name: dbTableName || varName,
      columns,
    });
  }

  return tables;
}

/**
 * Extracts schema information from Prisma schema files
 */
export function extractPrismaSchema(content) {
  const tables = [];
  const modelRegex = /model\s+(\w+)\s*\{([^}]+)\}/g;
  let match;

  while ((match = modelRegex.exec(content)) !== null) {
    const [, modelName, body] = match;
    const columns = [];
    const lines = body.split('\n');

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line || line.startsWith('//') || line.startsWith('@@')) continue;

      const parts = line.split(/\s+/);
      if (parts.length >= 2) {
        const [colName, colType, ...directives] = parts;
        const flags = [];
        if (directives.some((d) => d.includes('@id'))) flags.push('PK');
        if (directives.some((d) => d.includes('@unique'))) flags.push('UNIQUE');
        if (directives.some((d) => d.includes('@relation'))) flags.push('FK');

        columns.push({
          name: colName,
          type: colType,
          flags: flags.length ? `[${flags.join(', ')}]` : '',
        });
      }
    }

    tables.push({ name: modelName, columns });
  }

  return tables;
}

/**
 * Extracts schema information from standard SQL DDL
 */
export function extractSqlSchema(content) {
  const tables = [];
  const tableRegex = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?([^\s(]+)\s*\(([^;]+)\);/gis;
  let match;

  while ((match = tableRegex.exec(content)) !== null) {
    const [, rawTableName, body] = match;
    const tableName = rawTableName.replace(/['"`]/g, '').trim();
    const columns = [];
    const lines = body.split(',');

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line || line.toUpperCase().startsWith('PRIMARY KEY') || line.toUpperCase().startsWith('CONSTRAINT')) continue;

      const parts = line.split(/\s+/);
      if (parts.length >= 2) {
        const colName = parts[0].replace(/['"`]/g, '');
        const colType = parts[1].toUpperCase();
        const upper = line.toUpperCase();
        const flags = [];
        if (upper.includes('PRIMARY KEY')) flags.push('PK');
        if (upper.includes('UNIQUE')) flags.push('UNIQUE');
        if (upper.includes('NOT NULL')) flags.push('NOT NULL');
        if (upper.includes('REFERENCES')) flags.push('FK');

        columns.push({
          name: colName,
          type: colType,
          flags: flags.length ? `[${flags.join(', ')}]` : '',
        });
      }
    }

    tables.push({ name: tableName, columns });
  }

  return tables;
}

/**
 * Auto-detects dialect and generates token-optimized Markdown context
 */
export function extractSchemaContextFromFile(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Schema file not found: ${filePath}`);
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  let tables = [];

  if (filePath.endsWith('.prisma')) {
    tables = extractPrismaSchema(content);
  } else if (filePath.endsWith('.sql')) {
    tables = extractSqlSchema(content);
  } else {
    // Default to Drizzle / TypeScript
    tables = extractDrizzleSchema(content);
    if (!tables.length) {
      tables = extractSqlSchema(content);
    }
  }

  return formatSchemaAsMarkdown(tables, filePath);
}

/**
 * Formats table metadata into an ultra-compact, token-efficient Markdown prompt block
 */
export function formatSchemaAsMarkdown(tables, sourceFile = '') {
  let output = `### DATABASE SCHEMA CONTEXT${sourceFile ? ` (${sourceFile})` : ''}\n`;
  output += `<!-- Auterix auto-extracted schema summary for zero-hallucination queries -->\n\n`;

  if (!tables || tables.length === 0) {
    output += `_No active database tables detected in schema._\n`;
    return output;
  }

  for (const table of tables) {
    output += `#### Table: \`${table.name}\`\n`;
    if (!table.columns.length) {
      output += `  (No parsed columns)\n\n`;
      continue;
    }
    const cols = table.columns
      .map((c) => `\`${c.name}\` (${c.type}${c.flags ? ` ${c.flags}` : ''})`)
      .join(', ');
    output += `- Columns: ${cols}\n\n`;
  }

  return output;
}
