/**
 * notifies.js - obsługa mapy i podglądu statusu zgłoszenia w interfejsie dla zgłaszającego
 */


/* Strona z mapką */

// marker na mapce
var g_marker;

// Inicjalizacja - funkcja wywoływana przy ładowaniu strony
function initializeNotifies()
{
  createMap(); // map_common.js

  g_marker = null;

  google.maps.event.addListener(g_map, 'click',
    function(event)
    {
      placeMarker(event.latLng);
    }
  );
}

// Tworzy marker albo przesuwa istniejący do podanego położenia
function placeMarker(location)
{
  if (g_marker == null)
  {
    g_marker = new google.maps.Marker(
      {
        position: location,
        map: g_map,
        draggable: true
      }
    );

    displayDialog();

    google.maps.event.addListener(g_marker, 'click', displayDialog);
  }
  else
  {
    g_marker.setPosition(location);
  }
}

// Tworzy dialog z formą do zgłaszania
function displayDialog()
{
  var dialog = initDialogWindow('/res/issue', 400, 500, dialogLoaded);
}

function dialogLoaded(dialog)
{
  $("#issue_form form ").bind("submit",
    function()
    {
      $("#issue_form input[name=longitude]").val(g_marker.getPosition().lng());
      $("#issue_form input[name=latitude]").val(g_marker.getPosition().lat());
      $("#issue_form input[name=photo]").val(getPhotoInBase64());
      $("#issue_form input[name=category_id]").val(index);
    }
  );

  $("#issue_form form").live("ajax:success",
    function(event, data, status, xhr)
    {
      var result = jQuery.parseJSON(data.responseText);
      $("#issue_message").html(
        'Dziękujemy za wysłanie zgłoszenia!<br>' +
        'Twoje zgłoszenie zostało przyjęte i otrzymało nr ID ' + result['id'] + '<br>');
    }
  );

  $("#issue_form form").live("ajax:error",
    function(event, data, status, xhr)
    {
      var result = jQuery.parseJSON(data.responseText);
      $("#issue_message").html(
        'Twoje zgłoszenie nie mogło zostać przyjęte z powodu następujących błędów:<br>' +
        result['message'] + '<br>');
    }
  );

  $('#selectable').selectable(
    {
      stop:
      function (event, ui)
      {
        var selectedElem = $('#selectable').children('.ui-selected').first();
        var index = selectedElem.index() + 1;
        if (index == 0)
        {
          $('#category_name_span').text('[wybierz]');
          $('#category_id').val('');
          return;
        }

        jQuery.getJSON('/res/categories/' + index + '.json',
          function(data)
          {
            $('#category_name_span').text(data.name);
            $('#category_id').val(data.id);
          }
        );
      }
    }
  );

  dialog.dialog('open');
}

function getPhotoInBase64()
{
  var img = $("#upload_iframe").contents().find("img").attr("src");

  if( img != undefined )
    return img.split(',')[1];

  return '';
}


/* Strona z podglądem zgłoszenia */

// Inicjalizacja - wywoływane przy ładowaniu strony
// param_id to opcjonalne ID przekazane w zapytaniu
function initializeCheckStatus(param_id)
{
  if (param_id)
  {
    getIssueData(param_id);
    $('input[id=id]').val(param_id);
  }

  $('#get_data_button').bind("click",
    function()
    {
      var id = $('input[id=id]').val();
      getIssueData(id);
    }
  );
}

// Funkcja pobierająca dane zgłoszenia
function getIssueData(id)
{
  $.ajax(
    {
      'type': 'GET',
      'url': '/res/issue_instances/' + id,
      'error':
        function(xhr)
        {
          if (xhr.status == 404)
            $('#issue_data').html('Zgłoszenie o podanym ID nie istnieje!');
          else
            $('#issue_data').html('Przepraszamy, wystąpił błąd serwera');
        },
      'success':
        function(data)
        {
          $('#issue_data').html(data);
        }
     }
  );
}