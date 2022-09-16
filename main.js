var mem = {

    hWrap : null,
    url : "assets/",
    sets : 3,
    grid : [],
    moves : 0,
    matched : 0,
    last : null,
    lock : null,
    hint : 1000,
  
    // (B) PRELOAD
    preload : () => {

        mem.hWrap = document.getElementById("main-game");
  

        let img, loaded = -1;
      for (let i=0; i<=mem.sets; i++) {
        img = document.createElement("img");
        img.onload = () => {
          loaded++;
          if (loaded == mem.sets) { mem.reset(); }
        };
        img.src = "assets/" + `img-${i}.png`; 
      }
    },
  
    // RESET GAME
    reset : () => {
      // RESET FLAGS
      clearTimeout(mem.lock); mem.lock = null;
      mem.moves = 0; mem.matched = 0;
      mem.last = null; mem.grid = [];
      for (let s=1; s<=mem.sets; s++) {
        mem.grid.push(s); mem.grid.push(s);
      }
  
      // RANDOM CARDS
      let current = mem.sets * 2, temp, random;
      while (0 !== current) {
        random = Math.floor(Math.random() * current);
        current -= 1;
        temp = mem.grid[current];
        mem.grid[current] = mem.grid[random];
        mem.grid[random] = temp;
      }
  
      // CREATE CARDS
      mem.hWrap.innerHTML = "";
      for (let id in mem.grid) {
        let card = document.createElement("img");
        card.className = "mem-card";
        card.src = `${mem.url}img-0.png`;
        card.onclick = () => { mem.open(card); };
        card.set = mem.grid[id];
        card.open = false;
        mem.hWrap.appendChild(card);
        mem.grid[id] = card;
      }
    },
  
    // OPEN CARD
    open : (card) => { if (mem.lock == null) { if (!card.open) {
      // UPDATE FLAGS
      card.open = true;
      mem.moves++;
      card.src = `${mem.url}img-${card.set}.png`;
      card.classList.add("open");
  
      // FIRST CARD - SET IN LAST
      if (mem.last == null) { mem.last = card; }
  
      // (D3) SECOND CARD - CHECK MATCH
      else {
        // REMOVE CSS CLASS
        card.classList.remove("open");
        mem.last.classList.remove("open");
  
        // MATCHED
        if (card.set == mem.last.set) {
          // UPDATE FLAGS + CSS
          mem.matched++;
          card.classList.add("right");
          mem.last.classList.add("right");
          mem.last = null;
  
          // END GAME?
          if (mem.matched == mem.sets) {
            alert("YOU WIN! TOTAL MOVES " + mem.moves);
            mem.reset();
          }
        }
  
        else {
          card.classList.add("wrong");
          mem.last.classList.add("wrong");
          mem.lock = setTimeout(() => {
            card.classList.remove("wrong");
            mem.last.classList.remove("wrong");
            card.open = false;
            mem.last.open = false;
            card.src = `${mem.url}img-0.png`;
            mem.last.src = `${mem.url}img-0.png`;
            mem.last = null;
            mem.lock = null;
          }, mem.hint);
        }
      }
    }}}
  };
  window.addEventListener("DOMContentLoaded", mem.preload);
  