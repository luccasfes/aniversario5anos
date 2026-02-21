const firebaseConfig = {
  apiKey: "AIzaSyBYpbdlWGL1TuUER_li_VImoiNwoWq1Ss8",
  authDomain: "sarah-lucas-5anos.firebaseapp.com",
  projectId: "sarah-lucas-5anos",
  storageBucket: "sarah-lucas-5anos.firebasestorage.app",
  messagingSenderId: "88165556060",
  appId: "1:88165556060:web:0b7a0ea66d9ea9c4ba2b99",
  measurementId: "G-RY6KN2TET0"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ==========================================
// CONFIGURAÇÕES GERAIS E SAVE STATE
// ==========================================
const PASSWORD_PARTS = ["ZO", "OT", "OP", "I", "A"];
const FINAL_PASSWORD = "ZOOTOPIA";

let gameProgress = JSON.parse(localStorage.getItem('sarah5AnosProgress')) || {
    unlockedYears: [2021],
    completedYears: [],
    vaultUnlocked: false,
    capsuleMessage: ""
};

let currentYear = 2021;
let currentQuestionIndex = 0;
let errorsInCurrentQuestion = 0;

const quizDatabase = {
    2021: [
        { q: "Qual o nome da série do nosso primeiro beijo?", opts: ["Todas as Mulheres do Mundo", "Friends", "Big Bang Theory", "Vis a Vis"], ans: 0, fb: "Exato! Inesquecível." },
        { q: "Qual a primeira série que dormiu ao ver comigo?", opts: ["Vis a Vis", "Grey's Anatomy", "The Office", "La Casa de Papel"], ans: 0, fb: "Dormiste num instante! 😂" },
        { q: "Onde assistimos ao nosso primeiro filme juntos (Zootopia)?", opts: ["Na tua casa", "No cinema", "Na minha casa", "Numa viagem"], ans: 0, fb: "Aquele sofá perfeito..." },
        { q: "E qual foi o nosso outro primeiro filme juntos?", opts: ["Tom & Jerry", "Homem-Aranha", "Toy Story", "Shrek"], ans: 0, fb: "Que clássico!" },
        { q: "Em que dia começámos a namorar oficialmente?", opts: ["22 de Fevereiro", "20 de Fevereiro", "15 de Março", "10 de Janeiro"], ans: 0, fb: "❤️ O dia mais feliz da minha vida!" }
    ],
    2022: [
        { q: "O que comemos no nosso primeiro aniversário de namoro?", opts: ["Pizza", "Sushi", "Hambúrguer", "Lasanha"], ans: 0, fb: "Pizza é vida!" },
        { q: "Qual o sinal de beijos que eu te dou?", opts: ["Testa, bochechas, nariz e selinho", "Só selinho", "Bochechas e testa", "Nenhum"], ans: 0, fb: "O nosso código secreto!" },
        { q: "O que o Michael Kyle (Patroa e as Crianças) diria sobre as minhas invenções malucas?", opts: ["Éh... não.", "Isso é genial!", "Pergunta à Jay.", "Vamos patentear!"], ans: 0, fb: "Ele não percebe o meu génio!" },
        { q: "A palavra do Sheldon (Big Bang Theory) ao fazer piada:", opts: ["Bazinga!", "Eureka!", "Apanhei-te!", "Tcharam!"], ans: 0, fb: "Bazinga!" },
        { q: "Qual é o animal com o qual você vive me comparando toda a hora?", opts: ["Com um Urso Pardo", "Com um Cachorrinho", "Com um Gatinho", "Com um Panda"], ans: 0, fb: "Eu sou o seu Urso Pardo, aff! 🐻❤️" }
    ],
    2023: [
        { q: "Como o Chris resolve problemas na escola Corleone?", opts: ["Correndo muito rápido", "Enfrentando o Caruso", "Chamando a mãe", "Dando dinheiro"], ans: 0, fb: "Foge Chris!" },
        { q: "Em quais jogos eu ODEIO perder para você?", opts: ["Nintendo, Uno e Cabra Queijo Pizza", "Só Uno", "Só no Nintendo", "Não me importo de perder"], ans: 0, fb: "Sou muito competitivo, assumo!" },
        { q: "A música hit da Phoebe (Friends):", opts: ["Smelly Cat", "Ugly Dog", "Central Perk Blues", "My Guitar"], ans: 0, fb: "Smelly cat, smelly caaat..." },
        { q: "Nível Hard de 'Eu, a Patroa e as Crianças': No lendário episódio do 'Euro Treino', quantas repetições o instrutor diz que faz em cada aparelho?", opts: ["Apenas UMA repetição", "Cem repetições rápidas", "Dez repetições com muito peso", "Nenhuma, ele usa a mente"], ans: 0, fb: "EURO TREINOOO! É uma só e acabou! 😂" },
        { q: "Se fôssemos o Michael e a Jay, quem daria castigos mais criativos?", opts: ["Eu, com invenções tecnológicas", "Tu, a Patroa", "Os nossos filhos", "Nenhum de nós"], ans: 0, fb: "As minhas invenções seriam épicas!" }
    ],
    2024: [
        { q: "O que a Rochelle faz quando alguém a humilha?", opts: ["Lembra que o marido tem DOIS empregos", "Chora", "Foge", "Liga para o Julius"], ans: 0, fb: "Meu marido tem dois empregos!" },
        { q: "Quantas vezes o Sheldon bate na porta?", opts: ["Três vezes, dizendo Penny", "Duas vezes rápido", "Ele simplesmente entra", "Uma vez bem forte"], ans: 0, fb: "Penny! Penny! Penny!" },
        { q: "Eu te acho linda com todas as roupas… mas qual look eu gosto mais pra sair com você?", opts: ["Vestido", "Calça e blusa", "Saia e blusa", "Você de macacão"], ans: 0, fb: "Mas a verdade é que você fica linda de qualquer jeito 💙" },
        { q: "O que o Franklin diz num momento romântico?", opts: ["Qualquer coisa por você, Kady!", "Sou mais inteligente que você.", "Vamos estudar matemática.", "Amo você!"], ans: 0, fb: "Anytiiiing for you!" },
        { q: "Joey Tribbiani tem uma regra de ouro:", opts: ["Joey não divide comida!", "Sempre paga a conta.", "Nunca dorme na casa do Chandler.", "Gosta mais do pato."], ans: 0, fb: "Joey doesn't share food!" }
    ],
    2025: [
        { q: "Para onde viajámos juntos em julho de 2025?", opts: ["Pirenópolis", "Gramado", "Caldas Novas", "Chapada dos Veadeiros"], ans: 0, fb: "Uma viagem inesquecível!" },
        { q: "O que me ensinaste ao longo de todos estes anos?", opts: ["A ser melhor e a explorar o novo", "A cozinhar", "A programar mais rápido", "A sair mais de casa"], ans: 0, fb: "Sou um homem melhor por tua causa." },
        { q: "A famosa frase do Golpe Baixo (Todo Mundo Odeia o Chris):", opts: ["Tragédia + Tempo = Comédia.", "Me empresta um dólar?", "A culpa é do Chris.", "Cadê o meu relógio?"], ans: 0, fb: "Sábias palavras." },
        { q: "Quem é a garota que acaba de chegar à reta final deste jogo?", opts: ["Sarah, a patroa da minha vida!", "Penny.", "Rachel.", "A Agatha e a pandinha."], ans: 0, fb: "És tu, meu amor! ❤️" },
        { q: "O que 2025 representou para nós?", opts: ["A certeza de sermos extraordinários juntos.", "Apenas mais um ano.", "Que é fácil te amar.", "Muitas viagens."], ans: 0, fb: "Vamos ficar juntos para sempre. Eu te amoo❤️!" }
    ]
};

function saveState() { localStorage.setItem('sarah5AnosProgress', JSON.stringify(gameProgress)); }

// ==========================================
// INICIALIZAÇÃO
// ==========================================
window.onload = () => {
    setTimeout(() => { document.getElementById('loader').style.opacity = '0'; setTimeout(()=>document.getElementById('loader').style.display='none', 1000); }, 2000);
    
    // VERIFICA SE A CÁPSULA ESTÁ NO FIREBASE
    verificarCapsulaNoFirebase();

    createHearts(); updateCounter(); setInterval(updateCounter, 60000);
    
    const years = [2021, 2022, 2023, 2024, 2025];
    currentYear = years.find(y => !gameProgress.completedYears.includes(y)) || 2025;
    
    updateQuizUI();
    if(currentYear <= 2025 && !gameProgress.completedYears.includes(2025)) loadQuestion();
    buildCalendar();
    
    const obs = new IntersectionObserver((entries) => { entries.forEach(e => { if(e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)'; }}); }, { threshold: 0.1 });
    document.querySelectorAll('.slide-in').forEach(el => obs.observe(el));
};

// ==========================================
// LÓGICA DO FIREBASE (CÁPSULA 2031)
// ==========================================
async function verificarCapsulaNoFirebase() {
    try {
        const docRef = await db.collection("timecapsule").doc("sarah_lucas").get();
        
        if (docRef.exists || gameProgress.vaultUnlocked) {
            const couponsSec = document.getElementById('coupons');
            const navCoupons = document.getElementById('nav-coupons');
            if(couponsSec) couponsSec.style.display = 'block';
            if(navCoupons) navCoupons.style.display = 'inline-block';

            document.getElementById('capsule-locked-view').style.display = 'none';
            document.getElementById('capsule-snake-view').style.display = 'none';
            document.getElementById('capsule-open-view').style.display = 'block';

            if (docRef.exists) {
                const data = docRef.data();
                const anoAtual = new Date().getFullYear();

                if (anoAtual >= 2031) {
                    document.getElementById('capsuleMessage').value = data.mensagem;
                    document.getElementById('capsuleMessage').disabled = true;
                    document.querySelector('#capsule-open-view .capsule-btn').style.display = 'none';
                    
                    document.getElementById('capsuleConfirmation').innerHTML = `✨ Cápsula Aberta! Escrita em ${data.dataSelada} ✨`;
                    document.getElementById('capsuleConfirmation').style.display = 'block';
                    launchConfetti();
                } else {
                    document.getElementById('capsuleMessage').style.display = 'none';
                    document.querySelector('#capsule-open-view .capsule-btn').style.display = 'none';
                    
                    document.getElementById('capsuleConfirmation').innerHTML = `📦 Cápsula selada com sucesso em ${data.dataSelada}!<br><br><span style="color:#fae4e9;">O seu Urso Pardo guardou a mensagem a sete chaves no banco de dados. Voltem a este site em <b>2031</b> para descobrir o que está escrito.</span>`;
                    document.getElementById('capsuleConfirmation').style.display = 'block';
                }
            }
        }
    } catch (error) {
        console.error("Erro ao verificar cápsula:", error);
    }
}

async function saveCapsule() {
    const msg = document.getElementById('capsuleMessage').value.trim();
    if(msg) {
        try {
            const dataHoje = new Date().toLocaleDateString('pt-BR');
            await db.collection("timecapsule").doc("sarah_lucas").set({
                mensagem: msg,
                dataSelada: dataHoje,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });

            showToast("📦 Cápsula selada para a eternidade (2031)!");
            verificarCapsulaNoFirebase();
            
        } catch (error) {
            console.error("Erro ao salvar:", error);
            showToast("Erro ao conectar com o banco de dados.");
        }
    } else {
        showToast("Escreva algo bonito primeiro!");
    }
}

function createHearts() {
    const c = document.getElementById('floatingHearts');
    const emojis = ['❤️', '💕', '✨', '🐻', '🐼'];
    for(let i=0; i<25; i++) {
        let h = document.createElement('div'); h.className = 'heart-particle'; h.innerHTML = emojis[Math.floor(Math.random()*emojis.length)];
        h.style.left = Math.random()*100 + '%'; h.style.top = Math.random()*100 + '%'; h.style.animationDelay = Math.random()*5 + 's'; h.style.fontSize = (15+Math.random()*20) + 'px';
        c.appendChild(h);
    }
}

function updateCounter() {
    const diff = new Date() - new Date('2021-02-22T00:00:00');
    document.getElementById('daysCounter').textContent = Math.floor(diff / 86400000);
    document.getElementById('hoursCounter').textContent = Math.floor((diff % 86400000) / 3600000);
    document.getElementById('minutesCounter').textContent = Math.floor((diff % 3600000) / 60000);
}

function updateQuizUI() {
    document.querySelectorAll('.year-btn').forEach(btn => {
        const y = parseInt(btn.dataset.year);
        btn.className = 'year-btn';
        if(gameProgress.completedYears.includes(y)) btn.classList.add('completed');
        else if(gameProgress.unlockedYears.includes(y)) btn.classList.add('available');
        else btn.classList.add('locked');
        
        if(y === currentYear) btn.classList.add('active');
        
        btn.onclick = () => {
            if(gameProgress.unlockedYears.includes(y) || gameProgress.completedYears.includes(y)) {
                currentYear = y; currentQuestionIndex = 0; errorsInCurrentQuestion = 0;
                updateQuizUI(); loadQuestion();
            } else showToast("Completa o ano anterior primeiro!");
        };
    });

    let displayPass = "";
    for(let i=0; i<5; i++) {
        let y = 2021 + i;
        if(gameProgress.completedYears.includes(y)) displayPass += PASSWORD_PARTS[i] + " ";
        else displayPass += PASSWORD_PARTS[i].replace(/./g, "_") + " ";
    }
    document.getElementById('collected-password').textContent = displayPass.trim();
    
    if(gameProgress.completedYears.length === 5) {
        document.getElementById('quizQuestion').textContent = "TODOS OS ANOS COMPLETOS! PARABÉNS MEU AMOR. Vai até à cápsula e insira a senha.";
        document.getElementById('quizOptions').innerHTML = "";
        document.getElementById('quizProgress').style.width = "100%";
        document.getElementById('quizLives').innerHTML = "";
    }
}

function loadQuestion() {
    if(gameProgress.completedYears.includes(currentYear) && gameProgress.completedYears.length === 5) return;
    
    const q = quizDatabase[currentYear][currentQuestionIndex];
    document.getElementById('quizQuestion').textContent = q.q;
    document.getElementById('quizProgress').style.width = ((currentQuestionIndex) / 5 * 100) + '%';
    document.getElementById('quizFeedback').innerHTML = "";
    
    document.getElementById('quizLives').innerHTML = errorsInCurrentQuestion === 0 ? "<span>❤️</span><span>❤️</span>" : "<span>❤️</span>";

    const container = document.getElementById('quizOptions'); container.innerHTML = '';
    let opts = q.opts.map((text, idx) => ({text, originalIndex: idx})).sort(() => Math.random() - 0.5);
    opts.forEach(opt => {
        let btn = document.createElement('div'); btn.className = 'quiz-option'; btn.textContent = opt.text;
        btn.onclick = () => checkAnswer(btn, opt.originalIndex === q.ans);
        container.appendChild(btn);
    });
}

function checkAnswer(btn, isCorrect) {
    document.querySelectorAll('.quiz-option').forEach(b => b.classList.add('disabled'));
    
    if(isCorrect) {
        btn.classList.add('correct'); showToast("✨ Correto!");
        document.getElementById('quizFeedback').innerHTML = `<span style="color: #64fa82">${quizDatabase[currentYear][currentQuestionIndex].fb}</span>`;
        setTimeout(() => advanceQuestion(), 1500);
    } else {
        btn.classList.add('wrong'); 
        errorsInCurrentQuestion++;
        
        if(errorsInCurrentQuestion >= 2) {
            document.getElementById('quizLives').innerHTML = "<span>💔</span>";
            document.getElementById('quizFeedback').innerHTML = `<span style="color: #ff5e5e; font-weight: bold;">O Urso Pardo zerou o ano de ${currentYear}! Recomeçando...</span>`;
            setTimeout(() => { currentQuestionIndex = 0; errorsInCurrentQuestion = 0; loadQuestion(); }, 2500);
        } else {
            document.getElementById('quizFeedback').innerHTML = "<span style='color: #ffb6c1'>❌ Tenta de novo! (Última chance)</span>";
            document.getElementById('quizLives').innerHTML = "<span>❤️</span>";
            setTimeout(() => { document.querySelectorAll('.quiz-option').forEach(b => b.classList.remove('disabled')); btn.classList.remove('wrong'); }, 1000);
        }
    }
}

function advanceQuestion() {
    currentQuestionIndex++; errorsInCurrentQuestion = 0;
    if(currentQuestionIndex >= 5) {
        if(!gameProgress.completedYears.includes(currentYear)) {
            gameProgress.completedYears.push(currentYear);
            if(currentYear < 2025) gameProgress.unlockedYears.push(currentYear + 1);
            saveState();
        }
        showToast(`🎉 Ano ${currentYear} completo! Recebeste sílabas.`);
        if(currentYear < 2025) { currentYear++; currentQuestionIndex = 0; updateQuizUI(); loadQuestion(); }
        else updateQuizUI();
    } else loadQuestion();
}

function checkVaultPassword() {
    if(document.getElementById('vault-input').value.toUpperCase().trim() === FINAL_PASSWORD) {
        document.getElementById('vault-error').style.display = 'none';
        document.getElementById('capsule-locked-view').style.display = 'none';
        document.getElementById('capsule-snake-view').style.display = 'block';
        initSnakeGame();
    } else document.getElementById('vault-error').style.display = 'block';
}

let snakeDir = "RIGHT"; let gameLoop;
function setSnakeDir(dir) { 
    if((dir==="LEFT" && snakeDir!=="RIGHT") || (dir==="RIGHT" && snakeDir!=="LEFT") || (dir==="UP" && snakeDir!=="DOWN") || (dir==="DOWN" && snakeDir!=="UP")) snakeDir = dir; 
}

document.querySelectorAll('.dpad-btn').forEach(btn => {
    btn.addEventListener('touchstart', e => { e.preventDefault(); setSnakeDir(btn.dataset.dir); });
    btn.addEventListener('mousedown', () => { setSnakeDir(btn.dataset.dir); });
});

document.onkeydown = (e) => { 
    if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)) e.preventDefault();
    if(e.key==="ArrowLeft") setSnakeDir("LEFT"); else if(e.key==="ArrowUp") setSnakeDir("UP"); 
    else if(e.key==="ArrowRight") setSnakeDir("RIGHT"); else if(e.key==="ArrowDown") setSnakeDir("DOWN"); 
};

function initSnakeGame() {
    clearInterval(gameLoop);
    const goScreen = document.getElementById('snake-gameover');
    if(goScreen) goScreen.style.display = 'none';

    const canvas = document.getElementById("snake-game"); const ctx = canvas.getContext("2d");
    const box = 20; let snake = [{x: 5*box, y: 5*box}]; snakeDir = "RIGHT"; 
    
    // A MÁGICA DA VELOCIDADE AQUI: Começa em 250ms (mais lento)
    let snakeSpeed = 250; 
    
    const mems = [ 
        { e: '🍕', m: '1º Ano: A celebrar o nosso 1º aniversário a comer Pizza.' }, 
        { e: '🎬', m: 'Zootopia na tua casa... E claro, Tom & Jerry!' }, 
        { e: '🧳', m: 'Começamos a viajar juntos. A explorar o novo contigo.' },
        { e: '🐻', m: 'O teu amor (e o Urso Pardo) destrancou o cofre!' } 
    ];
    let memIdx = 0; 
    let food = { x: Math.floor(Math.random()*14)*box, y: Math.floor(Math.random()*14)*box, item: mems[memIdx] };

    function runGame() {
        ctx.fillStyle = "#120a0c"; ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.strokeStyle = "rgba(255, 182, 193, 0.05)";
        for(let i=0; i<=canvas.width; i+=box) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke(); }

        let time = Date.now() / 200; let floatOffset = Math.sin(time) * 3;
        ctx.font = "18px Arial"; ctx.fillText(food.item.e, food.x + 1, food.y + 16 + floatOffset);
        
        ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.lineWidth = box - 4; ctx.strokeStyle = "#ff99aa";
        ctx.beginPath();
        snake.forEach((s, i) => { if(i===0) ctx.moveTo(s.x + box/2, s.y + box/2); else ctx.lineTo(s.x + box/2, s.y + box/2); });
        ctx.stroke();
        
        ctx.fillStyle = "#ff5e5e"; ctx.beginPath(); ctx.arc(snake[0].x + box/2, snake[0].y + box/2, box/2 - 2, 0, Math.PI*2); ctx.fill();
        
        let nx = snake[0].x, ny = snake[0].y;
        if(snakeDir==="LEFT") nx-=box; if(snakeDir==="UP") ny-=box; if(snakeDir==="RIGHT") nx+=box; if(snakeDir==="DOWN") ny+=box;
        
        if(nx === food.x && ny === food.y) {
            clearInterval(gameLoop); 
            
            document.getElementById('snake-emoji').textContent = food.item.e;
            document.getElementById('snake-msg').textContent = food.item.m;
            document.getElementById('snake-popup').style.display = 'block';
            
            let bar = document.getElementById('mem-bar'); bar.style.width = '0%';
            let startT = Date.now(), memDur = 3000;
            let barInt = setInterval(()=>{
                let p = Math.min(100, (Date.now()-startT)/memDur*100); bar.style.width = p+'%';
                if(p>=100) clearInterval(barInt);
            }, 30);
            
            setTimeout(() => {
                document.getElementById('snake-popup').style.display = 'none';
                memIdx++;
                if(memIdx >= mems.length) {
                    gameProgress.vaultUnlocked = true; saveState();
                    verificarCapsulaNoFirebase();
                    launchConfetti(); showToast("Cápsula e Cupons Desbloqueados!");
                } else {
                    food = { x: Math.floor(Math.random()*14)*box, y: Math.floor(Math.random()*14)*box, item: mems[memIdx] };
                    snake.unshift({x: nx, y: ny});
                    
                    // Aumenta a velocidade do jogo toda vez que come um item! (Diminui 50ms)
                    snakeSpeed = snakeSpeed - 50; 
                    
                    gameLoop = setInterval(runGame, snakeSpeed);
                }
            }, 3000);
        } else {
            snake.pop(); 
            if(nx<0 || nx>=canvas.width || ny<0 || ny>=canvas.height || snake.some(s=>s.x===nx && s.y===ny)) { 
                clearInterval(gameLoop);
                if(goScreen) goScreen.style.display = 'flex';
            } else {
                snake.unshift({x: nx, y: ny}); 
            }
        }
    }
    gameLoop = setInterval(runGame, snakeSpeed);
}

function togglePlay() {
    const audioEl = document.getElementById('audio-player');
    const disc = document.getElementById('music-disc');
    const btn = document.getElementById('play-pause-btn');
    if(audioEl.paused) {
        audioEl.play().catch(e => showToast("Clica no play primeiro!"));
        btn.textContent = '⏸'; disc.classList.add('spinning');
    } else {
        audioEl.pause(); btn.textContent = '▶'; disc.classList.remove('spinning');
    }
}
function restartMusic() { const a = document.getElementById('audio-player'); a.currentTime = 0; if(a.paused) togglePlay(); }
function toggleMute() { const a = document.getElementById('audio-player'); a.muted = !a.muted; }
document.getElementById('audio-player').ontimeupdate = function() { if(this.duration) document.getElementById('music-progress').style.width = (this.currentTime/this.duration)*100 + '%'; };
function seekMusic(e) { const a = document.getElementById('audio-player'); if(a.duration) a.currentTime = (e.offsetX / e.currentTarget.offsetWidth) * a.duration; }

function openLightbox(src, isVideo) {
    const lb = document.getElementById('lightbox');
    const img = document.getElementById('lightbox-img');
    const vid = document.getElementById('lightbox-video');

    if(isVideo) {
        img.style.display = 'none';
        vid.style.display = 'block';
        vid.src = src;
        vid.play().catch(e => console.log("Erro ao tocar vídeo:", e));
    } else {
        vid.style.display = 'none';
        vid.pause();
        img.style.display = 'block';
        img.src = src;
    }
    lb.classList.add('open');
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('open');
    const vid = document.getElementById('lightbox-video');
    if(vid) vid.pause();
}

let calYear = 2026, calMonth = 1; 
const specialDates = [ 
    { y: 'all', m: 1, d: 12, name: '🎂 Aniversário do Meu Amor', note: 'O dia da mulher da minha vida.', desc: 'Um dia incrível e o meu favorito, porque foi quando você nasceu. Amo-te muito!', icon: '🎂' },
    { y: 'all', m: 12, d: 11, name: '✨ 11 de Dezembro', note: 'Data especial.', desc: 'Você fez com que esta data se tornasse bem mais especial do que era antes de te conhecer.', icon: '✨' },
    { y: 'all', m: 12, d: 25, name: '🎄 Natal', note: 'O nosso favorito.', desc: 'Um dia maravilhoso e incrível, o nosso favorito do ano.', icon: '🎄' },
    { y: 2021, m: 2, d: 22, name: '💝 O Início de Tudo', note: 'Onde a nossa história começou.', desc: 'A data que nunca vou esquecer. O dia oficial do nosso início.', icon: '💝' },
    { y: 2021, m: 3, d: 22, name: '🍕 1 Mês (Escondido)', note: 'Ninguém sabia de nada!', desc: 'Comemos pizza para comemorar um mês escondidos e me deste uma caixinha muito linda. Tantas memórias!', icon: '🎁' },
    { y: 2022, m: 9, d: 11, name: '🍓 Festa do Morango', note: 'Passeio incrível.', desc: 'Fomos à Festa do Morango e foi bom demais.', icon: '🍓' },
    { y: 2022, m: 9, d: 22, name: '⛺ Cabana na Sala', note: 'Simples e único.', desc: 'Fizemos uma cabana em casa, compramos pizza e assistimos a uma série. Um momento tão simples, mas maravilhoso.', icon: '⛺' },
    { y: 2022, m: 10, d: 22, name: '🌻 Exposição do Van Gogh', note: 'A melhor até hoje.', desc: 'Imersiva, agradável, linda, sensacional. Não sei explicar o quão bom foi.', icon: '🎨' },
    { y: 2023, m: 1, d: 22, name: '📸 Eduardo e Mônica', note: 'Fotos no Museu.', desc: 'Saímos, fomos ao museu e tiramos fotos igual Eduardo e Mônica no Teatro Nacional.', icon: '🏛️' },
    { y: 2023, m: 2, d: 22, name: '🏡 2 Anos no Chalé', note: 'O nosso segundo aniversário.', desc: 'Comemoramos o nosso segundo aniversário de namoro num chalé perfeito.', icon: '🏡' },
    { y: 2023, m: 6, d: 16, name: '💡 Concerto das Luzes', note: 'Um dos melhores.', desc: 'Um concerto tão agradável. Tinha umas luzes que você até queria roubar (pegar emprestado para sempre!).', icon: '✨' },
    { y: 2023, m: 10, d: 7, name: '🍧 Açaí e Conversa', note: 'No Fluo do Açaí.', desc: 'Tomamos açaí à noite. Uma conversa tão agradável, um momento mágico e divertido.', icon: '🍧' },
    { y: 2024, m: 2, d: 22, name: '🥰 Surpresa dos 3 Anos', note: '3 anos juntos.', desc: 'Fizeste uma surpresa para mim com o meu nome. O que é legal, porque hoje já completamos cinco!', icon: '🎉' },
    { y: 2024, m: 2, d: 24, name: '🍣 Salmão no Airbnb', note: 'Taguatinga.', desc: 'Comemoramos comendo salmão num apartamento no Airbnb.', icon: '🍣' },
    { y: 2024, m: 3, d: 29, name: '🍇 Imersão no CCBB', note: 'Piquenique perfeito.', desc: 'Comemos biscoito, bolo, amendoim, uva e um suquinho de laranja que você trouxe.', icon: '🧺' },
    { y: 2024, m: 5, d: 30, name: '🍷 Buraco do Jazz', note: 'Experiência marcante.', desc: 'Fomos ao Buraco do Jazz, tomamos vinho e foi uma das experiências mais marcantes para mim até hoje.', icon: '🎷' },
    { y: 2024, m: 6, d: 29, name: '🦁 Zoológico', note: 'Passeio divertido.', desc: 'Fomos ao zoológico e foi muito divertido.', icon: '🦒' },
    { y: 2024, m: 8, d: 4, name: '🍔 Reencontro na Hamburgueria', note: 'Volta de viagem.', desc: 'Voltei de viagem e foi um dia tão bom. Estava muito feliz por te ver de novo.', icon: '🍔' },
    { y: 2024, m: 9, d: 14, name: '🎬 Ainda Estou Aqui', note: 'Cinema.', desc: 'Assistimos ao filme da Fernanda Torres que ganhou Oscar. Muito bom.', icon: '🍿' },
    { y: 2024, m: 11, d: 16, name: '🍝 Airbnb em Samambaia', note: 'Um dos melhores.', desc: 'Lasanha gostosa e uma taça de vinho. Foi um dos melhores momentos para mim.', icon: '🍷' },
    { y: 2025, m: 1, d: 13, name: '🛣️ Viagem a Luziânia', note: 'Goiás.', desc: 'Foi especial porque saí da tecnologia e estive mais um momento com você.', icon: '📵' },
    { y: 2025, m: 2, d: 1, name: '🗾 Exposição do Japão', note: 'Pátio Brasil.', desc: 'Fomos à Exposição do Japão no shopping.', icon: '⛩️' },
    { y: 2025, m: 2, d: 15, name: '⛵ Passeio de Barco', note: 'Dia incrível.', desc: 'Um passeio de barco inesquecível a dois.', icon: '🌊' },
    { y: 2025, m: 2, d: 22, name: '🥂 4 Anos de Namoro', note: 'Restaurante no Guará.', desc: 'O nosso quarto ano, comemorado com muita alegria no Guará.', icon: '🍾' },
    { y: 2025, m: 4, d: 18, name: '🏢 Airbnb no SIA', note: 'Em Brasília.', desc: 'Aproveitamos um tempo juntos naquele apartamento perto do SIA.', icon: '🏙️' },
    { y: 2025, m: 6, d: 22, name: '🎸 Concerto de Sertanejos', note: 'Muita música.', desc: 'Fomos ao concerto curtir juntos.', icon: '🤠' },
    { y: 2025, m: 7, d: 15, name: '🧳 Viagem a Pirenópolis', note: 'Aventura a dois.', desc: 'Exploramos Pirenópolis. Você me ensinou a ser melhor e a explorar o novo.', icon: '🗺️' },
    { y: 2026, m: 2, d: 14, name: '🚗 Viagem para Goiânia', note: 'Novas histórias.', desc: 'Pegamos a estrada rumo a Goiânia para criar mais memórias.', icon: '🛣️' },
    { y: 2026, m: 2, d: 22, name: '👑 5 Anos de Namoro!', note: 'A Patroa da minha vida.', desc: 'Hoje completamos 5 anos. O Urso Pardo te ama mais do que tudo no universo.', icon: '🐻' }
];

function buildCalendar() {
    const mNames = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
    document.getElementById('cal-month-title').textContent = `${mNames[calMonth]} ${calYear}`;
    const grid = document.getElementById('calendar-grid'); grid.innerHTML = '';
    ['D','S','T','Q','Q','S','S'].forEach(d => grid.innerHTML += `<div class="cal-day-header">${d}</div>`);
    const fDay = new Date(calYear, calMonth, 1).getDay(); const days = new Date(calYear, calMonth+1, 0).getDate();
    
    for(let i=0; i<fDay; i++) grid.innerHTML += `<div class="cal-day empty"></div>`;
    
    for(let d=1; d<=days; d++) { 
        let isSp = specialDates.some(s => (s.y === calYear || s.y === 'all') && s.m === calMonth+1 && s.d === d); 
        if(isSp) {
            grid.innerHTML += `<div class="cal-day special" onclick="openCalendarModal(${calYear}, ${calMonth+1}, ${d})">${d}</div>`;
        } else {
            grid.innerHTML += `<div class="cal-day">${d}</div>`;
        }
    }
}

function changeMonth(dir) { 
    calMonth += dir; 
    if(calMonth > 11) { calMonth = 0; calYear++; } 
    if(calMonth < 0) { calMonth = 11; calYear--; } 
    buildCalendar(); 
}

function openCalendarModal(year, month, day) {
    const ev = specialDates.find(s => (s.y === year || s.y === 'all') && s.m === month && s.d === day);
    if(ev) {
        document.getElementById('cal-modal-icon').textContent = ev.icon;
        document.getElementById('cal-modal-title').textContent = ev.name;
        const mNames = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
        let displayYear = ev.y === 'all' ? '(Todos os anos)' : ev.y;
        document.getElementById('cal-modal-date').textContent = `${ev.d} de ${mNames[ev.m-1]} ${displayYear}`;
        document.getElementById('cal-modal-desc').textContent = ev.desc;
        document.getElementById('calendar-modal').style.display = 'flex';
    }
}
function closeCalendarModal() { document.getElementById('calendar-modal').style.display = 'none'; }

function showToast(text) { const t = document.getElementById('toast'); t.textContent = text; t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 3000); }

function launchConfetti() {
    const cc = document.getElementById('confetti-canvas'); cc.style.display='block'; cc.width = window.innerWidth; cc.height = window.innerHeight;
    const cctx = cc.getContext('2d'); const pieces = []; const colors = ['#ff99aa','#ffb6c1','#ffffff','#c9a84c'];
    for(let i=0;i<100;i++){ pieces.push({ x: Math.random()*cc.width, y: -20 - Math.random()*200, w: 6+Math.random()*6, h: 4+Math.random()*4, color: colors[Math.floor(Math.random()*colors.length)], vx: (Math.random()-0.5)*3, vy: 2+Math.random()*4, rot: Math.random()*360, rotV: (Math.random()-0.5)*8, opacity: 0.8+Math.random()*0.2 }); }
    let frame=0;
    function animConf(){
        cctx.clearRect(0,0,cc.width,cc.height);
        pieces.forEach(p=>{
            p.x+=p.vx; p.y+=p.vy; p.rot+=p.rotV; if(p.y>cc.height+20){ p.y=-20; p.x=Math.random()*cc.width; }
            cctx.save(); cctx.translate(p.x,p.y); cctx.rotate(p.rot*Math.PI/180); cctx.globalAlpha=p.opacity*(1-Math.min(1,frame/300)); cctx.fillStyle=p.color; cctx.fillRect(-p.w/2,-p.h/2,p.w,p.h); cctx.restore();
        });
        frame++; if(frame<300) requestAnimationFrame(animConf); else { cc.style.display='none'; cctx.clearRect(0,0,cc.width,cc.height); }
    }
    animConf();
}

// ==========================================
// ÁUDIO DA CARTA (COM FUNDO MUSICAL)
// ==========================================
function toggleLetterAudio() {
    const letterAudio = document.getElementById('letter-audio');
    const letterBgMusic = document.getElementById('letter-bg-music'); // Puxa o toque bonitinho
    const btn = document.getElementById('btn-play-letter');
    
    // Puxa os elementos da música principal (a que toca no rádio)
    const bgMusic = document.getElementById('audio-player');
    const bgMusicBtn = document.getElementById('play-pause-btn');
    const disc = document.getElementById('music-disc');

    if(letterAudio.paused) {
        // 1. Pausa a música principal do site (se estiver a tocar)
        if (!bgMusic.paused) {
            bgMusic.pause();
            bgMusicBtn.textContent = '▶'; 
            disc.classList.remove('spinning'); 
        }

        // 2. Configura o volume do toque bonitinho bem baixo (15%) e dá play
        letterBgMusic.volume = 0.05; // Você pode mudar de 0.1 (muito baixo) a 0.5 (metade)
        letterBgMusic.play();

        // 3. Toca a sua voz
        letterAudio.play();
        
        btn.innerHTML = '⏸ Pausar áudio';
        btn.style.background = 'rgba(255, 153, 170, 0.3)';
    } else {
        // Se clicar em pausar, pausa a sua voz e a musiquinha fofa
        letterAudio.pause();
        letterBgMusic.pause();
        
        btn.innerHTML = '▶ Ouvir a minha voz';
        btn.style.background = 'rgba(255, 153, 170, 0.1)';
    }
}

// Quando o áudio da carta (sua voz) terminar...
document.getElementById('letter-audio').onended = () => {
    const btn = document.getElementById('btn-play-letter');
    const letterBgMusic = document.getElementById('letter-bg-music');
    
    // Pausa a musiquinha fofa e volta ela para o começo
    letterBgMusic.pause();
    letterBgMusic.currentTime = 0;

    // Volta o botão ao normal
    btn.innerHTML = '▶ Ouvir a minha voz';
    btn.style.background = 'rgba(255, 153, 170, 0.1)';
};