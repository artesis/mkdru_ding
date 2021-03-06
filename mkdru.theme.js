"use strict";

Drupal.theme.mkdruShowFullDescr = function(id) {
  document.getElementById("short_" + id).style.display = 'none';
  document.getElementById("full_" + id).style.display = 'block';
};
Drupal.theme.mkdruShowShortDescr = function(id) {
  document.getElementById("short_" + id).style.display = 'block';
  document.getElementById("full_" + id).style.display = 'none';
};
Drupal.theme.mkdruTruncateDescr = function(desc, length) {
  var s = desc.substr(0, length);
  return s.substr(0, s.lastIndexOf(' '));
};
Drupal.theme.mkdruSafeTrim = function(s) {
  if (s.trim) {
    return s.trim();
  }
  if (s.replace) {
    return s.replace(/^\s+|\s+$/g, "");
  }
  // argh
  if (console && console.log) {
    console.log("String object doesn't even have replace() ??");
  }
  return s;
};

Drupal.theme.mkdruResult = function(hit) {
  var link = choose_url(hit);
  var basePath = Drupal.settings.basePath;
  var specific_author_field = "";
  var specific_subject_field = "";
  if (mkdru.settings) {
    if (mkdru.settings.specific_author_field) {
      specific_author_field = mkdru.settings.specific_author_field + '=';
    }
    if (mkdru.settings.specific_subject_field) {
      specific_subject_field = mkdru.settings.specific_subject_field + '=';
    }
  }

  if (!link) {
    link = choose_url(hit['location'][0]);
  }
  var html = "";
  html += '<li class="search-result" id="rec_' + hit.recid + '" >' + '<h3 class="title">';
  if (link) {
    html += '<a href="' + link + '" target="_blank" >';
  }
  html += hit["md-title"];
  if (link) {
    html += '</a>';
  }
  if (hit['location'][0]['md-medium']) {
    html += " (" + hit['location'][0]['md-medium'] + ")";
  }
  html += '</h3>';
  html += '<div class="search-snippet-info">' + '<p class="search-snippet"></p>' + '<div class="ting-object clearfix">' + '<div class="ting-overview clearfix">' + '<div class="left-column left">' + '<div class="picture"></div>' + '</div>' + '<div class="right-column left">';
  if (hit["md-author"]) {
    // expand on ; and reprint in the same form
    var authors = hit["md-author"][0].split(';');
    html += '<div class="creator"><span class="byline">' + Drupal.t('By') + ' </span>';
    for (var i = 0; i < authors.length - 1; i++) {
      html += '<a class="author" href="' + basePath + 'search/meta/' + specific_author_field + Drupal.theme.mkdruSafeTrim(authors[i]) + '">' + authors[i] + '</a> ;';
    }
    html += '<a class="author" href="' + basePath + 'search/meta/' + specific_author_field + Drupal.theme.mkdruSafeTrim(authors[authors.length - 1]) + '">' + authors[authors.length - 1] + '</a>';
    if (hit['md-date']) {
      html += '<span class="date"> (' + hit['md-date'] + ')</span>';
    }
    html += '</div><p></p>';
  }
  var dhit=hit['location'][0];
  if (dhit["md-citation"]) {
    html += '<div class="mkdru-result-citation">'+dhit["md-citation"];
    html += '</div><p/>';
  }
  else if (hit["md-journal-title"]) {
    html += '<div class="mkdru-result-journal">' + hit["md-journal-title"];
    html += '</div><p/>';
  }
  if (dhit["md-subject"] && dhit["md-subject"].length > 0) {
    html += '<div class="mkdru-result-subject"><p>';
    for (var i = 0; i < dhit["md-subject"].length - 1; i++) {
      html += '<a href="' + basePath + 'search/meta/' + specific_subject_field + dhit["md-subject"][i] + '">' + dhit["md-subject"][i] + '</a> ; ';
    }
    html += '<a href="' + basePath + 'search/meta/' + specific_subject_field + dhit["md-subject"][dhit["md-subject"].length - 1] + '">' + dhit["md-subject"][dhit["md-subject"].length - 1] + '</a></p></div>';
  }
  html += "</div>";
  if (hit["md-description"]) {
    // limit description to 600 characters
    var d = hit["md-description"][0];
    var recid = hit.recid;
    html += '<span class="mkdru-result-description">';
    if (d.length < 620) {
      html += '<div>' + d + '</div>';
    }
    else {
      html += '<div id="full_' + recid + '" style="display:none">' + d + '<a href="javascript:Drupal.theme.mkdruShowShortDescr(\'' + recid + '\')"> <i>less</i></a></div>';
      html += '<div id="short_' + recid + '" style="display:block">' + Drupal.theme.mkdruTruncateDescr(d, 600) + '<a href="javascript:Drupal.theme.mkdruShowFullDescr(\'' + recid + '\')"> <i>more</i></a></div>';
    }
    html += '</span>';
  }
  html += '<div class="export-to-ris"><a href="/service-proxy/?command=exportrecords&action=getfile&source=show&output=ris&windowid=cookie-agreed&id=' + hit.recid + '">' + Drupal.t('Export to RIS') + '</div>';
  html += '</div>';
  html += '</div>';
  html += '</div>';
  html += '</li>';
  return html;
};

Drupal.theme.mkdruFacetContainer = function(facetsCfg) {
  var fs = [];
  for ( var fname in facetsCfg) {
    facetsCfg[fname].originalKey = fname;
    fs.push(facetsCfg[fname]);
  }
  fs.sort(function(a, b) {
    return a.orderWeight - b.orderWeight;
  });

  // Keep facet browser title.
  var title = 'Facet browser';
  var originalTitle = jQuery(Drupal.settings.dingFacetBrowser.mainElement);
  if (originalTitle.length > 0) {
    title = originalTitle.find('h2').text();
  }

  var html = '<h2>' + title + '</h2><div class="content">';
  for (var i = 0; i < fs.length; i++) {
    var f = fs[i];
    // not display
    html += '<div id="mkdru-container-' + f.originalKey + '" style="display: none;">';
    html += '<fieldset class="form-wrapper">';
    html += '<legend><span class="fieldset-legend">' + f.displayName + '</span></legend>';
    html += '<div class="fieldset-wrapper">';
    html += '<div class="mkdru-facet-' + f.originalKey + ' form-checkboxes"/>';
    html += '</div>';
    html += '</fieldset>';
    html += '</div>';
  }
  html += '</div>';
  return html;
};

Drupal.theme.mkdruFacet = function(terms, facet, max, selections) {
  jQuery('#mkdru-container-' + facet).hide();
  var html = "";
  var show = false;
  for (var i = 0; i < terms.length && i < max; i++) {
    show = true;
    var term = terms[i];
    var id = term.name.split(/w+/).join("-").toLowerCase();
    html += '<div class="form-item form-type-checkbox">';
    html += '<input type="checkbox" id="' + id + '" onclick="window.location=\'' + term.toggleLink + '\'; return true;" class="form-checkbox"';
    if (term.selected) {
      html += ' checked="checked"';
    }
    html += '/><label class="option" for="' + id + '">' + term.name.replace('/', ' / ');
    html += '<span>&nbsp;(' + term.freq + ')</span></label></div>';
  }
  if (terms.length === 0 && selections && selections.length) {
    for (var i = 0; i < selections.length; i++) {
      show = true;
      if (selections[i]) {
        // since we have no target name (only id) go for the basename
        // FIXME get the proper target name
        var name = facet === "source" ? selections[i].replace(/.*[\/\\]/, "").replace(/\?.*/, '') : selections[i];
        html += '<div class="form-item form-type-checkbox">';
        html += '<input type="checkbox" checked="checked" id="' + name + '" ' + 'onclick="window.location=\'' + mkdru.removeLimit(facet, selections[i]) + '\';return true;" class="form-checkbox"/><label class="option" for="' + name + '">' + name.replace('/', ' / ') + '</a></label></div>';
      }
    }
  }
  if (show) {
    jQuery('#mkdru-container-' + facet).show();
  }
  return html;
};

Drupal.theme.mkdruCounts = function(first, last, available, total) {
  var result = Drupal.theme.prototype.mkdruCounts(first, last, available, total);
  // Hide all counters except first when we have no results.
  if (last === 0) {
    jQuery('.mkdru-counts:not(:first)').hide();
  }
  // Show all counters.
  else {
    jQuery('.mkdru-counts').show();
  }
  return result;
};
