$(document).ready(function() {
  var articleContainer = $();

  $(document).on("click", handleArticleDelete);
  $(document).on("click", handleArticleNotes);
  $(document).on("click", handleNoteSave);
  $(document).on("click", handleNoteDelete);
  $(".clear").on("click", handleArticleClear);

  function initPage() {
    $.get("/api/headlines?saved=true").then(function(data) {
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
        $(),
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
      [].join()
    );
    articleContainer.append(emptyAlert);
  }

  function renderNotesList(data) {
    var notesToRender = [];
    var currentNote;
    if (!data.notes.length) {
      currentNote = $();
      notesToRender.push(currentNote);
    } else {
      for (var i = 0; i < data.notes.length; i++) {
        currentNote = $()
          .text(data.notes[i].noteText)
          .append($())
        currentNote.children().data("_id", data.notes[i]._id);
        notesToRender.push(currentNote);
      }
    }
    $().append(notesToRender);
  }

  function handleArticleDelete() {
    var articleToDelete = $(this)
      .parents()
      .data();

    $(this)
      .parents()
      .remove();
    $.ajax({
      method: "DELETE",
      url: "/api/headlines/" + articleToDelete._id
    }).then(function(data) {
      if (data.ok) {
        initPage();
      }
    });
  }
  function handleArticleNotes(event) {
    var currentArticle = $(this)
      .parents()
      .data();
    $.get("/api/notes/" + currentArticle._id).then(function(data) {
      var modalText = $().append(
        $().text("Notes For Article: " + currentArticle._id),
        $(),
        $(),
        $(),
        $()
      );
      bootbox.dialog({
        message: modalText,
        closeButton: true
      });
      var noteData = {
        _id: currentArticle._id,
        notes: data || []
      };
      $().data(noteData);
      renderNotesList(noteData);
    });
  }

  function handleNoteSave() {
    var noteData;
    var newNote = $()
      .val()
      .trim();

    if (newNote) {
      noteData = { _headlineId: $(this).data()._id, noteText: newNote };
      $.post("/api/notes", noteData).then(function() {
        bootbox.hideAll();
      });
    }
  }

  function handleNoteDelete() {
    var noteToDelete = $(this).data("_id");
    $.ajax({
      url: "/api/notes/" + noteToDelete,
      method: "DELETE"
    }).then(function() {
      bootbox.hideAll();
    });
  }

  function handleArticleClear() {
    $.get("api/clear")
      .then(function() {
        articleContainer.empty();
        initPage();
      });
  }
});
