/*var clickedElement;
document.addEventListener("mousedown", function(event){
  clickedElement = event.target;
}, true);
*/
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log(request);
    if(request.id==="ipt-tst"){
        if(request.enable===true){
            addInputTest();
        } else {
            $(".ipt-tst").remove();

            $("[class*='ipt-tst']").each(function() {

                // Keep 'this' for inside later loop
                var el = $(this);
              
                // get all the classes
                var classList = el.attr('class').split(/\s+/);
              
                // loop each class to check if it's one to remove
                $.each(classList, function(index, item) {
                  if (item.startsWith("ipt-tst")) {
                    el.removeClass(item);
                  }
                });
              });
        }
    }

    
}
);

function addInputTest() {
    var inputs = $("input");
    for (let i = 0; i < inputs.length; i++) {
        var input = $(inputs[i]);
        input.addClass("ipt-tst" + i);
        //input.css('background','yellow');
        var parent = $(input).parent();
        $(parent).css({ position: 'relative' });
        var icon = $('<span />', {
            id: "ipt-tst" + i,
            'class': "ipt-tst",
            //text    : "M",          // jQuery text() is called,
            html: 'M<div class="ipt-tst-menu" style="display:none"></div>',
            on: {                     // calls jQuery's .on('click' ...
                click: function () {
                    var currentDisplay = $(this).find('.ipt-tst-menu').css("display");
                    $('.ipt-tst-menu').hide();
                    if(currentDisplay==="block"){
                        $(this).find('.ipt-tst-menu').hide();
                    } else {
                        $(this).find('.ipt-tst-menu').show();
                    }
                    
                }
            }
        });

        $(icon).css({ top: input.position().top, left: 0 });//input.width()

        var actions = "";
        var info = "";

        var inputType = $(input).prop("type").toLowerCase();

        if (inputType === "password") {
            actions = actions + ' <li><a href="" class="ipt-tst-action" data-action="removePassword" data-input="ipt-tst' + i + '">Remove Password</a></li>' +
                ' <li><a href="" class="ipt-tst-action" data-action="addPassword" data-input="ipt-tst' + i + '">Add Password</a></li>';
        }

        if (inputType === "text" || inputType === "password") {
            var attrb = input.attr("maxlength");
            if (typeof attrb !== typeof undefined && attrb !== false) {
                info = info + ' <li><a href="" disabled>Max Length ' + attrb + '</a></li>';
                actions = actions + ' <li><a href="" class="ipt-tst-action" data-action="setMaxLength" data-input="ipt-tst' + i + '">Set Max Length Text</a></li>' +
                    ' <li><a href="" class="ipt-tst-action" data-action="setAboveMaxLength" data-input="ipt-tst' + i + '">Set Above Max Length Text</a></li>';
            } else {
                info = info + ' <li><a href="" disabled>No Max Length</a></li>';
            }

            attrb = input.attr("minlength");
            if (typeof attrb !== typeof undefined && attrb !== false) {
                info = info + ' <li><a href="" disabled>Min Length ' + attrb + '</a></li>';
                actions = actions + ' <li><a href="" class="ipt-tst-action" data-action="setMinLength" data-input="ipt-tst' + i + '">Set Min Length Text</a></li>' +
                    ' <li><a href="" class="ipt-tst-action" data-action="setBelowMinLength" data-input="ipt-tst' + i + '">Set Below Min Length Text</a></li>';
            } else {
                info = info + ' <li><a href="" disabled>No Min Length</a></li>';
            }

            attrb = input.attr("required");
            if (typeof attrb !== typeof undefined && attrb !== false) {
                info = info + ' <li><a href="" disabled>Required</a></li>';
                actions = actions + ' <li><a href="" class="ipt-tst-action" data-action="removeRequired" data-input="ipt-tst' + i + '">Remove Required</a></li>' +
                    ' <li><a href=""  class="ipt-tst-action" data-action="addRequired" data-input="ipt-tst' + i + '">Add Required</a></li>';
            } else {
                info = info + ' <li><a href="" disabled>Not Required</a></li>';
            }

            attrb = input.attr("disabled");
            if (typeof attrb !== typeof undefined && attrb !== false) {
                info = info + ' <li><a href="" disabled>Disabled</a></li>';
                actions = actions + ' <li><a href="" class="ipt-tst-action" data-action="removeDisabled" data-input="ipt-tst' + i + '">Remove Disabled</a></li>' +
                    ' <li><a href=""  class="ipt-tst-action" data-action="addDisabled" data-input="ipt-tst' + i + '">Add Disabled</a></li>';
            } else {
                info = info + ' <li><a href="" disabled>Not Disabled</a></li>';
            }


            var menu = '<div class="ipt-tst-menu" style="display:none">' +
                '<ul> ' +
                ' <li class="has-sub"><a>Info</a><ul>' + info + '</ul></li>' +
                ' <li class="has-sub"><a>Actions</a><ul>' + actions + '</ul></li>' +
                '</ul> ' +
                '</div>';

            $(icon).append(menu);

            $(parent).append(icon);

            $(document).on('click', '.ipt-tst-action', function(e){
                e.preventDefault();

                var action = $(this).data("action");
                var inputClass = $(this).data("input");
                var element = $("." + inputClass);

                switch(action){
                    case "setMaxLength":
                        var maxLength = $(element).attr('maxlength');
                        if (maxLength) {
                            $(element).val(randomString(maxLength,true,true,true));
                        }
                        break;
                    case "setAboveMaxLength":
                        var maxLength = $(element).attr('maxlength');
                        if (maxLength) {
                            $(element).val(randomString(maxLength + 1,true,true,true));
                        }
                        break;
                    case "setMinLength":
                        var minLength = $(element).attr('minlength');
                        if (minLength) {
                            $(element).val(randomString(minLength,true,true,true));
                        }
                        break;
                    case "setBelowMinLength":
                        var minLength = $(element).attr('minlength');
                        if (minLength) {
                            $(element).val(randomString(minLength-1,true,true,true));
                        }
                        break;
                    case "removeRequired":
                        $(element).removeAttr("required");
                        break;
                    case "addRequired":
                        $(element).prop("required", true);
                        break;
                    case "removeDisabled":
                        $(element).removeAttr("disabled");
                        break;
                    case "addDisabled":
                        $(element).prop("disabled", true);
                        break;
                    case "removePassword":
                        $(element).attr("type", "text");
                        break;
                    case "addPassword":
                        $(element).attr("type", "password");
                        break;
                }  

                return false;
            });
        }


    }
}
function setMaxLength(element) {
    var maxLength = $(element).attr('maxlength');
    if (maxLength) {
        $(element).val(randomString(maxLength,true,true,true));
    }
}

function randomString(length,lower,upper,numeric,special,space) {
    var text = "";
    var possible;
    
    if (space) {
          possible = possible + ' ';
      } 
      if (upper) {
            possible = possible + "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      } 
      if (lower) {
            possible = possible + "abcdefghijklmnopqrstuvwxyz";
      }
      if (numeric) {
          possible = possible + "0123456789";
      }
      if(special) {
          possible = possible + "#!@~$%^&*)-_";
      }
    
    for ( var i = 0; i < length; i++ ) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
    }
  

