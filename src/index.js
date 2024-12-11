import { AutoRouter, withCookies, withContent } from 'itty-router';
import cookieSigner from 'cookie-signature';

const router = AutoRouter();

/**
 * Checks that the user_id and servers cookies are both present and valid.
 * A valid cookie is one that can be successfully unsign()ed with the given secret.
 * @param {Record<string, string>} cookies - The cookies from the request
 * @param {string} secret - The secret used to sign the cookies
 * @returns {boolean} - Whether the cookies are valid
 */
function validateCookies(cookies, secret) {
	return cookieSigner.unsign(cookies?.user_id, secret) && cookieSigner.unsign(cookies?.servers, secret);
}

/**
 * Checks that the user_id and servers cookies are both present and valid.
 * A valid cookie is one that can be successfully unsign()ed with the given secret.
 * @param {Record<string, string>} request.cookies - The cookies from the request
 * @param {string} secret - The secret used to sign the cookies
 * @returns {boolean} - Whether the cookies are valid
 */
function ensureAuth(request, secret) {
	return validateCookies(request?.cookies, secret);
}

// login page redirect
router.get('/login', async (_, env) => {
	const discord_redirect = new URL('https://discord.com/api/oauth2/authorize');
	discord_redirect.searchParams.set('client_id', env.DISCORD_CLIENT_ID);
	discord_redirect.searchParams.set('response_type', 'code');
	discord_redirect.searchParams.set('redirect_uri', env.DISCORD_REDIRECT_URI);
	discord_redirect.searchParams.set('scope', 'identify guilds');

	return Response.redirect(discord_redirect, 302);
});

// callback page
router.get('/callback', withCookies, async ({ query, url, route }, env) => {
	// take the code from the redirect and request an access token
	try {
		const oauth_response = await fetch('https://discord.com/api/v10/oauth2/token', {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			method: 'POST',
			body: new URLSearchParams({
				client_id: env.DISCORD_CLIENT_ID,
				client_secret: env.DISCORD_CLIENT_SECRET,
				code: query.code,
				grant_type: 'authorization_code',
				redirect_uri: env.DISCORD_REDIRECT_URI,
			}),
		});

		const authResp = await oauth_response.json();

		// get user's ID
		const user_response = await fetch('https://discord.com/api/v10/users/@me', {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${authResp.access_token}`,
			},
		});
		const { id: user_id } = await user_response.json();

		// get a list of guild IDs for the user
		const guild_response = await fetch('https://discord.com/api/v10/users/@me/guilds', {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${authResp.access_token}`,
			},
		});
		const userGuildData = await guild_response.json();
		const userGuildIDs = userGuildData.map(({ id }) => id);

		// get a list of guild IDs for the bot
		const bot_guild_response = await fetch('https://discord.com/api/v10/users/@me/guilds', {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bot ${env.DISCORD_BOT_TOKEN}`,
			},
		});
		const botGuildData = await bot_guild_response.json();

		// determine which guild IDs the user and bot both belong to, sign it and add to response
		const authorizedGuildIDs = botGuildData.map(({ id }) => {
			if (userGuildIDs.includes(id)) {
				return id;
			}
		});

		const [location, _] = url.split(route);
		const redirect_response = new Response(null, { status: 302 });
		redirect_response.headers.append('Location', location);
		redirect_response.headers.append(
			'Set-Cookie',
			`user_id=${cookieSigner.sign(user_id, env.DISCORD_CLIENT_SECRET)}; secure; HttpOnly; SameSite=Strict; Max-Age=3600`
		);

		redirect_response.headers.append(
			'Set-Cookie',
			`servers=${cookieSigner.sign(
				authorizedGuildIDs.join('_'),
				env.DISCORD_CLIENT_SECRET
			)}; secure; HttpOnly; SameSite=Strict; Max-Age=3600`
		);

		return redirect_response;
	} catch (error) {
		return new Response(error, { status: 500 });
	}
});

router.post('/emit', withCookies, withContent, async (request, env) => {
	const authorized = ensureAuth(request, env.DISCORD_CLIENT_SECRET);
	if (!authorized) {
		return new Response(null, { status: 401 });
	}

	// go fetch info by ID from
	/// https://api2.moxfield.com/v3/cards/editions/${cardID}

	const body = JSON.stringify({
		content: `<@${request.cookies.user_id.split('.')[0]}> casts a [spell](${request.content.image_url})`,
		allowed_mentions: {
			parse: ['users'],
		},
	});

	await fetch(`https://discord.com/api/v10/channels/${env.DISCORD_CHANNEL_ID}/messages`, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bot ${env.DISCORD_BOT_TOKEN}`,
		},
		method: 'POST',
		body,
	});

	return new Response(null, { status: 200 });
});

router.get('/auth-status', withCookies, (request, env) => {
	const authorized = ensureAuth(request, env.DISCORD_CLIENT_SECRET);
	if (!authorized) {
		return new Response(null, { status: 401 });
	}
	return new Response(null, { status: 200 });
});

router.all('*', () => new Response('Not Found', { status: 404 }));

export default router;
