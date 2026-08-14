// Mock implementation for Web to prevent expo-sqlite bundling errors
// Since this is a Mobile-first offline app, Web falls back to empty arrays
export const db = {
  execAsync: async () => {},
  runAsync: async () => {},
  getAllAsync: async () => [],
  getFirstAsync: async () => null,
} as any;

export async function initializeDatabase() {
  console.log('SQLite mock database initialized for Web');
}
