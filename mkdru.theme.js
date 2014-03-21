Drupal.theme.mkdruShowFullDescr = function(id) {
  document.getElementById("short_"+id).style.display = 'none';
  document.getElementById("full_"+id).style.display = 'block';
};
Drupal.theme.mkdruShowShortDescr = function(id) {
  document.getElementById("short_"+id).style.display = 'block';
  document.getElementById("full_"+id).style.display = 'none';
};
Drupal.theme.mkdruTruncateDescr = function(desc,length) {
  var s=desc.substr(0,length);
  return s.substr(0,s.lastIndexOf(' '));
};
Drupal.theme.mkdruSafeTrim = function(s) {
  if(s.trim) return s.trim();
  if(s.replace) return s.replace(/^\s+|\s+$/g,"");
  // argh
  if(console && console.log) console.log("String object doesn't even have replace() ??");
  return s;
};

Drupal.theme.mkdruResult = function(hit, num, detailLink) {
  var link = true;//choose_url(hit);
  var recid = new MkdruRecid(hit.recid[0]);
  var basePath=Drupal.settings.basePath;
  var specific_author_field="";
  var specific_subject_field="";
  if(mkdru.settings) {
    if(mkdru.settings.specific_author_field) specific_author_field=mkdru.settings.specific_author_field+'=';
    if(mkdru.settings.specific_subject_field) specific_subject_field=mkdru.settings.specific_subject_field+'=';
  }

  if (!link) link = choose_url(hit['location'][0]);
  var html = "";
  html += '<li class="mkdru search-result" id="' + recid.toHtmlAttr() + '" >';

  if(hit['md-medium']) {
    var status = {
      'available': true,
      'reservable': false,
      toCSSClass: function() {
        return (this.available ? ' available' : '')
          + (this.reservable ? ' reservable' : '');
      }
    };
    if (hit.location != undefined) {
      jQuery.each(hit.location, function(i, e){
        if (e['md-locallocation'] == undefined) {
          return;
        }
        jQuery.each(e['md-locallocation'], function(ii){
          if (typeof(e['md-publicnote']) != 'undefined' && e['md-publicnote'][ii] == 'CHECK SHELF') {
            status.reservable = true;
          }
        });
        html += '</table>';
      });
    }

    html += '<div class="availability' + status.toCSSClass() + '">' + hit['md-medium'] + '</div>';
  }

  html += '<h3 class="title">';
  if (link) html += '<span data-href="'+link+'" onclick="javascript:bindMkdruDetailsHandler(\''+hit.recid[0]+'\');">';
  html += hit["md-title"];
  if (link) html += '</span>';
  html += '</h3>';

  html += '<div class="search-snippet-info">' +
      '<p class="search-snippet"></p>' +
      '<div class="ting-object clearfix">' +
       '<div class="ting-overview clearfix">' +
         '<div class="left-column left">' +
           '<div class="picture"></div>' +
         '</div>' +
         '<div class="right-column left">';

  if (hit["md-author"]) {
    // expand on ; and reprint in the same form
    var authors = hit["md-author"][0].split(';');
    html += '<div class="creator"><span class="byline">' + Drupal.t('By') + ' </span>';
    for(var i=0; i<authors.length-1; i++) {
      html+='<a class="author" href="'+basePath+'search/meta/'+specific_author_field+Drupal.theme.mkdruSafeTrim(authors[i])+'">'+authors[i]+'</a> ;';
    }
    html+='<a class="author" href="'+basePath+'search/meta/'+specific_author_field+Drupal.theme.mkdruSafeTrim(authors[authors.length-1])+'">'+authors[authors.length-1]+'</a>';
    if (hit['md-date']) {
      html += '<span class="date"> ('+hit['md-date']+')</span>';
    }
    html += '</div><p></p>';
  }
  var dhit=hit['location'][0];
  if (dhit["md-journal-subpart"]) {
    html += '<div class="mkdru-result-journal-subpart">'+dhit["md-journal-subpart"];
    html += '</div><p/>';
  } else if (hit["md-journal-title"]) {
    html += '<div class="mkdru-result-journal">'+hit["md-journal-title"];
    html += '</div><p/>';
  }
  if (dhit["md-subject"] && dhit["md-subject"].length > 0) {
    html+='<div class="mkdru-result-subject"><p>';
    for(var i=0; i<dhit["md-subject"].length-1; i++) {
       html+='<a href="'+basePath+'search/meta/'+specific_subject_field+dhit["md-subject"][i]+'">'+dhit["md-subject"][i]+'</a> ; ';
    }
    html+='<a href="'+basePath+'search/meta/'+specific_subject_field+dhit["md-subject"][dhit["md-subject"].length-1]+'">'+dhit["md-subject"][dhit["md-subject"].length-1]+'</a></p></div>';
  }
  html += "</div>";
  if (hit["md-description"]) {
    // limit description to 600 characters
    var d=hit["md-description"].join(' ');
    var recid=hit.recid;
    html+='<span class="mkdru-result-description">';
    if (d.length < 620) {
      html+='<div style="margin: 10px 0">'+d+'</div>';
    } else {
      html += '<div id="full_' +recid+'" style="display:none">'+
              d +'<a href="javascript:Drupal.theme.mkdruShowShortDescr(\''+recid+'\')"> <i>less</i></a></div>';
      html += '<div id="short_'+recid+'" style="display:block">'+
              Drupal.theme.mkdruTruncateDescr(d,600) +
                '<a href="javascript:Drupal.theme.mkdruShowFullDescr(\''+recid+'\')"> <i>more</i></a></div>';
    }
    html+='</span>';
  }

  jQuery.each(hit.location, function(i, e){
    if (e['md-locallocation'] != undefined) {
      html += '<table>';
      jQuery.each(e['md-locallocation'], function(ii){
        html += '<tr>';
        var locallocation = e['md-locallocation'][ii].split(':');
        var note = '';
        if (typeof(e['md-publicnote']) != 'undefined' && typeof(e['md-publicnote'][ii]) != 'undefined') {
          note = e['md-publicnote'][ii];
        }
        html += '<td>' + locallocation.shift() + '</td>';
        html += '<td>' + locallocation.join(':') + '</td>';
        html += '<td>' + e['md-callnumber'][ii] + '</td>';
        html += '<td>' + note + '</td>';
        html += '</tr>';
      });
      html += '</table>';
    }
  });

  html += '</div>';
  html += '</div>';
  html += '</div>';
  var id = hit.location[0]['md-id'];
  html += '<button class="mkopac-reserve-button" data-id="'+id+'">Reserve</button>'
  html += '</li>';
  return html;
};

Drupal.theme.mkdruFacetContainer = function (facetsCfg) {
  var fs = [];
  for (var fname in facetsCfg) {
    facetsCfg[fname].originalKey = fname;
    fs.push(facetsCfg[fname]);
  }
  fs.sort(function (a,b) { return a.orderWeight - b.orderWeight; });
  var html = '<h2>' + Drupal.t('Facet browser') + '</h2><div class="content">';
  for (var i=0; i<fs.length; i++) {
    var f = fs[i];
    //not display
    html += '<div id="mkdru-container-'+f.originalKey +
      '" style="display: none;">';
    html += '<fieldset class="form-wrapper">';
    html += '<legend><span class="fieldset-legend">'+f.displayName +'</span></legend>';
    html += '<div class="fieldset-wrapper">';
    html += '<div class="mkdru-facet-'+f.originalKey+' form-checkboxes"/>';
    html += '</div>';
    html += '</fieldset>';
    html += '</div>';
  }
  html += '</div>';
  return html;
};

Drupal.theme.mkdruFacet = function (terms, facet, max, selections) {
  jQuery('#mkdru-container-'+facet).hide();
  var html = "";
  var show = false;
  for (var i = 0; i < terms.length && i < max; i++ ) {
    show = true;
    var term = terms[i];
    var id = facet + "-" + term.name.split(/w+/).join("-").toLowerCase();
    html += '<div class="form-item form-type-checkbox ' + (term.selected ? ' active-field' : '') + '">';
    html += '<input type="checkbox" id="'+id+'" onclick="window.location=\'' +term.toggleLink+'\'; return true;" class="form-checkbox"';
    if (term.selected) html += ' checked="checked"';
    html += '/><label class="option" for="'+id+'">' + term.name.replace('/', ' / ');
    if (term.freq) {
      html += '<span>&nbsp;('+term.freq+')</span>';
    }
    html += '</label></div>';
  }
  if (terms.length === 0 && selections && selections.length) {
    for (var i=0; i<selections.length; i++) {
      show = true;
      if (selections[i]) {
        // since we have no target name (only id) go for the basename
        // FIXME get the proper target name
        var name = facet == "source" ? selections[i].replace(/.*[\/\\]/, "").replace(/\?.*/, '') : selections[i];
        html += '<div class="form-item form-type-checkbox">';
        html += '<input type="checkbox" checked="checked" id="'+name+'" ' +
          'onclick="window.location=\''+mkdru.removeLimit(facet, selections[i]) +
          '\';return true;" class="form-checkbox"/><label class="option" for="' +
          name+'">' + name.replace('/', ' / ') + '</a></label></div>';
      }
    }
  }
  if (show) jQuery('#mkdru-container-'+facet).show();
  return html;
};

Drupal.theme.mkdruDetails = function (data) {
  var html = '<div class="details" title="'+data['md-title']+'"><table width="100%">';
  var _values_stack = [];
  var render_field = function(field, value) {
    if (!value || value == 'PAZPAR2_NULL_VALUE' || value[0] == 'PAZPAR2_NULL_VALUE') {
      return '';
    }

    // skip fields without "md-" prefix
    if (field.substring(0, 3) != 'md-' && i != 'location') {
      return '';
    }

    // skip already shown fields
    if (jQuery.inArray(field, ['md-author', 'md-title', 'md-date', 'md-medium', 'md-description','md-callnumber','md-publicnote','md-locallocation']) != -1) {
      return '';
    }

    // eliminate dublicates
    if (jQuery.inArray(field, _values_stack) != -1) {
      return '';
    }
    _values_stack.push(field);

    var _field = field.replace(/md-/, '').replace('-', ' ');
    var show_field = _field.charAt(0).toUpperCase() + _field.slice(1);

    return '<tr><td style="white-space:nowrap"><b>' + show_field + ': </b></td><td>' + value + '</td></tr>';
  }

  jQuery.each(data, function(i, e){
    if (i == "location") {
      jQuery.each(e[0], function(ii, ee){
        html += render_field(ii, ee);
      });
    } else {
      html += render_field(i, e);
    }
  });

  html += '</table></div>';

  return html;
}

// Mkdru record id wrapper.
function MkdruRecid(recid) {
  this.recid = recid;
  this.toHtmlAttr = function () {
    return this.recid.replace(/[\s\:]+/g, '_');
  };
}

// Open details box.
function bindMkdruDetailsHandler(recid) {
  // Try to close details box if it open.
  if (closeDetailsBox(recid)) {
    return;
  }

  // Are details already loading?
  if (jQuery('.mkdru-details-loader').length) {
    return;
  }

  var selector = jQuery('#' + (new MkdruRecid(recid)).toHtmlAttr());
  var loader = jQuery('<img class="mkdru-details-loader" src="http://www.netgem.com/images/ajax-loader.gif">');
  jQuery('.title', selector).append(loader);

  // Hide all other details boxes if any.
  jQuery.each(jQuery('.mkdru-result.details'), function(i, e) {
    closeDetailsBox(jQuery(this).prev().attr('id'));
    jQuery(this).remove();
  });

  // Clear mkdru handler and set own.
  jQuery(document).unbind('mkdru.onrecord');
  jQuery(document).bind('mkdru.onrecord', function(event, data) {
    var selector = jQuery('#' + (new MkdruRecid(data.recid[0])).toHtmlAttr());

    clearTimeout(mkdru.pz2.showTimer);
    jQuery('.mkdru-details-loader, .mkdru-result.details').remove();

    var details = jQuery(Drupal.theme('mkdruDetails', data))
      .appendTo(selector)
      .dialog({ width: 500 });

    details.find('.e-close').click(function () {
      closeDetailsBox(recid);
    });

    selector.addClass('open');

    // Copy external links from album to each track.
    jQuery('.external a', selector).clone().appendTo(jQuery('.b-data.external', details));

    // Scroll to details.
    var offset = details.offset();
    if (offset) {
      jQuery('html, body').animate({
        scrollTop: offset.top-70,
        scrollLeft: offset.left
      });
    }

    mkdru.pz2.errorHandler = null;
    clearTimeout(mkdru.pz2.recordTimer);
  });

  // Call to pz webservice.
  mkdru.pz2.errorHandler = function (e) {
    jQuery(e).dialog();
  };
  mkdru.pz2.record(recid);
};

// Close details box.
function closeDetailsBox(recid) {
  var row = jQuery('#' + (new MkdruRecid(recid)).toHtmlAttr());
  var details = row.next();
  if (details.hasClass('mkdru-result details')) {
    details.remove();
    row.removeClass('open');
    return true;
  }
  return false;
}
