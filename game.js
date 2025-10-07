// Game State
const gameState = {
    money: 250,
    income: 0,
    fame: 0,
    selectedMachine: null,
    placedMachines: [],
    lastIncomeTime: 0,
    customers: [],
    gridWidth: 800,
    gridHeight: 600,
    expansions: 0,
    incomeMultiplier: 1,
    customerSpawnRate: 1,
    day: 1,
    lastDayTime: 0,
    maintenanceCost: 0,
    staff: [],
    researchPoints: 0,
    rank: 'Rookie',
    rankProgress: 0,
    investments: [],
    totalCustomers: 0,
    gameStarted: false
};

// Machine Types
const machineTypes = [
    {
        id: 'claw',
        name: '🦞 Claw Machine',
        cost: 100,
        income: 2,
        maintenance: 5,
        color: 0xff6b9d,
        unlocked: true
    },
    {
        id: 'shooter',
        name: '🔫 Space Shooter',
        cost: 250,
        income: 5,
        maintenance: 10,
        color: 0x4ecdc4,
        unlocked: true
    },
    {
        id: 'racer',
        name: '🏎️ Racing Game',
        cost: 500,
        income: 12,
        maintenance: 25,
        color: 0xffe66d,
        unlocked: false,
        unlockCost: 1000
    },
    {
        id: 'fighter',
        name: '🥊 Fighter Arena',
        cost: 800,
        income: 20,
        maintenance: 40,
        color: 0xff6b6b,
        unlocked: false,
        unlockCost: 2000
    },
    {
        id: 'rhythm',
        name: '🎵 Dance Hero',
        cost: 1500,
        income: 35,
        maintenance: 75,
        color: 0xc44569,
        unlocked: false,
        unlockCost: 5000
    },
    {
        id: 'vr',
        name: '🥽 VR Experience',
        cost: 3000,
        income: 75,
        maintenance: 150,
        color: 0x5f27cd,
        unlocked: false,
        unlockCost: 10000
    },
    {
        id: 'coincounter',
        name: '🪙 Coin Counter',
        cost: 200,
        income: 3,
        maintenance: 15,
        color: 0xf39c12,
        unlocked: true,
        isFacility: true
    },
    {
        id: 'massage',
        name: '💆 Massage Chair',
        cost: 1000,
        income: 15,
        maintenance: 30,
        color: 0x9b59b6,
        unlocked: false,
        unlockCost: 2500,
        isFacility: true
    },
    {
        id: 'restaurant',
        name: '🍔 Restaurant',
        cost: 2500,
        income: 50,
        maintenance: 100,
        color: 0xe74c3c,
        unlocked: false,
        unlockCost: 7500,
        isFacility: true
    }
];

// Staff Types
const staffTypes = [
    {
        id: 'worker',
        name: '👔 Worker',
        cost: 500,
        salary: 50,
        effect: 'Walks around the area'
    },
    {
        id: 'technician',
        name: '🔧 Technician',
        cost: 800,
        salary: 80,
        effect: 'Reduces maintenance by 20%'
    },
    {
        id: 'marketer',
        name: '📢 Marketer',
        cost: 1000,
        salary: 100,
        effect: 'Increases customer spawn rate'
    }
];

// Investment Options
const investmentTypes = [
    {
        id: 'bond',
        name: '💼 Government Bond',
        minInvest: 1000,
        dailyReturn: 0.02,
        description: '2% daily return (low risk)'
    },
    {
        id: 'stock',
        name: '📈 Stock Market',
        minInvest: 2500,
        dailyReturn: 0.05,
        description: '5% daily return (medium risk)'
    },
    {
        id: 'crypto',
        name: '₿ Cryptocurrency',
        minInvest: 5000,
        dailyReturn: 0.10,
        description: '10% daily return (high risk)'
    },
    {
        id: 'realestate',
        name: '🏢 Real Estate',
        minInvest: 10000,
        dailyReturn: 0.08,
        description: '8% daily return + fixed income'
    }
];

// Star Rating System (1-10 stars)
const starRatings = [
    { stars: 1, name: '1⭐ Beginner', threshold: 0, color: '#888888' },
    { stars: 2, name: '2⭐ Novice', threshold: 100, color: '#9d8065' },
    { stars: 3, name: '3⭐ Amateur', threshold: 250, color: '#cd7f32' },
    { stars: 4, name: '4⭐ Professional', threshold: 500, color: '#c0c0c0' },
    { stars: 5, name: '5⭐ Expert', threshold: 800, color: '#ffd700' },
    { stars: 6, name: '6⭐ Master', threshold: 1200, color: '#e5e4e2' },
    { stars: 7, name: '7⭐ Grandmaster', threshold: 1700, color: '#b9f2ff' },
    { stars: 8, name: '8⭐ Champion', threshold: 2300, color: '#ff69b4' },
    { stars: 9, name: '9⭐ Legend', threshold: 3000, color: '#ff1493' },
    { stars: 10, name: '10⭐ ULTIMATE', threshold: 4000, color: '#00ffff' }
];

// Keep old ranks for backward compatibility
const ranks = starRatings;

// Upgrades
const upgrades = [
    {
        id: 'expand',
        name: '🏗️ Expand Right',
        description: 'Add 400px to the right',
        baseCost: 10000,
        costMultiplier: 2.5,
        owned: 0,
        maxOwned: 1
    },
    {
        id: 'expand_up',
        name: '⬆️ Expand Upward',
        description: 'Add 300px upward',
        baseCost: 12000,
        costMultiplier: 2.8,
        owned: 0,
        maxOwned: 1
    },
    {
        id: 'income_boost',
        name: '💎 Income Boost',
        description: '+25% income from all machines',
        baseCost: 5000,
        costMultiplier: 3,
        owned: 0
    },
    {
        id: 'customer_speed',
        name: '🏃 Customer Rush',
        description: 'Customers spawn 50% faster',
        baseCost: 3000,
        costMultiplier: 2,
        owned: 0
    }
];

// Phaser Configuration
const config = {
    type: Phaser.AUTO,
    parent: 'phaser-game',
    width: 800,
    height: 600,
    backgroundColor: '#2d2d44',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

function preload() {
    console.log('🎵 Starting audio preload...');

    // Load audio files with error handling
    this.load.on('loaderror', function (file) {
        console.error('❌ Error loading file:', file.src, file.key);
    });

    this.load.on('filecomplete', function (key, type, data) {
        console.log('✅ Loaded:', key, type);
    });

    this.load.on('complete', function () {
        console.log('🎵 All files loaded!');
    });

    // Try to load audio - Phaser will pick the first one that works
    this.load.audio('bgmusic', 'Neon Dreams.mp3');
    this.load.audio('coin', 'drop-coin-384921.mp3');
    this.load.audio('place', 'exploding-building-1-185114.mp3');
    this.load.audio('unlock', 'exploding-building-1-185114.mp3');
    this.load.audio('invest', 'drop-coin-384921.mp3');

    console.log('🎵 Audio files queued for loading');
}

let gridGraphics;
let machinesGroup;
let previewSprite;
let customersGroup;
let particlesGroup;
let staffGroup;
let wallsGroup;
let sceneRef;
let sounds = {};
let backgroundMusic;

function create() {
    sceneRef = this;
    this.cameras.main.setBackgroundColor('#2d2d44');

    // Create sound objects with error handling - silently fail if audio doesn't load
    try {
        if (this.cache.audio.exists('coin')) {
            sounds.coin = this.sound.add('coin', { volume: 0.3 });
        }
        if (this.cache.audio.exists('place')) {
            sounds.place = this.sound.add('place', { volume: 0.4 });
        }
        if (this.cache.audio.exists('unlock')) {
            sounds.unlock = this.sound.add('unlock', { volume: 0.2 });
        }
        if (this.cache.audio.exists('invest')) {
            sounds.invest = this.sound.add('invest', { volume: 0.3 });
        }

        if (this.cache.audio.exists('bgmusic')) {
            backgroundMusic = this.sound.add('bgmusic', {
                volume: 0.2,
                loop: true
            });

            // Try to play music immediately
            const attemptPlay = () => {
                if (backgroundMusic && !window.musicPlaying) {
                    backgroundMusic.play();
                    window.musicPlaying = true;
                    document.getElementById('music-toggle').textContent = '🔊';
                    console.log('🎵 Music started playing');
                }
            };

            // Try multiple methods to start music
            setTimeout(attemptPlay, 100);

            // Also try on first click/touch
            sceneRef.input.once('pointerdown', attemptPlay);

            // Try on any interaction
            document.addEventListener('click', attemptPlay, { once: true });
            document.addEventListener('keydown', attemptPlay, { once: true });
        }
    } catch (error) {
        console.log('Audio not available:', error.message);
    }

    // Draw walls and entrance
    wallsGroup = this.add.group();
    drawWalls(this);

    // Draw grid
    gridGraphics = this.add.graphics();
    drawGrid(this);

    // Groups
    particlesGroup = this.add.group();
    machinesGroup = this.add.group();
    customersGroup = this.add.group();
    staffGroup = this.add.group();

    // Preview sprite for placement
    previewSprite = this.add.rectangle(0, 0, 60, 60, 0xffffff, 0.3);
    previewSprite.setVisible(false);

    // Input handling
    this.input.on('pointermove', (pointer) => {
        if (gameState.selectedMachine) {
            const snapX = Math.floor(pointer.x / 80) * 80 + 40;
            const snapY = Math.floor(pointer.y / 80) * 80 + 40;
            previewSprite.setPosition(snapX, snapY);
            previewSprite.setVisible(true);

            const machineType = machineTypes.find(m => m.id === gameState.selectedMachine);
            if (machineType) {
                previewSprite.setFillStyle(machineType.color, 0.5);
            }
        } else {
            previewSprite.setVisible(false);
        }
    });

    this.input.on('pointerdown', (pointer) => {
        if (gameState.selectedMachine) {
            placeMachine(this, pointer);
        }
    });

    // Initialize UI
    initShop();
    initUpgrades();
    updateUI();

    // Check if autoload from home screen
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('autoload') === 'true') {
        setTimeout(() => {
            loadGame();
        }, 500);
    } else {
        // Show tutorial for new game
        setTimeout(() => {
            showTutorial();
        }, 1000);
    }
}

function update(time, delta) {
    // Day counter (30 seconds per day)
    if (time - gameState.lastDayTime > 30000) {
        advanceDay();
        gameState.lastDayTime = time;
    }

    // Generate income every second
    if (time - gameState.lastIncomeTime > 1000) {
        const totalIncome = Math.floor(gameState.income * gameState.incomeMultiplier);
        gameState.money += totalIncome;
        gameState.lastIncomeTime = time;
        updateUI();
    }

    // Spawn customers only if game has started (first machine placed)
    if (gameState.gameStarted && gameState.placedMachines.length > 0 && Math.random() < 0.02 * gameState.customerSpawnRate) {
        spawnCustomer();
    }

    // Update customers
    gameState.customers.forEach((customer, index) => {
        if (!customer.sprite || !customer.sprite.active) return;

        // Move towards target
        const dx = customer.targetX - customer.sprite.x;
        const dy = customer.targetY - customer.sprite.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 5) {
            // Reached machine
            if (!customer.played) {
                customer.played = true;
                customer.playTime = time + 2000; // Stay for 2 seconds

                // Check if this is a coin counter
                const targetMachine = gameState.placedMachines.find(m => m.x === customer.targetX && m.y === customer.targetY);
                if (targetMachine && targetMachine.type === 'coincounter') {
                    // Customer is at coin counter - exchange coins for money
                    createCoinExchangeParticle(customer.sprite.x, customer.sprite.y);
                    if (sounds.coin) sounds.coin.play();
                } else {
                    // Regular machine - earn coins
                    createMoneyParticle(customer.sprite.x, customer.sprite.y);
                }
            }

            // Leave after playing or check if need to visit coin counter
            if (time > customer.playTime) {
                const targetMachine = gameState.placedMachines.find(m => m.x === customer.targetX && m.y === customer.targetY);

                // If customer just played a game (not coin counter) and there's a coin counter, go there
                if (targetMachine && targetMachine.type !== 'coincounter' && !customer.visitedCounter) {
                    const coinCounter = gameState.placedMachines.find(m => m.type === 'coincounter');
                    if (coinCounter) {
                        customer.targetX = coinCounter.x;
                        customer.targetY = coinCounter.y;
                        customer.played = false;
                        customer.visitedCounter = true;
                        return;
                    }
                }

                // Leave the arcade through the bridge
                customer.targetX = -50;
                // Exit through bridge area (same as spawn)
                const entranceY = gameState.gridHeight / 2;
                const arcadeLetters = 6;
                const letterSpacing = 18;
                const totalTextHeight = arcadeLetters * letterSpacing;
                const bridgeStartY = entranceY - (totalTextHeight / 2);
                customer.targetY = bridgeStartY + Math.random() * totalTextHeight;
            }
        } else {
            // Calculate next position
            const speed = 2;
            const nextX = customer.sprite.x + (dx / distance) * speed;
            const nextY = customer.sprite.y + (dy / distance) * speed;

            // Move directly without collision checking
            customer.sprite.x = nextX;
            customer.sprite.y = nextY;
        }

        // Remove if off screen
        if (customer.sprite.x < -50) {
            customer.sprite.destroy();
            customer.text.destroy();
            gameState.customers.splice(index, 1);
        }
    });

    // Update staff movement
    gameState.staff.forEach(staff => {
        if (!staff.sprite || !staff.sprite.active) return;

        // Move towards target
        const dx = staff.targetX - staff.sprite.x;
        const dy = staff.targetY - staff.sprite.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 10) {
            // Reached target, pick new random target
            staff.targetX = 50 + Math.random() * (gameState.gridWidth - 100);
            staff.targetY = 50 + Math.random() * (gameState.gridHeight - 100);
        } else {
            // Move towards target
            staff.sprite.x += (dx / distance) * 1.5;
            staff.sprite.y += (dy / distance) * 1.5;
            staff.text.x = staff.sprite.x;
            staff.text.y = staff.sprite.y;
        }
    });

    // Machines don't rotate - they're top-down view

    // Update particles
    particlesGroup.getChildren().forEach(particle => {
        if (particle.active) {
            particle.y -= 1;
            particle.alpha -= 0.02;
            if (particle.alpha <= 0) particle.destroy();
        }
    });
}

function drawGrid(scene) {
    gridGraphics.clear();
    gridGraphics.lineStyle(1, 0x444466, 0.3);

    for (let x = 0; x < gameState.gridWidth; x += 80) {
        gridGraphics.lineBetween(x, 0, x, gameState.gridHeight);
    }

    for (let y = 0; y < gameState.gridHeight; y += 80) {
        gridGraphics.lineBetween(0, y, gameState.gridWidth, y);
    }
}

function drawWalls(scene) {
    const wallThickness = 20;
    const wallColor = 0x1a1a2e;
    const ledColors = [0xff006e, 0x00f5ff, 0xffd60a, 0x06ffa5, 0xff00ff];
    const entranceY = gameState.gridHeight / 2;
    const entranceHeight = 120;

    // Left wall - top part (above entrance)
    const topLeftWall = scene.add.rectangle(
        wallThickness / 2,
        (entranceY - entranceHeight / 2) / 2,
        wallThickness,
        entranceY - entranceHeight / 2,
        wallColor
    );
    wallsGroup.add(topLeftWall);

    // Left wall - bottom part (below entrance)
    const bottomLeftWall = scene.add.rectangle(
        wallThickness / 2,
        entranceY + entranceHeight / 2 + (gameState.gridHeight - entranceY - entranceHeight / 2) / 2,
        wallThickness,
        gameState.gridHeight - entranceY - entranceHeight / 2,
        wallColor
    );
    wallsGroup.add(bottomLeftWall);

    // Top wall (full width)
    const topWall = scene.add.rectangle(
        gameState.gridWidth / 2,
        wallThickness / 2,
        gameState.gridWidth,
        wallThickness,
        wallColor
    );
    wallsGroup.add(topWall);

    // Bottom wall (full width)
    const bottomWall = scene.add.rectangle(
        gameState.gridWidth / 2,
        gameState.gridHeight - wallThickness / 2,
        gameState.gridWidth,
        wallThickness,
        wallColor
    );
    wallsGroup.add(bottomWall);

    // Right wall (full height)
    const rightWall = scene.add.rectangle(
        gameState.gridWidth - wallThickness / 2,
        gameState.gridHeight / 2,
        wallThickness,
        gameState.gridHeight,
        wallColor
    );
    wallsGroup.add(rightWall);

    // Add LED strips along walls
    addLEDStrip(scene, 0, 0, gameState.gridWidth, 0); // Top
    addLEDStrip(scene, 0, gameState.gridHeight, gameState.gridWidth, gameState.gridHeight); // Bottom
    addLEDStrip(scene, gameState.gridWidth, 0, gameState.gridWidth, gameState.gridHeight); // Right
    addLEDStrip(scene, 0, 0, 0, entranceY - entranceHeight / 2); // Left top
    addLEDStrip(scene, 0, entranceY + entranceHeight / 2, 0, gameState.gridHeight); // Left bottom

    // Add vertical "ARCADE" sign at entrance
    const arcadeLetters = ['A', 'R', 'C', 'A', 'D', 'E'];
    const letterSpacing = 18;
    const totalTextHeight = arcadeLetters.length * letterSpacing;
    const startY = entranceY - (totalTextHeight / 2);

    // Add bridge/walkway at entrance - perfectly aligned with text
    const bridgeColor = 0x3a3a52;
    const bridgeWidth = 40;
    const bridge = scene.add.rectangle(
        -10,
        entranceY,
        bridgeWidth,
        totalTextHeight,
        bridgeColor
    );
    wallsGroup.add(bridge);

    // Add bridge border
    const bridgeGraphics = scene.add.graphics();
    bridgeGraphics.lineStyle(2, 0x555577, 1);
    bridgeGraphics.strokeRect(-30, startY, bridgeWidth, totalTextHeight);
    wallsGroup.add(bridgeGraphics);

    arcadeLetters.forEach((letter, index) => {
        const letterText = scene.add.text(wallThickness, startY + (index * letterSpacing) + 9, letter, {
            fontSize: '16px',
            fontStyle: 'bold',
            color: '#ffd700',
            fontFamily: 'Arial'
        });
        letterText.setOrigin(0.5);
        wallsGroup.add(letterText);
    });
}

function addLEDStrip(scene, x1, y1, x2, y2) {
    const ledSpacing = 40;
    const ledSize = 4;
    const ledColors = [0xff006e, 0x00f5ff, 0xffd60a, 0x06ffa5, 0xff00ff];

    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.sqrt(dx * dx + dy * dy);
    const numLEDs = Math.floor(length / ledSpacing);

    for (let i = 0; i < numLEDs; i++) {
        const t = i / numLEDs;
        const x = x1 + dx * t;
        const y = y1 + dy * t;

        const colorIndex = i % ledColors.length;
        const led = scene.add.circle(x, y, ledSize, ledColors[colorIndex]);
        led.setAlpha(0.8);
        wallsGroup.add(led);

        // Animate each LED with offset
        scene.tweens.add({
            targets: led,
            alpha: 0.3,
            scaleX: 0.7,
            scaleY: 0.7,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            delay: i * 50,
            ease: 'Sine.easeInOut'
        });
    }
}

function spawnCustomer() {
    if (!sceneRef || gameState.placedMachines.length === 0) return;

    const customerEmojis = ['🧑', '👨', '👩', '🧒', '👦', '👧', '🧔', '👴', '👵'];
    const emoji = customerEmojis[Math.floor(Math.random() * customerEmojis.length)];

    const targetMachine = gameState.placedMachines[Math.floor(Math.random() * gameState.placedMachines.length)];

    // Spawn at entrance bridge
    const entranceY = gameState.gridHeight / 2;
    const arcadeLetters = 6;
    const letterSpacing = 18;
    const totalTextHeight = arcadeLetters * letterSpacing;
    const bridgeStartY = entranceY - (totalTextHeight / 2);
    const bridgeEndY = entranceY + (totalTextHeight / 2);

    // Spawn within the bridge area
    const startY = bridgeStartY + Math.random() * totalTextHeight;
    const customerSprite = sceneRef.add.circle(-50, startY, 15, 0xffd700);
    const customerText = sceneRef.add.text(-50, startY, emoji, {
        fontSize: '24px'
    });
    customerText.setOrigin(0.5);

    customersGroup.add(customerSprite);
    customersGroup.add(customerText);

    const customer = {
        sprite: customerSprite,
        text: customerText,
        targetX: targetMachine.x,
        targetY: targetMachine.y,
        played: false,
        playTime: 0,
        visitedCounter: false
    };

    gameState.customers.push(customer);
    gameState.totalCustomers++;
    updateUI();
}

function createMoneyParticle(x, y) {
    if (!sceneRef) return;

    const particle = sceneRef.add.text(x, y, '💰', {
        fontSize: '20px'
    });
    particle.setOrigin(0.5);
    particlesGroup.add(particle);

    // Create floating money text
    const moneyText = sceneRef.add.text(x + 20, y - 20, '+$', {
        fontSize: '14px',
        color: '#4ecca3',
        fontStyle: 'bold'
    });
    particlesGroup.add(moneyText);

    // Play coin sound
    if (sounds.coin) sounds.coin.play();
}

function createCoinExchangeParticle(x, y) {
    if (!sceneRef) return;

    // Show coins being exchanged
    const coinParticle = sceneRef.add.text(x, y, '🪙', {
        fontSize: '20px'
    });
    coinParticle.setOrigin(0.5);
    particlesGroup.add(coinParticle);

    // Show coins turning into money
    setTimeout(() => {
        const moneyParticle = sceneRef.add.text(x + 10, y - 10, '💵', {
            fontSize: '20px'
        });
        moneyParticle.setOrigin(0.5);
        particlesGroup.add(moneyParticle);

        // Create floating exchange text
        const exchangeText = sceneRef.add.text(x + 25, y - 25, 'Exchange!', {
            fontSize: '12px',
            color: '#ffd700',
            fontStyle: 'bold'
        });
        particlesGroup.add(exchangeText);
    }, 300);
}


function placeMachine(scene, pointer) {
    const machineType = machineTypes.find(m => m.id === gameState.selectedMachine);

    if (!machineType || !machineType.unlocked) {
        updateInfo('❌ Machine not unlocked!');
        return;
    }

    if (gameState.money < machineType.cost) {
        updateInfo('❌ Not enough money!');
        return;
    }

    const snapX = Math.floor(pointer.x / 80) * 80 + 40;
    const snapY = Math.floor(pointer.y / 80) * 80 + 40;

    // Check if position is occupied
    let occupied = false;

    if (machineType.id === 'restaurant') {
        // Check 3x3 grid for restaurant (9 positions)
        // Restaurant needs to check if it overlaps with any existing machine
        occupied = gameState.placedMachines.some(m => {
            // If existing machine is also a restaurant
            if (m.type === 'restaurant') {
                // Check if 3x3 areas overlap
                return Math.abs(m.x - snapX) < 240 && Math.abs(m.y - snapY) < 240;
            } else {
                // Check if the 1x1 machine is within the 3x3 restaurant area
                return Math.abs(m.x - snapX) < 120 && Math.abs(m.y - snapY) < 120;
            }
        });
    } else {
        // For regular 1x1 machines
        occupied = gameState.placedMachines.some(m => {
            if (m.type === 'restaurant') {
                // Check if placing inside a restaurant's 3x3 area
                return Math.abs(m.x - snapX) < 120 && Math.abs(m.y - snapY) < 120;
            } else {
                // Regular 1x1 to 1x1 check
                return Math.abs(m.x - snapX) < 80 && Math.abs(m.y - snapY) < 80;
            }
        });
    }

    if (occupied) {
        updateInfo('❌ Space occupied!');
        return;
    }

    // Deduct money and place machine
    gameState.money -= machineType.cost;
    gameState.income += machineType.income;
    gameState.maintenanceCost += machineType.maintenance;
    gameState.fame += Math.floor(machineType.income / 2);

    // Create top-down machine
    const machineGraphics = scene.add.graphics();

    // Check if it's a restaurant, coin counter, massage chair, or regular machine
    if (machineType.id === 'restaurant') {
        // Draw restaurant with tables (3x3 grid = 240x240)
        machineGraphics.fillStyle(machineType.color, 1);
        machineGraphics.fillRoundedRect(snapX - 120, snapY - 120, 240, 240, 8);

        // Kitchen area (top section)
        const darkerColor = Phaser.Display.Color.IntegerToColor(machineType.color).darken(30).color;
        machineGraphics.fillStyle(darkerColor, 1);
        machineGraphics.fillRoundedRect(snapX - 110, snapY - 110, 220, 50, 5);

        // Dining area tables (6 tables in 2 rows of 3)
        machineGraphics.fillStyle(0x8b4513, 1); // Brown
        // Row 1
        machineGraphics.fillRect(snapX - 90, snapY - 30, 40, 30);
        machineGraphics.fillRect(snapX - 20, snapY - 30, 40, 30);
        machineGraphics.fillRect(snapX + 50, snapY - 30, 40, 30);
        // Row 2
        machineGraphics.fillRect(snapX - 90, snapY + 40, 40, 30);
        machineGraphics.fillRect(snapX - 20, snapY + 40, 40, 30);
        machineGraphics.fillRect(snapX + 50, snapY + 40, 40, 30);

        // Chairs around tables
        machineGraphics.fillStyle(0x654321, 1);
        // Row 1 tables
        // Table 1
        machineGraphics.fillCircle(snapX - 70, snapY - 35, 4);
        machineGraphics.fillCircle(snapX - 70, snapY + 5, 4);
        // Table 2
        machineGraphics.fillCircle(snapX, snapY - 35, 4);
        machineGraphics.fillCircle(snapX, snapY + 5, 4);
        // Table 3
        machineGraphics.fillCircle(snapX + 70, snapY - 35, 4);
        machineGraphics.fillCircle(snapX + 70, snapY + 5, 4);
        // Row 2 tables
        // Table 4
        machineGraphics.fillCircle(snapX - 70, snapY + 35, 4);
        machineGraphics.fillCircle(snapX - 70, snapY + 75, 4);
        // Table 5
        machineGraphics.fillCircle(snapX, snapY + 35, 4);
        machineGraphics.fillCircle(snapX, snapY + 75, 4);
        // Table 6
        machineGraphics.fillCircle(snapX + 70, snapY + 35, 4);
        machineGraphics.fillCircle(snapX + 70, snapY + 75, 4);

        // Border
        machineGraphics.lineStyle(2, 0xffffff, 1);
        machineGraphics.strokeRoundedRect(snapX - 120, snapY - 120, 240, 240, 8);

    } else if (machineType.id === 'massage') {
        // Draw massage chair
        machineGraphics.fillStyle(machineType.color, 1);
        machineGraphics.fillRoundedRect(snapX - 30, snapY - 25, 60, 50, 8);

        // Chair seat (main part)
        const seatColor = Phaser.Display.Color.IntegerToColor(machineType.color).darken(20).color;
        machineGraphics.fillStyle(seatColor, 1);
        machineGraphics.fillRoundedRect(snapX - 25, snapY - 5, 50, 30, 8);

        // Backrest (top part)
        const backrestColor = Phaser.Display.Color.IntegerToColor(machineType.color).lighten(10).color;
        machineGraphics.fillStyle(backrestColor, 1);
        machineGraphics.fillRoundedRect(snapX - 22, snapY - 20, 44, 18, 6);

        // Armrests (side rectangles)
        machineGraphics.fillStyle(seatColor, 1);
        machineGraphics.fillRoundedRect(snapX - 28, snapY, 8, 15, 3);
        machineGraphics.fillRoundedRect(snapX + 20, snapY, 8, 15, 3);

        // Headrest (small rounded rectangle at top)
        machineGraphics.fillStyle(0x8b7ba8, 1); // Lighter purple
        machineGraphics.fillRoundedRect(snapX - 15, snapY - 22, 30, 8, 4);

        // Footrest (bottom)
        machineGraphics.fillStyle(seatColor, 1);
        machineGraphics.fillRoundedRect(snapX - 12, snapY + 20, 24, 8, 3);

        // Border
        machineGraphics.lineStyle(2, 0xffffff, 1);
        machineGraphics.strokeRoundedRect(snapX - 30, snapY - 25, 60, 50, 8);

    } else if (machineType.id === 'coincounter') {
        // Draw coin counter booth
        machineGraphics.fillStyle(machineType.color, 1);
        machineGraphics.fillRoundedRect(snapX - 30, snapY - 25, 60, 50, 5);

        // Counter top (darker)
        const darkerColor = Phaser.Display.Color.IntegerToColor(machineType.color).darken(30).color;
        machineGraphics.fillStyle(darkerColor, 1);
        machineGraphics.fillRect(snapX - 28, snapY - 5, 56, 8);

        // Window/opening (lighter top section)
        const lighterColor = Phaser.Display.Color.IntegerToColor(machineType.color).lighten(20).color;
        machineGraphics.fillStyle(lighterColor, 1);
        machineGraphics.fillRoundedRect(snapX - 25, snapY - 20, 50, 12, 3);

        // Coin slots/tray
        machineGraphics.fillStyle(0x333333, 1);
        machineGraphics.fillRect(snapX - 15, snapY + 8, 30, 10);

        // Coin decorations
        machineGraphics.fillStyle(0xffd700, 1);
        machineGraphics.fillCircle(snapX - 10, snapY + 13, 3);
        machineGraphics.fillCircle(snapX, snapY + 13, 3);
        machineGraphics.fillCircle(snapX + 10, snapY + 13, 3);

        // Border
        machineGraphics.lineStyle(2, 0xffffff, 1);
        machineGraphics.strokeRoundedRect(snapX - 30, snapY - 25, 60, 50, 5);

    } else {
        // Regular arcade machine
        machineGraphics.fillStyle(machineType.color, 1);
        machineGraphics.fillRoundedRect(snapX - 30, snapY - 25, 60, 50, 5);

        // Screen area (darker)
        const darkerColor = Phaser.Display.Color.IntegerToColor(machineType.color).darken(30).color;
        machineGraphics.fillStyle(darkerColor, 1);
        machineGraphics.fillRoundedRect(snapX - 22, snapY - 18, 44, 20, 3);

        // Control panel (lighter strip at bottom)
        const lighterColor = Phaser.Display.Color.IntegerToColor(machineType.color).lighten(20).color;
        machineGraphics.fillStyle(lighterColor, 1);
        machineGraphics.fillRect(snapX - 25, snapY + 8, 50, 12);

        // Buttons (small circles on control panel)
        machineGraphics.fillStyle(0xff0000, 1);
        machineGraphics.fillCircle(snapX - 12, snapY + 14, 3);
        machineGraphics.fillStyle(0x00ff00, 1);
        machineGraphics.fillCircle(snapX - 3, snapY + 14, 3);
        machineGraphics.fillStyle(0x0000ff, 1);
        machineGraphics.fillCircle(snapX + 6, snapY + 14, 3);

        // Joystick (small circle on left side)
        machineGraphics.fillStyle(0x333333, 1);
        machineGraphics.fillCircle(snapX - 15, snapY + 2, 4);

        // Border
        machineGraphics.lineStyle(2, 0xffffff, 1);
        machineGraphics.strokeRoundedRect(snapX - 30, snapY - 25, 60, 50, 5);
    }

    machinesGroup.add(machineGraphics);

    // Add emoji icon on screen
    const emoji = scene.add.text(snapX, snapY - 8, machineType.name.split(' ')[0], {
        fontSize: '20px',
        align: 'center'
    });
    emoji.setOrigin(0.5);
    machinesGroup.add(emoji);

    // Create sparkle effect
    for (let i = 0; i < 8; i++) {
        setTimeout(() => {
            createSparkle(snapX, snapY);
        }, i * 100);
    }

    // Store machine data
    gameState.placedMachines.push({
        x: snapX,
        y: snapY,
        type: machineType.id,
        sprite: machineGraphics,
        emoji: emoji
    });

    // Start the game when first machine is placed
    if (!gameState.gameStarted) {
        gameState.gameStarted = true;
        updateInfo(`🎮 Game Started! Customers will now visit your machines!`);
    } else {
        updateInfo(`✅ Placed ${machineType.name}! +${machineType.income}/sec`);
    }

    // Play place sound
    if (sounds.place) sounds.place.play();

    updateUI();
    checkUnlocks();
    updateRank();
}

function initShop() {
    const shopDiv = document.getElementById('machine-shop');
    if (!shopDiv) {
        console.error('machine-shop element not found!');
        return;
    }

    shopDiv.innerHTML = ''; // Clear existing content

    machineTypes.forEach(machine => {
        const card = document.createElement('div');
        card.className = 'machine-card';
        if (!machine.unlocked) card.classList.add('locked');

        let content = `
            <div class="machine-name">${machine.name}</div>
            <div class="machine-stats">
                💰 Cost: $${machine.cost} | 📈 Income: $${machine.income}/sec<br>
                🔧 Maintenance: $${machine.maintenance}/day
            </div>
        `;

        if (!machine.unlocked) {
            content += `<div class="machine-cost">🔒 Unlock: $${machine.unlockCost}</div>`;
        }

        card.innerHTML = content;
        card.dataset.machineId = machine.id;

        card.addEventListener('click', () => {
            if (!machine.unlocked) {
                if (gameState.money >= machine.unlockCost) {
                    gameState.money -= machine.unlockCost;
                    machine.unlocked = true;
                    card.classList.remove('locked');
                    updateInfo(`🎉 Unlocked ${machine.name}!`);
                    if (sounds.unlock) sounds.unlock.play();
                    initShop(); // Refresh shop
                    initUpgrades();
                    updateUI();
                } else {
                    updateInfo(`❌ Need $${machine.unlockCost} to unlock!`);
                }
                return;
            }

            // Select for placement
            document.querySelectorAll('.machine-card').forEach(c =>
                c.classList.remove('selected')
            );
            card.classList.add('selected');
            gameState.selectedMachine = machine.id;
            updateInfo(`Selected ${machine.name} - Click to place!`);
        });

        shopDiv.appendChild(card);
    });

    console.log('Shop initialized with', machineTypes.length, 'machines');
}

function updateUI() {
    const dayEl = document.getElementById('day');
    const moneyEl = document.getElementById('money');
    const incomeEl = document.getElementById('income');
    const maintenanceEl = document.getElementById('maintenance');
    const fameEl = document.getElementById('fame');
    const rankEl = document.getElementById('rank');
    const customersEl = document.getElementById('customers');

    if (dayEl) dayEl.textContent = gameState.day;
    if (moneyEl) moneyEl.textContent = Math.floor(gameState.money);
    if (incomeEl) incomeEl.textContent = gameState.income;
    if (maintenanceEl) maintenanceEl.textContent = gameState.maintenanceCost;
    if (fameEl) fameEl.textContent = gameState.fame;
    if (rankEl) rankEl.textContent = gameState.rank;
    if (customersEl) customersEl.textContent = gameState.totalCustomers;
}

function updateInfo(text) {
    document.getElementById('info-text').textContent = text;
}

function advanceDay() {
    gameState.day++;

    // Calculate staff salaries
    let totalSalaries = 0;
    gameState.staff.forEach(staff => {
        totalSalaries += staff.salary;
    });

    // Calculate maintenance with technician discount
    const techCount = gameState.staff.filter(s => s.type === 'technician').length;
    const maintenanceDiscount = techCount * 0.2;
    const actualMaintenance = Math.floor(gameState.maintenanceCost * (1 - Math.min(maintenanceDiscount, 0.8)));

    // Calculate investment returns
    let totalReturns = 0;
    gameState.investments.forEach(investment => {
        const investType = investmentTypes.find(t => t.id === investment.type);
        if (investType) {
            const dailyProfit = Math.floor(investment.amount * investType.dailyReturn);
            totalReturns += dailyProfit;
        }
    });

    const totalCosts = actualMaintenance + totalSalaries;

    // Pay daily costs and add investment returns
    gameState.money -= totalCosts;
    gameState.money += totalReturns;

    if (gameState.money < 0) {
        updateInfo(`⚠️ Day ${gameState.day} - Can't pay costs! Debt: $${Math.abs(Math.floor(gameState.money))}`);
    } else if (totalReturns > 0) {
        updateInfo(`📅 Day ${gameState.day} - Costs: $${totalCosts} | Investment Returns: +$${totalReturns}`);
    } else if (totalCosts > 0) {
        updateInfo(`📅 Day ${gameState.day} - Paid $${actualMaintenance} maintenance + $${totalSalaries} salaries`);
    } else {
        updateInfo(`📅 Day ${gameState.day} started!`);
    }

    updateUI();
}

function checkUnlocks() {
    // Auto-unlock based on fame milestones
    if (gameState.fame >= 30 && !machineTypes[2].unlocked) {
        machineTypes[2].unlocked = true;
        updateInfo('🎉 Racing Game unlocked for free!');
        if (sounds.unlock) sounds.unlock.play();
        initShop();
    }
    if (gameState.fame >= 100 && !machineTypes[3].unlocked) {
        machineTypes[3].unlocked = true;
        updateInfo('🎉 Fighter Arena unlocked for free!');
        if (sounds.unlock) sounds.unlock.play();
        initShop();
    }
}

function createSparkle(x, y) {
    if (!sceneRef) return;

    const angle = Math.random() * Math.PI * 2;
    const speed = 2 + Math.random() * 3;
    const sparkle = sceneRef.add.circle(
        x,
        y,
        3 + Math.random() * 5,
        0xffd700
    );
    sparkle.velocityX = Math.cos(angle) * speed;
    sparkle.velocityY = Math.sin(angle) * speed;
    particlesGroup.add(sparkle);

    const interval = setInterval(() => {
        sparkle.x += sparkle.velocityX;
        sparkle.y += sparkle.velocityY;
        sparkle.alpha -= 0.05;
        if (sparkle.alpha <= 0) {
            sparkle.destroy();
            clearInterval(interval);
        }
    }, 16);
}

function initUpgrades() {
    const shopDiv = document.getElementById('machine-shop');
    if (!shopDiv) {
        console.error('machine-shop element not found!');
        return;
    }

    const upgradeHeader = document.createElement('h2');
    upgradeHeader.textContent = '⬆️ Upgrades';
    upgradeHeader.style.marginTop = '20px';
    upgradeHeader.style.color = '#ffd700';
    upgradeHeader.className = 'upgrade-section';
    shopDiv.appendChild(upgradeHeader);

    upgrades.forEach(upgrade => {
        const card = document.createElement('div');
        card.className = 'machine-card upgrade-card';

        const cost = Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.owned));
        const maxText = upgrade.maxOwned ? ` / ${upgrade.maxOwned}` : '';
        const isMaxed = upgrade.maxOwned && upgrade.owned >= upgrade.maxOwned;

        card.innerHTML = `
            <div class="machine-name">${upgrade.name}</div>
            <div class="machine-stats">${upgrade.description}</div>
            <div class="machine-cost">💰 Cost: ${isMaxed ? 'MAX' : '$' + cost} | Owned: ${upgrade.owned}${maxText}</div>
        `;

        if (isMaxed) {
            card.style.opacity = '0.5';
            card.style.cursor = 'not-allowed';
        }

        card.addEventListener('click', () => {
            buyUpgrade(upgrade);
        });

        card.dataset.upgradeId = upgrade.id;
        shopDiv.appendChild(card);
    });

    console.log('Upgrades initialized with', upgrades.length, 'items');
}

function buyUpgrade(upgrade) {
    // Check max owned limit
    if (upgrade.maxOwned && upgrade.owned >= upgrade.maxOwned) {
        updateInfo(`❌ Maximum ${upgrade.name} reached!`);
        return;
    }

    const cost = Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.owned));

    if (gameState.money < cost) {
        updateInfo(`❌ Need $${cost} for ${upgrade.name}!`);
        return;
    }

    gameState.money -= cost;
    upgrade.owned++;

    // Apply upgrade effects
    if (upgrade.id === 'expand') {
        gameState.gridWidth += 400;
        sceneRef.scale.resize(gameState.gridWidth, gameState.gridHeight);
        drawGrid(sceneRef);

        // Redraw walls with new width
        wallsGroup.clear(true, true);
        drawWalls(sceneRef);

        updateInfo('🏗️ Area expanded right!');
    } else if (upgrade.id === 'expand_up') {
        gameState.gridHeight += 300;
        sceneRef.scale.resize(gameState.gridWidth, gameState.gridHeight);
        drawGrid(sceneRef);

        // Redraw walls with new height
        wallsGroup.clear(true, true);
        drawWalls(sceneRef);

        updateInfo('⬆️ Area expanded upward!');
    } else if (upgrade.id === 'income_boost') {
        gameState.incomeMultiplier += 0.25;
        updateInfo('💎 Income boosted by 25%!');
    } else if (upgrade.id === 'customer_speed') {
        gameState.customerSpawnRate += 0.5;
        updateInfo('🏃 More customers incoming!');
    }

    updateUI();

    // Refresh shop and upgrades
    const shopDiv = document.getElementById('machine-shop');
    const upgradeElements = shopDiv.querySelectorAll('.upgrade-section, .upgrade-card');
    upgradeElements.forEach(el => el.remove());
    initUpgrades();
}

function updateRank() {
    const totalScore = gameState.fame + gameState.placedMachines.length * 10;

    for (let i = ranks.length - 1; i >= 0; i--) {
        if (totalScore >= ranks[i].threshold) {
            if (gameState.rank !== ranks[i].name) {
                const oldRank = gameState.rank;
                gameState.rank = ranks[i].name;
                updateInfo(`🎉 RANK UP! You are now ${ranks[i].name}!`);

                // Check if reached 10 stars (ULTIMATE)
                if (ranks[i].stars === 10 && (!oldRank || !oldRank.includes('10⭐'))) {
                    setTimeout(() => {
                        showLegendaryWin();
                    }, 1000);
                }

                // Rank display color
                const rankDisplay = document.querySelector('.rank-display');
                rankDisplay.style.background = `linear-gradient(135deg, ${ranks[i].color} 0%, ${ranks[i].color}dd 100%)`;
            }
            break;
        }
    }

    gameState.rankProgress = totalScore;
}

function showStaffHire() {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.8); display: flex; align-items: center;
        justify-content: center; z-index: 1000;
    `;
    modal.className = 'modal-overlay';

    // Click outside to close
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });

    const content = document.createElement('div');
    content.style.cssText = `
        background: linear-gradient(135deg, #0f3460 0%, #16213e 100%);
        padding: 30px; border-radius: 15px; border: 3px solid #e94560;
        max-width: 500px; width: 90%;
    `;

    let html = '<h2 style="color: #ffd700; margin-bottom: 20px;">👥 Hire Staff</h2>';

    staffTypes.forEach(staff => {
        const count = gameState.staff.filter(s => s.type === staff.id).length;
        html += `
            <div style="background: rgba(255,255,255,0.1); padding: 15px; margin: 10px 0; border-radius: 10px; border: 2px solid #e94560;">
                <div style="color: #ffd700; font-size: 18px; font-weight: bold;">${staff.name}</div>
                <div style="color: #aaa; font-size: 14px; margin: 5px 0;">${staff.effect}</div>
                <div style="color: #4ecca3; font-weight: bold;">Cost: $${staff.cost} | Salary: $${staff.salary}/day | Hired: ${count}</div>
                <button onclick="hireStaff('${staff.id}')" style="
                    background: #e94560; color: white; border: none; padding: 8px 15px;
                    border-radius: 5px; cursor: pointer; margin-top: 10px; font-weight: bold;
                ">Hire Now</button>
            </div>
        `;
    });

    html += '<button onclick="this.parentElement.parentElement.remove()" style="background: #666; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-top: 15px; width: 100%; font-weight: bold;">Close</button>';

    content.innerHTML = html;
    modal.appendChild(content);
    document.body.appendChild(modal);

    // ESC key to close
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);
}

function hireStaff(staffId) {
    const staffType = staffTypes.find(s => s.id === staffId);
    if (!staffType) return;

    if (gameState.money < staffType.cost) {
        updateInfo(`❌ Need $${staffType.cost} to hire ${staffType.name}!`);
        return;
    }

    gameState.money -= staffType.cost;

    // Create staff sprite
    const startX = 50 + Math.random() * (gameState.gridWidth - 100);
    const startY = 50 + Math.random() * (gameState.gridHeight - 100);

    if (sceneRef) {
        // Create blue circle for body
        const staffSprite = sceneRef.add.circle(startX, startY, 15, 0x4169e1); // Royal blue
        const staffText = sceneRef.add.text(startX, startY, '👔', {
            fontSize: '24px'
        });
        staffText.setOrigin(0.5);

        staffGroup.add(staffSprite);
        staffGroup.add(staffText);

        gameState.staff.push({
            type: staffId,
            salary: staffType.salary,
            sprite: staffSprite,
            text: staffText,
            targetX: 100 + Math.random() * (gameState.gridWidth - 200),
            targetY: 100 + Math.random() * (gameState.gridHeight - 200)
        });
    } else {
        gameState.staff.push({
            type: staffId,
            salary: staffType.salary
        });
    }

    // Apply staff effects
    if (staffId === 'technician') {
        const techCount = gameState.staff.filter(s => s.type === 'technician').length;
        // Maintenance reduction handled in advanceDay
    } else if (staffId === 'marketer') {
        gameState.customerSpawnRate += 0.3;
    }

    updateInfo(`✅ Hired ${staffType.name}!`);
    updateUI();
    document.querySelectorAll('[onclick^="hireStaff"]').forEach(btn => {
        btn.parentElement.parentElement.parentElement.remove();
    });
    showStaffHire(); // Refresh modal
}

function showResearch() {
    updateInfo('🔬 Research system: Coming soon! Earn research points by operating your empire.');
    gameState.researchPoints += 10;
    updateInfo(`🔬 Research points: ${gameState.researchPoints} (Feature in development)`);
}

function showInstructions() {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.8); display: flex; align-items: center;
        justify-content: center; z-index: 1000;
    `;
    modal.className = 'modal-overlay';

    // Click outside to close
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });

    const content = document.createElement('div');
    content.style.cssText = `
        background: linear-gradient(135deg, #0f3460 0%, #16213e 100%);
        padding: 30px; border-radius: 15px; border: 3px solid #e94560;
        max-width: 600px; width: 90%; max-height: 80vh; overflow-y: auto;
    `;

    content.innerHTML = `
        <h2 style="color: #ffd700; margin-bottom: 20px;">📖 How to Play</h2>

        <div style="background: rgba(255,255,255,0.1); padding: 15px; margin: 10px 0; border-radius: 10px; border: 2px solid #4ecca3;">
            <h3 style="color: #4ecca3; margin-bottom: 10px;">🎯 Objective</h3>
            <p style="color: #eee; line-height: 1.6;">Build and manage your empire! Place machines, earn money, hire staff, and rank up from Rookie to Legendary!</p>
        </div>

        <div style="background: rgba(255,255,255,0.1); padding: 15px; margin: 10px 0; border-radius: 10px; border: 2px solid #ffd700;">
            <h3 style="color: #ffd700; margin-bottom: 10px;">🎮 Placing Machines</h3>
            <p style="color: #eee; line-height: 1.6;">
                1. Click a machine in the shop to select it<br>
                2. Click on the grid to place it<br>
                3. Each machine generates income per second<br>
                4. Press ESC to cancel placement
            </p>
        </div>

        <div style="background: rgba(255,255,255,0.1); padding: 15px; margin: 10px 0; border-radius: 10px; border: 2px solid #ff6b9d;">
            <h3 style="color: #ff6b9d; margin-bottom: 10px;">💰 Money & Income</h3>
            <p style="color: #eee; line-height: 1.6;">
                • Machines generate passive income every second<br>
                • Customers visit machines and give extra money<br>
                • Pay maintenance costs every day (30 seconds)<br>
                • Unlock better machines as you progress
            </p>
        </div>

        <div style="background: rgba(255,255,255,0.1); padding: 15px; margin: 10px 0; border-radius: 10px; border: 2px solid #c44569;">
            <h3 style="color: #c44569; margin-bottom: 10px;">👥 Staff & Upgrades</h3>
            <p style="color: #eee; line-height: 1.6;">
                • 👔 Workers walk around your area<br>
                • 🔧 Technicians reduce maintenance costs by 20%<br>
                • 📢 Marketers increase customer spawn rate<br>
                • Buy upgrades to expand your area and boost income
            </p>
        </div>

        <div style="background: rgba(255,255,255,0.1); padding: 15px; margin: 10px 0; border-radius: 10px; border: 2px solid #00f5ff;">
            <h3 style="color: #00f5ff; margin-bottom: 10px;">🏆 Ranks & Fame</h3>
            <p style="color: #eee; line-height: 1.6;">
                Earn fame by placing machines and rank up!<br>
                Higher ranks show your empire success.<br>
                Click the 🏆 Ranks button to see requirements.
            </p>
        </div>

        <button onclick="this.parentElement.parentElement.remove()" style="
            background: #e94560; color: white; border: none; padding: 12px 20px;
            border-radius: 5px; cursor: pointer; margin-top: 15px; width: 100%;
            font-weight: bold; font-size: 16px; font-family: 'Courier New', monospace;
        ">Close</button>
    `;

    modal.appendChild(content);
    document.body.appendChild(modal);

    // ESC key to close
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);
}

function showRanks() {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.8); display: flex; align-items: center;
        justify-content: center; z-index: 1000;
    `;
    modal.className = 'modal-overlay';

    // Click outside to close
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });

    const content = document.createElement('div');
    content.style.cssText = `
        background: linear-gradient(135deg, #0f3460 0%, #16213e 100%);
        padding: 30px; border-radius: 15px; border: 3px solid #e94560;
        max-width: 500px; width: 90%; max-height: 80vh; overflow-y: auto;
    `;

    const totalScore = gameState.fame + gameState.placedMachines.length * 10;
    let currentRankIndex = 0;
    for (let i = ranks.length - 1; i >= 0; i--) {
        if (totalScore >= ranks[i].threshold) {
            currentRankIndex = i;
            break;
        }
    }

    let html = `
        <h2 style="color: #ffd700; margin-bottom: 10px;">⭐ Star Rating Chart</h2>
        <p style="color: #aaa; margin-bottom: 20px;">Your Score: ${totalScore} (Fame + Machines × 10)</p>
    `;

    ranks.forEach((rank, index) => {
        const isCurrentRank = index === currentRankIndex;
        const isUnlocked = totalScore >= rank.threshold;
        const nextRank = ranks[index + 1];
        const progress = nextRank ? Math.min(100, ((totalScore - rank.threshold) / (nextRank.threshold - rank.threshold)) * 100) : 100;

        // Display stars visually
        const starsDisplay = '⭐'.repeat(rank.stars);

        html += `
            <div style="
                background: ${isCurrentRank ? 'rgba(255,215,0,0.2)' : 'rgba(255,255,255,0.1)'};
                padding: 15px; margin: 10px 0; border-radius: 10px;
                border: 3px solid ${isCurrentRank ? rank.color : (isUnlocked ? rank.color : '#666')};
                ${isCurrentRank ? 'box-shadow: 0 0 20px ' + rank.color + '88;' : ''}
            ">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <div style="color: ${rank.color}; font-size: 18px; font-weight: bold;">
                        ${isCurrentRank ? '➤ ' : ''}${rank.name}
                    </div>
                    <div style="color: #4ecca3; font-weight: bold;">
                        ${isUnlocked ? '✅' : '🔒'} ${rank.threshold} pts
                    </div>
                </div>
                <div style="color: ${rank.color}; font-size: 16px; margin-top: 5px;">
                    ${starsDisplay}
                </div>
                ${isCurrentRank && nextRank ? `
                    <div style="background: rgba(0,0,0,0.3); border-radius: 5px; height: 8px; margin-top: 10px; overflow: hidden;">
                        <div style="background: ${rank.color}; height: 100%; width: ${progress}%; transition: width 0.3s;"></div>
                    </div>
                    <div style="color: #aaa; font-size: 12px; margin-top: 5px;">
                        ${Math.floor(progress)}% to ${nextRank.name} (${nextRank.threshold - totalScore} pts needed)
                    </div>
                ` : ''}
            </div>
        `;
    });

    html += `
        <button onclick="this.parentElement.parentElement.remove()" style="
            background: #e94560; color: white; border: none; padding: 12px 20px;
            border-radius: 5px; cursor: pointer; margin-top: 15px; width: 100%;
            font-weight: bold; font-size: 16px; font-family: 'Courier New', monospace;
        ">Close</button>
    `;

    content.innerHTML = html;
    modal.appendChild(content);
    document.body.appendChild(modal);
}

function showInvestments() {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.8); display: flex; align-items: center;
        justify-content: center; z-index: 1000;
    `;
    modal.className = 'modal-overlay';

    // Click outside to close
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });

    const content = document.createElement('div');
    content.style.cssText = `
        background: linear-gradient(135deg, #0f3460 0%, #16213e 100%);
        padding: 30px; border-radius: 15px; border: 3px solid #e94560;
        max-width: 600px; width: 90%; max-height: 80vh; overflow-y: auto;
    `;

    let totalInvested = 0;
    let totalDailyReturns = 0;
    gameState.investments.forEach(inv => {
        totalInvested += inv.amount;
        const invType = investmentTypes.find(t => t.id === inv.type);
        if (invType) totalDailyReturns += Math.floor(inv.amount * invType.dailyReturn);
    });

    let html = `
        <h2 style="color: #ffd700; margin-bottom: 10px;">💰 Investment Portfolio</h2>
        <p style="color: #aaa; margin-bottom: 20px;">Total Invested: $${totalInvested} | Daily Returns: $${totalDailyReturns}</p>
        <h3 style="color: #4ecca3; margin-bottom: 15px;">Your Investments:</h3>
    `;

    if (gameState.investments.length === 0) {
        html += '<p style="color: #aaa; margin-bottom: 20px;">No investments yet. Start investing below!</p>';
    } else {
        gameState.investments.forEach((inv, index) => {
            const invType = investmentTypes.find(t => t.id === inv.type);
            const dailyReturn = Math.floor(inv.amount * invType.dailyReturn);
            html += `
                <div style="background: rgba(78,204,163,0.2); padding: 12px; margin: 8px 0; border-radius: 8px; border: 2px solid #4ecca3; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <div style="color: #ffd700; font-weight: bold;">${invType.name}</div>
                        <div style="color: #eee; font-size: 14px;">Invested: $${inv.amount} | Daily: +$${dailyReturn}</div>
                    </div>
                    <button onclick="withdrawInvestment(${index})" style="
                        background: #e94560; color: white; border: none; padding: 6px 12px;
                        border-radius: 5px; cursor: pointer; font-weight: bold; font-size: 12px;
                    ">Withdraw</button>
                </div>
            `;
        });
    }

    html += '<h3 style="color: #ffd700; margin-top: 20px; margin-bottom: 15px;">Available Investments:</h3>';

    investmentTypes.forEach(inv => {
        html += `
            <div style="background: rgba(255,255,255,0.1); padding: 15px; margin: 10px 0; border-radius: 10px; border: 2px solid #e94560;">
                <div style="color: #ffd700; font-size: 18px; font-weight: bold; margin-bottom: 5px;">${inv.name}</div>
                <div style="color: #aaa; font-size: 14px; margin: 5px 0;">${inv.description}</div>
                <div style="color: #4ecca3; font-weight: bold; margin: 8px 0;">Min: $${inv.minInvest}</div>
                <input type="number" id="invest-${inv.id}" placeholder="Amount" min="${inv.minInvest}" step="100" style="
                    width: 100%; padding: 8px; margin: 8px 0; border-radius: 5px; border: 2px solid #e94560;
                    background: rgba(0,0,0,0.3); color: #fff; font-family: 'Courier New', monospace;
                ">
                <button onclick="makeInvestment('${inv.id}')" style="
                    background: #4ecca3; color: #16213e; border: none; padding: 8px 15px;
                    border-radius: 5px; cursor: pointer; width: 100%; font-weight: bold;
                ">Invest Now</button>
            </div>
        `;
    });

    html += '<button onclick="this.parentElement.parentElement.remove()" style="background: #666; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-top: 15px; width: 100%; font-weight: bold;">Close</button>';

    content.innerHTML = html;
    modal.appendChild(content);
    document.body.appendChild(modal);

    // ESC key to close
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);
}

function makeInvestment(investId) {
    const investType = investmentTypes.find(t => t.id === investId);
    if (!investType) return;

    const inputField = document.getElementById(`invest-${investId}`);
    const amount = parseInt(inputField.value);

    if (!amount || amount < investType.minInvest) {
        updateInfo(`❌ Minimum investment is $${investType.minInvest}!`);
        return;
    }

    if (gameState.money < amount) {
        updateInfo(`❌ Not enough money! Need $${amount}`);
        return;
    }

    gameState.money -= amount;
    gameState.investments.push({
        type: investId,
        amount: amount
    });

    updateInfo(`✅ Invested $${amount} in ${investType.name}!`);
    if (sounds.invest) sounds.invest.play();
    updateUI();

    // Refresh modal
    document.querySelectorAll('[onclick^="makeInvestment"]').forEach(btn => {
        btn.parentElement.parentElement.parentElement.remove();
    });
    showInvestments();
}

function withdrawInvestment(index) {
    if (index >= gameState.investments.length) return;

    const investment = gameState.investments[index];
    const investType = investmentTypes.find(t => t.id === investment.type);

    gameState.money += investment.amount;
    gameState.investments.splice(index, 1);

    updateInfo(`💵 Withdrew $${investment.amount} from ${investType.name}`);
    if (sounds.coin) sounds.coin.play();
    updateUI();

    // Refresh modal
    document.querySelectorAll('[onclick^="withdrawInvestment"]').forEach(btn => {
        btn.parentElement.parentElement.parentElement.remove();
    });
    showInvestments();
}

function startBackgroundMusic() {
    // Create simple looping background music using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Create a simple melody loop
    const playNote = (frequency, startTime, duration) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = 'triangle';

        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.03, startTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
    };

    // Simple chord progression (C - Am - F - G)
    const melody = [
        [523.25, 659.25], // C - E
        [440.00, 554.37], // A - C#
        [349.23, 523.25], // F - C
        [392.00, 493.88]  // G - B
    ];

    const loopMusic = () => {
        const currentTime = audioContext.currentTime;
        const beatDuration = 0.8;

        melody.forEach((chord, i) => {
            const startTime = currentTime + (i * beatDuration);
            chord.forEach(freq => {
                playNote(freq, startTime, beatDuration * 0.9);
            });
        });

        // Loop every 3.2 seconds
        setTimeout(loopMusic, 3200);
    };

    loopMusic();
}

function saveGame() {
    try {
        const saveData = {
            money: gameState.money,
            income: gameState.income,
            fame: gameState.fame,
            placedMachines: gameState.placedMachines.map(m => ({
                x: m.x,
                y: m.y,
                type: m.type
            })),
            gridWidth: gameState.gridWidth,
            gridHeight: gameState.gridHeight,
            expansions: gameState.expansions,
            incomeMultiplier: gameState.incomeMultiplier,
            customerSpawnRate: gameState.customerSpawnRate,
            day: gameState.day,
            maintenanceCost: gameState.maintenanceCost,
            staff: gameState.staff.map(s => ({
                type: s.type,
                salary: s.salary
            })),
            researchPoints: gameState.researchPoints,
            rank: gameState.rank,
            rankProgress: gameState.rankProgress,
            investments: gameState.investments,
            unlockedMachines: machineTypes.map(m => m.unlocked),
            upgradesOwned: upgrades.map(u => u.owned),
            totalCustomers: gameState.totalCustomers,
            gameStarted: gameState.gameStarted
        };

        localStorage.setItem('empireTycoonSave', JSON.stringify(saveData));
        updateInfo('💾 Game saved successfully!');
    } catch (error) {
        updateInfo('❌ Failed to save game!');
        console.error(error);
    }
}

function exportGame() {
    try {
        const saveData = {
            money: gameState.money,
            income: gameState.income,
            fame: gameState.fame,
            placedMachines: gameState.placedMachines.map(m => ({
                x: m.x,
                y: m.y,
                type: m.type
            })),
            gridWidth: gameState.gridWidth,
            gridHeight: gameState.gridHeight,
            expansions: gameState.expansions,
            incomeMultiplier: gameState.incomeMultiplier,
            customerSpawnRate: gameState.customerSpawnRate,
            day: gameState.day,
            maintenanceCost: gameState.maintenanceCost,
            staff: gameState.staff.map(s => ({
                type: s.type,
                salary: s.salary
            })),
            researchPoints: gameState.researchPoints,
            rank: gameState.rank,
            rankProgress: gameState.rankProgress,
            investments: gameState.investments,
            unlockedMachines: machineTypes.map(m => m.unlocked),
            upgradesOwned: upgrades.map(u => u.owned),
            totalCustomers: gameState.totalCustomers,
            gameStarted: gameState.gameStarted
        };

        const dataStr = JSON.stringify(saveData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `empire-tycoon-save-day${gameState.day}.json`;
        link.click();

        URL.revokeObjectURL(url);
        updateInfo('📤 Game exported successfully!');
    } catch (error) {
        updateInfo('❌ Failed to export game!');
        console.error(error);
    }
}

function loadGame() {
    try {
        const saveData = localStorage.getItem('empireTycoonSave');

        if (!saveData) {
            updateInfo('❌ No save file found!');
            return;
        }

        const data = JSON.parse(saveData);

        // Restore game state
        gameState.money = data.money;
        gameState.income = data.income;
        gameState.fame = data.fame;
        gameState.gridWidth = data.gridWidth;
        gameState.gridHeight = data.gridHeight;
        gameState.expansions = data.expansions;
        gameState.incomeMultiplier = data.incomeMultiplier;
        gameState.customerSpawnRate = data.customerSpawnRate;
        gameState.day = data.day;
        gameState.maintenanceCost = data.maintenanceCost;
        gameState.researchPoints = data.researchPoints;

        // Clear and restore staff
        gameState.staff.forEach(staff => {
            if (staff.sprite) staff.sprite.destroy();
            if (staff.text) staff.text.destroy();
        });
        gameState.staff = [];

        if (data.staff) {
            data.staff.forEach(staffData => {
                const staffType = staffTypes.find(s => s.id === staffData.type);
                if (staffType && sceneRef) {
                    const startX = 50 + Math.random() * (gameState.gridWidth - 100);
                    const startY = 50 + Math.random() * (gameState.gridHeight - 100);

                    const staffSprite = sceneRef.add.circle(startX, startY, 15, 0x4169e1);
                    const staffText = sceneRef.add.text(startX, startY, '👔', { fontSize: '24px' });
                    staffText.setOrigin(0.5);

                    staffGroup.add(staffSprite);
                    staffGroup.add(staffText);

                    gameState.staff.push({
                        type: staffData.type,
                        salary: staffData.salary,
                        sprite: staffSprite,
                        text: staffText,
                        targetX: 100 + Math.random() * (gameState.gridWidth - 200),
                        targetY: 100 + Math.random() * (gameState.gridHeight - 200)
                    });
                }
            });
        }
        gameState.rank = data.rank;
        gameState.rankProgress = data.rankProgress;
        gameState.investments = data.investments;
        gameState.totalCustomers = data.totalCustomers || 0;
        gameState.gameStarted = data.gameStarted || false;

        // Restore unlocked machines
        if (data.unlockedMachines) {
            data.unlockedMachines.forEach((unlocked, index) => {
                if (machineTypes[index]) {
                    machineTypes[index].unlocked = unlocked;
                }
            });
        }

        // Restore upgrades
        if (data.upgradesOwned) {
            data.upgradesOwned.forEach((owned, index) => {
                if (upgrades[index]) {
                    upgrades[index].owned = owned;
                }
            });
        }

        // Clear existing machines
        if (machinesGroup) {
            machinesGroup.clear(true, true);
        }
        gameState.placedMachines = [];

        // Recreate machines
        if (data.placedMachines) {
            data.placedMachines.forEach(machineData => {
                const machineType = machineTypes.find(m => m.id === machineData.type);
                if (machineType && sceneRef) {
                    recreateMachine(machineData.x, machineData.y, machineType);
                }
            });
        }

        // Redraw scene
        if (sceneRef) {
            sceneRef.scale.resize(gameState.gridWidth, gameState.gridHeight);
            drawGrid(sceneRef);
            wallsGroup.clear(true, true);
            drawWalls(sceneRef);
        }

        initShop();
        initUpgrades();
        updateUI();
        updateInfo('📂 Game loaded successfully!');
    } catch (error) {
        updateInfo('❌ Failed to load game!');
        console.error(error);
    }
}

function recreateMachine(x, y, machineType) {
    // Create top-down machine
    const machineGraphics = sceneRef.add.graphics();

    // Check if it's a restaurant, coin counter, massage chair, or regular machine
    if (machineType.id === 'restaurant') {
        // Draw restaurant with tables (3x3 grid = 240x240)
        machineGraphics.fillStyle(machineType.color, 1);
        machineGraphics.fillRoundedRect(x - 120, y - 120, 240, 240, 8);

        // Kitchen area (top section)
        const darkerColor = Phaser.Display.Color.IntegerToColor(machineType.color).darken(30).color;
        machineGraphics.fillStyle(darkerColor, 1);
        machineGraphics.fillRoundedRect(x - 110, y - 110, 220, 50, 5);

        // Dining area tables (6 tables in 2 rows of 3)
        machineGraphics.fillStyle(0x8b4513, 1); // Brown
        // Row 1
        machineGraphics.fillRect(x - 90, y - 30, 40, 30);
        machineGraphics.fillRect(x - 20, y - 30, 40, 30);
        machineGraphics.fillRect(x + 50, y - 30, 40, 30);
        // Row 2
        machineGraphics.fillRect(x - 90, y + 40, 40, 30);
        machineGraphics.fillRect(x - 20, y + 40, 40, 30);
        machineGraphics.fillRect(x + 50, y + 40, 40, 30);

        // Chairs around tables
        machineGraphics.fillStyle(0x654321, 1);
        // Row 1 tables
        // Table 1
        machineGraphics.fillCircle(x - 70, y - 35, 4);
        machineGraphics.fillCircle(x - 70, y + 5, 4);
        // Table 2
        machineGraphics.fillCircle(x, y - 35, 4);
        machineGraphics.fillCircle(x, y + 5, 4);
        // Table 3
        machineGraphics.fillCircle(x + 70, y - 35, 4);
        machineGraphics.fillCircle(x + 70, y + 5, 4);
        // Row 2 tables
        // Table 4
        machineGraphics.fillCircle(x - 70, y + 35, 4);
        machineGraphics.fillCircle(x - 70, y + 75, 4);
        // Table 5
        machineGraphics.fillCircle(x, y + 35, 4);
        machineGraphics.fillCircle(x, y + 75, 4);
        // Table 6
        machineGraphics.fillCircle(x + 70, y + 35, 4);
        machineGraphics.fillCircle(x + 70, y + 75, 4);

        // Border
        machineGraphics.lineStyle(2, 0xffffff, 1);
        machineGraphics.strokeRoundedRect(x - 120, y - 120, 240, 240, 8);

    } else if (machineType.id === 'massage') {
        // Draw massage chair
        machineGraphics.fillStyle(machineType.color, 1);
        machineGraphics.fillRoundedRect(x - 30, y - 25, 60, 50, 8);

        // Chair seat (main part)
        const seatColor = Phaser.Display.Color.IntegerToColor(machineType.color).darken(20).color;
        machineGraphics.fillStyle(seatColor, 1);
        machineGraphics.fillRoundedRect(x - 25, y - 5, 50, 30, 8);

        // Backrest (top part)
        const backrestColor = Phaser.Display.Color.IntegerToColor(machineType.color).lighten(10).color;
        machineGraphics.fillStyle(backrestColor, 1);
        machineGraphics.fillRoundedRect(x - 22, y - 20, 44, 18, 6);

        // Armrests (side rectangles)
        machineGraphics.fillStyle(seatColor, 1);
        machineGraphics.fillRoundedRect(x - 28, y, 8, 15, 3);
        machineGraphics.fillRoundedRect(x + 20, y, 8, 15, 3);

        // Headrest (small rounded rectangle at top)
        machineGraphics.fillStyle(0x8b7ba8, 1); // Lighter purple
        machineGraphics.fillRoundedRect(x - 15, y - 22, 30, 8, 4);

        // Footrest (bottom)
        machineGraphics.fillStyle(seatColor, 1);
        machineGraphics.fillRoundedRect(x - 12, y + 20, 24, 8, 3);

        // Border
        machineGraphics.lineStyle(2, 0xffffff, 1);
        machineGraphics.strokeRoundedRect(x - 30, y - 25, 60, 50, 8);

    } else if (machineType.id === 'coincounter') {
        // Draw coin counter booth
        machineGraphics.fillStyle(machineType.color, 1);
        machineGraphics.fillRoundedRect(x - 30, y - 25, 60, 50, 5);

        // Counter top (darker)
        const darkerColor = Phaser.Display.Color.IntegerToColor(machineType.color).darken(30).color;
        machineGraphics.fillStyle(darkerColor, 1);
        machineGraphics.fillRect(x - 28, y - 5, 56, 8);

        // Window/opening (lighter top section)
        const lighterColor = Phaser.Display.Color.IntegerToColor(machineType.color).lighten(20).color;
        machineGraphics.fillStyle(lighterColor, 1);
        machineGraphics.fillRoundedRect(x - 25, y - 20, 50, 12, 3);

        // Coin slots/tray
        machineGraphics.fillStyle(0x333333, 1);
        machineGraphics.fillRect(x - 15, y + 8, 30, 10);

        // Coin decorations
        machineGraphics.fillStyle(0xffd700, 1);
        machineGraphics.fillCircle(x - 10, y + 13, 3);
        machineGraphics.fillCircle(x, y + 13, 3);
        machineGraphics.fillCircle(x + 10, y + 13, 3);

        // Border
        machineGraphics.lineStyle(2, 0xffffff, 1);
        machineGraphics.strokeRoundedRect(x - 30, y - 25, 60, 50, 5);

    } else {
        // Regular arcade machine
        machineGraphics.fillStyle(machineType.color, 1);
        machineGraphics.fillRoundedRect(x - 30, y - 25, 60, 50, 5);

        // Screen area (darker)
        const darkerColor = Phaser.Display.Color.IntegerToColor(machineType.color).darken(30).color;
        machineGraphics.fillStyle(darkerColor, 1);
        machineGraphics.fillRoundedRect(x - 22, y - 18, 44, 20, 3);

        // Control panel (lighter strip at bottom)
        const lighterColor = Phaser.Display.Color.IntegerToColor(machineType.color).lighten(20).color;
        machineGraphics.fillStyle(lighterColor, 1);
        machineGraphics.fillRect(x - 25, y + 8, 50, 12);

        // Buttons (small circles on control panel)
        machineGraphics.fillStyle(0xff0000, 1);
        machineGraphics.fillCircle(x - 12, y + 14, 3);
        machineGraphics.fillStyle(0x00ff00, 1);
        machineGraphics.fillCircle(x - 3, y + 14, 3);
        machineGraphics.fillStyle(0x0000ff, 1);
        machineGraphics.fillCircle(x + 6, y + 14, 3);

        // Joystick (small circle on left side)
        machineGraphics.fillStyle(0x333333, 1);
        machineGraphics.fillCircle(x - 15, y + 2, 4);

        // Border
        machineGraphics.lineStyle(2, 0xffffff, 1);
        machineGraphics.strokeRoundedRect(x - 30, y - 25, 60, 50, 5);
    }

    machinesGroup.add(machineGraphics);

    // Add emoji icon on screen
    const emoji = sceneRef.add.text(x, y - 8, machineType.name.split(' ')[0], {
        fontSize: '20px',
        align: 'center'
    });
    emoji.setOrigin(0.5);
    machinesGroup.add(emoji);

    // Store machine data
    gameState.placedMachines.push({
        x: x,
        y: y,
        type: machineType.id,
        sprite: machineGraphics,
        emoji: emoji
    });
}

function showTutorial() {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.9); display: flex; align-items: center;
        justify-content: center; z-index: 2000; animation: fadeIn 0.5s;
    `;

    const content = document.createElement('div');
    content.style.cssText = `
        background: linear-gradient(135deg, #0f3460 0%, #16213e 100%);
        padding: 40px; border-radius: 20px; border: 4px solid #ffd700;
        max-width: 700px; width: 90%; text-align: center;
        box-shadow: 0 0 50px rgba(255, 215, 0, 0.5);
    `;

    let tutorialStep = 0;
    const steps = [
        {
            title: "👋 Welcome to Empire Tycoon!",
            text: "Hey there! I'm Arky, your friendly arcade machine guide!<br>Let me show you how to build your gaming empire!<br><br><strong style='color: #ff6b6b;'>⚠️ FULLSCREEN RECOMMENDED!</strong><br><span style='color: #ffd700;'>Press F11 or use browser fullscreen for best experience</span>",
            machine: "😊"
        },
        {
            title: "🎮 Step 1: Place Machines",
            text: "First, select a machine from the shop on the left.<br>Then click on the grid to place it!<br>Each machine generates income every second!",
            machine: "🤓"
        },
        {
            title: "💰 Step 2: Earn Money",
            text: "Watch as customers visit your machines and pay to play!<br>The more machines you have, the more money you make!",
            machine: "😎"
        },
        {
            title: "📈 Step 3: Expand & Upgrade",
            text: "Use your profits to unlock machines and facilities!<br>Add coin counters, massage chairs, and restaurants!<br>Expand your area right and upward!",
            machine: "🤩"
        },
        {
            title: "⭐ Step 4: Reach 10 Stars!",
            text: "Your goal is to reach 10⭐ ULTIMATE rank!<br>Earn fame by placing machines and serving customers.<br>Good luck, and have fun! 🎉",
            machine: "😁"
        }
    ];

    function renderStep() {
        const step = steps[tutorialStep];
        content.innerHTML = `
            <div style="font-size: 120px; margin-bottom: 20px; position: relative; display: inline-block;">
                <div style="font-size: 120px;">🎮</div>
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 40px;">
                    ${step.machine}
                </div>
            </div>
            <h2 style="color: #ffd700; margin-bottom: 20px; font-size: 28px;">${step.title}</h2>
            <p style="color: #eee; font-size: 18px; line-height: 1.8; margin-bottom: 30px;">${step.text}</p>
            <div style="display: flex; gap: 15px; justify-content: center;">
                ${tutorialStep > 0 ? '<button onclick="window.tutorialPrev()" style="background: #666; color: white; border: none; padding: 12px 30px; border-radius: 10px; cursor: pointer; font-size: 16px; font-weight: bold; font-family: \'Courier New\', monospace;">← Back</button>' : ''}
                ${tutorialStep < steps.length - 1 ?
                    '<button onclick="window.tutorialNext()" style="background: #4ecca3; color: #16213e; border: none; padding: 12px 30px; border-radius: 10px; cursor: pointer; font-size: 16px; font-weight: bold; font-family: \'Courier New\', monospace;">Next →</button>' :
                    '<button onclick="window.tutorialStart()" style="background: linear-gradient(135deg, #e94560 0%, #c44569 100%); color: white; border: none; padding: 15px 40px; border-radius: 10px; cursor: pointer; font-size: 20px; font-weight: bold; font-family: \'Courier New\', monospace; border: 3px solid #ffd700;">Start Playing! 🎮</button>'}
                <button onclick="window.tutorialSkip()" style="background: #444; color: #aaa; border: none; padding: 12px 30px; border-radius: 10px; cursor: pointer; font-size: 16px; font-family: \'Courier New\', monospace;">Skip Tutorial</button>
            </div>
            <div style="margin-top: 20px; display: flex; gap: 8px; justify-content: center;">
                ${steps.map((_, i) => `<div style="width: 12px; height: 12px; border-radius: 50%; background: ${i === tutorialStep ? '#ffd700' : '#444'};"></div>`).join('')}
            </div>
        `;
    }

    window.tutorialNext = () => {
        tutorialStep++;
        renderStep();
    };

    window.tutorialPrev = () => {
        tutorialStep--;
        renderStep();
    };

    window.tutorialStart = () => {
        modal.remove();
        updateInfo('🎮 Welcome! Click a machine in the shop to get started!');
        delete window.tutorialNext;
        delete window.tutorialPrev;
        delete window.tutorialStart;
        delete window.tutorialSkip;
    };

    window.tutorialSkip = () => {
        modal.remove();
        updateInfo('Tutorial skipped. Good luck! 🎮');
        delete window.tutorialNext;
        delete window.tutorialPrev;
        delete window.tutorialStart;
        delete window.tutorialSkip;
    };

    renderStep();
    modal.appendChild(content);
    document.body.appendChild(modal);
}

function showLegendaryWin() {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.95); display: flex; align-items: center;
        justify-content: center; z-index: 2000; animation: fadeIn 0.5s;
    `;

    const content = document.createElement('div');
    content.style.cssText = `
        background: linear-gradient(135deg, #ff1493 0%, #ffd700 100%);
        padding: 50px; border-radius: 20px; border: 5px solid #fff;
        max-width: 600px; width: 90%; text-align: center;
        box-shadow: 0 0 100px rgba(255, 215, 0, 0.8);
        animation: bounce 1s ease-in-out;
    `;

    content.innerHTML = `
        <style>
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes bounce {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }
            @keyframes sparkle {
                0%, 100% { transform: scale(1) rotate(0deg); }
                50% { transform: scale(1.2) rotate(180deg); }
            }
        </style>
        <div style="font-size: 150px; margin-bottom: 20px; position: relative; display: inline-block;">
            <div style="font-size: 150px;">🎮</div>
            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 50px; animation: sparkle 2s infinite;">
                🤩
            </div>
        </div>
        <h1 style="color: #fff; font-size: 48px; margin-bottom: 20px; text-shadow: 3px 3px 6px rgba(0,0,0,0.5);">
            🎉 CONGRATULATIONS! 🎉
        </h1>
        <h2 style="color: #fff; font-size: 32px; margin-bottom: 30px; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">
            You've Reached 10⭐ ULTIMATE!
        </h2>
        <p style="color: #fff; font-size: 20px; line-height: 1.8; margin-bottom: 30px; text-shadow: 1px 1px 2px rgba(0,0,0,0.5);">
            You've built an incredible gaming empire!<br>
            You're now a true <strong>Empire Tycoon ULTIMATE!</strong><br><br>
            But the journey doesn't end here...<br>
            Keep playing to grow your empire even bigger! 🚀
        </p>
        <button onclick="this.parentElement.parentElement.remove()" style="
            background: linear-gradient(135deg, #e94560 0%, #c44569 100%);
            color: white; border: none; padding: 20px 50px;
            border-radius: 15px; cursor: pointer; font-size: 24px;
            font-weight: bold; font-family: 'Courier New', monospace;
            border: 3px solid #fff; box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        ">Continue Playing! 🎮</button>
    `;

    modal.appendChild(content);
    document.body.appendChild(modal);

    // Play unlock sound
    if (sounds.unlock) sounds.unlock.play();
}

// Button listeners
document.getElementById('hire-staff-btn').addEventListener('click', showStaffHire);
document.getElementById('invest-btn').addEventListener('click', showInvestments);
document.getElementById('instructions-btn').addEventListener('click', showInstructions);
document.getElementById('ranks-btn').addEventListener('click', showRanks);
document.getElementById('save-btn').addEventListener('click', saveGame);
document.getElementById('load-btn').addEventListener('click', loadGame);
document.getElementById('export-btn').addEventListener('click', exportGame);
document.getElementById('home-btn').addEventListener('click', showHomeMenu);

function showHomeMenu() {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.9); display: flex; align-items: center;
        justify-content: center; z-index: 2000;
    `;
    modal.className = 'modal-overlay';

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });

    const content = document.createElement('div');
    content.style.cssText = `
        background: linear-gradient(135deg, #0f3460 0%, #16213e 100%);
        padding: 40px; border-radius: 20px; border: 4px solid #e94560;
        max-width: 500px; width: 90%; text-align: center;
        box-shadow: 0 0 50px rgba(233, 69, 96, 0.5);
    `;

    content.innerHTML = `
        <h1 style="color: #ffd700; font-size: 48px; margin-bottom: 20px;">🏠 Menu</h1>
        <p style="color: #aaa; margin-bottom: 30px;">Day ${gameState.day} • $${Math.floor(gameState.money)} • ${gameState.rank}</p>

        <div style="display: flex; flex-direction: column; gap: 15px;">
            <button onclick="this.parentElement.parentElement.parentElement.remove()" style="
                background: linear-gradient(135deg, #4ecca3 0%, #3ab88a 100%);
                color: white; border: none; padding: 15px 30px;
                border-radius: 10px; cursor: pointer; font-size: 18px;
                font-weight: bold; font-family: 'Courier New', monospace;
                border: 3px solid #ffd700;
            ">▶️ Resume Game</button>

            <button onclick="saveGame(); updateInfo('💾 Game saved!'); this.parentElement.parentElement.parentElement.remove();" style="
                background: linear-gradient(135deg, #e94560 0%, #c44569 100%);
                color: white; border: none; padding: 15px 30px;
                border-radius: 10px; cursor: pointer; font-size: 18px;
                font-weight: bold; font-family: 'Courier New', monospace;
            ">💾 Save & Continue</button>

            <button onclick="saveGame(); sessionStorage.setItem('fromHome', 'true'); window.location.href = 'home.html';" style="
                background: linear-gradient(135deg, #ffd60a 0%, #e5c100 100%);
                color: #16213e; border: none; padding: 15px 30px;
                border-radius: 10px; cursor: pointer; font-size: 18px;
                font-weight: bold; font-family: 'Courier New', monospace;
            ">💾 Save & Quit</button>

            <button onclick="if(confirm('Quit without saving? All progress will be lost!')) { sessionStorage.setItem('fromHome', 'true'); window.location.href = 'home.html'; }" style="
                background: #666; color: white; border: none; padding: 15px 30px;
                border-radius: 10px; cursor: pointer; font-size: 18px;
                font-weight: bold; font-family: 'Courier New', monospace;
            ">🚪 Quit Without Saving</button>
        </div>
    `;

    modal.appendChild(content);
    document.body.appendChild(modal);

    const escHandler = (e) => {
        if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);
}

// Music toggle button
window.musicPlaying = window.musicPlaying || false;
document.getElementById('music-toggle').addEventListener('click', () => {
    if (!backgroundMusic) {
        // Audio not available, just ignore
        return;
    }

    if (window.musicPlaying) {
        // Pause the music
        if (backgroundMusic.isPlaying) {
            backgroundMusic.pause();
        }
        document.getElementById('music-toggle').textContent = '🔇';
        window.musicPlaying = false;
    } else {
        // Resume the music
        if (backgroundMusic.isPaused) {
            backgroundMusic.resume();
        } else {
            backgroundMusic.play();
        }
        document.getElementById('music-toggle').textContent = '🔊';
        window.musicPlaying = true;
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        gameState.selectedMachine = null;
        document.querySelectorAll('.machine-card').forEach(c =>
            c.classList.remove('selected')
        );
        updateInfo('Selection cancelled');
    }
});
