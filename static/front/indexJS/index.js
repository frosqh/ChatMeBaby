var settingPageHtml=`
<div class='setting'>
  <div class='textSett'>
    <p class='title'>Paramètres</p>
    <div id='list_item'>
      <input type='checkbox' class='checkbox' checked>set1
      <br />
      <input type='checkbox' class='checkbox'>set2
    </div>
  </div>
  <button class='mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent'>Valider</button>
  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed mollis nibh eget lacus cursus, a aliquet dolor blandit. Curabitur ut risus diam. Suspendisse dictum augue ac purus gravida, sed pulvinar mauris rutrum. Nulla ornare mi non efficitur interdum. Nam placerat bibendum ullamcorper. Nunc vehicula vitae lacus ac ultrices. Nullam sed lobortis ante. Aliquam maximus augue nec sagittis euismod. Mauris vehicula, diam id efficitur sodales, justo ipsum lobortis neque, non faucibus velit mauris quis eros. Mauris feugiat ipsum justo, ut imperdiet risus imperdiet sit amet.

Pellentesque pretium consectetur tortor eget condimentum. Duis massa sem, maximus quis consequat id, tincidunt feugiat massa. In pretium magna libero, ut fringilla leo feugiat at. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Quisque convallis a dolor eu semper. Pellentesque dictum lacus ante, ac bibendum urna bibendum at. Integer rutrum ligula ac sem congue vestibulum. Vivamus posuere erat ac diam interdum gravida. Maecenas ac commodo dolor, ac scelerisque mauris. Donec sapien sapien, fringilla vel lacus ornare, tincidunt efficitur nisi. Quisque placerat, quam quis laoreet gravida, ligula ante sodales nulla, sed dapibus neque lorem in augue. Proin malesuada a magna eu facilisis. Pellentesque nisl magna, fermentum quis suscipit sit amet, gravida quis eros. Mauris fringilla felis sed purus lacinia, quis semper urna ornare.

Mauris eu dignissim elit. Sed sodales mattis mauris at pharetra. Nunc cursus lorem sit amet nisi euismod sodales. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi eu nisl sit amet diam fermentum eleifend non et tortor. Curabitur laoreet pellentesque ligula, et lobortis purus ultrices eu. Proin in lectus urna. Phasellus elementum suscipit elementum. Maecenas volutpat malesuada tortor ac finibus. Suspendisse urna massa, efficitur et ornare blandit, ultricies eget tortor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis fringilla consequat diam, quis ultrices orci congue quis. Ut laoreet, urna sed dictum egestas, purus leo iaculis sem, quis lacinia nisi neque nec tortor. In nec gravida dolor. Sed eget dictum ante. Ut non leo viverra, convallis tortor a, consectetur massa.

Maecenas rutrum nisi nisi, vitae finibus eros varius at. Curabitur eget consectetur dui. Phasellus at dapibus risus. Donec eget consequat orci. Duis at consequat quam. Fusce molestie gravida dapibus. Nulla mattis, risus ac tempus vehicula, nisi eros iaculis risus, ut commodo dui erat ut neque. Donec nibh eros, convallis quis lectus sed, condimentum ultricies urna.

Proin ac semper libero. Vestibulum eget sollicitudin lorem. Integer nibh lorem, mollis et venenatis ac, pulvinar pharetra sapien. Aliquam placerat bibendum erat sit amet vulputate. Duis nec leo magna. Donec dignissim risus eget pharetra varius. Ut placerat ut lectus et congue. Phasellus nec imperdiet felis. Maecenas laoreet diam sit amet pulvinar tempor. Donec imperdiet metus orci, a eleifend velit eleifend non. Cras tempor augue in tortor faucibus bibendum. Maecenas sodales, sem id scelerisque gravida, mi ex scelerisque quam, rhoncus lobortis leo tellus sit amet odio.
</div>`;


var indexPageHtml = `
<div class='coucou'>
  <h1>Super</h1>
</div>`;

function setCookie(sName, sValue) {
		var today = new Date(), expires = new Date();
		expires.setTime(today.getTime() + (365*24*60*60*1000));
		document.cookie = sName + "=" + sValue + ";expires=" + expires.toGMTString();
}

$(function(){
  var name  = "user";
  var value = "getUser";
  setCookie(name, value);

  $(".settingsPage").on("click",function(){
    $(".coucou").remove();
    $(".setting").remove();
    $(".content").append(settingPageHtml);
  })
  $(".indexPage").on("click",function(){
    $(".setting").remove();
    $(".coucou").remove();
    $(".content").append(indexPageHtml);
  })

});
