import { AutoRouter, withContent, withCookies, json } from "itty-router";
import cookieSigner from "cookie-signature";

const router = AutoRouter();

/**
 * Middleware function that checks that the user_id and servers cookies are both present and valid.
 * A valid cookie is one that can be successfully unsigned with the given secret.
 * Returns a 401 response if both cookies are not present and valid, otherwise does nothing.
 */
function requireAuth({ cookies }, { DISCORD_CLIENT_SECRET }) {
    if (
        !(
            cookieSigner.unsign(
                cookies?.user_id ?? "",
                DISCORD_CLIENT_SECRET
            ) &&
            cookieSigner.unsign(cookies?.servers ?? "", DISCORD_CLIENT_SECRET)
        )
    ) {
        return new Response(null, { status: 401 });
    }
}

/**
 * Used on intial page load to confirm the user is logged in
 */
router.get(
    "/auth-status",
    withCookies,
    requireAuth,
    () => new Response(null, { status: 200 })
);

/**
 * Redirects user to begin Discord OAuth2 flow
 */
router.get("/login", async (_, env) => {
    const discord_redirect = new URL(
        "https://discord.com/api/oauth2/authorize"
    );
    discord_redirect.searchParams.set("client_id", env.DISCORD_CLIENT_ID);
    discord_redirect.searchParams.set("response_type", "code");
    discord_redirect.searchParams.set("redirect_uri", env.DISCORD_REDIRECT_URI);
    discord_redirect.searchParams.set("scope", "identify guilds");

    return Response.redirect(discord_redirect, 302);
});

/**
 * Redirect URI for OAuth.
 * Receive an auth code, use the bot credentials to exchange it for an access_token.
 * Use the user's access_token to get the user ID and guild membership.
 * Use the bot's token to get bot guild membership.
 * Find guild IDs shared by both the bot and the user.
 * Return the user to "/" along with signed cookies for user ID and shared guild membership.
 */
router.get("/callback", async (request, env) => {
    try {
        // take the code from the redirect and request an access token
        const token_response = await fetch(
            "https://discord.com/api/v10/oauth2/token",
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                method: "POST",
                body: new URLSearchParams({
                    client_id: env.DISCORD_CLIENT_ID,
                    client_secret: env.DISCORD_CLIENT_SECRET,
                    code: request.query.code,
                    grant_type: "authorization_code",
                    redirect_uri: env.DISCORD_REDIRECT_URI,
                }),
            }
        );
        const { access_token } = await token_response.json();

        // get user's ID
        const user_response = await fetch(
            "https://discord.com/api/v10/users/@me",
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${access_token}`,
                },
            }
        );
        const { id: user_id } = await user_response.json();

        // get a list of guild IDs for the user
        const user_guild_response = await fetch(
            "https://discord.com/api/v10/users/@me/guilds",
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${access_token}`,
                },
            }
        );
        const userGuildData = await user_guild_response.json();
        const userGuildIDs = userGuildData.map(({ id }) => id);

        // get a list of guild IDs for the bot
        const bot_guild_response = await fetch(
            "https://discord.com/api/v10/users/@me/guilds",
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bot ${env.DISCORD_BOT_TOKEN}`,
                },
            }
        );
        const botGuildData = await bot_guild_response.json();

        // determine which guild IDs the user and bot both belong to, sign it and add to response
        const authorizedGuildIDs = botGuildData
            .filter(({ id }) => userGuildIDs.includes(id))
            .map(({ id }) => id)
            .join("_");

        // give the user some signed cookies to store relevant data
        const redirect_response = new Response(null, { status: 302 });
        const cookieSettings =
            "secure; HttpOnly; SameSite=Strict; Max-Age=21600";
        const [location] = request.url.split(request.route);
        redirect_response.headers.append("Location", location);
        redirect_response.headers.append(
            "Set-Cookie",
            `user_id=${cookieSigner.sign(
                user_id,
                env.DISCORD_CLIENT_SECRET
            )}; ${cookieSettings}`
        );
        redirect_response.headers.append(
            "Set-Cookie",
            `servers=${cookieSigner.sign(
                authorizedGuildIDs,
                env.DISCORD_CLIENT_SECRET
            )}; ${cookieSettings}`
        );
        return redirect_response;
    } catch (error) {
        console.error("error during user auth: ", error);
        return new Response(error, { status: 500 });
    }
});

/**
 * Sends a message to Discord describing a MTG card.
 */
router.post(
    "/emit",
    withCookies,
    withContent,
    requireAuth,
    async (request, env) => {
        const { verb, type, front_id, back_id } = await request.content;
        const cardType = type.toLowerCase();

        // build the message depending of if the card has 1 or 2 sides
        let cardMarkdown = `${verb} ${
            ["a", "e", "i"].includes(cardType[0]) ? "an" : "a"
        } [${cardType}](https://assets.moxfield.net/cards/card-${front_id}-normal.webp)`;
        if (back_id) {
            cardMarkdown = `casts a [${cardType}](https://assets.moxfield.net/cards/card-face-${front_id}-normal.webp) that [flips](https://assets.moxfield.net/cards/card-face-${back_id}-normal.webp)`;
        }

        await fetch(
            `https://discord.com/api/v10/channels/${env.DISCORD_CHANNEL_ID}/messages`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bot ${env.DISCORD_BOT_TOKEN}`,
                },
                method: "POST",
                body: JSON.stringify({
                    content: `<@${
                        request.cookies.user_id.split(".")[0]
                    }> ${cardMarkdown}`,
                    allowed_mentions: {
                        parse: ["users"],
                    },
                }),
            }
        );

        return new Response(null, { status: 201 });
    }
);

/**
 * Fetches the deck data given a Moxfield deck ID and returns it to the client.
 * This works around CORS issue with the client requesting this directly.
 */
router.get(
    "/deck/:deckID",
    withCookies,
    withContent,
    requireAuth,
    async ({ params: { deckID } }) => {
        try {
            const response = await fetch(
                `https://api2.moxfield.com/v3/decks/all/${deckID}`,
                {
                    headers: {
                        Accept: "application/json",
                        "User-Agent":
                            "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0",
                    },
                }
            );
            return json(await response.json(), { status: 200 });
        } catch (error) {
            console.error("error during deck fetch auth: ", error);
            return new Response(error, { status: 500 });
        }
    }
);

router.all("*", () => new Response("Not Found", { status: 404 }));

export default router;
