let data = undefined;

document.addEventListener('DOMContentLoaded', () => {
  readFromStorage()
    .then(data => {
      if (data) {
        const rootElement = visualizeLinkGroup(data);
        document.body.appendChild(rootElement);
      } else {
        console.log('No data found in storage, trying to fetch test data');
        fetch('testdata.json')
          .then(response => response.json())
          .then(data => {
            const rootElement = visualizeLinkGroup(data);
            document.body.appendChild(rootElement);
            writeToStorage(data);
          })
          .catch(error => {
            console.error('Error fetching test data:', error);
          });
      }
    })
    .catch(error => {
      console.error('Error reading from storage:', error);
    });
});

/**
 * Visualizes a LinkGroup as DOM elements.
 * @param {LinkGroup} linkGroup - The LinkGroup to visualize.
 * @returns {HTMLElement} - The root DOM element representing the LinkGroup.
 */
function visualizeLinkGroup(linkGroup) {
  const rootElement = document.createElement('div');
  rootElement.className = 'link-group';

  const groupName = document.createElement('p');
  groupName.textContent = linkGroup.name;
  rootElement.appendChild(groupName);

  const list = document.createElement('ul');
  rootElement.appendChild(list);

  linkGroup.items.forEach(item => {
    const listItem = document.createElement('li');

    switch (item.type) {
      case 'link':
        const anchor = document.createElement('a');
        anchor.href = item.url;
        anchor.textContent = item.title;
        anchor.target = '_blank';
        listItem.appendChild(anchor);

        if (item.description) {
          const description = document.createElement('p');
          description.textContent = item.description;
          listItem.appendChild(description);
        }
        break;

      case 'group':
        const nestedGroup = visualizeLinkGroup(item);
        listItem.appendChild(nestedGroup);
        break;

      default:
        console.warn(`Unknown item type: ${item.type}`);
    }

    list.appendChild(listItem);
  });

  return rootElement;
}


// Read JSON data from Chrome extension's storage
function readFromStorage() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get('jsonData', (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(result.jsonData || null);
      }
    });
  });
}

// Write JSON data to Chrome extension's storage
function writeToStorage(data) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({ jsonData: data }, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve();
      }
    });
  });
}

// Function to delete JSON data from Chrome extension's storage
function deleteFromStorage() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.remove('jsonData', () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        console.log('JSON data deleted from storage');
        resolve();
      }
    });
  });
}
