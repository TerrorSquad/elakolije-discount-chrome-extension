// TODO: Extract utils to a separate file and import it here
const utils = {
    getClonedDOMChildren: function (htmlString) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');
        let options = doc.body.children;
        options = Array.from(options);
        return options;
    },

    createSelectAndAppendChildren: function (children) {
        const newSelect = document.createElement('select');
        for (const element of children) {
            newSelect.appendChild(element);
        }
        return newSelect;
    },

    appendOptionToSelect: function (select, value, text) {
        const optionElement = document.createElement('option');
        optionElement.value = value;
        optionElement.textContent = text;
        select.appendChild(optionElement);
    }
}

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

function replaceSelect() {
    let originalSelect = document.querySelector('#artikli_desktop_sortiraj select');
    let options = utils.getClonedDOMChildren(originalSelect.innerHTML);
    const newSelect = utils.createSelectAndAppendChildren(options);

    utils.appendOptionToSelect(newSelect, 'discount', 'POPUSTU');

    // replace the original select element with the new select element
    originalSelect.parentNode.insertBefore(newSelect, originalSelect);
    originalSelect.parentNode.removeChild(originalSelect);

    newSelect.addEventListener('change', (e) => {
        if (e.target.value === 'discount') {
            sortByDiscount();
        } else {
            // redirect to the url of the selected option (original behaviour)
            location.href = e.target.value;
        }
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

replaceSelect();
addGlobalEventListeners();
sortByDiscount('desc');
