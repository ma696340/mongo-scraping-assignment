$(document).ready(function() {

  var articleContainer = $();
  $(document).on("click", handleArticleSave);
  $(document).on("click", handleArticleScrape);
  $(".clear").on("click", handleArticleClear);

  function initPage() {
  
    $.get("/api/headlines?saved=false").then(function(data) {
      articleContainer.empty();
    
      if (data && data.length) {
        renderArticles(data);
      } else {
      
        renderEmpty();
      }
    });
  }

  function renderArticles(articles) {
   
    var articleCards = [];
  
    for (var i = 0; i < articles.length; i++) {
      articleCards.push(createCard(articles[i]));
    }
    
    articleContainer.append(articleCards);
  }

  function createCard(article) {
   
    var card = $();
    var cardHeader = $().append(
      $().append(
        $()
          .attr(article.url)
          .text(article.headline),
        $()
      )
    );

    var cardBody = $().text(article.summary);

    card.append(cardHeader, cardBody);
    
    card.data("_id", article._id);
   
    return card;
  }

  function renderEmpty() {

    var emptyAlert = $(
      [
       
      ].join()
    );
    articleContainer.append(emptyAlert);
  }

  function handleArticleSave() {
 
    var articleToSave = $(this)
      .parents()
      .data();

    $(this)
      .parents()
      .remove();

    articleToSave.saved = true;
   
    $.ajax({
      method: "PUT",
      url: "/api/headlines/" + articleToSave._id,
      data: articleToSave
    }).then(function(data) {
    
      if (data.saved) {
        initPage();
      }
    });
  }

  function handleArticleScrape() {
    $.get("/api/fetch").then(function(data) {
     
      initPage();
      bootbox.alert($().text(data.message));
    });
  }

  function handleArticleClear() {
    $.get("api/clear").then(function() {
      articleContainer.empty();
      initPage();
    });
  }
});
