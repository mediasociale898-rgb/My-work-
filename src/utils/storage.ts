import {
  DailyTask,
  DayPlan,
  NoteItem,
  QuizItem,
  ProjectItem,
  FileFolderItem,
  CodeProject,
  FocusSession,
  AppShortcut,
  IdeaItem,
  AppSettings,
} from '../types';
import {
  initialTasks,
  initialDayPlan,
  initialNotes,
  initialQuizzes,
  initialProjects,
  initialFolders,
  initialCodeProjects,
  initialSavedApps,
  initialFocusSessions,
  initialIdeas,
  initialSettings,
} from './initialData';

const DB_NAME = 'my_work_os_db';
const DB_VERSION = 1;

export interface FullBackupPayload {
  version: string;
  exportedAt: string;
  tasks: DailyTask[];
  dayPlan: DayPlan;
  notes: NoteItem[];
  quizzes: QuizItem[];
  projects: ProjectItem[];
  folders: FileFolderItem[];
  codeProjects: CodeProject[];
  focusSessions: FocusSession[];
  savedApps: AppShortcut[];
  ideas: IdeaItem[];
  settings: AppSettings;
}

class StorageManager {
  private dbPromise: Promise<IDBDatabase> | null = null;

  private getDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        reject(new Error('IndexedDB not supported in this environment'));
        return;
      }
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const stores = [
          'tasks',
          'dayPlan',
          'notes',
          'quizzes',
          'projects',
          'folders',
          'codeProjects',
          'focusSessions',
          'savedApps',
          'ideas',
          'settings',
        ];
        stores.forEach(storeName => {
          if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, { keyPath: 'id' });
          }
        });
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    return this.dbPromise;
  }

  // Generic IndexedDB load or fallback to localStorage
  public async loadAllData(): Promise<FullBackupPayload> {
    try {
      const db = await this.getDB();
      const readStore = <T>(storeName: string): Promise<T[]> => {
        return new Promise((resolve, reject) => {
          const tx = db.transaction(storeName, 'readonly');
          const store = tx.objectStore(storeName);
          const req = store.getAll();
          req.onsuccess = () => resolve(req.result || []);
          req.onerror = () => reject(req.error);
        });
      };

      const [
        tasks,
        dayPlans,
        notes,
        quizzes,
        projects,
        folders,
        codeProjects,
        focusSessions,
        savedApps,
        ideas,
        settingsArr,
      ] = await Promise.all([
        readStore<DailyTask>('tasks'),
        readStore<DayPlan & { id: string }>('dayPlan'),
        readStore<NoteItem>('notes'),
        readStore<QuizItem>('quizzes'),
        readStore<ProjectItem>('projects'),
        readStore<FileFolderItem>('folders'),
        readStore<CodeProject>('codeProjects'),
        readStore<FocusSession>('focusSessions'),
        readStore<AppShortcut>('savedApps'),
        readStore<IdeaItem>('ideas'),
        readStore<AppSettings & { id: string }>('settings'),
      ]);

      // Check if initialized; if empty, seed defaults
      if (tasks.length === 0 && notes.length === 0) {
        const initialPayload: FullBackupPayload = {
          version: '1.0',
          exportedAt: new Date().toISOString(),
          tasks: initialTasks,
          dayPlan: initialDayPlan,
          notes: initialNotes,
          quizzes: initialQuizzes,
          projects: initialProjects,
          folders: initialFolders,
          codeProjects: initialCodeProjects,
          focusSessions: initialFocusSessions,
          savedApps: initialSavedApps,
          ideas: initialIdeas,
          settings: initialSettings,
        };
        await this.saveAllData(initialPayload);
        return initialPayload;
      }

      return {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        tasks,
        dayPlan: dayPlans[0] || initialDayPlan,
        notes,
        quizzes,
        projects,
        folders,
        codeProjects,
        focusSessions,
        savedApps: savedApps.length > 0 ? savedApps : initialSavedApps,
        ideas,
        settings: settingsArr[0] || initialSettings,
      };
    } catch {
      // LocalStorage fallback if IndexedDB throws
      const raw = localStorage.getItem('MY_WORK_LOCAL_BACKUP');
      if (raw) {
        try {
          return JSON.parse(raw);
        } catch {
          // ignore corrupted JSON
        }
      }
      return {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        tasks: initialTasks,
        dayPlan: initialDayPlan,
        notes: initialNotes,
        quizzes: initialQuizzes,
        projects: initialProjects,
        folders: initialFolders,
        codeProjects: initialCodeProjects,
        focusSessions: initialFocusSessions,
        savedApps: initialSavedApps,
        ideas: initialIdeas,
        settings: initialSettings,
      };
    }
  }

  public async saveAllData(data: FullBackupPayload): Promise<void> {
    try {
      const db = await this.getDB();
      const saveStore = (storeName: string, items: unknown[]): Promise<void> => {
        return new Promise((resolve, reject) => {
          const tx = db.transaction(storeName, 'readwrite');
          const store = tx.objectStore(storeName);
          store.clear();
          items.forEach(item => store.put(item));
          tx.oncomplete = () => resolve();
          tx.onerror = () => reject(tx.error);
        });
      };

      await Promise.all([
        saveStore('tasks', data.tasks),
        saveStore('dayPlan', [{ ...data.dayPlan, id: 'current' }]),
        saveStore('notes', data.notes),
        saveStore('quizzes', data.quizzes),
        saveStore('projects', data.projects),
        saveStore('folders', data.folders),
        saveStore('codeProjects', data.codeProjects),
        saveStore('focusSessions', data.focusSessions),
        saveStore('savedApps', data.savedApps),
        saveStore('ideas', data.ideas),
        saveStore('settings', [{ ...data.settings, id: 'user_settings' }]),
      ]);
    } catch {
      // Fallback
      localStorage.setItem('MY_WORK_LOCAL_BACKUP', JSON.stringify(data));
    }

    // Always mirror lightweight settings in localStorage for instant theme/prefs load
    localStorage.setItem('MY_WORK_PREFS', JSON.stringify(data.settings));
  }

  public async getStorageEstimate(): Promise<{ usage: number; quota: number; percent: number }> {
    if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.estimate) {
      try {
        const est = await navigator.storage.estimate();
        const usage = est.usage || 0;
        const quota = est.quota || 1;
        return {
          usage,
          quota,
          percent: Math.min(100, Math.round((usage / quota) * 100)),
        };
      } catch {
        // ignore
      }
    }
    return { usage: 1024 * 1024 * 2.5, quota: 1024 * 1024 * 500, percent: 1 };
  }

  public async exportBackup(data: FullBackupPayload, password?: string): Promise<string> {
    const rawJson = JSON.stringify(data, null, 2);
    if (!password) {
      return rawJson;
    }
    // AES-GCM password-based encryption using Web Crypto API
    const enc = new TextEncoder();
    const pwKey = await window.crypto.subtle.importKey(
      'raw',
      enc.encode(password),
      'PBKDF2',
      false,
      ['deriveKey']
    );
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const aesKey = await window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt,
        iterations: 100000,
        hash: 'SHA-256',
      },
      pwKey,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt']
    );
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      aesKey,
      enc.encode(rawJson)
    );

    const packed = {
      isEncrypted: true,
      salt: Array.from(salt),
      iv: Array.from(iv),
      cipherText: Array.from(new Uint8Array(encrypted)),
    };
    return JSON.stringify(packed);
  }

  public async importBackup(content: string, password?: string): Promise<FullBackupPayload> {
    const parsed = JSON.parse(content);
    if (parsed.isEncrypted) {
      if (!password) {
        throw new Error('This backup is encrypted. Please provide the decryption password.');
      }
      const enc = new TextEncoder();
      const pwKey = await window.crypto.subtle.importKey(
        'raw',
        enc.encode(password),
        'PBKDF2',
        false,
        ['deriveKey']
      );
      const salt = new Uint8Array(parsed.salt);
      const iv = new Uint8Array(parsed.iv);
      const cipherText = new Uint8Array(parsed.cipherText);

      const aesKey = await window.crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt,
          iterations: 100000,
          hash: 'SHA-256',
        },
        pwKey,
        { name: 'AES-GCM', length: 256 },
        false,
        ['decrypt']
      );

      const decrypted = await window.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        aesKey,
        cipherText
      );
      const dec = new TextDecoder();
      return JSON.parse(dec.decode(decrypted));
    }

    if (!parsed.tasks || !parsed.notes) {
      throw new Error('Invalid backup file format: missing core OS structures.');
    }
    return parsed as FullBackupPayload;
  }
}

export const storageManager = new StorageManager();
