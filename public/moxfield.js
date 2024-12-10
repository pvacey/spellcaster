const moxfieldInput = document.getElementById('moxfieldInput');
const inbox = document.getElementById('inbox');

moxfieldInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        processURL();
        e.preventDefault(); // Prevents default action of Enter key
    }
});

function sizeDown() {
    document.getElementById('imageSize').value++
    resizeImages()
}

function sizeUp() {
    document.getElementById('imageSize').value--
    resizeImages()
}

function resizeImages(event) {

    slider = document.getElementById('imageSize');
    var width = Math.floor((document.getElementById('deck').getBoundingClientRect().width)/slider.value)-1;
    document.documentElement.style.setProperty('--image-width', `${width}px`);
    document.documentElement.style.setProperty('--image-radius', `${width *.05  }px`);

    var height = document.getElementById('nav').offsetHeight;
    document.documentElement.style.setProperty('--nav-height', `${height}px`);
}

// resize when window size changes
onresize = () => {resizeImages()};
// resize when when the slider input changes
document.getElementById('imageSize').addEventListener("input", () => {resizeImages()});
// resize for small screens
if (document.getElementById('deck').getBoundingClientRect().width < 500) {
    document.getElementById('imageSize').value = 2;
}


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

function loadDeck(id) {
    document.getElementById('deck').innerHTML = '';
    fetch(`https://corsproxy.io/?url=https://api2.moxfield.com/v3/decks/all/${id}`)
    .then(response => response.json())
    .then(data => loadImages(data))
    .catch(error => console.error('Error:', error));
}

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

function loadImages(deckData) {
    
    const board = {};

    Object.entries(deckData.boards.commanders.cards).forEach(([_, card]) => {
        card.card.type = 0;
        console.log(card.card.type)
        if (!(card.card.type in board)) {
            board[card.card.type] = [];
        }
        board[card.card.type].push(card)
    });

    Object.entries(deckData.boards.mainboard.cards).forEach(([_, card]) => {
        if (!(card.card.type in board)) {
            board[card.card.type] = [];
        }
        board[card.card.type].push(card)
    });


    Object.entries(board).forEach(([cardType, cardArray]) => {
        
        const typeBox = document.createElement('div');
        typeBox.className = 'typeBox';
    
        const header = document.createElement('div');
        header.className = 'cardType';
        header.textContent  = cardTypes[cardType]
        deck.appendChild(header);
        deck.appendChild(typeBox);

        const extractedData = [];
        const layoutExceptions = ['adventure', 'split']
        
        Object.entries(cardArray).forEach(([_, data]) => {
            let cardID = data.card.id
            if (data.card.card_faces.length > 0){
                cardID = `face-${data.card.card_faces[0].id}`
                console.log(data.card.layout)
                if (layoutExceptions.includes(data.card.layout)) {
                    cardID = data.card.id
                }
                console.log(data)
            }
            extractedData.push({
                id: cardID, 
                name: data.card.name
            });
        });

        extractedData.sort((a,b) => a.name > b.name);
        extractedData.map((card) => addImage(card.id, card.name, typeBox));

    });
    
    resizeImages()
}

function addImage(id, name, typeBox) {
    const imgBox = document.createElement('div');
    imgBox.className = 'imgBox'
    const cardImg = document.createElement('img');
    cardImg.src = `https://assets.moxfield.net/cards/card-${id}-normal.webp`;
    cardImg.alt = name
    cardImg.onclick = imageClick;
    imgBox.appendChild(cardImg)
    typeBox.appendChild(imgBox);
}

async function imageClick(event) {
    console.log('clicked image')
    console.log(event.target.src)
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
            image_name: event.target.alt,
			image_url: event.target.src
		}),
	});
    if (response.status === 401) {
        window.location = window.location + 'login'
    }
}

async function checkLogin() {
    const response = await fetch(`${window.location}auth-status`);
    if (response.status === 401) {
        window.location = window.location + 'login'
    } 
}

checkLogin()

const deckID = localStorage.getItem("deckID");
if (deckID) {
    loadDeck(deckID)
}