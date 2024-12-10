import { AutoRouter, json, withCookies} from 'itty-router'
import cookieSigner from 'cookie-signature'


const router = AutoRouter()

function validateCookies(cookies, secret) {
	return !cookieSigner.unsign(cookies?.user_id, secret) && !cookieSigner.unsign(cookies?.servers, secret);
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
	console.log(authResp)

	// if (!response.ok) {
	// 	throw new Error(`HTTP error! status: ${response.status}`);
	// }

	// get user's ID 
	response = await fetch('https://discord.com/api/v10/users/@me', {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${authResp.access_token}`
		}
	});
	const user = await response.json();
	console.log(user)

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
	const authorizedGuildIDs = [];
	botGuildData.map((guild) => {
		if (userGuildIDs.includes(guild.id)) {
			authorizedGuildIDs.push(guild.id)
		}
	});

	console.log(request)
	const r = new Response(null, {status: 302});
	r.headers.append('Location', request.url.split(request.route)[0]);
	r.headers.append('Set-Cookie', `user_id=${cookieSigner.sign(user.id, env.DISCORD_CLIENT_SECRET)}; secure; HttpOnly; SameSite=Strict; Max-Age=3600`);
	r.headers.append('Set-Cookie', `servers=${cookieSigner.sign(authorizedGuildIDs.join('_'), env.DISCORD_CLIENT_SECRET)}; secure; HttpOnly; SameSite=Strict; Max-Age=3600`);
	return r;

});

router.post('/emit', withCookies, async (request, env) => {
	const unauthorized = ensureAuth(request, env.DISCORD_CLIENT_SECRET);
	if (unauthorized) {
		return unauthorized
	} 

	const reqJSON = await request.json()
	console.log(reqJSON)

	const simpleMessage = {
		content: `<@${request.cookies.user_id.split('.')[0]}> casts a [spell](${reqJSON.image_url})`,
		allowed_mentions: {
			parse: ["users"]
		}
	}

	const response = await fetch(`https://discord.com/api/v10/channels/${env.DISCORD_CHANNEL_ID}/messages`, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bot ${env.DISCORD_BOT_TOKEN}`
		},
		method: "POST",
		body: JSON.stringify(simpleMessage)
	});
	const whatever = await response.json()
	console.log(whatever)
	return 'ok'
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


// let example = 
//   {
//     description: "",
//     fields: [],
//     image: {
//       url: "https://images-ext-1.discordapp.net/external/MSeHQK3-X4dckR9yJ_k-ZrHR7sQBa9JegVb2arpjvNw/https/spelltable.danielcigrang.workers.dev/_drc?format=webp&width=489&height=682"
//     },
//     color: 5462587
//   }