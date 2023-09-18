//SPECIAL FLAIRS
loadFlairs = function() {
  var enter = document.getElementById('special');

  // length variable from fetch API below
  for (i=1; i<=total; i++) {
    //creates HTML for special flairs
    var flair_special = document.createElement('img');
    flair_special.setAttribute('class', 'flair');
    flair_special.setAttribute('id', i);
    flair_special.setAttribute('src', 'images/icons/'+i+'.webp');

    enter.appendChild(flair_special);
  }
}

// <----------------------------------------------------------------->

// updates local storage values
function updateStorage(key, value, save) {
  if (save) {
    localStorage.setItem(key, value);
  }
  else {
    localStorage.removeItem(key);
  }
}

// reads local storage based on key
function readStorageValue(key) {
  return localStorage.getItem(key);
}

// reads entire local storage array
function readAllStorage() {
  const nbItem = localStorage.length;
  const store = [];
  let i;
  let storeKey;
  for (i = 0; i < nbItem; i += 1) {
    storeKey = localStorage.key(i);
    store.push({
      "key" : storeKey,
      "value" : readStorageValue(storeKey)
    });
  }
  return store;
}

// reads storage and updates the page accordingly
function updatePage() {
  //check local storage
  const store = readAllStorage();
  //restore the selected class
  $.each(store, function(index, elem) {
    if(elem['value'] == 'hidden')
      $("#" + elem.key).addClass("disabled");
    else if (elem['value'] == 'true'){
      $('.base').toggleClass('hidden');
      $('#hide-base').css('display', 'none');
      $('#show-base').css('display', 'inline-block');
    }
    else
      $("#" + elem.key).addClass("selected");
  });
}

// select all icons on page
function selectPage() {
    //adds selected class to every icon
    $("#special .flair:not(.disabled)").addClass("selected");

  var className = document.getElementsByClassName('selected');
  var idStore = new Array();


  //loops every ID and stores key into array
  for(var i = 0; i < className.length; i++) {
    idStore.push({"key" : className[i].id, "value" : className[i].className});
  }

  //add IDs from array to local storage
  for(var j=0; j<idStore.length; j++) {
      updateStorage(idStore[j]['key'], null, true);
    }
}

// remove all selections on page
function resetPage() {
  //check local storage
  const store = readAllStorage();
  //delete the selected class
  $.each(store, function(index, elem) {
    $("#" + elem.key).removeClass("selected");
    $("#" + elem.key).removeClass("disabled");
  });
  //clears local storage
  localStorage.clear();
}

//total legend tracker
function countLegends() {
  var amount = $(".selected").length;
  var total = $("#special .flair").length;
  var disabled = $('.disabled').length;

  $('#counter').html("<span class='cl'>Total LRs - </span>" + amount + "/" + (total-disabled));
}

//unhides specific Legends
function listHidden() {
  toggleModal('removed-modal');
  $(".modal-content2").empty();
  $("#hide-lr").prop("checked", false);

  var disabled = $(".disabled");
  var box = $('.modal-content2');

  //creates new images for hidden legends
  for(var i = 0; i < disabled.length; i++) {
    var flair = document.createElement('img');
    flair.setAttribute('class', 'flair');
    flair.setAttribute('name', disabled[i].id);
    flair.setAttribute('src', 'images/icons/'+disabled[i].id+'.webp');

    box.append(flair);
  }

  //unhide legends in checklist when clicked
  $(".modal-content2 img").mousedown(function(e) {
    const $obj = $(this);
    var id = $obj[0].name;

    $("#"+id).removeClass('disabled');
    //removes from modal display
    $obj.hide();
    //removes from local storage
    localStorage.removeItem(id);
    //updates counters
    countLegends();
  });
}

//toggles popup window
function toggleModal(e) {
  let modal = document.querySelector("#"+e);
  let closeBtn = document.querySelector("#"+e+" .close-btn")

  modal.style.visibility = "visible";
  modal.style.opacity = "100";

  closeBtn.onclick = function(){
    modal.style.visibility = "hidden";
    modal.style.opacity = "0";
    $('#import-text').val('');
  }
  window.onclick = function(e){
    if(e.target == modal){
      modal.style.visibility = "hidden";
      modal.style.opacity = "0";
      $('#import-text').val('');
    }
  }
}

function windowOnClick(event) {
  var modal = document.querySelector(".modal");
   if (event.target === modal) {
       toggleModal();
   }
}

//export image function
function generateImage() {
  toggleModal('image-modal');

  $(".modal-content").empty();

   domtoimage.toPng($('.icon-container')[0]).then(function (dataUrl) {
           var img = new Image();
           img.src = dataUrl;
           $(".modal-content").append(img);
   });
}


//download feature
function download() {
  domtoimage.toBlob($('.icon-container')[0]).then(function (blob) {
        window.saveAs(blob, 'checklist.png');
    });
}

//export localStorage
function exportSelection() {
  var raw = JSON.stringify(localStorage);
  container = document.getElementById("export-text");
  container.setAttribute("style", "transform: translateY(0); opacity: 1; z-index: 1;");
  container.value = LZString.compressToEncodedURIComponent(raw);
}

//copy exported data
function copySelection() {
  container = document.getElementById("export-text");
  container.select();
  document.execCommand("copy");
  $('#display-copied').fadeIn().delay(1000).fadeOut();
}

//apply imported data
function importSelection() {
  var text = document.getElementById("import-text").value;

  plaintext = LZString.decompressFromEncodedURIComponent(text);

  //clears local storage
  localStorage.clear();

  try {
    // Convert to a JSON object
    data = JSON.parse(plaintext);

    console.log(data);

    // Iterate over the JSON object and save to localstorage
    Object.keys(data).map(function(key, index) {
        var value = data[key];
        localStorage.setItem(key, value);
    });

    $('#imported').fadeIn().delay(1000).fadeOut();
  }
  //if error
  catch {
    $('#undefined').fadeIn().delay(1000).fadeOut();
  }

  coreFunctions();
}

function coreFunctions() {
  //restore previous state
  updatePage();

  //legend counter
  countLegends();
}

$(document).ready(function() {

  fetch('https://api.github.com/repos/dokkanlr/dokkanlr.github.io/contents/images/icons?ref=master')
  .then(response => response.json()) // convert API to json format
  .then(function (response) {
    total = Object.values(response).length;

    // generate icons
    loadFlairs();

    coreFunctions();
  });

  //main function for selecting icons
  $("#special").on("click", "img", function(e) {
    var isChecked = document.getElementById('hide-lr').checked;

    const $obj = $(this);

    //hide LRs toggle
    if(isChecked){
      $obj.toggleClass("disabled");
      $obj.removeClass("selected");

      const save = $obj.hasClass("disabled");

      updateStorage($obj.attr("id"), "hidden", save);
      countLegends();
    }
    //if not checked
    else {
      //toggles selected classes
      $obj.toggleClass("selected");

      //creates object if selected class is present
      const save = $obj.hasClass("selected");

      //update the key
      updateStorage($obj.attr("id"), null, save);

      countLegends();
    }
  });

  //select all button
  $("#select-all").on("click", function() {
    selectPage();
    countLegends();
  });

  //clear button
  $("#select-none").on("click", function() {
    if (confirm("Are you sure you want to reset the checklist?")){
      resetPage();
      countLegends();
    }
  });

  //unhide specific legends
  $("#list-hidden").on("click", function() {
    listHidden();
    countLegends();
  });

  //generate image window
  $("#generate").on("click", function() {
    generateImage();
    countLegends();
  });

  //import code window
  $("#import").on("click", function() {
    toggleModal('import-modal');
  });

  //import code button
  $("#import-btn").on("click", function() {
    importSelection();
    countLegends();
  });

  //export code window
  $("#export").on("click", function() {
    toggleModal('export-modal');
    exportSelection();
  });

  //copy code button
  $("#copy-export").on("click", function() {
    copySelection();
  });
});
