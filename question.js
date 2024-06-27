
const sellPrices = [15, 25, 35, 45, 55, 65, 75, 85, 95, 10];

const buyPrices = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

function createEquations() {
    for (let i = 0; i < buyPrices.length; i++) {
        const buyPrice = buyPrices[i];
        const sellPrice = sellPrices[i];
        const equation = `Buy Price: $${buyPrice}, Sell Price: $${sellPrice}`;
        const evaluated = sellPrice > buyPrice ? 'true' : 'false';
        const equationObject = { value: equation, evaluated: evaluated };
        equationsArray.push(equationObject);
    }
    shuffle(equationsArray);
}

// Shuffle function to randomize the equations array
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;
  
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

// Add Equations to DOM
function equationsToDOM() {
    equationsArray.forEach((equation) => {
        const item = document.createElement('div');
        item.classList.add('item');
        const equationText = document.createElement('h1');
        equationText.textContent = equation.value;
        item.appendChild(equationText);
        itemContainer.appendChild(item);
    });
}

// Dynamically adding correct/incorrect equations
function populateGamePage() {
    itemContainer.textContent = '';
    const topSpacer = document.createElement('div');
    topSpacer.classList.add('height-240');
    const selectedItem = document.createElement('div');
    selectedItem.classList.add('selected-item');
    itemContainer.append(topSpacer, selectedItem);
    createEquations();
    equationsToDOM();
    const bottomSpacer = document.createElement('div');
    bottomSpacer.classList.add('height-500');
    itemContainer.appendChild(bottomSpacer);
}
