export const DBConfig = {
    name: "MyDB",
    version: 1,
    objectStoresMeta: [
      {
        store: "Words",
        storeConfig: { keyPath: "id", autoIncrement: true },
        storeSchema: [
          { name: "word", keypath: "word", options: { unique: false } },
          { name: "meaning", keypath: "meaning", options: { unique: false } },
        ],
      },
    ],
  };