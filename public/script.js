$(function() {
    console.log("script run")
    $('#testForm').submit(function(e) {

      console.log('testForm 1 submitted');
      $('#jsonResult').html('Fetching Data..');
      $.ajax({
        url: '/api/stock-prices',
        type: 'get',
        data: $('#testForm').serialize(),
        success: function(data) {
          $('#jsonResult').html('Stock: '+data.stock+'&nbsp&nbsp&nbsp&nbspPrice: '+data.price+'&nbsp&nbsp&nbsp&nbspLikes: '+data.like);
        }
      });
      e.preventDefault();

    });

    $('#testForm2').submit(function(e) {
      $('#jsonResult').html('Fetching Data..');
      console.log('testForm 2 submitted');
      $.ajax({
        url: '/api/stock-prices',
        type: 'get',
        data: $('#testForm2').serialize(),
        success: function(data) {
          $('#jsonResult').html('First Stock: <br>Stock: '+data.stockData[0].stock+'&nbsp&nbsp&nbsp&nbspPrice: '+data.stockData[0].price+'&nbsp&nbsp&nbsp&nbspRel_likes: '+data.stockData[0].rel_likes
          +'<br>Second Stock:<br>Stock: '+data.stockData[1].stock+'&nbsp&nbsp&nbsp&nbspPrice: '+data.stockData[1].price+'&nbsp&nbsp&nbsp&nbspRel_likes: '+data.stockData[1].rel_likes);
        }
      });
      e.preventDefault();

    });
  });