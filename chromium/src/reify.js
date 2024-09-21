const memoizedResults = new Map();
const MAX_DEPTH = 3;

/**
 * @typedef {Object} MiLinksConfig
 * @property {'group'} type - The type of the configuration, always 'group'.
 * @property {string} name - The name of the group.
 * @property {LinkOrGroup[]} items - An array of links or groups.
 */

/**
 * @typedef {Link | LinkGroup | LinkGroupRef} LinkOrGroup
 */

/**
 * @typedef {Object} Link
 * @property {string} id - The unique identifier for the link.
 * @property {'link'} type - The type of the item, always 'link'.
 * @property {string} url - The URL of the link.
 * @property {string} title - The title of the link.
 * @property {string} [description] - An optional description of the link.
 */

/**
 * @typedef {Object} LinkGroup
 * @property {string} id - The unique identifier for the group.
 * @property {'group'} type - The type of the item, always 'group'.
 * @property {string} name - The name of the group.
 * @property {LinkOrGroup[]} items - An array of links or groups.
 */

/**
 * @typedef {Object} LinkGroupRef
 * @property {string} id - The unique identifier for the group reference.
 * @property {'groupRef'} type - The type of the item, always 'groupRef'.
 * @property {string} url - The URL of the referenced group.
 * @property {string} [alias] - An optional alias for the referenced group.
 */


/**
 * Reify link group references up to a given depth.
 * 
 * @param {LinkGroup} linkGroup - The link group to reify.
 * @param {number} depth - The current depth of the recursion.
 * @returns {Promise<LinkGroup>}
 */
async function reifyLinkGroupReferences(linkGroup, depth = 0) {
    const resolvedData = {
        type: 'group',
        items: [],
    };

    if (depth > MAX_DEPTH) {
        console.warn(`Max depth reached for URL: ${url}`);
        return resolvedData
    }

    if (memoizedResults.has(url)) {
        return memoizedResults.get(url);
    }

    try {
        for (const item of linkGroup.items || []) {
            switch (item.type) {
                case 'link':
                    resolvedData.items.push(item);
                    break;
                case 'group':
                    // don't increase depth for groups that don't need to be reified
                    const group = await reifyLinkGroupReferences(item, depth);
                    resolvedData.items.push(group);
                    break;
                case 'groupRef':
                    const response = await fetch(item.url);

                    /**
                     * @type {LinkGroup}
                     */
                    const data = await response.json();
                    const resolvedGroup = await reifyLinkGroupReferences(data, depth + 1);
                    resolvedData.items.push(resolvedGroup);
                    break;
            }
        }
        memoizedResults.set(url, resolvedData);
    } catch (error) {
        console.error(`Error fetching or parsing data from ${url}:`, error);
    }

    return resolvedData;
}
