/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';
//stock price api https://repeated-alpaca.glitch.me/v1/stock/[symbol]/quote
//[symbol]=nama stock pricenya
var expect = require('chai').expect;
// var request = require('request');
var axios = require('axios');
var stock=require('../models/stock.js');

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(function (req, res){
    // console.log(req.query.stock)
    if(typeof req.query.stock==='string'){//jika 1 query stocknya
      axios.get('https://repeated-alpaca.glitch.me/v1/stock/'+req.query.stock+'/quote')
      .catch((err)=>{
        console.log(err);
      })
      .then((result)=>{//getting the needed data from the api / http request
        var result=[result.data.symbol,result.data.latestPrice];
        // console.log(result);
        return result;
      })
      .then((result)=>{
        stock.findOne({name: result[0]})//searching the stock
        .then((obj)=>{
          if(obj){//if stock was found
            console.log('stock was found');
            if(req.query.like=='true'){//if user like the stock
              console.log('liked it');
              if(obj.ips.includes(req.connection.remoteAddress)==false){//check if this ip address has liked it before
                console.log('this ip not done it before');
                obj.like++;
                obj.ips.push(req.connection.remoteAddress);
              }
              return obj.save()
              .then((saveResult)=>{
                return [saveResult,result[1]];
              })
            }else{//if user didn't liked the stock
            return [obj,result[1]]
            }
          }else{//if not found create new stock
            console.log('create new stock');
            var newStock = new stock({
              name: result[0],
              like: 0,
              ips:[]
            });
            if(req.query.like=='true'){//if user like it
              console.log('liked it');
              newStock.like++;
              newStock.ips.push(req.connection.remoteAddress);
            }
            return newStock.save()
            .then((saveResult)=>{
              return [saveResult,result[1]];
            })
          }
        })
        .then((result)=>{
          res.json({
            stock: result[0].name,
            price: result[1],
            like: result[0].like
          })
        })
      });
    }else{//jika 2 query stocknya
      axios.get('https://repeated-alpaca.glitch.me/v1/stock/'+req.query.stock[0]+'/quote')
      .catch((err)=>{
        console.log(err);
      })
      .then((response)=>{
        var result=[{name: response.data.symbol, price: response.data.latestPrice}];
        return result;
      })
      .then((result)=>{
        return axios.get('https://repeated-alpaca.glitch.me/v1/stock/'+req.query.stock[1]+'/quote')
        .catch((err)=>{
          console.log(err);
        })
        .then((response)=>{
          result.push({name: response.data.symbol,price: response.data.latestPrice})
          // console.log(result);
          return result;
        })
      })
      .then((result)=>{//this result contain both name and price of two stocks
        var bothResult=[];
        return stock.findOne({name: result[0].name})//search for the first stock
        .then((obj)=>{
          if(obj){//if first stock is found
            console.log('first stock found')
            if(req.query.like=='true'){//if user like it
              console.log('liked')
              if(obj.ips.includes(req.connection.remoteAddress)==false){
                console.log('this user not done it before')
                obj.ips.push(req.connection.remoteAddress);
                obj.like++;
              }
              return obj.save()
              .then((saveResult)=>{
                bothResult.push({name: saveResult.name, price: result[0].price,like:saveResult.like});
                return bothResult;
              })
            }else{//if user dont like it
              bothResult.push({name: obj.name, price: result[0].price,like:obj.like});
              return bothResult;
            }
          }else{//if first stock not found
            console.log('first stock not found')
            var newStock = new stock({
              name: result[0].name,
              like: 0,
              ips:[]
            })
            if(req.query.like=='true'){
              console.log('liked it')
              newStock.ips.push(req.connection.remoteAddress);
              newStock.like++;
            }
            return newStock.save()
            .then((saveResult)=>{
              bothResult.push({name: saveResult.name, price: result[0].price,like:saveResult.like});
              return bothResult
            })
          }
        })
        .then(()=>{
          return stock.findOne({name: result[1].name})
          .then((obj)=>{
            if(obj){//if second stock is found
              console.log('second stock found')
              if(req.query.like=='true'){//if user like it
                console.log('liked it')
                if(obj.ips.includes(req.connection.remoteAddress)==false){//check if ip has liked it before
                  console.log('user has not done it before')
                  obj.ips.push(req.connection.remoteAddress);
                  obj.like++;
                }
                return obj.save()
                .then((saveResult)=>{
                  bothResult.push({name: saveResult.name, price: result[1].price,like: saveResult.like})
                  return bothResult;
                })
              }else{//if user dont like it
                bothResult.push({name: obj.name, price: result[1].price,like: obj.like});
                return bothResult;
              }
            }else{//if second stock not found
              console.log('second stock not found')
              var newStock= new stock({
                name: result[1].name,
                like:0,
                ips:[]
              })
              if(req.query.like=="true"){
                newStock.like++;
                newStock.ips.push(req.connection.remoteAddress);
              }
              return newStock.save()
              .then((saveResult)=>{
                bothResult.push({name: saveResult.name, price: result[1].price, like: newStock.like});
                return bothResult
              })
            }
          })
        })
      })
      .then((result)=>{
        res.json({
          stockData: [
            {stock: result[0].name, price: result[0].price, rel_likes: result[0].like-result[1].like},
            {stock: result[1].name, price: result[1].price, rel_likes: result[1].like-result[0].like}
          ]
        })
      })
    }
    });



};
