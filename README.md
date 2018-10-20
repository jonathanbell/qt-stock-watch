## Developer installation

1. Clone this repo
1. `cd qt-stock-watch`
1. `npm install && cd client && npm install && cd ..`

https://medium.freecodecamp.org/how-to-make-create-react-app-work-with-a-node-backend-api-7c5c48acb1b0

# QT Stock Watch

QT Stock Watch allows you to view your Questrade account without logging in. It helps when you just want to check your stock positions. The web application cannot make trades. It only visualizes your primary Questrade account. However, **please be aware** that this application will display your live Questrade positions to the Internet. If you have any reservations about this, please do not use the app.

I recommend setting this application up at secret URL and bookmarking that URL. Then, you can quickly check your stock positions.

## Installation on Heroku

1. Clone this repository.
1. Login to Heroku and [create a new app](https://dashboard.heroku.com/new-app).
1. On the command line, `cd` to your `qt-stock-watch` directory.
1. Login to Heroku on the command line: `heroku login`
1. `heroku git:remote -a your-heroku-dyno-name` You can see the instructions for this at this URL: `https://dashboard.heroku.com/apps/your-heroku-dyno-name/deploy/heroku-git`
1. Then, just `git push heroku master`

## Setup on Questrade

1. Visit [the Questrade "My Apps" API webpage](https://login.questrade.com/APIAccess/userapps.aspx).
1. Click "Register a Personal App".
1. Under "Security settings" --> "OAuth scopes" make sure to select "Retrieve balances, positions, orders and executions" and "Retrieve delayed and real-time market data". **Do not select "Place, modify and cancel orders"**
1. After giving the app a name, click "Save"
1. On the ["My apps" page](https://login.questrade.com/APIAccess/userapps.aspx), click "+ New Device" and then "Generate new token"
1. Copy to the clipboard or write down your token. You will use this in the next part of the installation on Heroku.
1. At the Heroku Dashboard, visit the "Settings" tab of your app. (`https://dashboard.heroku.com/apps/your-heroku-dyno-name/settings`)
1. Click "Reveal Config Vars"
1. Add a config var with the KEY: `QT_KEY` and the VALUE of your Questrade token (see above).
1. Click "Add".
1. QT Stock Watch should be up and running on your Heroku dyno. :dollar:

The Questrade API is documented here: <http://www.questrade.com/api/documentation/getting-started>

## Is This the Right Portfolio Manager/Monitor for Me?

Maybe, but, probably not. I made some assumptions when making this dashboard:

- The user wants to visulazie their **main** Questrade account. In the future I may add the ability to switch between accounts. Currently, I only have one account - so I'd have to sign up for another one to test that particular functionality.
- The user owns stocks & the user owns < 30 stocks. The visual display of > 30 stocks may just look "weird" using QT Stock Watch. The charts may not display well if a user owns a lot of differnet stocks.

## TODOs

1. Add [DataTables](https://datatables.net/) to main dashboard.
1. Some Google charts are not displaying depending on the stock symbol. Fix this.
1. Heroku(?) or Questrade(?) expire the tokens when you wouldn't expect them to expire. Need to find the cause of this as it's a big crux to a well working app. See Issue #1: <https://github.com/jonathanbell/qt-stock-watch/issues/1>
