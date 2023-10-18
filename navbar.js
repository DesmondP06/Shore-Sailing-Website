window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
    document.getElementById("navbar").styles.padding = "30px 10px";
    document.getElementById("logo").styles.fontSize = "25px";
  } else {
    document.getElementById("navbar").styles.padding = "80px 10px";
    document.getElementById("logo").styles.fontSize = "35px";
  }
}