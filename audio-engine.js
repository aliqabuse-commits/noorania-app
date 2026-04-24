const AudioEngine = (() => {
  const DEFAULT_PAUSE = 180;

  function stop(){
    if("speechSynthesis" in window) speechSynthesis.cancel();
  }

  function utter(text){
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "ar-SA";
    u.rate = 0.58;
    return u;
  }

  function playSequence(items, pause = DEFAULT_PAUSE){
    stop();
    const seq = items.flat();
    let i = 0;

    function next(){
      if(i >= seq.length) return;
      const u = utter(seq[i++]);
      u.onend = () => setTimeout(next, pause);
      speechSynthesis.speak(u);
    }
    next();
  }

  return { playSequence, stop };
})();