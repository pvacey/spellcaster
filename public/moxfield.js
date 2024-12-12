const moxfieldInput = document.getElementById('moxfieldInput');
const imageSize = document.getElementById('imageSize');
const inbox = document.getElementById('inbox');
const deck = document.getElementById('deck');
const cardTypes = {
    0: 'Commander',
    1: 'Battle',
    2: 'Planeswalker',
    3: 'Creature',
    4: 'Sorcery',
    5: 'Instant',
    6: 'Artifact',
    7: 'Enchantment',
    8: 'Land'
}

/**
 * Initial Page Load
 */

async function checkLogin() {
    const response = await fetch(`${window.location}auth-status`);
    if (response.status === 401) {
        window.location = window.location + 'login'
    } 
}

document.addEventListener('DOMContentLoaded', () => {
    // make sure the user is logged in
	checkLogin();
    // load their last deck
    const deckID = localStorage.getItem('deckID');
    if (deckID) {
        loadDeck(deckID)
    }
});

/**
 * Card Resizing
 */

function sizeDown() {
    imageSize.value++
    resizeImages()
}

function sizeUp() {
    imageSize.value--
    resizeImages()
}

function resizeImages(event) {
    slider = imageSize;
    var width = Math.floor((deck.getBoundingClientRect().width)/slider.value)-1;
    document.documentElement.style.setProperty('--image-width', `${width}px`);
    document.documentElement.style.setProperty('--image-radius', `${width *.05  }px`);

    var height = document.getElementById('nav').offsetHeight;
    document.documentElement.style.setProperty('--nav-height', `${height}px`);
}

// resize when window size changes
onresize = () => resizeImages();
// resize when when the slider input changes
imageSize.addEventListener("input", (_) => resizeImages());
// resize for small screens
if (deck.getBoundingClientRect().width < 500) {
    imageSize.value = 2;
}

/**
 * Deck Loading
 */

moxfieldInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        processURL();
        e.preventDefault();
    }
});

function processURL() {
    const message = moxfieldInput.value.trim();
    if (message !== '') {
        const urlMatch = message.match(/https:\/\/www\.moxfield\.com\/decks\/([^\/]+)/)
        if (urlMatch.length == 2) {
            const deckID = urlMatch[1];
            console.log(`valid moxfield URL, deck ID: ${deckID}`)
            loadDeck(deckID)
            localStorage.setItem("deckID", deckID);
        }            
    }
    moxfieldInput.value = '';
}

async function loadDeck(id) {
    // clear the page
    deck.innerHTML = '';
    // fetch the deck data, load images from it 
    const response = await fetch(`${window.location}deck/${id}`);
    const {boards} = await response.json();
    loadImages(boards);
}

function loadImages(data) {
    
    // sorting bin, an array per card type
    const bin = {}
    Object.keys(cardTypes).forEach((typeID) => bin[typeID] = []);
    // collect commanders and sort mainboard cards based on type
    Object.values(data.commanders.cards).forEach(({card}) => bin[0].push(card));
    Object.values(data.mainboard.cards).forEach(({card}) => bin[card.type].push(card));

    Object.entries(bin).forEach(([cType, cArray]) => {
        // skip it if we don't have that type
        if (cArray.length == 0) {
            return
        }
    
        const header = document.createElement('div');
        header.className = 'cardType';
        header.textContent  = cardTypes[cType]
        deck.appendChild(header);

        const content = document.createElement('div');
        content.className = 'cardBox';
        deck.appendChild(content);

        // sort the cards aplhabetically
        cArray.sort((a,b) => a.name > b.name);

        // add images to the content div
        cArray.map((card) => {

            const imgBox = document.createElement('div');
            imgBox.className = 'imgBox'
            const cardImg = document.createElement('img');
            cardImg.onclick = imageClick;
            cardImg.alt = card.name;

            // assume it's a one-sided card
            cardImg.src = `https://assets.moxfield.net/cards/card-${card.id}-normal.webp`;
            cardImg.dataset.type = cardTypes[cType];
            cardImg.dataset.front = card.id;
            cardImg.dataset.back = '';
            // check for double faced cards but exclude certain types
            if (card.card_faces.length > 0 && !(['adventure', 'split'].includes(card.layout))) {
                cardImg.src = `https://assets.moxfield.net/cards/card-face-${card.card_faces[0].id}-normal.webp`;
                cardImg.dataset.front = card.card_faces[0].id
                cardImg.dataset.back = card.card_faces[1].id
            }

            imgBox.appendChild(cardImg)
            content.appendChild(imgBox);
        });
    });
    
    // make sure they fit the window properly
    resizeImages()
}

async function imageClick(event) {
    // css animation
    event.target.className = 'clicked';
    setTimeout(() => {
        event.target.classList.remove('clicked');
    }, 250);

    const response = await fetch(`${window.location}emit`, {
		headers: {
			'Content-Type': 'application/json',
		},
		method: "POST",
		body: JSON.stringify({
            type: event.target.dataset.type,
            front_id: event.target.dataset.front,
			back_id: event.target.dataset.back
		}),
	});
    if (response.status === 401) {
        window.location = window.location + 'login'
    }
}