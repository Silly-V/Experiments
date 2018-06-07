
function script(){

   // add own elements to the web site
   $(".item.block.shadow").append("<div class='btn-ai-colorize'>Ai</div");
   assignClicks();

   var style = "<style>" + "\n" +
   ".btn-ai-colorize {" + "\n" +
   "   position: absolute;" + "\n" +
   "   width: 40px;" + "\n" +
   "   color: #ff9d00;" + "\n" +
   "   height: 40px;" + "\n" +
   "   background-color: #634500;" + "\n" +
   "   border: 2px solid #ff9900;" + "\n" +
   "   box-shadow: 0 2px 4px rgba(0,0,0,0.5);" + "\n" +
   "   top: 5px;" + "\n" +
   "   text-align: center;" + "\n" +
   "   cursor: pointer;" + "\n" +
   "   font-size: 2em;" + "\n" +
   "   right: 5px;" + "\n" +
   "}" + "\n" +
   ".colorhunt-ai-colorizer-result-message {" + "\n" +
   "   background-color: #ffe200;" + "\n" +
   "   font-size: 1.5em;" + "\n" +
   "   text-align: center;" + "\n" +
   "   box-shadow: 0 3px 10px rgba(0,0,0,0.5);" + "\n" +
   "   color: #0500ab;" + "\n" +
   "   user-select: none;" + "\n" +
   "   transition: all 0.3s;" + "\n" +
   "   height: 0px;" + "\n" +
   "   opacity: 0;" + "\n" +
   "   overflow: hidden;" + "\n" +
   "}" + "\n" +
   ".colorhunt-ai-colorizer-result-message.error {" + "\n" +
   "   color: #F00;" + "\n" +
   "}" + "\n" +
   "</style>";
   $("head").append(style);

   // assign click function to the added [Ai] icons. These must be assigned to new items as they are created when user scrolls downward.
   function assignClicks(){
      console.log("Assigning clicks...");

      $(".btn-ai-colorize").off("click");
      $(".btn-ai-colorize").click(function(){
         var paletteElem = $(this).parent().find(".palette").eq(0);
         var paletteDivs = paletteElem.children("div");

         // the divs inside the .palette div have class names that match up with the user-created Illustrator document custom global swatches.
         // class name "place c1" will require that the Illustrator document contains a global color named "place c1".
         var arr = [], thisDiv, newObj;
         for (var i = 0; i < paletteDivs.length; i++) {
            thisDiv = $(paletteDivs[i]);
            newObj = {};
            newObj[thisDiv.attr("class")] = thisDiv.attr("style").replace(/background-color\s*\:\s*/, "").replace(";", "");
            arr.push( newObj );
         }
         testNativeMessage(arr);
      });

   };

   // send the data to the python application
   function testNativeMessage(msg){

   	chrome.extension.sendRequest(msg);

   };

   // edit the web page according to the returned result.
   function updateWebPage(status, msg){
      var timeStamp = new Date().getTime();
      $("#header").append("<div id='colorhunt-ai-colorizer-result-message-" + timeStamp + "' class='colorhunt-ai-colorizer-result-message " + status + "'>" + msg.replace(":", " : ") + "</div>");
      setTimeout(function(){
         $("#colorhunt-ai-colorizer-result-message-" + timeStamp).css({ "height" : "50px", "opacity" : "1" });
      }, 10);
      setTimeout(function(){
         $("#colorhunt-ai-colorizer-result-message-" + timeStamp).css({ "height" : "0px" });
         setTimeout(function(){
            $("#colorhunt-ai-colorizer-result-message-" + timeStamp).remove();
         }, 500);
      }, 3000);
   };

   // this function fires when a message is received from the python app after it has ran the applescript which ran the extendscript
   chrome.runtime.onMessage.addListener(function(message, callback) {
      var containerObj = message.resultMsg;
      var resultMarker, msg;
      for(var all in containerObj){
         msg = containerObj[all];
         resultMarker = all;
      }
      var status = (all == "Success")? "success" : "error";
      updateWebPage(status, all + ":" + msg);
   });

   function debounce(func, wait, immediate) {
      // https://davidwalsh.name/javascript-debounce-function
      var timeout;
      return function() {
         var context = this, args = arguments;
         var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
         };
         var callNow = immediate && !timeout;
         clearTimeout(timeout);
         timeout = setTimeout(later, wait);
         if (callNow) func.apply(context, args);
      };
   };

   // to take care of assigning click events to new items as they scroll into view, this simply assigns them to all items all over again.
   // inefficient, but works for this demonstration.
   var scrollFunction = debounce(assignClicks, 300);

   var t = 0;
   $(window).scroll( scrollFunction );

};

window.addEventListener("load", script);