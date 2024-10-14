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
    // Get all elements with class "lot-grid-column" on gallery pages
    var auctionListings = document.querySelectorAll('.lot-grid-column');

    // Loop through each listing
    auctionListings.forEach(function(listing) {
        // Retrieve data from the listing
        var listingTitle = listing.querySelector('.lot-grid-header').innerText;
        var listingPrice = parseFloat(listing.querySelector('.current-bid-value').getAttribute('data-current-bid'));
        var maxBid = parseFloat(listing.querySelector('.your-maximum-bid-value').getAttribute('data-your-maximum-bid'));
        var lotNumber = listing.querySelector('.lot-number').innerText;

        // Check if current bid exists and it's not NaN or 0
        if (!isNaN(listingPrice) && listingPrice !== 0) {
            // Calculate adjusted prices
            var listingPriceWillPay = calculateAdjustedPrice(listingPrice);
            
            // Create a new element for displaying adjusted prices
            var adjustedPriceElement = document.createElement('div');
            adjustedPriceElement.classList.add('item', 'current-bid-will-pay');
            adjustedPriceElement.innerHTML = `
                <div class="content flexable">
                    <div class="meta current-bid-label list-item-info-header">After Fees</div>
                    <div class="description description-en-gb">
                        <span class="current-bid-value">${listingPriceWillPay.toFixed(2)}</span>
                        <span class="current-bid-currency">GBP</span>
                    </div>
                </div>
            `;

            // Insert the adjusted price element after the current bid section
            listing.querySelector('.item.current-bid').insertAdjacentElement('afterend', adjustedPriceElement);
        }

        
        // Check if max bid exists and it's not NaN or 0
        if (!isNaN(maxBid) && maxBid !== 0) {
            // Calculate adjusted prices
            var maxBidWillPay = calculateAdjustedPrice(maxBid);
            
            // Create a new element for displaying adjusted prices
            var adjustedPriceElement = document.createElement('div');
            adjustedPriceElement.classList.add('item', 'max-bid-will-pay');
            adjustedPriceElement.innerHTML = `
                <div class="content flexable">
                    <div class="meta current-bid-label list-item-info-header">After Fees</div>
                    <div class="description description-en-gb">
                        <span class="current-bid-value">${maxBidWillPay.toFixed(2)}</span>
                        <span class="current-bid-currency">GBP</span>
                    </div>
                </div>
            `;

            // Insert the adjusted price element after the current bid section
            listing.querySelector('.item.your-maximum-bid').insertAdjacentElement('afterend', adjustedPriceElement);
        }

    });

        // Get all elements with class "lot-details" on singular pages
        var auctionListings = document.querySelectorAll('.lot-details ');

        // Loop through each listing
        auctionListings.forEach(function(listing) {
            // Retrieve data from the listing
            var listingPrice = parseFloat(listing.querySelector('.current-bid-value').getAttribute('data-current-bid'));
            var maxBid = parseFloat(listing.querySelector('.user-maximum-bid-value').innerText);
    
            // Check if current bid exists and it's not NaN or 0
            if (!isNaN(listingPrice) && listingPrice !== 0) {
                // Calculate adjusted prices
                var listingPriceWillPay = calculateAdjustedPrice(listingPrice);
                
                // Create a new element for displaying adjusted prices
                var adjustedPriceElement = document.createElement('div');
                adjustedPriceElement.classList.add('inline', 'current-bid-will-pay');
                adjustedPriceElement.innerHTML = `
                <div class="inline fields current-bid">
                <div class="seven wide field">
                    <label current-bid-content="Current bid after fees" closing-bid-content="Closing bid after fees" class="current-bid-label"></label>
                </div>
                <div class="seven wide field">
                    <span class="current-bid-value" data-current-bid="76.00">${listingPriceWillPay.toFixed(2)}</span>
                    <span class="current-bid-currency">GBP</span>
                </div>
                `;
    
                // Insert the adjusted price element after the current bid section
                listing.querySelector('.inline.fields.current-bid').insertAdjacentElement('afterend', adjustedPriceElement);
            }
    
            
            // Check if max bid exists and it's not NaN or 0
            if (!isNaN(maxBid) && maxBid !== 0) {
                // Calculate adjusted prices
                var maxBidWillPay = calculateAdjustedPrice(maxBid);
                
                // Create a new element for displaying adjusted prices
                var adjustedPriceElement = document.createElement('div');
                adjustedPriceElement.classList.add('inline', 'max-bid-will-pay');
                adjustedPriceElement.innerHTML = `
                <div class="inline fields user-maximum-bid">
                <div class="seven wide field">
                <label>Your maximum bid after fees</label>
                </div>
                <div class="nine wide field">
                    <span class="user-maximum-bid-value" data-current-bid="76.00">${maxBidWillPay.toFixed(2)}</span>
                    <span class="user-maximum-bid-currency">GBP</span>
                </div>
                `;
    
                // Insert the adjusted price element after the current bid section
                listing.querySelector('.fields.user-maximum-bid').insertAdjacentElement('afterend', adjustedPriceElement);
            }
    
        });
}

// Function to handle input events on the maximumBid input field
function handleMaximumBidInput() {
    // Get the input field for maximum bid
    var bidInput = document.getElementById('bid-panel-form');
    
    if (bidInput) {  
        var maximumBidInput = document.getElementById('maximumBid');

      // Add event listener for input event
    maximumBidInput.addEventListener('input', function() {
        // Get the value entered in the input field
        var bidValue = parseFloat(maximumBidInput.value);
        
        // Check if the entered value is a valid number
        if (!isNaN(bidValue) && bidValue !== 0) {
            // Calculate adjusted price
            var adjustedPrice = calculateAdjustedPrice(bidValue);
            
            // Check if the adjusted price display already exists
            var adjustedPriceDisplay = document.getElementById('adjustedPriceDisplay');
            if (!adjustedPriceDisplay) {
                // Create a new div to display the adjusted price
                adjustedPriceDisplay = document.createElement('div');
                adjustedPriceDisplay.id = 'adjustedPriceDisplay';
                adjustedPriceDisplay.classList.add('field'); // Add field class to match the existing structure
                var bidForm = document.getElementById('bid-panel-form');
                if (bidForm) {
                    // Insert the adjusted price display after the bid form
                    bidForm.insertAdjacentElement('afterend', adjustedPriceDisplay);
                }
            }
            
            // Update the content of the adjusted price display div
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
        } else {
            // If the entered value is not a valid number or is 0, remove the adjusted price display
            var adjustedPriceDisplay = document.getElementById('adjustedPriceDisplay');
            if (adjustedPriceDisplay) {
                adjustedPriceDisplay.parentNode.removeChild(adjustedPriceDisplay);
            }
        }
    });
};

}

// Call the function to handle input events on maximumBid input field
handleMaximumBidInput();


// Call the function when the page loads
window.addEventListener('load', processAuctionListings);
