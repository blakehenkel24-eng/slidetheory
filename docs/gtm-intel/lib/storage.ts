// File storage utilities
// File: /gtm/lib/storage.ts

import { promises as fs } from 'fs';
import { join } from 'path';

const OUTPUT_ROOT = '/home/node/.openclaw/workspace/gtm/outputs';

export interface OutputFile {
  path: string;
  name: string;
  jobId: string;
  date: string;
  size: number;
  modified: Date;
  content?: string;
}

export interface DateFolder {
  date: string;
  path: string;
  jobs: Record<string, OutputFile[]>;
  totalFiles: number;
}

// List all date folders
export async function listDateFolders(): Promise<DateFolder[]> {
  const folders: DateFolder[] = [];
  
  try {
    const entries = await fs.readdir(OUTPUT_ROOT, { withFileTypes: true });
    
    for (const entry of entries) {
      if (entry.isDirectory() && /^\d{4}-\d{2}-\d{2}$/.test(entry.name)) {
        const datePath = join(OUTPUT_ROOT, entry.name);
        const dateFolder = await getDateFolder(entry.name);
        folders.push(dateFolder);
      }
    }
  } catch {
    // Directory doesn't exist yet
  }
  
  return folders.sort((a, b) => b.date.localeCompare(a.date));
}

// Get files for a specific date
export async function getDateFolder(date: string): Promise<DateFolder> {
  const datePath = join(OUTPUT_ROOT, date);
  const folder: DateFolder = { date, path: datePath, jobs: {}, totalFiles: 0 };
  
  try {
    const jobDirs = await fs.readdir(datePath, { withFileTypes: true });
    
    for (const jobDir of jobDirs) {
      if (jobDir.isDirectory()) {
        const jobPath = join(datePath, jobDir.name);
        const files = await fs.readdir(jobPath);
        
        folder.jobs[jobDir.name] = [];
        
        for (const file of files) {
          const filePath = join(jobPath, file);
          const stat = await fs.stat(filePath);
          
          folder.jobs[jobDir.name].push({
            path: filePath,
            name: file,
            jobId: jobDir.name,
            date,
            size: stat.size,
            modified: stat.mtime,
          });
        }
        
        folder.totalFiles += folder.jobs[jobDir.name].length;
      }
    }
  } catch {
    // Directory doesn't exist
  }
  
  return folder;
}

// Read file content
export async function readOutputFile(filePath: string): Promise<OutputFile | null> {
  try {
    const stat = await fs.stat(filePath);
    const content = await fs.readFile(filePath, 'utf-8');
    const parts = filePath.split('/');
    const name = parts[parts.length - 1];
    const jobId = parts[parts.length - 2];
    const date = parts[parts.length - 3];
    
    return {
      path: filePath,
      name,
      jobId,
      date,
      size: stat.size,
      modified: stat.mtime,
      content,
    };
  } catch {
    return null;
  }
}

// Write output file
export async function writeOutput(jobId: string, filename: string, content: string): Promise<void> {
  const today = new Date().toISOString().split('T')[0];
  const dir = join(OUTPUT_ROOT, today, jobId);
  
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(join(dir, filename), content, 'utf-8');
}

// Search across all outputs
export async function searchOutputs(query: string): Promise<OutputFile[]> {
  const results: OutputFile[] = [];
  const folders = await listDateFolders();
  
  for (const folder of folders) {
    for (const [jobId, files] of Object.entries(folder.jobs)) {
      for (const file of files) {
        if (file.name.toLowerCase().includes(query.toLowerCase())) {
          results.push(file);
          continue;
        }
        
        // Search content (limit to recent files for performance)
        try {
          const content = await fs.readFile(file.path, 'utf-8');
          if (content.toLowerCase().includes(query.toLowerCase())) {
            results.push(file);
          }
        } catch {
          // Skip unreadable files
        }
      }
    }
  }
  
  return results.slice(0, 20); // Limit results
}

// Get latest outputs across all jobs
export async function getLatestOutputs(limit: number = 5): Promise<OutputFile[]> {
  const folders = await listDateFolders();
  const outputs: OutputFile[] = [];
  
  for (const folder of folders.slice(0, 3)) { // Last 3 days
    for (const files of Object.values(folder.jobs)) {
      outputs.push(...files);
    }
  }
  
  return outputs
    .sort((a, b) => b.modified.getTime() - a.modified.getTime())
    .slice(0, limit);
}

// Delete old outputs
export async function purgeOldOutputs(daysToKeep: number = 30): Promise<number> {
  const folders = await listDateFolders();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - daysToKeep);
  
  let deleted = 0;
  
  for (const folder of folders) {
    const folderDate = new Date(folder.date);
    if (folderDate < cutoff) {
      try {
        await fs.rm(folder.path, { recursive: true });
        deleted++;
      } catch {
        // Ignore errors
      }
    }
  }
  
  return deleted;
}
