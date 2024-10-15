console.log("Woooooooo i am the ghost of David Dickinson coming to haunt you with nightmares of fake tan... Cheap as Chips");

// Function to calculate adjusted price with VAT and fees (20%)
function calculateAdjustedPrice(currentBid) {
    // Calculate VAT on Hammer Price (20%)
    var vatOnHammer = currentBid * 0.20;

    // Calculate Buyer's Premium (15%)
    var buyersPremium = currentBid * 0.15;

    // Calculate VAT on Buyer's Premium (20%)
    var vatOnPremium = buyersPremium * 0.20;

    // Calculate Total
    var total = currentBid + vatOnHammer + buyersPremium + vatOnPremium;

    return total;

}

function processAuctionListings() {
    // Function to update prices for a single listing
    function updateListing(listing) {
        // Retrieve data from the listing
        var listingPrice = parseFloat(listing.querySelector('.current-bid-value').getAttribute('data-current-bid'));
        var maxBid = parseFloat(listing.querySelector('.your-maximum-bid-value')?.getAttribute('data-your-maximum-bid') || listing.querySelector('.user-maximum-bid-value')?.innerText);

        // Update current bid
        if (!isNaN(listingPrice) && listingPrice !== 0) {
            var listingPriceWillPay = calculateAdjustedPrice(listingPrice);
            updateOrCreateAdjustedPriceElement(listing, '.inline.fields.current-bid, .item.current-bid', 'current-bid-will-pay', 'After Fees', listingPriceWillPay);
        }

        // Update max bid
        if (!isNaN(maxBid) && maxBid !== 0) {
            var maxBidWillPay = calculateAdjustedPrice(maxBid);
            updateOrCreateAdjustedPriceElement(listing, '.inline.fields.user-maximum-bid, .item.your-maximum-bid', 'max-bid-will-pay', 'After Fees', maxBidWillPay);
        }
    }

    // Helper function to update or create adjusted price element
    function updateOrCreateAdjustedPriceElement(listing, selector, className, label, price) {
        var existingElement = listing.querySelector(`.${className}`);
        if (existingElement) {
            existingElement.querySelector('.current-bid-value').textContent = price.toFixed(2);
        } else {
            var targetElement = listing.querySelector(selector);
            if (targetElement) {
                var adjustedPriceElement = document.createElement('div');
                adjustedPriceElement.classList.add('inline', 'fields', className);
                
                if (targetElement.classList.contains('inline')) {
                    // For singular item page
                    adjustedPriceElement.innerHTML = `
                        <div class="seven wide field">
                            <label>${label}</label>
                        </div>
                        <div class="nine wide field">
                            <span class="current-bid-value">${price.toFixed(2)}</span>
                            <span class="current-bid-currency">GBP</span>
                        </div>
                    `;
                } else {
                    // For gallery page
                    adjustedPriceElement.innerHTML = `
                        <div class="content flexable">
                            <div class="meta current-bid-label list-item-info-header">${label}</div>
                            <div class="description description-en-gb">
                                <span class="current-bid-value">${price.toFixed(2)}</span>
                                <span class="current-bid-currency">GBP</span>
                            </div>
                        </div>
                    `;
                }
                targetElement.insertAdjacentElement('afterend', adjustedPriceElement);
            } else {
                console.log(`Target element not found for selector: ${selector}`);
            }
        }
    }

    // Function to handle mutations
    function handleMutations(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' || mutation.type === 'subtree') {
                const listing = mutation.target.closest('.lot-grid-column, .lot-details');
                if (listing) {
                    updateListing(listing);
                }
            }
        });
    }

    // Create a MutationObserver
    const observer = new MutationObserver(handleMutations);

    // Configuration for the observer
    const config = { childList: true, subtree: true, characterData: true };

    // Start observing the document body
    observer.observe(document.body, config);

    // Initial processing of existing listings
    function initialProcess() {
        const listings = document.querySelectorAll('.lot-grid-column, .lot-details');
        if (listings.length > 0) {
            listings.forEach(updateListing);
        } else {
            // If listings are not found, try again after a short delay
            setTimeout(initialProcess, 500);
        }
    }

    initialProcess();
}

function handleMaximumBidInput() {
    function updateAdjustedPrice(input) {
        var bidValue = parseFloat(input.value);
        var adjustedPriceDisplay = document.getElementById('adjustedPriceDisplay');
        
        if (!isNaN(bidValue) && bidValue !== 0) {
            var adjustedPrice = calculateAdjustedPrice(bidValue);
            
            if (!adjustedPriceDisplay) {
                adjustedPriceDisplay = document.createElement('div');
                adjustedPriceDisplay.id = 'adjustedPriceDisplay';
                adjustedPriceDisplay.classList.add('field');
                var bidForm = document.getElementById('bid-panel-form');
                if (bidForm) {
                    bidForm.insertAdjacentElement('afterend', adjustedPriceDisplay);
                }
            }
            
            adjustedPriceDisplay.innerHTML = `
            <div class="ui form timedbid-panel-form">
                <div class="inline fields">
                    <div class="ten wide field">
                        <div class="ui right labeled input">
                            <p>This bid will actually cost you ${adjustedPrice.toFixed(2)} GBP</p>
                        </div>
                    </div>
                </div>
            </div>
            `;
        } else if (adjustedPriceDisplay) {
            adjustedPriceDisplay.parentNode.removeChild(adjustedPriceDisplay);
        }
    }

    function handleMutations(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'value') {
                updateAdjustedPrice(mutation.target);
            }
        });
    }

    const observer = new MutationObserver(handleMutations);
    const config = { attributes: true, attributeFilter: ['value'] };

    function initMaximumBidInput() {
        const maximumBidInput = document.getElementById('maximumBid');
        if (maximumBidInput) {
            observer.observe(maximumBidInput, config);
            maximumBidInput.addEventListener('input', function() {
                updateAdjustedPrice(this);
            });
            // Initial update
            updateAdjustedPrice(maximumBidInput);
        } else {
            // If the input is not found, try again after a short delay
            setTimeout(initMaximumBidInput, 500);
        }
    }

    initMaximumBidInput();
}

// Call the functions when the page loads
window.addEventListener('load', function() {
    processAuctionListings();
    handleMaximumBidInput();
});
