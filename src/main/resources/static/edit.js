var animation = bodymovin.loadAnimation({
    container: document.getElementById('editAnimation'),
        
    // Set your ID to something that you'll associate with the animation you're using //
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: 'edit.json'
});
loader.addEventListener("mouseenter", function() {
  animation.play();
});
loader.addEventListener("mouseleave", function() {
  animation.stop();
});
    // Make sure your path has the same filename as your animated     SVG's JSON file //
