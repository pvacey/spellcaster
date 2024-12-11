import { AutoRouter, json, withCookies} from 'itty-router'
import cookieSigner from 'cookie-signature'


const router = AutoRouter()

function validateCookies(cookies, secret) {
	let valid = false
	if ('user_id' in cookies && 'servers' in cookies) {
		if (cookieSigner.unsign(cookies.user_id, secret) !== false && cookieSigner.unsign(cookies.servers, secret) !== false) {
			valid = true
		}
	}
	return valid
}

function ensureAuth(request, secret) {
	if (validateCookies(request.cookies, secret) !== true){
		return new Response(null, {status: 401})
	}
}

router.get('/login', async (request, env) => {
	return Response.redirect(`https://discord.com/oauth2/authorize?client_id=${env.DISCORD_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(env.DISCORD_REDIRECT_URI)}&scope=identify+guilds`)
});


router.get('/callback',  withCookies, async (request, env) => {

	// take the code from the redirect and request an access token
	let response = await fetch('https://discord.com/api/v10/oauth2/token', {
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		method: "POST",
		body: new URLSearchParams({
			client_id: env.DISCORD_CLIENT_ID,
			client_secret: env.DISCORD_CLIENT_SECRET,
			code: request.query.code,
			grant_type: 'authorization_code',
			redirect_uri: env.DISCORD_REDIRECT_URI
		}),
	});
	const authResp = await response.json();

	// get user's ID 
	response = await fetch('https://discord.com/api/v10/users/@me', {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${authResp.access_token}`
		}
	});
	const user = await response.json();

	// get a list of guild IDs for the user
	response = await fetch('https://discord.com/api/v10/users/@me/guilds', {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${authResp.access_token}`
		}
	});
	const userGuildData = await response.json();
	const userGuildIDs = userGuildData.map((guild) => guild.id)

	// get a list of guild IDs for the bot
	response = await fetch('https://discord.com/api/v10/users/@me/guilds', {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bot ${env.DISCORD_BOT_TOKEN}`
		}
	});
	const botGuildData = await response.json();

	// determine which guild IDs the user and bot both belong to, sign it and add to response
	const authorizedGuildIDs = botGuildData.filter((guild) => {
		if (userGuildIDs.includes(guild.id)) {
			return guild
		}
	}).map((guild) => guild.id);

	// console.log(request)
	const r = new Response(null, {status: 302});
	const cookieSettings = 'secure; HttpOnly; SameSite=Strict; Max-Age=3600'
	r.headers.append('Location', request.url.split(request.route)[0]);
	r.headers.append('Set-Cookie', `user_id=${cookieSigner.sign(user.id, env.DISCORD_CLIENT_SECRET)}; ${cookieSettings}`);
	r.headers.append('Set-Cookie', `servers=${cookieSigner.sign(authorizedGuildIDs.join('_'), env.DISCORD_CLIENT_SECRET)}; ${cookieSettings}`);
	return r;

});

router.post('/emit', withCookies, async (request, env) => {
	const unauthorized = ensureAuth(request, env.DISCORD_CLIENT_SECRET);
	if (unauthorized) {
		return unauthorized
	} 

	const { type, front_id, back_id } = await request.json()

	// build the message depending of if the card has 1 or 2 sides
	let cardMarkdown = `casts a [${type.toLowerCase()}](https://assets.moxfield.net/cards/card-${front_id}-normal.webp)`
	if (back_id !== '') {
		cardMarkdown = `casts a [${type.toLowerCase()}](https://assets.moxfield.net/cards/card-face-${front_id}-normal.webp) that [flips](https://assets.moxfield.net/cards/card-face-${back_id}-normal.webp)`
	}

	const response = await fetch(`https://discord.com/api/v10/channels/${env.DISCORD_CHANNEL_ID}/messages`, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bot ${env.DISCORD_BOT_TOKEN}`
		},
		method: "POST",
		body: JSON.stringify({
			content: `<@${request.cookies.user_id.split('.')[0]}> ${cardMarkdown}`,
			allowed_mentions: {
				parse: ["users"]
			}
		})
	});
	const whatever = await response.json()
	return new Response(null, {status: 201})
});

router.get('/auth-status', withCookies, (request, env) => {
	const unauthorized = ensureAuth(request, env.DISCORD_CLIENT_SECRET);
	if (unauthorized) {
		return unauthorized
	} else {
		return new Response(null, {status: 200})
	}
});

router.all('*', () => new Response('Not Found', { status: 404 }))

export default router