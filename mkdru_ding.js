// Wrapper for jQuery
(function($) {
  var mkdru_ding = {};

  Drupal.theme.prototype.mkdruFacetContainer = function(facetsCfg) {
    var fs = [];
    for (var fname in facetsCfg) {
      facetsCfg[fname].originalKey = fname;
      fs.push(facetsCfg[fname]);
    }
    fs.sort(function(a, b) {
      return a.orderWeight - b.orderWeight;
    });
    var html = '<h2>Facet browser</h2><div class="content">';
    for (var i = 0; i < fs.length; i++) {
      var f = fs[i];
      //not display
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

  mkdru_ding.populateFacetContainer = function() {
    $(Drupal.settings.dingFacetBrowser.mainElement).html(Drupal.theme('mkdruFacetContainer', mkdru.facets));
  };

  // sometimes/browsers defer won't work and we need to have mkdru call us back
  if (mkdru.pz2) {
    mkdru_ding.populateFacetContainer();
  } else {
    mkdru.callbacks.push(mkdru_ding.populateFacetContainer);
  }

  $(document).ready(function() {
    // Set dropdown selected options, if url component has sort vaue.
    var sort_preg = new RegExp(/sort=(.+[0-1])&/);
    var sort = window.location.hash.match(sort_preg);

    if (sort && sort[1]) {
      var ele = decodeURIComponent(sort[1]);
      $('.mkdru-sorting select option[value="' + ele + '"]').attr('selected', 'selected');
    }
  });

  /**
   * Respond to sort value change.
   */
  $('.mkdru-sorting select').live('change', function() {
    var sort = $(this).attr('value');
    var location = window.location;
    var new_sort = 'sort=' + sort;
    var sort_preg = new RegExp(/sort=(.+[0-1])&/);

    // Make the needed changes in browser url.
    if (location.hash.match(sort_preg)) {
      var hash = location.hash.replace(sort_preg, new_sort + '&');
      location.hash = hash;
    }
    else {
      location.hash = new_sort + '&' + location.hash.replace('#', '');
    }

    // Let Mkdru know of new search params and trigger search.
    mkdru.defaultState.sort = sort;
    mkdru.state.sort = sort;
    mkdru.search();

    window.location = location.hash;

    return false;
  });

})(jQuery);
