# FreeCodeCamp Stock Price Checker
For the first project of FreeCodeCamp's information security we have to make a stock price checker using a express and also add security features using helmet.js.

## Live Demo on Repl
https://freecodecamp-stock-price-checker.jordyf15.repl.co/

## Technologies Used
1. HTML
2. CSS
3. Javascript
4. Axios version ^0.20.0
5. Body-parser version ^1.15.2
6. Chai version ^3.5.0
7. Chai-http version ^3.0.0
8. Cors version ^2.8.1
9. Express version ^4.14.0
10. Font-awesome version ^4.7.0
11. Helmet version ^3.1.0
12. Jquery version ^3.5.1
13. Mocha version ^3.2.0
14. Mongoose version ^5.10.7
15. Zombie version ^5.0.5

## User Stories
1. Set the content security policies to only allow loading of scripts and CSS from your server.
2. I can GET /api/stock-prices with form data containing a Nasdaq stock ticker and recieve back an object stockData.
3. In stockData, I can see the stock (the ticker as a string), price (decimal in string format), and likes (int).
4. I can also pass along the field like as true (boolean) to have my like added to the stock(s). Only 1 like per IP should be accepted.
5. If I pass along 2 stocks, the return object will be an array with information about both stocks. Instead of likes, it will display rel_likes (the difference between the likes) on both.
6. A good way to receive current prices is through our stock price proxy (replacing 'GOOG' with your stock symbol): https://Stock-Price-Checker-Proxy--freecodecamp.repl.co/v1/stock/GOOG/quote
7. All 5 functional tests are complete and passing.


## Project Description
There are 3 files in total that we need to complete in order for the Stock Price Checker to function properly.
### routes/api.js
There are only 1 routes that we need to create which is the `/api/stock-prices` in this route user can request information about 1 stock or 2 stock and then compare them. To get the stock information we can use the stock price API provided by FreeCode Camp https://stock-price-checker-proxy--freecodecamp.repl.co.  
In this route there are only 1 method which is the GET method. The user can request information about stock and like them by specifying the stock and like in the query. For each stock can only be liked by 1 ip so we need to check whether the user's ip has like it before incrementing the like count for that stock. Depending on the stock query this route will respond with either 1 stock or 2 stock.  
1. **1 Stock:**  
If the user only requested 1 stock then the response shall be:   
```
stock: (The stock name{string}),  
price: (The current price of the stock {int})  
like: (The current like count of the stock {int})  
```
2. **2 Stock:**  
If the user only requested 2 stock then the response shall be:
```
stockData:{
    [0]:{
        stock: (The stock name{string}),
        price: (The current price of the stock {int})
        rel_like: (The like difference of the first and second stock{int})
    },
    [1]:{
        stock: (The stock name{string}),
        price: (The current price of the stock {int})
        rel_like: (The like difference of the first and second stock{int})
    }
}
```

### server.js
In order for the Stock Price Checker to pass the test we need to set the content secure policy to only allow loading of scripts and CSS from your server, this can be done by using the helmet.contentSecurityPolicy middle ware like this:  
```
app.use(helmet.contentSecurityPolicy({directives:{
    defaultSrc: ["'self'"],
    scriptSrc:["'self'"]
  }}));
```
  By doing this it'll disable the jquery functions used for the form since it was loaded from another server using cdn link. So inorder to make it work we might want to install it using npm instead and serve it as a static file instead. This also needs to be done for font awesome and other things that is loaded using cdn links or from other servers.

### tests/2_functional-tests.js
There are 5 test in total that we need to create and pass. 
1. **1 stock:**  
In this test we will request the server and get /api/stock-prices with query stock equal to goog. This should return the stock goog with it's price and like count.
2. **1 stock with like:**  
In this test we will request the server and get /api/stock-prices with query stock equal to goog and like equal to true. This should return the stock goog with it's price and like count incremented.
3. **1 stock with like again:**  
In this test we will request the server and get /api/stock-prices with query stock equal to goog and like equal to true. This should return the stock goog with it's price and like count remain the same as the previous test.
4. **2 stock:**  
In this test we will request the server and get the route /api/stock-prices with two query goog and msft. This should return both stock's information and it's rel_likes (like of the stock decreased by the other stock)
5. **2 stock with like:**  
In this test we will request the server and get the route /api/stock-prices with two query goog and msft and like equal to true. This should return both stock's information and it's rel_likes (like of the stock decreased by the other stock) and also incremented both likes if it not been liked by the ip before.

## Previous Intruction from FreeCodeCamp Boilerplate's README.md
1. SET NODE_ENV to `test` without quotes and set DB to your mongo connection string
2. Complete the project in `routes/api.js` or by creating a handler/controller
3. You will add any security features to `server.js`
4. You will create all of the functional tests in `tests/2_functional-tests.js`


