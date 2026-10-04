/* The Curly Chef — v2 interactions: 3D tilt, parallax, nav, reveal. */
(function(){
  "use strict";

  /* touch fallback: gentle auto-drift instead of mousemove tilt */
  if (window.matchMedia("(hover: none)").matches) document.body.classList.add("touch");

  /* mobile nav */
  var toggle = document.querySelector(".nav-toggle");
  if (toggle) toggle.addEventListener("click", function(){
    var open = document.body.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  /* 3D tilt cards: rotate + glare + opposing parallax */
  var MAX = 9; // degrees
  document.querySelectorAll("[data-tilt]").forEach(function(card){
    var inner = card.querySelector(".tilt-inner") || card;
    var raf = null, rx = 0, ry = 0, mx = 0, my = 0, gx = 50, gy = 50;
    function apply(){
      raf = null;
      inner.style.setProperty("--rx", rx.toFixed(2) + "deg");
      inner.style.setProperty("--ry", ry.toFixed(2) + "deg");
      inner.style.setProperty("--mx", mx.toFixed(3));
      inner.style.setProperty("--my", my.toFixed(3));
      inner.style.setProperty("--gx", gx.toFixed(1) + "%");
      inner.style.setProperty("--gy", gy.toFixed(1) + "%");
    }
    function queue(){ if (!raf) raf = requestAnimationFrame(apply); }
    card.addEventListener("mousemove", function(e){
      var r = card.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      ry = (px - 0.5) * MAX * 2;
      rx = (0.5 - py) * MAX * 2;
      mx = px - 0.5; my = py - 0.5;
      gx = px * 100; gy = py * 100;
      queue();
    });
    card.addEventListener("mouseleave", function(){
      rx = ry = mx = my = 0; gx = gy = 50; queue();
    });
  });

  /* hero layered parallax (desktop) */
  var hero = document.querySelector("[data-hero]");
  if (hero && !document.body.classList.contains("touch")) {
    var layers = hero.querySelectorAll("[data-depth]");
    hero.addEventListener("mousemove", function(e){
      var r = hero.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      layers.forEach(function(el){
        var d = parseFloat(el.getAttribute("data-depth")) || 10;
        el.style.transform = "translate3d(" + (px * d).toFixed(1) + "px," + (py * d).toFixed(1) + "px,0)";
      });
    });
    hero.addEventListener("mouseleave", function(){
      layers.forEach(function(el){ el.style.transform = ""; });
    });
  }

  /* reveal on scroll */
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(function(el){ io.observe(el); });
})();
