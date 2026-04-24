const ReadingEngine = (() => {
  const names = {
    "ء":"همزٌ","ب":"باءٌ","ت":"تاءٌ","ث":"ثاءٌ","ج":"جيمٌ","ح":"حاءٌ","خ":"خاءٌ","د":"دالٌ","ذ":"ذالٌ","ر":"راءٌ","ز":"زايٌ",
    "س":"سينٌ","ش":"شينٌ","ص":"صادٌ","ض":"ضادٌ","ط":"طاءٌ","ظ":"ظاءٌ","ع":"عينٌ","غ":"غينٌ","ف":"فاءٌ","ق":"قافٌ",
    "ك":"كافٌ","ل":"لامٌ","م":"ميمٌ","ن":"نونٌ","ه":"هاءٌ","و":"واوٌ","ي":"ياءٌ","ة":"تاءٌ","ى":"ألفٌ مقصورةٌ"
  };

  function harakatForms(letter){
    return [
      { form: letter === "ء" ? "أَ" : letter + "َ", haraka:"فتحٌ" },
      { form: letter === "ء" ? "إِ" : letter + "ِ", haraka:"كسرٌ" },
      { form: letter === "ء" ? "أُ" : letter + "ُ", haraka:"ضمٌّ" }
    ];
  }

  function fathTanweenForm(letter){
    if(letter === "ة") return "ةً";
    if(letter === "ى") return "ىً";
    if(letter === "ء") return "ءً";
    return letter + "ًا";
  }

  function tanweenForms(letter){
    return [
      { form:fathTanweenForm(letter), label:"فتحتانِ", sound: soundBase(letter)+"َنْ" },
      { form:letter+"ٍ", label:"كسرتانِ", sound: soundBase(letter)+"ِنْ" },
      { form:letter+"ٌ", label:"ضمتانِ", sound: soundBase(letter)+"ُنْ" }
    ];
  }

  function soundBase(letter){
    if(letter === "ة") return "ت";
    if(letter === "ى") return "ا";
    return letter;
  }

  function buildLetterReading(type, letter){
    if(type === "harakat"){
      const f = harakatForms(letter), n = names[letter] || letter;
      return {
        main: f.map(x=>x.form).join(" "),
        noorani: [
          `${n} ${f[0].haraka} ${f[0].form}`,
          `${n} ${f[1].haraka} ${f[1].form} ، ${f[0].form} ${f[1].form}`,
          `${n} ${f[2].haraka} ${f[2].form} ، ${f[0].form} ${f[1].form} ${f[2].form}`
        ],
        taqti: [
          f[0].form,
          `${f[1].form} ، ${f[0].form} ${f[1].form}`,
          `${f[2].form} ، ${f[0].form} ${f[1].form} ${f[2].form}`
        ],
        free: [f.map(x=>x.form).join(" ، ")],
        audio: {
          noorani: [f[0].form, f[1].form, f[0].form, f[1].form, f[2].form, f[0].form, f[1].form, f[2].form],
          taqti: [f[0].form, f[1].form, f[0].form, f[1].form, f[2].form, f[0].form, f[1].form, f[2].form],
          free: f.map(x=>x.form)
        }
      };
    }

    const f = tanweenForms(letter), n = names[letter] || letter;
    return {
      main: f.map(x=>x.form).join(" "),
      noorani: [
        `${n} ${f[0].label} ${f[0].form} — تقرأ: ${f[0].sound}`,
        `${n} ${f[1].label} ${f[1].form} — تقرأ: ${f[1].sound} ، ${f[0].form} ${f[1].form}`,
        `${n} ${f[2].label} ${f[2].form} — تقرأ: ${f[2].sound} ، ${f[0].form} ${f[1].form} ${f[2].form}`
      ],
      taqti: [
        f[0].form,
        `${f[1].form} ، ${f[0].form} ${f[1].form}`,
        `${f[2].form} ، ${f[0].form} ${f[1].form} ${f[2].form}`
      ],
      free: [f.map(x=>x.form).join(" ")],
      audio: {
        noorani: [f[0].sound, f[1].sound, f[0].sound, f[1].sound, f[2].sound, f[0].sound, f[1].sound, f[2].sound],
        taqti: [f[0].sound, f[1].sound, f[0].sound, f[1].sound, f[2].sound, f[0].sound, f[1].sound, f[2].sound],
        free: f.map(x=>x.sound)
      }
    };
  }

  function buildAppReading(app){
    const partial2 = app.syllables[0] + app.syllables[1];
    const all = app.word;
    return {
      main: app.word,
      noorani: [
        app.names[0],
        `${app.names[1]} ، ${partial2}ـ`,
        `${app.names[2]} ، ${all}`
      ],
      taqti: [
        app.syllables[0],
        `${app.syllables[1]} ، ${partial2}ـ`,
        `${app.syllables[2]} ، ${all}`
      ],
      free: [app.word],
      audio: {
        noorani: [app.names[0], app.names[1], app.syllables[0], app.syllables[1], app.names[2], ...app.syllables],
        taqti: [app.syllables[0], app.syllables[1], app.syllables[0], app.syllables[1], app.syllables[2], ...app.syllables],
        free: app.syllables
      }
    };
  }

  return { buildLetterReading, buildAppReading };
})();