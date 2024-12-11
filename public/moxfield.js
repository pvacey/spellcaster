// Get DOM elements
const moxfieldInput = document.getElementById('moxfieldInput');
const inbox = document.getElementById('inbox');
const imageSize = document.getElementById('imageSize');
const deck = document.getElementById('deck');

// Add event listener to #moxfieldInput element for Enter key
moxfieldInput.addEventListener('keydown', function (e) {
	if (e.key === 'Enter' && !e.shiftKey) {
		e.preventDefault(); // Prevents default action of Enter key
		processURL();
	}
});

/**
 * Increments the value of the #imageSize slider and triggers a resize of the deck images.
 */
function sizeDown() {
	imageSize.value++;
	resizeImages();
}

/**
 * Decrements the value of the #imageSize slider and triggers a resize of the deck images.
 */
function sizeUp() {
	imageSize.value--;
	resizeImages();
}

/**
 * Updates the --image-width and --image-radius CSS custom properties based on the
 * value of the #imageSize slider. The width is calculated as the full width of the
 * #deck element divided by the slider value, and the radius is set to 5% of that width.
 * The --nav-height property is also set to the height of the #nav element.
 */
function resizeImages() {
	const width = Math.floor(deck.getBoundingClientRect().width / imageSize.value) - 1;
	document.documentElement.style.setProperty('--image-width', `${width}px`);
	document.documentElement.style.setProperty('--image-radius', `${width * 0.05}px`);

	const height = document.getElementById('nav').offsetHeight;
	document.documentElement.style.setProperty('--nav-height', `${height}px`);
}

// add event listener to #imageSize slider for value changes
imageSize.addEventListener('input', (_) => {
	resizeImages();
});

// set initial value of #imageSize slider for small screens
if (deck.getBoundingClientRect().width < 500) {
	imageSize.value = 2;
}

/**
 * Processes a URL entered into the moxfieldInput element.
 * If the URL is a valid Moxfield deck URL, it will be parsed and the deck
 * will be loaded. The deck ID is stored in localStorage.
 */
function processURL() {
	const message = moxfieldInput.value.trim();
	if (message !== '') {
		const urlMatch = message.match(/https:\/\/www\.moxfield\.com\/decks\/([^\/]+)/);
		if (urlMatch.length == 2) {
			const [_, deckID] = urlMatch;
			loadDeck(deckID);
			localStorage.setItem('deckID', deckID);
		}
	}
	moxfieldInput.value = '';
}

/**
 * Loads a Moxfield deck by its ID and displays the deck's images.
 * Clears the current deck display, fetches deck data from the Moxfield API,
 * and passes the data to the loadImages function for rendering.
 * Logs errors to the console if the fetch operation fails.
 *
 * @param {string} id - The ID of the Moxfield deck to be loaded.
 */
async function loadDeck(id) {
	deck.innerHTML = '';
	try {
		const response = await fetch(`https://corsproxy.io/?url=https://api2.moxfield.com/v3/decks/all/${id}`);
		const data = await response.json();
		loadImages(data);
	} catch (error) {
		console.error(error);
	}
}

// constant for card types
const cardTypes = {
	COMMANDER: 0,
	BATTLE: 1,
	PLANESWALKER: 2,
	CREATURE: 3,
	SORCERY: 4,
	INSTANT: 5,
	ARTIFACT: 6,
	ENCHANTMENT: 7,
	LAND: 8,
};

// constant for card type labels
const cardTypeLabel = {
	0: 'Commander',
	1: 'Battle',
	2: 'Planeswalker',
	3: 'Creature',
	4: 'Sorcery',
	5: 'Instant',
	6: 'Artifact',
	7: 'Enchantment',
	8: 'Land',
};

/**
 * Renders the cards in the provided deck data as a series of images, organized by card type.
 * The card types are determined by the `cardTypes` object and the `cardTypeLabel` object.
 * The function takes an object with the following structure:
 * {
 *  boards: {
 *    commanders: { cards: { id: string, name: string }[] },
 *    mainboard: { cards: { id: string, name: string }[] },
 *  },
 * }
 * and creates a `div` element for each card type, with a header containing the card type
 * name and a `div` element for each card, with an `img` element for the card image.
 * The `img` elements are created with the `addImage` function, which takes the card ID,
 * name, and a `div` element to append the image to.
 * The function also calls the `resizeImages` function at the end.
 */
function loadImages(deckData) {
	const board = {};

	const commander_cards = Object.entries(deckData?.boards?.commanders?.cards);
	const main_board_cards = Object.entries(deckData?.boards?.mainboard?.cards);

	commander_cards.forEach(([_, card]) => {
		card.card.type = cardTypes.COMMANDER;
		if (!Object.hasOwn(board, card.card.type)) {
			board[card.card.type] = [];
		}
		board[card.card.type].push(card);
	});

	main_board_cards.forEach(([_, card]) => {
		const type = card?.card?.type;
		if (!Object.hasOwn(board, type)) {
			board[type] = [];
		}
		board[card.card.type].push(card);
	});

	Object.entries(board).forEach(([cardType, cardArray]) => {
		const typeBox = document.createElement('div');
		typeBox.className = 'typeBox';

		const header = document.createElement('div');
		header.className = 'cardType';
		header.textContent = cardTypeLabel[cardType];

		deck.appendChild(header);
		deck.appendChild(typeBox);

		const layoutExceptions = ['adventure', 'split'];

		const extractedData = Object.entries(cardArray).map(([_, { card }]) => {
			let id = card?.id;
			const name = card?.name;
			if (card?.card_faces.length > 0) {
				id = `face-${card?.card_faces[0].id}`;
				if (layoutExceptions.includes(card?.layout)) {
					id = card?.id;
				}
			}
			return { id, name };
		});

		extractedData.sort((a, b) => a.name > b.name);
		extractedData.forEach(({ id, name }) => addImage(id, name, typeBox));
	});

	resizeImages();
}

/**
 * Creates an img element for a card image and appends it to the given typeBox element.
 * The img element is given a class of 'imgBox' and the card image URL is determined
 * by the given id. The img element is also given an alt attribute with the given name.
 * The img element is also given an onclick event handler that calls the imageClick
 * function when clicked.
 *
 * @param {string} id - The id of the card to be rendered.
 * @param {string} name - The name of the card to be rendered.
 * @param {HTMLElement} typeBox - The element to which the img element will be appended.
 */
function addImage(id, name, typeBox) {
	const imgBox = document.createElement('div');
	imgBox.className = 'imgBox';
	const cardImg = document.createElement('img');
	cardImg.src = `https://assets.moxfield.net/cards/card-${id}-normal.webp`;
	cardImg.alt = name;
	cardImg.onclick = imageClick;
	imgBox.appendChild(cardImg);
	typeBox.appendChild(imgBox);
}

/**
 * Handles clicks on the rendered card images. When an image is clicked, it gets the 'clicked'
 * class for 2 seconds, and a POST request is sent to the '/emit' endpoint with the image URL.
 * If the response status is 401 (unauthorized), redirects the user to the login page.
 *
 * @param {MouseEvent} event - The event object of the click event.
 * @this {HTMLElement} - The element that was clicked.
 */
async function imageClick({ target }) {
	target.className = 'clicked';
	setTimeout(() => {
		target.classList.remove('clicked');
	}, 2000);

	const response = await fetch('/emit', {
		headers: {
			'Content-Type': 'application/json',
		},
		method: 'POST',
		body: JSON.stringify({
			image_url: target.src,
		}),
	});
	if (response.status === 401) {
		window.location = 'login';
	}
}

/**
 * Checks the user's authentication status by making a request to the '/auth-status' endpoint.
 * If the response status is 401 (unauthorized), redirects the user to the login page.
 */
async function checkLogin() {
	const response = await fetch('/auth-status');
	if (response.status === 401) {
		window.location = 'login';
	}
}

// Wait to login once the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
	checkLogin();
});

const deckID = localStorage.getItem('deckID');
if (deckID) {
	loadDeck(deckID);
}
