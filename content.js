function sortByDiscount(direction = 'desc') {
    const products = document.querySelector('#artikli_lista').children;
    const productsArray = Array.from(products);
    productsArray.sort((a, b) => {
        let discountA = a.querySelector('.artikli_flekica_tekst').textContent;
        let discountB = b.querySelector('.artikli_flekica_tekst').textContent;

        discountA = discountA.replace(/%/g, '').replace(/-/g, '');
        discountB = discountB.replace(/%/g, '').replace(/-/g, '');

        return direction === 'desc' ? discountB - discountA : discountA - discountB;
    });
    const productsContainer = document.querySelector('#artikli_lista');
    productsContainer.innerHTML = '';
    productsArray.forEach(product => {
        productsContainer.appendChild(product);
    });
}

function addGlobalEventListeners() {
    chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
        const { direction } = msg;
        if (direction === 'desc') {
            sortByDiscount('desc');
        }
        if (direction === 'asc') {
            sortByDiscount('asc');
        }
    });
}

addGlobalEventListeners();
sortByDiscount('desc');
