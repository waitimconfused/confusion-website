class Database {
	db;

    async create(databaseName) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(databaseName, 1);

            request.onupgradeneeded = (event) => {
                this.db = event.target.result;
                console.log(`Database ${databaseName} created`);
                resolve(this.db);
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                console.log(`Database ${databaseName} opened`);
                resolve(this.db);
            };

            request.onerror = (event) => {
                console.error(`Database error: ${event.target.errorCode}`);
                reject(event.target.errorCode);
            };
        });
    }

    async remove() {
        return new Promise((resolve, reject) => {
            const dbName = this.db.name;
            this.db.close();
            const request = indexedDB.deleteDatabase(dbName);

            request.onsuccess = () => {
                console.log(`Database ${dbName} removed`);
                resolve();
            };

            request.onerror = (event) => {
                console.error(`Database error: ${event.target.errorCode}`);
                reject(event.target.errorCode);
            };
        });
    }

    async createTable(tableName, keyPath = 'id', autoIncrement = true) {
        return new Promise((resolve, reject) => {
            const version = this.db.version + 1;
            this.db.close();
            const request = indexedDB.open(this.db.name, version);

            request.onupgradeneeded = (event) => {
                this.db = event.target.result;
                if (!this.db.objectStoreNames.contains(tableName)) {
                    this.db.createObjectStore(tableName, { keyPath, autoIncrement });
                }
                console.log(`Table ${tableName} created`);
                resolve(this.db);
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                console.log(`Database ${this.db.name} upgraded`);
                resolve(this.db);
            };

            request.onerror = (event) => {
                console.error(`Database error: ${event.target.errorCode}`);
                reject(event.target.errorCode);
            };
        });
    }

    async removeTable(tableName) {
        return new Promise((resolve, reject) => {
            const version = this.db.version + 1;
            this.db.close();
            const request = indexedDB.open(this.db.name, version);

            request.onupgradeneeded = (event) => {
                this.db = event.target.result;
                if (this.db.objectStoreNames.contains(tableName)) {
                    this.db.deleteObjectStore(tableName);
                }
                console.log(`Table ${tableName} removed`);
                resolve(this.db);
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                console.log(`Database ${this.db.name} upgraded`);
                resolve(this.db);
            };

            request.onerror = (event) => {
                console.error(`Database error: ${event.target.errorCode}`);
                reject(event.target.errorCode);
            };
        });
    }

    async createIndex(tableName, indexName, keyPath) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([tableName], 'versionchange');
            const store = transaction.objectStore(tableName);

            store.createIndex(indexName, keyPath, { unique: true });

            transaction.oncomplete = () => {
                console.log(`Index ${indexName} created in table ${tableName}`);
                resolve();
            };

            transaction.onerror = (event) => {
                console.error(`Transaction error: ${event.target.errorCode}`);
                reject(event.target.errorCode);
            };
        });
    }

    async removeIndex(tableName, indexName) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([tableName], 'versionchange');
            const store = transaction.objectStore(tableName);

            store.deleteIndex(indexName);

            transaction.oncomplete = () => {
                console.log(`Index ${indexName} removed from table ${tableName}`);
                resolve();
            };

            transaction.onerror = (event) => {
                console.error(`Transaction error: ${event.target.errorCode}`);
                reject(event.target.errorCode);
            };
        });
    }

    async addToTable(tableName, dataToStore) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([tableName], 'readwrite');
            const store = transaction.objectStore(tableName);

            const request = store.add(dataToStore);

            request.onsuccess = () => {
                console.log(`Data added to table ${tableName}`);
                resolve();
            };

            request.onerror = (event) => {
                console.error(`Request error: ${event.target.errorCode}`);
                reject(event.target.errorCode);
            };
        });
    }

    async removeFromTable(tableName, key) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([tableName], 'readwrite');
            const store = transaction.objectStore(tableName);

            const request = store.delete(key);

            request.onsuccess = () => {
                console.log(`Data removed from table ${tableName}`);
                resolve();
            };

            request.onerror = (event) => {
                console.error(`Request error: ${event.target.errorCode}`);
                reject(event.target.errorCode);
            };
        });
    }

    async getFromTable(tableName, key) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([tableName], 'readonly');
            const store = transaction.objectStore(tableName);
            const request = store.get(key);

            request.onsuccess = (event) => {
                if (request.result) {
                    console.log(`Data retrieved from table ${tableName}`);
                    resolve(request.result);
                } else {
                    console.log(`No data found for key ${key} in table ${tableName}`);
                    resolve(null);
                }
            };

            request.onerror = (event) => {
                console.error(`Request error: ${event.target.errorCode}`);
                reject(event.target.errorCode);
            };
        });
    }
}


async function listAndDeleteDatabases() {
    const databases = await indexedDB.databases();
    for (const db of databases) {
        console.log(`Deleting database: ${db.name}`);
        await indexedDB.deleteDatabase(db.name);
    }
    console.log("All databases deleted");
}

listAndDeleteDatabases();


const projects = new Database;
await projects.create("projects");

await projects.createTable("projectStore");
await projects.createIndex("projectStore", "projectName", "projectName");

await projects.addToTable("projectStore", {
	projectName: "myFirstProject",
	customData: { aaa: "AAA", bbb: "BBB" }
});

const data = await projects.getFromTable("projectStore", "myFirstProject");
console.log(data);
// Returns: {
//     projectName: "myFirstProject",
//     customData: { aaa: "AAA", bbb: "BBB" }
// }