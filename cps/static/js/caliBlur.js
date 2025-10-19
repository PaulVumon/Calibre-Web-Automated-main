/* This file is part of the Calibre-Web (https://github.com/janeczku/calibre-web)
 *    Copyright (C) 2018-2019  hexeth
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
// Move advanced search to side-menu
$("a[href*='advanced']").parent().insertAfter("#nav_new");
$("body.stat").addClass("stats");
$("body.config").addClass("admin");
$("body.uiconfig").addClass("admin");
$("body.advsearch").addClass("advanced_search");
$("body.newuser").addClass("admin");
$("body.mailset").addClass("admin");
// $("body > div.container-fluid > div > div.col-sm-10 > div.filterheader").attr("style","margin: 40px 0 !important; padding: 0 10px 0 40px !important;");


// Back button
curHref = window.location.href.split("/");
prevHref = document.referrer.split("/");
$(".plexBack a").attr('href', encodeURI(document.referrer));

if (history.length === 1 ||
    curHref[0] +
    curHref[1] +
    curHref[2] !=
    prevHref[0] +
    prevHref[1] +
    prevHref[2] ||
    $("body.root") > length > 0) {
    $(".plexBack").addClass("noBack");
}

//Weird missing a after pressing back from edit.
setTimeout(function () {
    $(".plexBack a").attr('href', encodeURI(document.referrer));
}, 10);

/////////////////////////////////
// Start of Book Details Work //
///////////////////////////////

// Wrap book description in div container
if ($("body.book").length > 0) {

    description = $(".comments");
    bookInfo = $(".author").nextUntil("#decription");
    $("#decription").detach();
    $(".comments").detach();
    $(bookInfo).wrapAll('<div class="bookinfo"></div>');
//  $( 'h3:contains("Description:")' ).after( '<div class="description"></div>' );
    $(".languages").appendTo(".bookinfo");
    $(".hr").detach();
    if ($(".identifiers ").length > 0) {
        console.log(".identifiers length " + $(".identifiers").length);
        $('.identifiers').before('<div class="hr"></div>');
    } else {
        if ($(".bookinfo > p:first-child").length > 0) {
            console.log(".bookinfo > p:first-child length " + $(".bookinfo > p").length);
            $(".bookinfo > p:first-child").first().after('<div class="hr"></div>');
        } else {
            if ($('.bookinfo a[href*="/series/"]').length > 0) {
                console.log("series text found; placing hr below series");
                $('.bookinfo a[href*="/series/"]').parent().after('<div class="hr"></div>');
            } else {
                console.log("prepending hr div to top of .bookinfo");
                $(".bookinfo").prepend('<div class="hr"></div>');
            }
        }
    }
    $(".rating").insertBefore(".hr");
    $("#remove-from-shelves").insertAfter(".hr");
    $(description).appendTo(".bookinfo")

    // Sexy blurred backgrounds (desktop always; mobile only if allow-mobile-blur class present)
    if ( $(window).width() >= 768 || $('body').hasClass('allow-mobile-blur') ) {
        cover = $(".cover img").attr("src");
        if (cover) {
            if ($("#loader + .container-fluid > .blur-wrapper").length === 0) {
                $("#loader + .container-fluid")
                    .prepend("<div class='blur-wrapper'></div>");
            }
            $(".blur-wrapper").prepend('<div><img loading="lazy" alt="Blurred cover" class="bg-blur" src="' + cover + '"></div>');
        }
    }

    // Metadata Fields - Publishers, Published, Languages and Custom
    $('.publishers, .publishing-date, .real_custom_columns, .languages').each(function () {
        var splitText = $(this).text().split(':');
        var label = splitText.shift().trim();
        var value = splitText.join(':').trim();
        var class_value = ""
        // Preserve Links
        if ($(this).find('a').length) {
            value = $(this).find('a').first().removeClass();
        }
        // Preserve glyphicons
        if ($(this).find('span').length) {
            class_value = $(this).find('span').first().attr('class');
        }
        $(this).html('<span>' + label + '</span><span class="' + class_value + '"></span>').find('span').last().append(value);
    });

    $(".book-meta h2:first").clone()
        .prependTo(".book-meta > .btn-toolbar:first");

    // If only one download type exists still put the items into a drop-drown list.
    downloads = $("a[id^=btnGroupDrop]").get();
    if ($(downloads).length === 1) {
        $('<button id="btnGroupDrop1" type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span class="glyphicon glyphicon-download"></span>Download<span class="caret"></span></button><ul class="dropdown-menu leramslist aria-labelledby="btnGroupDrop1"></ul>').insertBefore(downloads[downloads.length - 1]);
        $(downloads).detach();
        $.each(downloads, function (i, val) {
            $("<li>" + downloads[i].outerHTML + "</li>").appendTo(".leramslist");
        });
        $(".leramslist").find("span").remove();
        $(".leramslist a").removeClass("btn btn-primary").removeAttr("role");
    }

    // Add classes to buttons
    $("#sendbtn").parent().addClass("sendBtn");
    $("[id*=btnGroupDrop]").parent().addClass("downloadBtn");
    $("read-in-browser").parent().addClass("readBtn");
    $("listen-in-browser").parent().addClass("listenBtn");
    $(".downloadBtn button:first").addClass("download-text");

    // Move all options in book details page to the same group
    $("[aria-label*='Delete book']")
        .prependTo('[aria-label^="Download, send"]')
        .children().removeClass("btn-sm");
    $(".custom_columns")
        .addClass(" btn-group")
        .attr("role", "group")
        .removeClass("custom_columns")
        .prependTo('[aria-label^="Download, send"]');
    $("#have_read_cb")
        .after('<label class="block-label readLbl" for="#have_read_cb"></label>');
    $("#have_read_form").next("p").remove();
    $("#have_read_form").next("p").remove();
    $("#archived_cb")
        .after('<label class="block-label readLbl" for="#archived_cb"></label>');
    $("#shelf-actions").prependTo('[aria-label^="Download, send"]');

    $(".more-stuff .col-sm-12 #back").hide()
/*        .html("&laquo; Previous")
        .addClass("page-link")
        .removeClass("btn btn-default")
        .prependTo('[aria-label^="Download, send"]');*/

    // Move dropdown lists higher in dom, replace bootstrap toggle with own toggle.
    $('ul[aria-labelledby="read-in-browser"]').insertBefore(".blur-wrapper").addClass("readinbrowser-drop");
    $('ul[aria-labelledby="listen-in-browser"]').insertBefore(".blur-wrapper").addClass("readinbrowser-drop");
    $('ul[aria-labelledby="send-to-kereader"]').insertBefore(".blur-wrapper").addClass("sendtoereader-drop");
    $(".leramslist").insertBefore(".blur-wrapper");
    $('ul[aria-labelledby="btnGroupDrop1"]').insertBefore(".blur-wrapper").addClass("leramslist");
    $("#add-to-shelves").insertBefore(".blur-wrapper");
    $("#back")
    $("#read-in-browser").click(function () {
        $(".readinbrowser-drop").toggle();
    });
    $("#listen-in-browser").click(function () {
        $(".readinbrowser-drop").toggle();
    });


    $(".downloadBtn").click(function () {
        $(".leramslist").toggle();
    });

    $("#sendbtn2").click(function () {
        $(".sendtoereader-drop").toggle();
    });


    $('div[aria-label="Add to shelves"]').click(function () {
        $("#add-to-shelves").toggle();
    });

    //Work to reposition dropdowns. Does not currently solve for
    //screen resizing
    function dropdownToggle() {
        var topPos = $(".book-meta > .btn-toolbar:first").offset().top;
        var windowWidth = $(window).width();

        function positionDropdown(trigger, dropdown) {
            if (trigger.length > 0) {
                var position = trigger.offset().left;
                if (position + dropdown.width() > windowWidth) {
                    var positionOff = position + dropdown.width() - windowWidth;
                    var newPosition = position - positionOff - 5;
                    dropdown.attr("style", "left: " + newPosition + "px !important; right: auto; top: " + topPos + "px");
                } else {
                    dropdown.attr("style", "left: " + position + "px !important; right: auto; top: " + topPos + "px");
                }
            }
        }

        positionDropdown($("#read-in-browser"), $(".readinbrowser-drop"));
        positionDropdown($("#sendbtn2"), $(".sendtoereader-drop"));
        positionDropdown($("#btnGroupDrop1"), $(".leramslist"));
        positionDropdown($('div[aria-label="Add to shelves"]'), $("#add-to-shelves"));
    }

    dropdownToggle();

    var resizeTimer;
    $(window).on("resize", function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            dropdownToggle();
        }, 250);
    });

// Clone book rating for mobile view.
    $(".book-meta > .bookinfo > .rating").clone().insertBefore(".book-meta > .description").addClass("rating-mobile");// Clone book rating for mobile view.
    $(".book-meta > .bookinfo > .rating").clone().insertBefore(".book-meta > .description").addClass("rating-mobile");
}

///////////////////////////////
// End of Book Details Work //
/////////////////////////////

/////////////////////////////////
//    Start of Global Work    //
///////////////////////////////

// Hide dropdown and collapse menus on click-off
$(document).mouseup(function (e) {
    var container = new Array();
    container.push($("ul[aria-labelledby=\"read-in-browser\"]"));
    container.push($(".sendtoereader-drop"));
    container.push($(".leramslist"));
    container.push($("#add-to-shelves"));
    container.push($(".navbar-collapse.collapse.in"));

    $.each(container, function (key, value) {
        if (!$(value).is(e.target) // if the target of the click isn't the container...
            && $(value).has(e.target).length === 0) // ... nor a descendant of the container
        {
            if ($(value).hasClass("dropdown-menu")) {
                $(value).hide();
            } else {
                if ($(value).hasClass("collapse")) {
                    $(value).collapse("toggle");
                }
            }
        }
    });
});

// Move create shelf
$("#nav_createshelf").prependTo(".your-shelves");

// Move About link it the profile dropdown
$(".profileDropli #top_user").parent().after($("#nav_about").addClass("dropdown"))

// Remove the modals except from some areas where they are needed
bodyClass = $("body").attr("class").split(" ");
modalWanted = ["admin", "editbook", "config", "uiconfig", "me", "edituser"];

if ($.inArray(bodyClass[0], modalWanted) != -1) {
} else {
    $(" a:not(.dropdown-toggle) ")
        .removeAttr("data-toggle", "data-target", "data-remote");
}


// Add classes to global buttons
$("#top_tasks").parent().addClass("top_tasks");
$("#top_admin").parent().addClass("top_admin");
$("#form-upload").parent().addClass("form-upload");
$("cwa-switch-theme").parent().addClass("cwa-switch-theme");
$("refresh-library").parent().addClass("refresh-library");

// Search button work
$("input#query").focus(function () {
    $('form[role="search"]').addClass("search-focus");
});
$("input#query").focusout(function () {
    setTimeout(function () {
        $('form[role="search"]').removeClass("search-focus");
    }, 100);
});

// Check if dropdown goes out of viewport and add class

$(document).on("click", ".dropdown-toggle", function () {
    // Add .offscreen if part of container not visible
    $(".dropdown-menu:visible").filter(function () {
        return $(this).visible() === false;
    }).each(function () {
        $(this).addClass("offscreen");
    });
});

// Collapse long text into read-more (responsive collapsed height)
(function(){
    function initCommentsReadmore(){
        var isMobile = $(window).width() <= 767;
        var collapsed = isMobile ? 350 : 134;
        var opts = {
            collapsedHeight: collapsed,
            heightMargin: 45,
            speed: 300,
            moreLink: '<a href="#">READ MORE</a>',    // ToDo: make translateable
            lessLink: '<a href="#">READ LESS</a>'     // ToDo: make translateable
        };
        $("div.comments").each(function(){
            var $el = $(this);
            var plugin = $el.data("plugin_readmore");
            if(plugin){
                // If current collapsedHeight differs, destroy and re-init
                if($el.data("collapsedHeight") !== collapsed){
                    $el.readmore('destroy');
                    $el.readmore(opts);
                }
            } else {
                $el.readmore(opts);
            }
        });
    }
    var lastIsMobile = null;
    $(function(){
        initCommentsReadmore();
        lastIsMobile = $(window).width() <= 767;
    });
    $(window).on('resize.readmoreBreakpoint', function(){
        var isMobile = $(window).width() <= 767;
        if(isMobile !== lastIsMobile){
            initCommentsReadmore();
            lastIsMobile = isMobile;
        }
    });
})();

/////////////////////////////////
//     End of Global Work     //
///////////////////////////////

// Search Results
if($("body.search").length > 0) {
  $('div[aria-label="Add to shelves"]').click(function () {
    $("#add-to-shelves").toggle();
  });
}

// Advanced Search Results
if($("body.advsearch").length > 0) {
  $("#loader + .container-fluid")
    .prepend("<div class='blur-wrapper'></div>");
  $("#add-to-shelves").insertBefore(".blur-wrapper");
  $('div[aria-label="Add to shelves"]').click(function () {
    $("#add-to-shelves").toggle();
  });
  $('#add-to-shelf').height("40px");
  function search_dropdownToggle() {
      if( $("#add-to-shelf").length) {
          topPos = $("#add-to-shelf").offset().top - 20;
      } else {
          topPos = 0
      }
      if ($('div[aria-label="Add to shelves"]').length > 0) {

          position = $('div[aria-label="Add to shelves"]').offset().left

          if (position + $("#add-to-shelves").width() > $(window).width()) {
              positionOff = position + $("#add-to-shelves").width() - $(window).width();
              adsPosition = position - positionOff - 5;
              $("#add-to-shelves").attr("style", "left: " + adsPosition + "px !important; right: auto;  top: " + topPos + "px");
          } else {
              $("#add-to-shelves").attr("style", "left: " + position + "px !important; right: auto;  top: " + topPos + "px");
          }
      }
  }

  search_dropdownToggle();

  $(window).on("resize", function () {
      search_dropdownToggle();
  });

}

// Author Page Background Blur
if ($("body.author").length > 0) {
    if ( $(window).width() >= 768 || $('body').hasClass('allow-mobile-blur') ) {
        cover = $(".author-bio img").attr("src");
        $("#loader + .container-fluid")
            .prepend('<div class="blur-wrapper"></div>');
        $(".blur-wrapper").prepend('<img loading="lazy" alt="Blurred author bio" class="bg-blur" src="' + cover + '">');
        // Place undefined cover images inside container
        if ($('.bg-blur[src="undefined"]').length > 0) {
            $(".bg-blur").before('<div class="bg-blur undefined-img"></div>');
            $("img.bg-blur").appendTo('.undefined-img');
        }
    }
}

// Split path name to array and remove blanks
url = window.location.pathname
// Ereader Page - add class to iframe body on ereader page after it loads.
backurl = "../../book/" + url[2]
$("body.epub #title-controls")
    .append('<div class="epub-back"><input action="action" onclick="location.href=backurl; return false;" type="button" value="Back" /></div>')

$("body.stat .col-sm-10 p:first").insertAfter("#libs");

// Check if link is external and force _blank attribute
$(function () { // document ready
    $("a").filter(function () {
        return this.hostname && this.hostname !== location.hostname;
    }).each(function () {
        $(this).addClass("external").attr("target", "_blank");
    });
});

// Check if lists are empty and add class to buttons
if ($.trim($("#add-to-shelves").html()).length === 0) {
    $("#add-to-shelf").addClass("empty-ul");
}

shelfLength = $("#add-to-shelves li").length;
emptyLength = 0;

$("#add-to-shelves").on("click", "li a", function () {
    console.log("#remove-from-shelves change registered");
    emptyLength++;

    setTimeout(function () {
        if (emptyLength >= shelfLength) {
            console.log("list is empty; adding empty-ul class");
            $("#add-to-shelf").addClass("empty-ul");
        } else {
            console.log("list is not empty; removing empty-ul class");
            $("#add-to-shelf").removeClass("empty-ul");
        }
    }, 100);
});

if ($.trim($('ul[aria-labelledby="read-in-browser"] li').html()).length === 0) {
    $("#read-in-browser").addClass("empty-ul");
}

// Shelf Buttons and Tooltips
if ($("body.shelf").length > 0) {
    $('div[data-target="#DeleteShelfDialog"]').
        before('<div class=".btn-group shelf-btn-group"></div>').
        appendTo(".shelf-btn-group").
        addClass("delete-shelf-btn");

    $('a[href*="edit"]').
        appendTo(".shelf-btn-group").
        addClass("edit-shelf-btn");

    $('a[href*="order"]').
        appendTo(".shelf-btn-group").
        addClass("order-shelf-btn");
    $(".delete-shelf-btn").attr({
        "data-toggle-two": "tooltip",
        "title": $(".delete-shelf-btn").text(),     // "Delete Shelf"
        "data-placement": "bottom"
    })
        .addClass("delete-btn-tooltip");

    $(".edit-shelf-btn").attr({
        "data-toggle-two": "tooltip",
        "title": $(".edit-shelf-btn").text(),       // "Edit Shelf"
        "data-placement": "bottom"
    })
        .addClass("edit-btn-tooltip");

    $(".order-shelf-btn").attr({
        "data-toggle-two": "tooltip",
        "title": $(".order-shelf-btn").text(),      //"Reorder Shelf"
        "data-placement": "bottom"
    })
        .addClass("order-btn-tooltip");
}

// Rest of Tooltips
$(".home-btn > a").attr({
    "data-toggle": "tooltip",
    "href": $(".navbar-brand")[0].href,
    "title": $(document.body).attr("data-text"),    // Home
    "data-placement": "bottom"
})
    .addClass("home-btn-tooltip");

$(".plexBack > a").attr({
    "data-toggle": "tooltip",
    "title": $(document.body).attr("data-textback"), // Back
    "data-placement": "bottom"
})
    .addClass("back-btn-tooltip");

$("#cwa-switch-theme").attr({
    "data-toggle": "tooltip",
    "title": $("#cwa-switch-theme").text(),              // "Switch Theme"
    "data-placement": "bottom",
    "data-viewport": "#main-nav"
})
    .addClass("switch-btn-tooltip");

$("#refresh-library").attr({
    "data-toggle": "tooltip",
    "title": $("#refresh-library").text(),              // "Refresh Library"
    "data-placement": "bottom",
    "data-viewport": "#main-nav"
})
    .addClass("refresh-lib-btn-tooltip");

$("#top_tasks").attr({
    "data-toggle": "tooltip",
    "title": $("#top_tasks").text(),              // "Tasks"
    "data-placement": "bottom",
    "data-viewport": "#main-nav"
})
    .addClass("tasks-btn-tooltip");

$("#top_admin").attr({
    "data-toggle": "tooltip",
    "title": $("#top_admin").attr("data-text"),     // Settings
    "data-placement": "bottom",
    "data-viewport": "#main-nav"
})
    .addClass("admin-btn-tooltip");

$(".profileDrop").attr({
    "title": $("#top_user").attr("data-text"),      //Account
    "data-placement": "bottom",
    "data-toggle-two": "tooltip",
    "data-viewport": "#main-nav"
})
    .addClass("send-btn-tooltip dropdown");

$("#btn-upload").attr({
    "data-toggle": "tooltip",
    "title": $("#btn-upload").parent().text(),     // "Upload"
    "data-placement": "bottom",
    "data-viewport": "#main-nav"
})
    .addClass("upload-btn-tooltip");

$("#add-to-shelf").attr({
    "data-toggle-two": "tooltip",
    "title": $("#add-to-shelf").text(),            // "Add to Shelf"
    "data-placement": "bottom",
    "data-viewport": ".btn-toolbar"
})
    .addClass("addtoshelf-btn-tooltip");

$("#have_read_cb").attr({
    "data-toggle": "tooltip",
    "title": $("#have_read_cb").attr("data-unchecked"),
    "data-placement": "bottom",
    "data-viewport": ".btn-toolbar"
})
    .addClass("readunread-btn-tooltip");

$("#have_read_cb:checked").attr({
    "data-toggle": "tooltip",
    "title": $("#have_read_cb").attr("data-checked"),
    "data-placement": "bottom",
    "data-viewport": ".btn-toolbar"
})
    .addClass("readunread-btn-tooltip");

$("#archived_cb").attr({
    "data-toggle": "tooltip",
    "title": $("#archived_cb").attr("data-unchecked"),
    "data-placement": "bottom",
    "data-viewport": ".btn-toolbar"
})
    .addClass("readunread-btn-tooltip");

$("#archived_cb:checked").attr({
    "data-toggle": "tooltip",
    "title": $("#archived_cb").attr("data-checked"),
    "data-placement": "bottom",
    "data-viewport": ".btn-toolbar"
})
    .addClass("readunread-btn-tooltip");

$("button#delete").attr({
    "data-toggle-two": "tooltip",
    "title": $("button#delete").text(),           //"Delete"
    "data-placement": "left",
    "data-viewport": ".btn-toolbar"
})
    .addClass("delete-book-btn-tooltip");

$("#have_read_cb").click(function () {
    if ($("#have_read_cb:checked").length > 0) {
        $(this).attr("data-original-title", $("#have_read_cb").attr("data-checked"));
    } else {
        $(this).attr("data-original-title", $("#have_read_cb").attr("data-unchecked"));
    }
});

$("#archived_cb").click(function () {
    if ($("#archived_cb:checked").length > 0) {
        $(this).attr("data-original-title", $("#archived_cb").attr("data-checked"));
    } else {
        $(this).attr("data-original-title", $("#archived_cb").attr("data-unchecked"));
    }
});

$('.btn-group[aria-label="Edit/Delete book"] a').attr({
    "data-toggle": "tooltip",
    "title": $("#edit_book").text(),               // "Edit"
    "data-placement": "bottom",
    "data-viewport": ".btn-toolbar"
})
    .addClass("edit-btn-tooltip");

$("#sendbtn").attr({
    "data-toggle": "tooltip",
    // Use provided data-text if present, otherwise fall back to visible button text
    "title": ($("#sendbtn").attr("data-text") || $.trim($("#sendbtn").text())),
    "data-placement": "bottom",
    "data-viewport": ".btn-toolbar"
})
    .addClass("send-btn-tooltip");

$("#sendbtn2").attr({
    "data-toggle-two": "tooltip",
    "title": $("#sendbtn2").text(),                 // "Send to eReader",
    "data-placement": "bottom",
    "data-viewport": ".btn-toolbar"
})
    .addClass("send-btn-tooltip");

$("#read-in-browser").attr({
    "data-toggle-two": "tooltip",
    "title": $.trim($("#read-in-browser").text()),
    "data-placement": "bottom",
    "data-viewport": ".btn-toolbar"
})
    .addClass("send-btn-tooltip");

// Ensure tooltip is initialized even though the button already uses data-toggle="dropdown"
$(function() {
    var $rib = $("#read-in-browser");
    if ($rib.length) {
        try {
            // Use body as viewport to avoid clipping/overlap from toolbar overlays
            $rib.tooltip({ container: "body", trigger: "hover", viewport: "body", placement: "bottom", title: $.trim($rib.text()) });
        } catch (e) { /* noop */ }
    }
});

// Initialize tooltip for single-format Read in Browser link
$(function() {
    var $rb = $("#readbtn");
    if ($rb.length) {
        try {
            $rb.tooltip({ container: "body", trigger: "hover", viewport: "body", placement: "bottom", title: $.trim($rb.attr("title") || $rb.text()) });
        } catch (e) { /* noop */ }
    }
});

$("#btnGroupDrop1").attr({
    "data-toggle-two": "tooltip",
    "title": $("#btnGroupDrop1").text(),
    "data-placement": "bottom",
    "data-viewport": ".btn-toolbar"
});

if ($("body.epub").length === 0) {
    $(document).ready(function () {
        $("[data-toggle='tooltip']").tooltip({container: "body", trigger: "hover"});
        $("[data-toggle-two='tooltip']").tooltip({container: "body", trigger: "hover"});
        $("#btn-upload").attr("title", " ");
    });


    $('[data-toggle-two="tooltip"]').click(function () {
        $('[data-toggle-two="tooltip"]').tooltip("hide");
    });

    $('[data-toggle="tooltip"]').click(function () {
        $('[data-toggle="tooltip"]').tooltip("hide");
    });
}

$("#read-in-browser a").attr("target", "");
$("#listen-in-browser a").attr("target", "");

if ($(".edit-shelf-btn").length > 1) {
    $(".edit-shelf-btn:first").remove();
}
if ($(".order-shelf-btn").length > 1) {
    $(".order-shelf-btn:first").remove();
}

$("#top_user > span.hidden-sm").clone().insertBefore(".profileDropli");
$(".navbar-collapse.collapse.in").before('<div class="sidebar-backdrop"></div>');

// Get rid of leading white space
recentlyAdded = $("#nav_new a:contains('Recently')").text().trim();
$("#nav_new a:contains('Recently')").contents().filter(function () {
    return this.nodeType === 3
}).each(function () {
    this.textContent = this.textContent.replace(" Recently Added", recentlyAdded);
});

// Change shelf textValue
shelfText = $(".shelf .discover h2:first").text().replace(":", " —").replace(/\'/g, "");
$(".shelf .discover h2:first").text(shelfText);

shelfText = $(".shelforder .col-sm-10 .col-sm-6.col-lg-6.col-xs-6 h2:first").text().replace(':', ' —').replace(/\'/g, "");
$(".shelforder .col-sm-10 .col-sm-6.col-lg-6.col-xs-6 h2:first").text(shelfText);


function mobileSupport() {
    var windowWidth = $(window).width();
    var sidebar = $(".row-fluid > .col-sm-2:first");
    var content = $(".col-sm-10:first");

    if (windowWidth <= 768) {
        if (!sidebar.hasClass("sidebar-collapsed")) {
            sidebar.addClass("sidebar-collapsed");
            content.addClass("content-expanded");
            sidebar.appendTo(".navbar-collapse.collapse:first");
            if ($(".sidebar-backdrop").length < 1) {
                $(".navbar-collapse.collapse:first").after("<div class='sidebar-backdrop'></div>");
            }
        }
    } else {
        if (sidebar.hasClass("sidebar-collapsed")) {
            sidebar.removeClass("sidebar-collapsed");
            content.removeClass("content-expanded");
            sidebar.insertBefore(content);
            $(".sidebar-backdrop").remove();
        }
    }
}

// LayerCake plug
if ($(" body.stat p").length > 0) {
    $(" body.stat p").append(" and <a href='https://github.com/leram84/layer.Cake/tree/master/caliBlur' target='_blank'>layer.Cake</a>");
    str = $(" body.stat p").html().replace("</a>.", "</a>");
    $(" body.stat p").html(str);
}
// Collect delete buttons in editbook to single dropdown
var deleteButtons = $(".editbook .text-center.more-stuff button[data-delete-format]").get();

if (deleteButtons.length > 0) {
    $(".editbook .text-center.more-stuff").prepend('<button id="deleteButton" type="button" class="btn btn-danger dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span class="glyphicon glyphicon-remove"></span>Delete Format<span class="caret"></span></button><ul class="dropdown-menu delete-dropdown"></ul>');

    $(deleteButtons).each(function() {
        var format = $(this).data('delete-format');
        var bookId = $(this).data('delete-id');
        // Rebuild the button as a link to fit in the dropdown list
        var listItem = '<li><a href="#" data-toggle="modal" data-delete-id="' + bookId + '" data-delete-format="' + format + '" data-target="#deleteModal">Delete - ' + format + '</a></li>';
        $(listItem).appendTo(".delete-dropdown");
        // Remove original button and its container
        $(this).closest('.form-group').remove();
    });
}

// Remove the now-empty "Delete formats:" heading if it exists
if ($(".editbook .text-center.more-stuff h4").length > 0 && deleteButtons.length > 0) {
    $(".editbook .text-center.more-stuff h4").remove();
}

// Turn off bootstrap animations
$(function () {
    $.support.transition = false;
})

/////////////////////////////////
// Direct Reading Functionality //
/////////////////////////////////

// Function to show page-level flash message (same as email_selection.js)
function showPageFlashMessage(message, type) {
    // Remove any existing flash messages
    $(".row-fluid.text-center").remove();
    $("#flash_danger").remove();
    $("#flash_success").remove();
    
    // Use same logic as handleResponse function
    var alertType = type === 'error' ? 'danger' : type;
    $(".navbar").after('<div class="row-fluid text-center">' +
        '<div id="flash_' + alertType + '" class="alert alert-' + alertType + '">' + message + '</div>' +
        '</div>');
}

// Handle clicks on book cover :before pseudo-elements for direct reading
$(function() {
    function initDirectReadingHandler() {
        // Remove any existing handlers first
        $('.book-cover-link').off('click.directReading mousemove.directReading mouseleave.directReading');
        $('.read-toggle-btn, .edit-metadata-btn, .send-ereader-btn').off('click.quickActions');
        
        // Check if device supports hover (not a touch device)
        var supportsHover = window.matchMedia('(hover: hover)').matches;
        var isDesktop = $(window).width() >= 768;
        
        // Only enable direct reading functionality on devices that support hover and are desktop sized
        if (supportsHover && isDesktop) {
            // Add quick action buttons to each book cover
            $('.book-cover-link').each(function() {
                var $link = $(this);
                
                // Add read status toggle button (only if it doesn't exist)
                if ($link.find('.read-toggle-btn').length === 0) {
                    var $readToggle = $('<div class="read-toggle-btn" title="Toggle Read Status"><span class="glyphicon glyphicon-eye-open"></span></div>');
                    $link.append($readToggle);
                }
                
                // Add edit metadata button (only if user has edit rights and button doesn't exist)
                if (window.cwaUserData && window.cwaUserData.canEditBooks && $link.find('.edit-metadata-btn').length === 0) {
                    var $editBtn = $('<div class="edit-metadata-btn" title="Edit Metadata"><span class="glyphicon glyphicon-pencil"></span></div>');
                    $link.append($editBtn);
                }
                
                // Add send to eReader button (only if it doesn't exist)
                if ($link.find('.send-ereader-btn').length === 0) {
                    var $sendBtn = $('<div class="send-ereader-btn" title="Send to eReader"><span class="glyphicon glyphicon-send"></span></div>');
                    $link.append($sendBtn);
                }
            });
            
            // Add direct click handlers for the action buttons
            $('.read-toggle-btn').on('click.quickActions', function(e) {
                e.preventDefault();
                e.stopPropagation();
                var $link = $(this).closest('.book-cover-link');
                handleReadStatusToggle($link);
            });
            
            $('.edit-metadata-btn').on('click.quickActions', function(e) {
                e.preventDefault();
                e.stopPropagation();
                var $link = $(this).closest('.book-cover-link');
                handleEditMetadata($link);
            });
            
            $('.send-ereader-btn').on('click.quickActions', function(e) {
                e.preventDefault();
                e.stopPropagation();
                var $link = $(this).closest('.book-cover-link');
                handleSendToEReader($link);
            });
            
            $('.book-cover-link').on('mousemove.directReading', function(e) {
                var $link = $(this);
                
                // Calculate if mouse is over any of the action areas
                var linkOffset = $link.offset();
                var mouseX = e.pageX - linkOffset.left;
                var mouseY = e.pageY - linkOffset.top;
                
                var linkWidth = $link.outerWidth();
                var linkHeight = $link.outerHeight();
                
                // Define the action areas
                var actionSize = 35;
                var margin = 8;
                
                // Center read icon (50px circle on desktop, 40px on smaller screens)
                var readIconSize = ($(window).width() >= 768) ? 50 : 40;
                var centerX = linkWidth / 2;
                var centerY = linkHeight / 2;
                var readIconRadius = readIconSize / 2;
                
                // Read toggle area (bottom-left)
                var readToggleX = margin + (actionSize / 2);
                var readToggleY = linkHeight - margin - (actionSize / 2);
                var readToggleRadius = actionSize / 2;
                
                // Send to eReader area (bottom-right)
                var sendEReaderX = linkWidth - margin - (actionSize / 2);
                var sendEReaderY = linkHeight - margin - (actionSize / 2);
                var sendEReaderRadius = actionSize / 2;
                
                // Edit metadata button (center-bottom)
                var editMetadataX = linkWidth / 2;
                var editMetadataY = linkHeight - margin - (actionSize / 2);
                var editMetadataRadius = actionSize / 2;
                
                // Calculate distances
                var distanceFromReadIcon = Math.sqrt(
                    Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2)
                );
                var distanceFromReadToggle = Math.sqrt(
                    Math.pow(mouseX - readToggleX, 2) + Math.pow(mouseY - readToggleY, 2)
                );
                var distanceFromEditMetadata = Math.sqrt(
                    Math.pow(mouseX - editMetadataX, 2) + Math.pow(mouseY - editMetadataY, 2)
                );
                var distanceFromSendEReader = Math.sqrt(
                    Math.pow(mouseX - sendEReaderX, 2) + Math.pow(mouseY - sendEReaderY, 2)
                );
                
                // Reset all hover states
                $link.removeClass('hovering-read-icon');
                $link.find('.read-toggle-btn').removeClass('hovering');
                $link.find('.edit-metadata-btn').removeClass('hovering');
                $link.find('.send-ereader-btn').removeClass('hovering');
                
                // Apply hover state based on position
                if (distanceFromReadIcon <= readIconRadius) {
                    $link.addClass('hovering-read-icon');
                } else if (distanceFromReadToggle <= readToggleRadius) {
                    $link.find('.read-toggle-btn').addClass('hovering');
                } else if (distanceFromEditMetadata <= editMetadataRadius) {
                    $link.find('.edit-metadata-btn').addClass('hovering');
                } else if (distanceFromSendEReader <= sendEReaderRadius) {
                    $link.find('.send-ereader-btn').addClass('hovering');
                }
            });
            
            $('.book-cover-link').on('mouseleave.directReading', function() {
                var $link = $(this);
                
                // Remove all hover states
                $link.removeClass('hovering-read-icon');
                $link.find('.read-toggle-btn').removeClass('hovering');
                $link.find('.edit-metadata-btn').removeClass('hovering');
                $link.find('.send-ereader-btn').removeClass('hovering');
            });
            
            $('.book-cover-link').on('click.directReading', function(e) {
                var $link = $(this);
                var $cover = $link.closest('.cover');
                
                // Check click position
                var linkOffset = $link.offset();
                var clickX = e.pageX - linkOffset.left;
                var clickY = e.pageY - linkOffset.top;
                
                var linkWidth = $link.outerWidth();
                var linkHeight = $link.outerHeight();
                
                // Define the action areas (same as mousemove)
                var actionSize = 35;
                var margin = 8;
                
                var readIconSize = ($(window).width() >= 768) ? 50 : 40;
                var centerX = linkWidth / 2;
                var centerY = linkHeight / 2;
                var readIconRadius = readIconSize / 2;
                
                var readToggleX = margin + (actionSize / 2);
                var readToggleY = linkHeight - margin - (actionSize / 2);
                var readToggleRadius = actionSize / 2;
                
                var sendEReaderX = linkWidth - margin - (actionSize / 2);
                var sendEReaderY = linkHeight - margin - (actionSize / 2);
                var sendEReaderRadius = actionSize / 2;
                
                // Edit metadata button (center-bottom)
                var editMetadataX = linkWidth / 2;
                var editMetadataY = linkHeight - margin - (actionSize / 2);
                var editMetadataRadius = actionSize / 2;
                
                var distanceFromReadIcon = Math.sqrt(
                    Math.pow(clickX - centerX, 2) + Math.pow(clickY - centerY, 2)
                );
                var distanceFromReadToggle = Math.sqrt(
                    Math.pow(clickX - readToggleX, 2) + Math.pow(clickY - readToggleY, 2)
                );
                var distanceFromEditMetadata = Math.sqrt(
                    Math.pow(clickX - editMetadataX, 2) + Math.pow(clickY - editMetadataY, 2)
                );
                var distanceFromSendEReader = Math.sqrt(
                    Math.pow(clickX - sendEReaderX, 2) + Math.pow(clickY - sendEReaderY, 2)
                );
                
                // Handle different click areas
                if (distanceFromReadIcon <= readIconRadius) {
                    // Direct reading functionality
                    e.preventDefault();
                    handleDirectReading($link);
                } else if (distanceFromReadToggle <= readToggleRadius) {
                    // Toggle read status
                    e.preventDefault();
                    handleReadStatusToggle($link);
                } else if (distanceFromEditMetadata <= editMetadataRadius) {
                    // Edit metadata
                    e.preventDefault();
                    handleEditMetadata($link);
                } else if (distanceFromSendEReader <= sendEReaderRadius) {
                    // Send to eReader
                    e.preventDefault();
                    handleSendToEReader($link);
                }
                // If click was not on any action area, let the normal link behavior proceed
            });
        }
    }
    
    function handleDirectReading($link) {
        var bookId = $link.data('book-id');
        var formatsStr = $link.data('book-formats');
        
        if (bookId && formatsStr) {
            var formats = formatsStr.toLowerCase().split(',').map(function(f) { 
                return f.trim(); 
            });
            
            var formatPriority = ['epub', 'pdf', 'txt', 'html', 'mobi', 'azw3', 'fb2'];
            var selectedFormat = null;
            
            for (var i = 0; i < formatPriority.length; i++) {
                if (formats.indexOf(formatPriority[i]) !== -1) {
                    selectedFormat = formatPriority[i];
                    break;
                }
            }
            
            if (!selectedFormat && formats.length > 0) {
                selectedFormat = formats[0];
            }
            
            if (selectedFormat) {
                window.open('/read/' + bookId + '/' + selectedFormat, '_blank');
            } else {
                window.location.href = $link.attr('href');
            }
        }
    }
    
    function handleReadStatusToggle($link) {
        var bookId = $link.data('book-id');
        if (!bookId) {
            console.error('Book ID not found');
            return;
        }
        
        // Show loading state
        var $readToggleBtn = $link.find('.read-toggle-btn');
        $readToggleBtn.addClass('loading');
        $readToggleBtn.find('.glyphicon').removeClass().addClass('glyphicon glyphicon-refresh');
        
        // Find the existing read badge
        var $readBadge = $link.find('.badge.read');
        var isCurrentlyRead = $readBadge.length > 0;
        
        $.ajax({
            url: '/ajax/toggleread/' + bookId,
            type: 'POST',
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            },
            success: function(response, textStatus, xhr) {
                console.log('Read status toggle successful');
                // Handle successful response - empty response means success
                if (xhr.status === 200) {
                    // Update the visual read badge immediately
                    if (isCurrentlyRead) {
                        // Remove read badge
                        $readBadge.remove();
                    } else {
                        // Add read badge
                        var $newBadge = $('<span class="badge read glyphicon glyphicon-ok"></span>');
                        $link.find('.img').append($newBadge);
                    }
                    
                    // Show success state
                    $readToggleBtn.addClass('success').removeClass('loading');
                    $readToggleBtn.find('.glyphicon').removeClass().addClass('glyphicon glyphicon-ok');
                    setTimeout(function() {
                        $readToggleBtn.removeClass('success');
                        $readToggleBtn.find('.glyphicon').removeClass().addClass('glyphicon glyphicon-eye-open');
                    }, 1000);
                }
            },
            error: function(xhr, textStatus, errorThrown) {
                console.error('Error toggling read status:', xhr.responseText || errorThrown);
                // Show error state
                $readToggleBtn.addClass('error').removeClass('loading');
                $readToggleBtn.find('.glyphicon').removeClass().addClass('glyphicon glyphicon-remove');
                setTimeout(function() {
                    $readToggleBtn.removeClass('error');
                    $readToggleBtn.find('.glyphicon').removeClass().addClass('glyphicon glyphicon-eye-open');
                }, 2000);
                
                // Try to show error message if available
                try {
                    var response = JSON.parse(xhr.responseText);
                    if (response.message) {
                        alert('Error: ' + response.message);
                    }
                } catch (e) {
                    // Not JSON, show generic error
                    alert('Error toggling read status. Please try again.');
                }
            }
        });
    }
    
    function handleSendToEReader($link) {
        var bookId = $link.data('book-id');
        var formatsStr = $link.data('book-formats');
        
        if (!bookId) {
            console.error('Book ID not found');
            return;
        }
        
        if (!formatsStr || formatsStr.length === 0) {
            alert('No formats available for this book');
            return;
        }
        
        // Check if user has email configured
        if (!window.cwaUserData || !window.cwaUserData.primaryEmail) {
            alert('Please configure your eReader email address in your profile settings.');
            return;
        }
        
        // Show loading state
        var $sendBtn = $link.find('.send-ereader-btn');
        $sendBtn.addClass('loading');
        $sendBtn.find('.glyphicon').removeClass().addClass('glyphicon glyphicon-refresh');
        
        // Get the best format for sending (prefer epub, then pdf, then others)
        var formats = formatsStr.toLowerCase().split(',').map(function(f) { 
            return f.trim(); 
        });
        
        var sendFormatPriority = ['epub', 'pdf', 'mobi', 'azw3', 'azw'];
        var selectedFormat = null;
        
        for (var i = 0; i < sendFormatPriority.length; i++) {
            if (formats.indexOf(sendFormatPriority[i]) !== -1) {
                selectedFormat = sendFormatPriority[i];
                break;
            }
        }
        
        if (!selectedFormat && formats.length > 0) {
            selectedFormat = formats[0];
        }
        
        if (!selectedFormat) {
            alert('No compatible format found for sending to eReader');
            $sendBtn.removeClass('loading');
            return;
        }
        
        // Use /send_selected endpoint but only send to primary email
        $.ajax({
            url: '/send_selected/' + bookId,
            type: 'POST',
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            },
            data: {
                'csrf_token': $('input[name="csrf_token"]').val() || '',
                'selected_emails': window.cwaUserData.primaryEmail,
                'book_format': selectedFormat.toUpperCase(),
                'convert': 0
            },
            success: function(response, textStatus, xhr) {
                console.log('Send to eReader successful');
                // Show success state
                $sendBtn.addClass('success').removeClass('loading');
                $sendBtn.find('.glyphicon').removeClass().addClass('glyphicon glyphicon-ok');
                setTimeout(function() {
                    $sendBtn.removeClass('success');
                    $sendBtn.find('.glyphicon').removeClass().addClass('glyphicon glyphicon-send');
                }, 1000);
                
                // Show success message if available
                if (response && response.length > 0 && response[0].message) {
                    // Use the proper flash notification system
                    showPageFlashMessage(response[0].message, 'success');
                }
            },
            error: function(xhr, textStatus, errorThrown) {
                console.error('Error sending to eReader:', xhr.responseText || errorThrown);
                // Show error state
                $sendBtn.addClass('error').removeClass('loading');
                $sendBtn.find('.glyphicon').removeClass().addClass('glyphicon glyphicon-remove');
                setTimeout(function() {
                    $sendBtn.removeClass('error');
                    $sendBtn.find('.glyphicon').removeClass().addClass('glyphicon glyphicon-send');
                }, 2000);
                
                // Try to show more specific error message
                var errorMessage = 'Error sending to eReader. Please check your configuration and ensure you have email addresses set up.';
                try {
                    var response = JSON.parse(xhr.responseText);
                    if (response && response.length > 0 && response[0].message) {
                        errorMessage = response[0].message;
                    }
                } catch (e) {
                    // Not JSON, use default message
                }
                alert(errorMessage);
            }
        });
    }
    
    function handleEditMetadata($link) {
        var bookId = $link.data('book-id');
        
        if (!bookId) {
            console.error('No book ID found for edit metadata action');
            return;
        }
        
        // Navigate to the edit page in the same tab
        var editUrl = '/admin/book/' + bookId;
        window.location.href = editUrl;
    }
    
    // Initialize on page load
    initDirectReadingHandler();
    
    // Re-initialize on window resize with debouncing
    var resizeTimer;
    $(window).on('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            initDirectReadingHandler();
        }, 250);
    });
});

/////////////////////////////////
// End Direct Reading Functionality //
/////////////////////////////////

mobileSupport();

// Only call function once resize is complete
var resizeTimerMobile;
$(window).on("resize", function () {
    clearTimeout(resizeTimerMobile);
    resizeTimerMobile = setTimeout(function() {
        mobileSupport();
    }, 250);
});
