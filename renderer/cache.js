const os = require('os');
const path = require('path');
const NodeCache = require( "node-cache");
const diskCache = require('cacache');
const fs = require('fs');

const cache =  {
    diskCachePath: path.resolve(os.tmpdir(), '6thstreet'),
    memoryCache: null,
    accessRecord: [],
    init: async (diskCachePath) => {
        if(diskCachePath){
            cache.diskCachePath = diskCachePath;
        }
        cache.memoryCache = new NodeCache();
        cache.memoryCache.on("del", ( key, value ) => {
            diskCache.put(cache.diskCachePath, key, value);
        });
        return cache.flush();
    },
    get: async (key) => {
        let html = cache.memoryCache.get(key);
        if(!html && await diskCache.get.info(cache.diskCachePath, key)){
            html = (await diskCache.get(cache.diskCachePath, key)).data
            cache.set(key, html);
        }

        const keyIndexInCacheAccessRecord = cache.accessRecord.indexOf(key);
        if(keyIndexInCacheAccessRecord >= 0){
            cache.accessRecord.splice(keyIndexInCacheAccessRecord, 1);
        }
        cache.accessRecord.push(key);
        return {
            html,
            ttRenderMs: 0
        };
    },
    set: async (key, value) => {
        if(cache.memoryCache.getStats().vsize >= 50000000){
            cache.del(cache.accessRecord[0])
            .then(() => {
                cache.accessRecord.shift();
                return cache.memoryCache.set(key, value);
            })
            .catch((err) => {
                console.error(`${err}, resetting the entire disk and memory cache`);
                cache.accessRecord = [];
                cache.flush();
            })
        }
        else{
            cache.memoryCache.set(key, value);
        }
    },
    del: async (key) => {
        return diskCache.get.info(cache.diskCachePath, key).finally((info) => {
            return new Promise((resolve, reject) => {
                if(info){
                    // Delete from disk cache as well
                    fs.unlink(info.path, (err) => {
                        err
                        ?
                        console.error(`Unable to delete item with key: ${key} from disk cache, ${err}`)
                        :
                        diskCache.rm.entry(cache.diskCachePath, key);
                    })
                }
                const del = cache.memoryCache.del(key);
                if(del){
                    resolve();
                }
                else{
                    reject(`Unable to delete item with key${key} from memory cache`);
                }
                
            })
        })
    },
    flush: async () => {
        console.log("Cleaning up disk cache")
        return diskCache.rm.all(cache.diskCachePath)
        .then(() => {
            console.log("Disk cache cleared")
        })
        .catch((err) => {
            console.error(`Unable to clear disk cache: ${err}`)
        })
        .finally(() => {
            if(cache.memoryCache){
                console.log("Cleaning up memory cache");
                cache.memoryCache.flushAll();
                cache.memoryCache.flushStats();
                console.log("Memory cache cleared")
            }
            else{
                console.log("No memory cache exists")
            }
        }); 
    },
    close: () => {
        return cache.memoryCache.close();
    }
}

module.exports = cache;