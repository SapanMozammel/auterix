/**
 * Auterix VS Code & Cursor Extension
 * Provides status bar synchronization telemetry, real-time drift detection,
 * and 1-click re-sync commands for 21 AI coding assistants.
 */

const vscode = require('vscode');
const cp = require('child_process');
const path = require('path');
const fs = require('fs');

let statusBarItem;

function getWorkspaceRoot() {
  const folders = vscode.workspace.workspaceFolders;
  return folders && folders.length > 0 ? folders[0].uri.fsPath : null;
}

/**
 * Runs Auterix verification check
 */
function runCheck(root) {
  return new Promise((resolve) => {
    if (!root) return resolve({ ok: false, message: 'No active workspace open' });

    // Look for bin/workflow.mjs in repo or global npx auterix
    const localCli = path.join(root, 'bin', 'workflow.mjs');
    const cmd = fs.existsSync(localCli)
      ? `node "${localCli}" check --root "${root}"`
      : `npx auterix check --root "${root}"`;

    cp.exec(cmd, { cwd: root }, (err, stdout, stderr) => {
      if (err) {
        resolve({ ok: false, error: stderr || stdout || err.message });
      } else {
        try {
          const parsed = JSON.parse(stdout);
          resolve({ ok: parsed.ok === true, data: parsed });
        } catch {
          resolve({ ok: stdout.includes('"ok": true') || stdout.includes('ok: true') });
        }
      }
    });
  });
}

/**
 * Updates the status bar item based on verification state
 */
async function updateStatusBar() {
  if (!statusBarItem) return;
  const root = getWorkspaceRoot();
  if (!root) {
    statusBarItem.hide();
    return;
  }

  const hasAuterix =
    fs.existsSync(path.join(root, '.ai')) ||
    fs.existsSync(path.join(root, 'CLAUDE.md')) ||
    fs.existsSync(path.join(root, '.cursorrules'));

  if (!hasAuterix) {
    statusBarItem.hide();
    return;
  }

  statusBarItem.show();
  const res = await runCheck(root);

  if (res.ok) {
    statusBarItem.text = '$(shield) Auterix: 21 Tools Synced';
    statusBarItem.tooltip = 'All 21 AI adapters match SHA-256 integrity lock. Click to verify.';
    statusBarItem.backgroundColor = undefined;
    statusBarItem.command = 'auterix.check';
  } else {
    statusBarItem.text = '$(alert) Auterix: Drift Detected';
    statusBarItem.tooltip = 'AI context rules have drifted from lockfile. Click to re-sync.';
    statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
    statusBarItem.command = 'auterix.sync';
  }
}

/**
 * Extension Activation
 */
function activate(context) {
  statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  context.subscriptions.push(statusBarItem);

  // Initial status check
  updateStatusBar();

  // Watch for changes to AI rule files
  const watcher = vscode.workspace.createFileSystemWatcher('**/{.ai/**,CLAUDE.md,.cursorrules,.agents/**,.windsurfrules}');
  watcher.onDidChange(() => updateStatusBar());
  watcher.onDidCreate(() => updateStatusBar());
  watcher.onDidDelete(() => updateStatusBar());
  context.subscriptions.push(watcher);

  // Command: auterix.check
  context.subscriptions.push(
    vscode.commands.registerCommand('auterix.check', async () => {
      const root = getWorkspaceRoot();
      if (!root) return vscode.window.showErrorMessage('Auterix: No active workspace.');

      vscode.window.withProgress(
        { location: vscode.ProgressLocation.Notification, title: 'Auterix: Verifying 21 AI agent rules...' },
        async () => {
          const res = await runCheck(root);
          if (res.ok) {
            vscode.window.showInformationMessage('✅ Auterix: All 21 AI adapters verified. Zero drift detected!');
          } else {
            const action = await vscode.window.showWarningMessage(
              '⚠️ Auterix: AI rule drift detected! Rules do not match SHA-256 lock.',
              'Re-Sync Now'
            );
            if (action === 'Re-Sync Now') {
              vscode.commands.executeCommand('auterix.sync');
            }
          }
          updateStatusBar();
        }
      );
    })
  );

  // Command: auterix.sync
  context.subscriptions.push(
    vscode.commands.registerCommand('auterix.sync', async () => {
      const root = getWorkspaceRoot();
      if (!root) return vscode.window.showErrorMessage('Auterix: No active workspace.');

      vscode.window.withProgress(
        { location: vscode.ProgressLocation.Notification, title: 'Auterix: Synchronizing all 21 AI adapters...' },
        async () => {
          const localCli = path.join(root, 'bin', 'workflow.mjs');
          const cmd = fs.existsSync(localCli)
            ? `node "${localCli}" init`
            : `npx auterix init`;

          cp.exec(cmd, { cwd: root }, (err, stdout, stderr) => {
            if (err) {
              vscode.window.showErrorMessage(`Auterix Sync Failed: ${stderr || err.message}`);
            } else {
              vscode.window.showInformationMessage('✅ Auterix: Successfully synchronized all 21 AI adapters with SHA-256 lock!');
            }
            updateStatusBar();
          });
        }
      );
    })
  );

  // Command: auterix.recordMemory
  context.subscriptions.push(
    vscode.commands.registerCommand('auterix.recordMemory', async () => {
      const root = getWorkspaceRoot();
      if (!root) return vscode.window.showErrorMessage('Auterix: No active workspace.');

      const category = await vscode.window.showQuickPick(
        ['architecture', 'security', 'conventions', 'anti-patterns'],
        { placeHolder: 'Select memory category' }
      );
      if (!category) return;

      const note = await vscode.window.showInputBox({
        prompt: 'Enter architectural decision or discarded anti-pattern',
        placeHolder: 'e.g. We use Drizzle ORM + pgvector instead of Pinecone'
      });
      if (!note) return;

      const localCli = path.join(root, 'bin', 'workflow.mjs');
      const cmd = `node "${localCli}" memory --category "${category}" --note "${note.replace(/"/g, '\\"')}"`;

      cp.exec(cmd, { cwd: root }, (err) => {
        if (err) {
          vscode.window.showErrorMessage(`Failed to record memory: ${err.message}`);
        } else {
          vscode.window.showInformationMessage(`🧠 Auterix: Recorded decision into .ai/memory.md for all 21 AI assistants!`);
        }
      });
    })
  );

  // Command: auterix.extractSchema
  context.subscriptions.push(
    vscode.commands.registerCommand('auterix.extractSchema', async (uri) => {
      const root = getWorkspaceRoot();
      const filePath = uri ? uri.fsPath : (vscode.window.activeTextEditor ? vscode.window.activeTextEditor.document.fileName : null);
      if (!filePath) return vscode.window.showErrorMessage('Please open a database schema file (.ts, .prisma, .sql).');

      const localCli = path.join(root, 'bin', 'workflow.mjs');
      const cmd = `node "${localCli}" extract-schema --file "${filePath}"`;

      cp.exec(cmd, { cwd: root }, async (err, stdout) => {
        if (err) {
          vscode.window.showErrorMessage(`Schema extraction failed: ${err.message}`);
        } else {
          const doc = await vscode.workspace.openTextDocument({
            content: stdout,
            language: 'markdown'
          });
          await vscode.window.showTextDocument(doc, { preview: true });
        }
      });
    })
  );

  // Command: auterix.doctor
  context.subscriptions.push(
    vscode.commands.registerCommand('auterix.doctor', () => {
      const root = getWorkspaceRoot();
      const terminal = vscode.window.createTerminal('Auterix Doctor');
      terminal.show();
      const localCli = root ? path.join(root, 'bin', 'workflow.mjs') : null;
      if (localCli && fs.existsSync(localCli)) {
        terminal.sendText(`node "${localCli}" doctor`);
      } else {
        terminal.sendText('npx auterix doctor');
      }
    })
  );

  // Command: auterix.openStudio
  context.subscriptions.push(
    vscode.commands.registerCommand('auterix.openStudio', () => {
      vscode.env.openExternal(vscode.Uri.parse('https://auterix.vercel.app'));
    })
  );
}

function deactivate() {
  if (statusBarItem) statusBarItem.dispose();
}

module.exports = {
  activate,
  deactivate
};
