$(document).ready(function() {
  console.log("App ready!");

  // Set DC or get it from Local Storage
  var dc = false;
  if ( localStorage.getItem("dc") ) {
    dc = localStorage.getItem("dc");
  } else {
    dc = 15;
    localStorage.setItem("dc", 15);
  }
  $("#dc").val(dc);
  console.log("DC set to " + dc + ".");
  // Set time or get it from Local Storage
  var time = false;
  if ( localStorage.getItem("time") ) {
    time = localStorage.getItem("time");
  } else {
    time = 0;
    localStorage.setItem("time", 0);
  }
  $("#time").val(time);
  console.log("Time set to " + time + ".");
  // Check if there is a current table locally
  if ( localStorage.getItem("table") ) {
    $("#dc-container").html( localStorage.getItem("table") );
    console.log("Loaded saved table.");
  }
  // Check if the user is already immune
  if ( localStorage.getItem("free") ) {
    immune();
    console.log("The user is already immune.");
  }

  $("#go").on("click", function() {
    $("#roll, #check").prop("disabled", false);
    $(this)
      .prop("disabled", true)
      .addClass("is-loading");
    $("#roll").focus();
  }).trigger("click");

  $("#roll").on("change input", function() {
    if ( $(this).val() == "" ) { $(this).addClass("is-danger"); }
    else { $(this).removeClass("is-danger"); }
  });

  $("#restart").on("click", function() {
    localStorage.clear();
    location.reload();
  });

  $("#check").on("click", function(){
    if ( $("#roll").val().trim() == "" ) {
      $("#roll")
        .addClass("is-danger")
        .focus();
    } else {
      $("#check, #roll").prop("disabled", true);
      var time = parseInt( $("#time").val() );
      time += 12;
      $("#time").val(time);
      localStorage.setItem("time", time);
      var result = parseInt( $("#roll").val() );
      var dc = parseInt( $("#dc").val() );
      var success = (result >= dc);

      var row = $("<tr>");
      var time_cell = $("<td>");
      var time_p = $("<p>").html( parseTime( time ) );
      time_cell.append( time_p );
      row.append( time_cell );
      var dc_cell = $("<td>");
      var dc_p = $("<p>").html(dc);
      dc_cell.append( dc_p );
      row.append( dc_cell );
      var roll_cell = $("<td>");
      var roll_p = $("<p>").html(result);
      var res_cell = $("<td>");
      var icon_span = $("<span>").addClass("icon");
      var icon_i = $("<i>").addClass("mdi mdi-18px");
      if (success) {
        roll_p.addClass("has-text-success");
        icon_span.addClass("has-text-success");
        icon_i.addClass("mdi-check-circle");
      } else {
        roll_p.addClass("has-text-danger");
        icon_span.addClass("has-text-danger");
        icon_i.addClass("mdi-close-circle");
      }
      roll_cell.append( roll_p );
      row.append( roll_cell );
      icon_span.append( icon_i );
      res_cell.append( icon_span );
      row.append( res_cell );
      $("#dc-container").append( row );
      localStorage.setItem("table", $("#dc-container").html());

      if (success) {
        dc -= Math.floor(Math.random() * 6) + 1;
        $("#dc").val(dc);
        localStorage.setItem("dc", dc);
      }
      if ( dc <= 0 ) {
        immune();
        localStorage.clear();
        localStorage.setItem("free", true);
      }
      $("#go").prop("disabled", false);
      $("#roll").val("");
      $("#go").removeClass("is-loading");
    }
  });
});

function parseTime(time) {
  var hours = time % 24;
  var days = Math.floor( time / 24 );
  var res = days + "d " + hours + "h";
  return res;
}
function immune() {
  $("#hero").addClass("is-success");
  var win = $("<h1>")
    .html("You are immune!")
    .addClass("title is-1 has-text-success has-text-centered");
  var field = $("<div>").addClass("field");
  var control = $("<div>").addClass("control is-expanded");
  var button = $("<button>")
    .attr("type", "button")
    .addClass("button is-danger is-fullwidth")
    .on("click", function() {
      localStorage.clear();
      location.reload();
    });
  var icontext = $("<span>").addClass("icon-text");
  var icon = $("<span>").addClass("icon");
  var i = $("<i>").addClass("mdi mdi-delete");
  var text = $("<span>").html("Restart");
  icon.append( i );
  icontext
    .append( icon )
    .append( text );
  button.append( icontext );
  control.append( button );
  field.append( control );
  $("#win")
    .empty()
    .append( win )
    .append( field );
  $(".pyro").removeClass("is-hidden");
}
