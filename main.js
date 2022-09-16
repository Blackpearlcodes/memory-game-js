var mem = {

    hWrap : null,

    url : "https://code-boxx.com/wp-content/uploads/2019/08/", // optional, url to images
    sets : 3, // number of sets to match
    grid : [], // current game grid
    moves : 0, // total number of moves
    matched : 0, // number of sets that have been matched
    last : null, // last opened card
    lock : null, // timer, lock game controls when showing mismatched cards
    hint : 1000, // how long to show mismatched cards
  
    // (B) PRELOAD
    preload : () => {
      // (B1) GET HTML GAME WRAPPER
      mem.hWrap = document.getElementById("mem-game");
  
      // (B2) PRELOAD IMAGES
      let img, loaded = -1;
      for (let i=0; i<=mem.sets; i++) {
        img = document.createElement("img");
        img.onload = () => {
          loaded++;
          if (loaded == mem.sets) { mem.reset(); }
        };
        img.src = `${mem.url}smiley-${i}.png`;
      }
    },
  
    // (C) RESET GAME
    reset : () => {
      // (C1) RESET ALL FLAGS
      clearTimeout(mem.lock); mem.lock = null;
      mem.moves = 0; mem.matched = 0;
      mem.last = null; mem.grid = [];
      for (let s=1; s<=mem.sets; s++) {
        mem.grid.push(s); mem.grid.push(s);
      }
  
      // (C2) RANDOM RESHUFFLE CARDS
      // credits : https://gomakethings.com/how-to-shuffle-an-array-with-vanilla-js/
      let current = mem.sets * 2, temp, random;
      while (0 !== current) {
        random = Math.floor(Math.random() * current);
        current -= 1;
        temp = mem.grid[current];
        mem.grid[current] = mem.grid[random];
        mem.grid[random] = temp;
      }
      // console.log(mem.grid); // CHEAT
  
      // (C3) CREATE HTML CARDS
      mem.hWrap.innerHTML = "";
      for (let id in mem.grid) {
        let card = document.createElement("img");
        card.className = "mem-card";
        card.src = `${mem.url}smiley-0.png`;
        card.onclick = () => { mem.open(card); };
        card.set = mem.grid[id];
        card.open = false;
        mem.hWrap.appendChild(card);
        mem.grid[id] = card;
      }
    },
  
    // (D) OPEN A CARD
    open : (card) => { if (mem.lock == null) { if (!card.open) {
      // (D1) UPDATE FLAGS & HTML
      card.open = true;
      mem.moves++;
      card.src = `${mem.url}smiley-${card.set}.png`;
      card.classList.add("open");
  
      // (D2) FIRST CARD - SET IN LAST
      if (mem.last == null) { mem.last = card; }
  
      // (D3) SECOND CARD - CHECK MATCH
      else {
        // (D3-1) REMOVE CSS CLASS
        card.classList.remove("open");
        mem.last.classList.remove("open");
  
        // (D3-2) MATCHED
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
  
        // (D3-3) NOT MATCHED - CLOSE BOTH CARDS ONLY AFTER A WHILE
        else {
          card.classList.add("wrong");
          mem.last.classList.add("wrong");
          mem.lock = setTimeout(() => {
            card.classList.remove("wrong");
            mem.last.classList.remove("wrong");
            card.open = false;
            mem.last.open = false;
            card.src = `${mem.url}smiley-0.png`;
            mem.last.src = `${mem.url}smiley-0.png`;
            mem.last = null;
            mem.lock = null;
          }, mem.hint);
        }
      }
    }}}
  };
  window.addEventListener("DOMContentLoaded", mem.preload);
  