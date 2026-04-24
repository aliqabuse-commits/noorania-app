const UI = (() => {
  let currentLesson = null;
  let currentTab = "letters";
  let currentItem = null;
  let currentReading = null;

  function init(){
    renderStage();
  }

  function screen(id){
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    document.getElementById(id).classList.add("active");
  }

  function renderStage(){
    const list = document.getElementById("lessonsList");
    list.innerHTML = "";
    Stage2Data.lessons.forEach(lesson => {
      const btn = document.createElement("button");
      btn.className = "lesson-btn";
      btn.innerHTML = `${lesson.title} — ${lesson.subtitle}<small>${lesson.description}</small>`;
      btn.onclick = () => openLesson(lesson.id);
      list.appendChild(btn);
    });
  }

  function openLesson(id){
    currentLesson = Stage2Data.lessons.find(l => l.id === id);
    currentTab = "letters";
    document.getElementById("headerTitle").textContent = currentLesson.subtitle;
    document.getElementById("headerNote").textContent = currentLesson.description;
    document.getElementById("lessonTitle").textContent = currentLesson.title + " — " + currentLesson.subtitle;
    document.getElementById("lessonDescription").textContent = currentLesson.description;
    renderTabs();
    renderItems();
    screen("screen-lesson");
  }

  function goStage(){
    AudioEngine.stop();
    document.getElementById("headerTitle").textContent = "الحروف المتحركة والمنونة";
    document.getElementById("headerNote").textContent = "نسخة منظمة: الواجهة منفصلة، البيانات منفصلة، محرك القراءة منفصل، ومحرك الصوت منفصل.";
    screen("screen-stage");
  }

  function renderTabs(){
    const wrap = document.getElementById("lessonTabs");
    wrap.innerHTML = "";
    currentLesson.tabs.forEach(tab => {
      const div = document.createElement("div");
      div.className = "tab" + (tab.id === currentTab ? " active" : "");
      div.textContent = tab.title;
      div.onclick = () => {
        AudioEngine.stop();
        currentTab = tab.id;
        renderTabs();
        renderItems();
      };
      wrap.appendChild(div);
    });
  }

  function renderItems(){
    const grid = document.getElementById("itemsGrid");
    grid.innerHTML = "";
    document.getElementById("itemsTitle").textContent = currentTab === "letters" ? currentLesson.tabs[0].title : currentLesson.tabs[1].title;

    const items = currentTab === "letters" ? currentLesson.letters : currentLesson.apps;
    items.forEach((item, index) => {
      const div = document.createElement("div");
      div.className = "item";
      div.textContent = currentTab === "letters" ? labelForLetter(item) : item.word;
      div.onclick = () => selectItem(item, div);
      grid.appendChild(div);
      if(index === 0) setTimeout(() => selectItem(item, div), 0);
    });
  }

  function labelForLetter(letter){
    const r = ReadingEngine.buildLetterReading(currentLesson.type, letter);
    return r.main;
  }

  function selectItem(item, el){
    AudioEngine.stop();
    document.querySelectorAll(".item").forEach(x => x.classList.remove("active"));
    el.classList.add("active");

    currentItem = item;
    currentReading = currentTab === "letters"
      ? ReadingEngine.buildLetterReading(currentLesson.type, item)
      : ReadingEngine.buildAppReading(item);

    document.getElementById("selectedMain").textContent = currentReading.main;
    document.getElementById("nooraniBox").innerHTML = currentReading.noorani.join("<br>");
    document.getElementById("taqtiBox").innerHTML = currentReading.taqti.join("<br>");
    document.getElementById("freeBox").innerHTML = currentReading.free.join("<br>");
  }

  function play(kind){
    if(!currentReading) return;
    AudioEngine.playSequence(currentReading.audio[kind]);
  }

  return { init, goStage, play };
})();

UI.init();