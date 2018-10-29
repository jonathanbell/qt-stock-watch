# QT Stock Watch

QT Stock Watch allows you to view your Questrade account without logging in. It helps when you want to check your stock positions quickly. The web application cannot make trades. It only visualizes your primary Questrade account. However, **please be aware** that this application will display your live Questrade positions to the Internet. If you have any reservations about this, please do not use this app.

The Questrade OAuth API refreshes its tokens often. The app connects to a Mongo database in order to store the refresh token and some other small pieces of information about its primary user (me).

## Developer installation

1. Clone this repo
1. `cd qt-stock-watch`
1. `npm install && cd client && npm install && cd .. && cp .env.example .env.development`
1. Setup your MongoDB with your provider (like mLab) and paste your connection string/URL into the appropriate spot in `.env.development`
1. Visit the [Questrade "My Apps" API webpage](https://login.questrade.com/APIAccess/userapps.aspx).
1. Click "Register a Personal App".
1. Under "Security settings" --> "OAuth scopes" make sure to select "Retrieve balances, positions, orders and executions" and "Retrieve delayed and real-time market data". **Do not select "Place, modify and cancel orders"**
1. After giving the app a name, click "Save"
1. Add `https://your-applications-url.com/catch-qt-authorization` as your callback URL for the QT app
1. Copy your app ID (aka Questrade Consumer Key) into the appropriate spot in `.env.development`
1. Add your email to `.env.development` in the appropriate spot
1. Add the domain where your QT Stock Watch will be hosted at under the `APP_HOST` section of `.env.development`
1. Copy `.env.development` to `.env.production` and edit the values for the production version of the app

### Setup Questrade OAuth (TODO)

1. Complete the instructions above and then send a GET request to: `https://login.questrade.com/oauth2/authorize?client_id=${process.env.QT_CONSUMER_KEY}&response_type=token&redirect_uri=https://${req.hostname}/catch-qt-authorization`
1. React will then send a POST request to `/catch-qt-authorization` with the new `access_token`, `refresh_token`, and `expires_in` values.
1. Node will accept the values and check if they already exist. If they do, return an error via JSON. Otherwise Node will set them for the first time.

## Uses:

- [Reactstrap](https://reactstrap.github.io/components)
- React
- ES6
- MongoDB

## Is This the Right Portfolio Manager/Monitor for Me?

Maybe, but, probably not. I made some assumptions when making this dashboard:

- The user wants to visulazie their **main** Questrade account. In the future I may add the ability to switch between accounts. Currently, I only have one account - so I'd have to sign up for another one to test that particular functionality.
- The user owns stocks & the user owns < ~30 stocks. The visual display of > 30 stocks may just look "weird" using QT Stock Watch.

## TODOs

1. ~~Heroku(?) or Questrade(?) expire the tokens when you wouldn't expect them to expire. Need to find the cause of this as it's a big crux to a well working app. See Issue #1: <https://github.com/jonathanbell/qt-stock-watch/issues/1>~~
1. Proper OAuth sign up process (see `authController.getInitialQtOauth`)
