  /*============================================================================
    Swatch options - second and third swatch 'sold-out' will update based on availability of previous options selected
  ==============================================================================*/
  Shopify.optionsMap = {};
  Shopify.updateOptionsInSelector = function(selectorIndex, parent) {
    switch (selectorIndex) {
      case 0:
        var key = 'root';
        var selector = $(parent + ' .single-option-selector:eq(0) input');
        break;
      case 1:
        var key = $(parent + ' .single-option-selector:eq(0) input:checked').val();
        var selector = $(parent + ' .single-option-selector:eq(1) input');
        break;
      case 2:
        var key = $(parent + ' .single-option-selector:eq(0) input:checked').val();
        key += ' / ' + $(parent + ' .single-option-selector:eq(1) input:checked').val();
        var selector = $(parent + ' .single-option-selector:eq(2) input');
    }
    var availableOptions = Shopify.optionsMap[key];
    console.log(key,availableOptions);
    $(parent + ' .swatch[data-option-index="' + selectorIndex + '"] .swatch-element').each(function() {
      //console.log(this);
      if ($.inArray($(this).attr('data-value'), availableOptions) !== -1) {
        $(this).removeClass('soldout').find(':radio').removeAttr('disabled','disabled').removeAttr('checked');
      }
      else {
        $(this).addClass('soldout').find(':radio').removeAttr('checked').attr('disabled','disabled');
      }
    });
  };
  Shopify.linkOptionSelectors = function(product, parent) {
      // Building our mapping object.
    console.log(product);
      
      for (var i=0; i<product.variants.length; i++) {
        var variant = product.variants[i];
        if (variant.available) {
          // Gathering values for the 1st drop-down.
          Shopify.optionsMap['root'] = Shopify.optionsMap['root'] || [];
          Shopify.optionsMap['root'].push(variant.option1);
          Shopify.optionsMap['root'] = Shopify.uniq(Shopify.optionsMap['root']);
          // Gathering values for the 2nd drop-down.
          if (product.options.length > 1) {
            var key = variant.option1;
            Shopify.optionsMap[key] = Shopify.optionsMap[key] || [];
            Shopify.optionsMap[key].push(variant.option2);
            Shopify.optionsMap[key] = Shopify.uniq(Shopify.optionsMap[key]);
          }
          // Gathering values for the 3rd drop-down.
          if (product.options.length === 3) {
            var key = variant.option1 + ' / ' + variant.option2;
            Shopify.optionsMap[key] = Shopify.optionsMap[key] || [];
            Shopify.optionsMap[key].push(variant.option3);
            Shopify.optionsMap[key] = Shopify.uniq(Shopify.optionsMap[key]);
            
          }
        }
        
      }
      console.log(Shopify.optionsMap);
      // Update options right away.
      Shopify.updateOptionsInSelector(0, parent);
      if (product.options.length > 1) Shopify.updateOptionsInSelector(1, parent);
      if (product.options.length === 3) Shopify.updateOptionsInSelector(2, parent);
      // When there is an update in the first dropdown.
      $(parent + " .single-option-selector:eq(0) input").change(function() {
        Shopify.updateOptionsInSelector(1, parent);
        if (product.options.length === 3) Shopify.updateOptionsInSelector(2, parent);
        return true;
      });
      // When there is an update in the second dropdown.
      $(parent + " .single-option-selector:eq(1) input").change(function() {
        if (product.options.length === 3) Shopify.updateOptionsInSelector(2, parent);
        return true;
      });
  };
    
    if ($('.product-single').length){
      var $productForms = $('.product-single').find('.product_form');
      //$productForms.addClass('is-visible');
      //Loop through each product and set the initial option value state
      $productForms.each(function(){
        var JSONData = $(this).data('product');
        var productID = $(this).data('product-id');
        var productSection = '.product-single';
        var swatchOptions = $(this).find('.swatch_options .swatch');
        if (swatchOptions.length > 1){
          console.log(JSONData);
          Shopify.linkOptionSelectors(JSONData, productSection);
        }
      });
    }
    //Add click event when there is more than one product on the page (eg. Collection in Detail)
  //   if ($('.js-product_section').length > 1){
  //     $('body').on('click', '.swatch-element', function(){
  //       var swatchValue = $(this).data('value').toString();
  //       $(this)
  //       .siblings('input[value="'+ swatchValue.replace(/\"/g,'\\"') +'"]')
  //       .prop("checked", true)
  //       .trigger("change");
  //       var JSONData = $(this).parents('.product_form').data('product');
  //       var productID = $(this).parents('.product_form').data('product-id');
  //       var productSection = '.product-' + productID + ' .js-product_section';
  //       var swatchOptions = $(this).parents('.product_form').find('.swatch_options .swatch');
  //       if (swatchOptions.length > 1){
  //         Shopify.linkOptionSelectors(JSONData, productSection);
  //       }
  //     })
  //   }