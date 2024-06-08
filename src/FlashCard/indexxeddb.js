// db.js
import Dexie from 'dexie';

export const db = new Dexie('myDatabase');

//baslangic
db.version(11).stores({
  times: '++id, validtime' // Primary key and indexed props
});
