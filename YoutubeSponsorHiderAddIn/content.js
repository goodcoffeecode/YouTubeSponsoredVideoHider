console.log('Video Hiding Content script loaded.');

// Function to process new target elements
function processNewElements(elements) {
    console.log('Number of new target divs found:', elements.length);

    elements.forEach(div => {

        let parent = div.closest('ytd-rich-item-renderer');
        if (parent && !parent.hasAttribute('data-opacity-set')) {
            parent.style.opacity = '0.1';
            parent.setAttribute('data-opacity-set', 'true');

            // Find the first parent yt-formatted-string element with id="video-title"
            let videoTitleElement = parent.querySelector('yt-formatted-string#video-title');
            if (videoTitleElement) {
                // Log the title attribute
                let titleAttribute = videoTitleElement.getAttribute('title');
                console.log('I hid vid:', titleAttribute);
            }
        }
    });
}

// Process existing elements once
function processExistingElements() {
    const existingDivs = document.querySelectorAll('div[aria-label="Sponsored"]:not([data-opacity-set="true"])');
    processNewElements(existingDivs);
}

processExistingElements();

// Create a MutationObserver to monitor changes in the DOM
const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1) { // Ensure it's an element node
                const newDivs = node.querySelectorAll && node.querySelectorAll('div[aria-label="Sponsored"]:not([data-opacity-set="true"])');
                if (newDivs && newDivs.length > 0) {
                    processNewElements(newDivs);
                }
            }
        });
    });
});

// Configure the observer to watch for child elements being added
observer.observe(document.body, { childList: true, subtree: true });

console.log('Video Hiding Content set up complete.');