const { google } = require("googleapis");
const config = require(".././config/config");

/*******************/
/** CONFIGURATION **/
/*******************/

const googleConfig = {
    clientId: config.GOOGLE_CLIENT_ID, // e.g. asdfghjkljhgfdsghjk.apps.googleusercontent.com
    clientSecret: config.GOOGLE_CLIENT_SECRET, // e.g. _ASDFA%DFASDFASDFASD#FAD-
    redirect: config.GOOGLE_REDIRECT_URL // this must match your google api settings
}

const defaultScope = [
    "https://www.googleapis.com/auth/plus.me",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile"
];

/*************/
/** HELPERS **/
/*************/

function createConnection() {
    return new google.auth.OAuth2(
        googleConfig.clientId,
        googleConfig.clientSecret,
        googleConfig.redirect
    );
}

function getConnectionUrl(auth) {
    return auth.generateAuthUrl({
        access_type: "offline",
        prompt: "consent",
        scope: defaultScope
    });
}

function getGooglePlusApi(auth) {
    return google.plus({ version: "v1", auth });
}

/**********/
/** MAIN **/
/**********/

/**
 * Part 1: Create a Google URL and send to the client to log in the user.
 */
function urlGoogle() {
    const auth = createConnection();
    const url = getConnectionUrl(auth);
    console.log(googleConfig);
    return url;
}

/**
 * Part 2: Take the "code" parameter which Google gives us once when the user logs in, then get the user's email and id.
 */
async function getGoogleAccountFromCode(code) {
    try {
        const auth = createConnection();
        const data = await auth.getToken(code);
        const tokens = data.tokens;
        auth.setCredentials(tokens);
        const plus = getGooglePlusApi(auth);
        const me = await plus.people.get({ userId: "me" });
        const userGoogleId = me.data.id;
        const userGoogleName = me.data.displayName;
        const userGoogleEmail =
            me.data.emails && me.data.emails.length && me.data.emails[0].value;
        return {
            username: userGoogleName,
            email: {
                email: userGoogleEmail,
                verified: true
            },
            googleId: userGoogleId
        };
    } catch (e) {
        console.log(e);
    }
}

module.exports = { urlGoogle, getGoogleAccountFromCode };
