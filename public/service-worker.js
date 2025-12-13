const CACHE_NAME = 'todo-pro-v1';

self.addEventListener('install', (event) => {
  console.log('Service Worker: Installed');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activated');
});

self.addEventListener('fetch', (event) => {
  // Let requests pass through for now
});