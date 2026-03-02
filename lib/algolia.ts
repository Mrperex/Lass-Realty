import algoliasearch from 'algoliasearch';

const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
const searchKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY;
const writeKey = process.env.ALGOLIA_WRITE_KEY;

export const searchClient = appId && searchKey ? algoliasearch(appId, searchKey) : null;

export const indexProperty = async (property: any) => {
    if (!appId || !writeKey) {
        console.warn('⚠️ Algolia credentials missing. Skipping indexing.');
        return;
    }
    const writeClient = algoliasearch(appId, writeKey);
    const index = writeClient.initIndex('properties');

    try {
        await index.saveObject({
            objectID: property._id.toString(),
            ...property
        });
    } catch (error) {
        console.error('❌ Failed to index property in Algolia', error);
    }
};
