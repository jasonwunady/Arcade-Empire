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
    cleanliness: 100,
    trash: [],
    staff: [],
    researchPoints: 0,
    rank: 'Rookie',
    rankProgress: 0,
    popularity: 100,
    lastCleanlinessCheck: 0
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
    }
];

// Staff Types
const staffTypes = [
    {
        id: 'janitor',
        name: '🧹 Janitor',
        cost: 200,
        salary: 25,
        effect: 'Cleans trash automatically'
    },
    {
        id: 'technician',
        name: '🔧 Technician',
        cost: 350,
        salary: 40,
        effect: 'Reduces maintenance by 20%'
    },
    {
        id: 'marketer',
        name: '📢 Marketer',
        cost: 500,
        salary: 50,
        effect: 'Increases customer spawn rate'
    }
];

// Arcade Ranks
const ranks = [
    { name: 'Rookie', threshold: 0, color: '#888888' },
    { name: 'Bronze', threshold: 100, color: '#cd7f32' },
    { name: 'Silver', threshold: 300, color: '#c0c0c0' },
    { name: 'Gold', threshold: 600, color: '#ffd700' },
    { name: 'Platinum', threshold: 1000, color: '#e5e4e2' },
    { name: 'Diamond', threshold: 1500, color: '#b9f2ff' },
    { name: 'Legendary', threshold: 2500, color: '#ff1493' }
];

// Investments
const investments = [
    {
        id: 'marketing',
        name: '📢 Marketing Campaign',
        description: '+10 Popularity, +20% Customer Rate',
        cost: 500,
        owned: 0
    },
    {
        id: 'renovation',
        name: '🎨 Arcade Renovation',
        description: '+15 Popularity, Cleanliness +20',
        cost: 1000,
        owned: 0
    },
    {
        id: 'premium_machines',
        name: '🎰 Premium Machines',
        description: '+30% Income, +5 Popularity',
        cost: 2000,
        owned: 0
    },
    {
        id: 'vip_lounge',
        name: '👑 VIP Lounge',
        description: '+25 Popularity, +50% Income',
        cost: 5000,
        owned: 0
    }
];

// Upgrades
const upgrades = [
    {
        id: 'expand',
        name: '🏗️ Expand Area',
        description: 'Add 400px to the right',
        baseCost: 10000,
        costMultiplier: 2.5,
        owned: 0
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
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let gridGraphics;
let machinesGroup;
let previewSprite;
let customersGroup;
let particlesGroup;
let trashGroup;
let wallsGroup;
let staffGroup;
let sceneRef;

function create() {
    sceneRef = this;
    this.cameras.main.setBackgroundColor('#2d2d44');

    // Draw walls and entrance
    wallsGroup = this.add.group();
    drawWalls(this);

    // Draw grid
    gridGraphics = this.add.graphics();
    drawGrid(this);

    // Groups
    trashGroup = this.add.group();

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

    // Check cleanliness and update popularity every 10 seconds
    if (time - gameState.lastCleanlinessCheck > 10000) {
        if (gameState.cleanliness <= 0) {
            gameState.popularity = Math.max(0, gameState.popularity - 5);
            gameState.customerSpawnRate = Math.max(0.1, gameState.customerSpawnRate * 0.95);
            updateInfo('⚠️ Low cleanliness hurting popularity!');
        }
        gameState.lastCleanlinessCheck = time;
        updateUI();
    }

    // Spawn customers (affected by popularity)
    const popularityMultiplier = gameState.popularity / 100;
    if (gameState.placedMachines.length > 0 && Math.random() < 0.02 * gameState.customerSpawnRate * popularityMultiplier) {
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
                createMoneyParticle(customer.sprite.x, customer.sprite.y);
            }

            // Leave after playing and drop trash
            if (time > customer.playTime) {
                if (!customer.hasDroppedTrash && Math.random() < 0.5) {
                    dropTrash(customer.sprite.x, customer.sprite.y);
                    customer.hasDroppedTrash = true;
                }
                customer.targetX = -50;
                customer.targetY = gameState.gridHeight / 2;
            }
        } else {
            // Move
            customer.sprite.x += (dx / distance) * 2;
            customer.sprite.y += (dy / distance) * 2;
        }

        // Remove if off screen
        if (customer.sprite.x < -50) {
            customer.sprite.destroy();
            customer.text.destroy();
            gameState.customers.splice(index, 1);
        }
    });

    // Update staff movement and actions
    gameState.staff.forEach(staff => {
        if (!staff.sprite || !staff.sprite.active) return;

        // Move towards target
        const dx = staff.targetX - staff.sprite.x;
        const dy = staff.targetY - staff.sprite.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 5) {
            // Reached target, pick new random target
            staff.targetX = Math.random() * (gameState.gridWidth - 100) + 50;
            staff.targetY = Math.random() * (gameState.gridHeight - 100) + 50;
        } else {
            // Move towards target
            staff.sprite.x += (dx / distance) * staff.speed;
            staff.sprite.y += (dy / distance) * staff.speed;
            staff.text.x = staff.sprite.x;
            staff.text.y = staff.sprite.y;
        }

        // Janitors passively increase cleanliness
        if (staff.type === 'janitor') {
            if (Math.random() < 0.02) {
                gameState.cleanliness = Math.min(100, gameState.cleanliness + 0.5);
                updateUI();
            }
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

    // Entrance markers with LED glow
    const entranceTop = scene.add.text(wallThickness, entranceY - entranceHeight / 2 - 20, '🚪', { fontSize: '30px' });
    entranceTop.setOrigin(0.5);
    wallsGroup.add(entranceTop);

    const entranceBottom = scene.add.text(wallThickness, entranceY + entranceHeight / 2 + 20, '🚪', { fontSize: '30px' });
    entranceBottom.setOrigin(0.5);
    wallsGroup.add(entranceBottom);
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

    // Spawn at entrance
    const entranceY = gameState.gridHeight / 2;
    const startY = entranceY + Math.random() * 100 - 50;
    const customerSprite = sceneRef.add.circle(-30, startY, 15, 0xffd700);
    const customerText = sceneRef.add.text(-30, startY, emoji, {
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
        hasDroppedTrash: false
    };

    gameState.customers.push(customer);
}

function createMoneyParticle(x, y) {
    if (!sceneRef) return;

    // Play coin sound
    const coinSound = document.getElementById('coin-sound');
    coinSound.currentTime = 0;
    coinSound.volume = 0.4;
    coinSound.play().catch(e => console.log('Coin sound failed:', e));

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
}

function dropTrash(x, y) {
    if (!sceneRef) return;

    // Just decrease cleanliness, don't show trash sprite
    gameState.cleanliness = Math.max(0, gameState.cleanliness - 0.5);
    updateUI();
}

function cleanTrash(index) {
    if (index >= gameState.trash.length) return;

    const trash = gameState.trash[index];
    trash.sprite.destroy();
    gameState.trash.splice(index, 1);
    gameState.cleanliness = Math.min(100, gameState.cleanliness + 3);
    updateUI();
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
    const occupied = gameState.placedMachines.some(m =>
        m.x === snapX && m.y === snapY
    );

    if (occupied) {
        updateInfo('❌ Space occupied!');
        return;
    }

    // Deduct money and place machine
    gameState.money -= machineType.cost;
    gameState.income += machineType.income;
    gameState.maintenanceCost += machineType.maintenance;
    gameState.fame += Math.floor(machineType.income / 2);
    gameState.popularity = Math.min(100, gameState.popularity + 3);

    // Create top-down arcade machine
    const machineGraphics = scene.add.graphics();

    // Main cabinet body (rectangular)
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

    machinesGroup.add(machineGraphics);

    // Add emoji icon on screen
    const emoji = scene.add.text(snapX, snapY - 8, machineType.name.split(' ')[0], {
        fontSize: '20px',
        align: 'center'
    });
    emoji.setOrigin(0.5);
    machinesGroup.add(emoji);

    // Play explode sound
    const explodeSound = document.getElementById('explode-sound');
    explodeSound.currentTime = 0;
    explodeSound.volume = 0.3;
    explodeSound.play().catch(e => console.log('Sound play failed:', e));

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

    updateInfo(`✅ Placed ${machineType.name}! +${machineType.income}/sec`);
    updateUI();
    checkUnlocks();
    updateRank();
}

function initShop() {
    const shopDiv = document.getElementById('machine-shop');

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
                    initShop(); // Refresh shop
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
}

function updateUI() {
    document.getElementById('day').textContent = gameState.day;
    document.getElementById('money').textContent = Math.floor(gameState.money);
    document.getElementById('income').textContent = gameState.income;
    document.getElementById('maintenance').textContent = gameState.maintenanceCost;
    document.getElementById('fame').textContent = gameState.fame;
    document.getElementById('rank').textContent = gameState.rank;
    document.getElementById('cleanliness').textContent = Math.floor(gameState.cleanliness);
    document.getElementById('popularity').textContent = Math.floor(gameState.popularity);

    // Update cleanliness bar color
    const cleanBar = document.querySelector('.status-bar');
    if (gameState.cleanliness < 30) {
        cleanBar.style.background = 'linear-gradient(135deg, #ff6b6b 0%, #c44569 100%)';
    } else if (gameState.cleanliness < 60) {
        cleanBar.style.background = 'linear-gradient(135deg, #ffe66d 0%, #ffa502 100%)';
    } else {
        cleanBar.style.background = 'linear-gradient(135deg, #4ecca3 0%, #2ecc71 100%)';
    }

    // Update popularity bar color
    const popBar = document.querySelector('.popularity-bar');
    if (gameState.popularity < 30) {
        popBar.style.background = 'linear-gradient(135deg, #ff6b6b 0%, #c44569 100%)';
    } else if (gameState.popularity < 60) {
        popBar.style.background = 'linear-gradient(135deg, #ffe66d 0%, #ffa502 100%)';
    } else {
        popBar.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
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

    const totalCosts = actualMaintenance + totalSalaries;

    // Pay daily costs
    if (totalCosts > 0) {
        gameState.money -= totalCosts;

        if (gameState.money < 0) {
            updateInfo(`⚠️ Day ${gameState.day} - Can't pay costs! Debt: $${Math.abs(Math.floor(gameState.money))}`);
        } else {
            updateInfo(`📅 Day ${gameState.day} - Paid $${actualMaintenance} maintenance + $${totalSalaries} salaries`);
        }
    } else {
        updateInfo(`📅 Day ${gameState.day} started!`);
    }

    // Decay cleanliness over time (slower)
    gameState.cleanliness = Math.max(0, gameState.cleanliness - 0.3);

    // Decay popularity over time
    gameState.popularity = Math.max(0, gameState.popularity - 1);

    updateUI();
}

function checkUnlocks() {
    // Auto-unlock based on fame milestones
    if (gameState.fame >= 30 && !machineTypes[2].unlocked) {
        machineTypes[2].unlocked = true;
        updateInfo('🎉 Racing Game unlocked for free!');
        initShop();
    }
    if (gameState.fame >= 100 && !machineTypes[3].unlocked) {
        machineTypes[3].unlocked = true;
        updateInfo('🎉 Fighter Arena unlocked for free!');
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

    const upgradeHeader = document.createElement('h2');
    upgradeHeader.textContent = '⬆️ Upgrades';
    upgradeHeader.style.marginTop = '20px';
    upgradeHeader.style.color = '#ffd700';
    shopDiv.appendChild(upgradeHeader);

    upgrades.forEach(upgrade => {
        const card = document.createElement('div');
        card.className = 'machine-card';

        const cost = Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.owned));

        card.innerHTML = `
            <div class="machine-name">${upgrade.name}</div>
            <div class="machine-stats">${upgrade.description}</div>
            <div class="machine-cost">💰 Cost: $${cost} | Owned: ${upgrade.owned}</div>
        `;

        card.addEventListener('click', () => {
            buyUpgrade(upgrade);
        });

        card.dataset.upgradeId = upgrade.id;
        shopDiv.appendChild(card);
    });
}

function buyUpgrade(upgrade) {
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

        updateInfo('🏗️ Arcade expanded!');
    } else if (upgrade.id === 'income_boost') {
        gameState.incomeMultiplier += 0.25;
        updateInfo('💎 Income boosted by 25%!');
    } else if (upgrade.id === 'customer_speed') {
        gameState.customerSpawnRate += 0.5;
        updateInfo('🏃 More customers incoming!');
    }

    updateUI();
    initShop(); // Refresh to update costs
    initUpgrades();
}

function updateRank() {
    const totalScore = gameState.fame + gameState.placedMachines.length * 10;

    for (let i = ranks.length - 1; i >= 0; i--) {
        if (totalScore >= ranks[i].threshold) {
            if (gameState.rank !== ranks[i].name) {
                gameState.rank = ranks[i].name;
                updateInfo(`🎉 RANK UP! You are now ${ranks[i].name}!`);

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
    const staffEmoji = staffId === 'janitor' ? '🧹' : staffId === 'technician' ? '🔧' : '📢';
    const startX = 100 + Math.random() * 200;
    const startY = 100 + Math.random() * 200;

    const staffSprite = sceneRef.add.circle(startX, startY, 15, 0x4169e1);
    const staffText = sceneRef.add.text(startX, startY, staffEmoji, {
        fontSize: '24px'
    });
    staffText.setOrigin(0.5);

    staffGroup.add(staffSprite);
    staffGroup.add(staffText);

    // Random target for wandering
    const targetX = Math.random() * (gameState.gridWidth - 100) + 50;
    const targetY = Math.random() * (gameState.gridHeight - 100) + 50;

    gameState.staff.push({
        type: staffId,
        salary: staffType.salary,
        sprite: staffSprite,
        text: staffText,
        targetX: targetX,
        targetY: targetY,
        speed: 1
    });

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

function showInvestments() {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.8); display: flex; align-items: center;
        justify-content: center; z-index: 1000;
    `;

    const content = document.createElement('div');
    content.style.cssText = `
        background: linear-gradient(135deg, #0f3460 0%, #16213e 100%);
        padding: 30px; border-radius: 15px; border: 3px solid #e94560;
        max-width: 500px; width: 90%; max-height: 80vh; overflow-y: auto;
    `;

    let html = '<h2 style="color: #ffd700; margin-bottom: 20px;">💎 Investments</h2>';

    investments.forEach(investment => {
        html += `
            <div style="background: rgba(255,255,255,0.1); padding: 15px; margin: 10px 0; border-radius: 10px; border: 2px solid #e94560;">
                <div style="color: #ffd700; font-size: 18px; font-weight: bold;">${investment.name}</div>
                <div style="color: #aaa; font-size: 14px; margin: 5px 0;">${investment.description}</div>
                <div style="color: #4ecca3; font-weight: bold;">Cost: $${investment.cost} | Owned: ${investment.owned}</div>
                <button onclick="buyInvestment('${investment.id}')" style="
                    background: #e94560; color: white; border: none; padding: 8px 15px;
                    border-radius: 5px; cursor: pointer; margin-top: 10px; font-weight: bold;
                ">Invest Now</button>
            </div>
        `;
    });

    content.innerHTML = html;

    // Create close button separately
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Close';
    closeBtn.style.cssText = 'background: #666; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-top: 15px; width: 100%; font-weight: bold;';
    closeBtn.addEventListener('click', () => {
        modal.remove();
    });
    content.appendChild(closeBtn);

    modal.appendChild(content);
    document.body.appendChild(modal);
}

function buyInvestment(investmentId) {
    const investment = investments.find(i => i.id === investmentId);
    if (!investment) return;

    if (gameState.money < investment.cost) {
        updateInfo(`❌ Need $${investment.cost} for ${investment.name}!`);
        return;
    }

    gameState.money -= investment.cost;
    investment.owned++;

    // Apply investment effects
    if (investment.id === 'marketing') {
        gameState.popularity = Math.min(100, gameState.popularity + 10);
        gameState.customerSpawnRate += 0.2;
        updateInfo('📢 Marketing boosted popularity!');
    } else if (investment.id === 'renovation') {
        gameState.popularity = Math.min(100, gameState.popularity + 15);
        gameState.cleanliness = Math.min(100, gameState.cleanliness + 20);
        updateInfo('🎨 Arcade renovated!');
    } else if (investment.id === 'premium_machines') {
        gameState.incomeMultiplier += 0.3;
        gameState.popularity = Math.min(100, gameState.popularity + 5);
        updateInfo('🎰 Premium machines installed!');
    } else if (investment.id === 'vip_lounge') {
        gameState.popularity = Math.min(100, gameState.popularity + 25);
        gameState.incomeMultiplier += 0.5;
        updateInfo('👑 VIP Lounge opened!');
    }

    updateUI();
    document.querySelectorAll('[onclick^="buyInvestment"]').forEach(btn => {
        btn.parentElement.parentElement.parentElement.remove();
    });
    showInvestments(); // Refresh modal
}

// Save/Load Functions
function saveGame() {
    const saveData = {
        gameState: {
            money: gameState.money,
            income: gameState.income,
            fame: gameState.fame,
            day: gameState.day,
            maintenanceCost: gameState.maintenanceCost,
            cleanliness: gameState.cleanliness,
            rank: gameState.rank,
            gridWidth: gameState.gridWidth,
            expansions: gameState.expansions,
            incomeMultiplier: gameState.incomeMultiplier,
            customerSpawnRate: gameState.customerSpawnRate,
            researchPoints: gameState.researchPoints
        },
        placedMachines: gameState.placedMachines.map(m => ({
            x: m.x,
            y: m.y,
            type: m.type
        })),
        staff: gameState.staff,
        machineTypes: machineTypes.map(m => ({
            id: m.id,
            unlocked: m.unlocked
        })),
        upgrades: upgrades.map(u => ({
            id: u.id,
            owned: u.owned
        })),
        timestamp: Date.now()
    };

    const saves = JSON.parse(localStorage.getItem('arcadeEmpireSaves') || '[]');
    saves.push(saveData);
    localStorage.setItem('arcadeEmpireSaves', JSON.stringify(saves));
    localStorage.setItem('arcadeEmpireLastSave', JSON.stringify(saveData));

    updateInfo('💾 Game saved!');
}

function loadGame(saveData) {
    // Restore game state
    gameState.money = saveData.gameState.money;
    gameState.income = saveData.gameState.income;
    gameState.fame = saveData.gameState.fame;
    gameState.day = saveData.gameState.day;
    gameState.maintenanceCost = saveData.gameState.maintenanceCost;
    gameState.cleanliness = saveData.gameState.cleanliness;
    gameState.rank = saveData.gameState.rank;
    gameState.gridWidth = saveData.gameState.gridWidth;
    gameState.expansions = saveData.gameState.expansions;
    gameState.incomeMultiplier = saveData.gameState.incomeMultiplier;
    gameState.customerSpawnRate = saveData.gameState.customerSpawnRate;
    gameState.researchPoints = saveData.gameState.researchPoints;

    // Restore staff
    gameState.staff = saveData.staff;

    // Restore unlocked machines
    saveData.machineTypes.forEach(saved => {
        const machine = machineTypes.find(m => m.id === saved.id);
        if (machine) machine.unlocked = saved.unlocked;
    });

    // Restore upgrades
    saveData.upgrades.forEach(saved => {
        const upgrade = upgrades.find(u => u.id === saved.id);
        if (upgrade) upgrade.owned = saved.owned;
    });

    // Clear and restore placed machines
    gameState.placedMachines.forEach(m => {
        if (m.sprite) m.sprite.destroy();
        if (m.emoji) m.emoji.destroy();
    });
    gameState.placedMachines = [];

    saveData.placedMachines.forEach(machineData => {
        const machineType = machineTypes.find(m => m.id === machineData.type);
        if (machineType && sceneRef) {
            recreateMachine(sceneRef, machineData.x, machineData.y, machineType);
        }
    });

    // Resize if expanded
    if (sceneRef && gameState.gridWidth !== 800) {
        sceneRef.scale.resize(gameState.gridWidth, gameState.gridHeight);
        drawGrid(sceneRef);
        wallsGroup.clear(true, true);
        drawWalls(sceneRef);
    }

    updateUI();
    initShop();
    initUpgrades();
}

function recreateMachine(scene, x, y, machineType) {
    const machineGraphics = scene.add.graphics();
    machineGraphics.fillStyle(machineType.color, 1);
    machineGraphics.fillRoundedRect(x - 30, y - 25, 60, 50, 5);

    const darkerColor = Phaser.Display.Color.IntegerToColor(machineType.color).darken(30).color;
    machineGraphics.fillStyle(darkerColor, 1);
    machineGraphics.fillRoundedRect(x - 22, y - 18, 44, 20, 3);

    const lighterColor = Phaser.Display.Color.IntegerToColor(machineType.color).lighten(20).color;
    machineGraphics.fillStyle(lighterColor, 1);
    machineGraphics.fillRect(x - 25, y + 8, 50, 12);

    machineGraphics.fillStyle(0xff0000, 1);
    machineGraphics.fillCircle(x - 12, y + 14, 3);
    machineGraphics.fillStyle(0x00ff00, 1);
    machineGraphics.fillCircle(x - 3, y + 14, 3);
    machineGraphics.fillStyle(0x0000ff, 1);
    machineGraphics.fillCircle(x + 6, y + 14, 3);

    machineGraphics.fillStyle(0x333333, 1);
    machineGraphics.fillCircle(x - 15, y + 2, 4);

    machineGraphics.lineStyle(2, 0xffffff, 1);
    machineGraphics.strokeRoundedRect(x - 30, y - 25, 60, 50, 5);

    machinesGroup.add(machineGraphics);

    const emoji = scene.add.text(x, y - 8, machineType.name.split(' ')[0], {
        fontSize: '20px',
        align: 'center'
    });
    emoji.setOrigin(0.5);
    machinesGroup.add(emoji);

    gameState.placedMachines.push({
        x: x,
        y: y,
        type: machineType.id,
        sprite: machineGraphics,
        emoji: emoji
    });
}

// Music control - Define early so other functions can use it
const bgMusic = document.getElementById('background-music');
const menuMusic = document.getElementById('menu-music');
const musicToggle = document.getElementById('music-toggle');
let musicPlaying = false;

bgMusic.volume = 0.5;
menuMusic.volume = 0.5;

// Start menu music on any interaction
let menuMusicStarted = false;
const startMenuMusicOnInteraction = () => {
    if (!menuMusicStarted) {
        menuMusic.play().then(() => {
            musicPlaying = true;
            menuMusicStarted = true;
            console.log('Menu music started');
        }).catch(err => console.log('Menu music failed:', err));
    }
};

// Try multiple ways to start the music
setTimeout(() => menuMusic.play().then(() => { musicPlaying = true; menuMusicStarted = true; }).catch(() => {}), 100);
document.addEventListener('click', startMenuMusicOnInteraction, { once: true });
document.addEventListener('mousemove', startMenuMusicOnInteraction, { once: true });
document.addEventListener('keydown', startMenuMusicOnInteraction, { once: true });

// Function to switch to game music
function startGameMusic() {
    menuMusic.pause();
    menuMusic.currentTime = 0;
    if (musicPlaying) {
        bgMusic.play().catch(e => console.log('Music play failed:', e));
    }
}

// Function to switch to menu music
function startMenuMusic() {
    bgMusic.pause();
    bgMusic.currentTime = 0;
    if (musicPlaying) {
        menuMusic.play().catch(e => console.log('Music play failed:', e));
    }
}

function showLoadMenu() {
    const saves = JSON.parse(localStorage.getItem('arcadeEmpireSaves') || '[]');
    const saveSlotsDiv = document.getElementById('save-slots');
    saveSlotsDiv.innerHTML = '';

    if (saves.length === 0) {
        saveSlotsDiv.innerHTML = '<p style="color: #aaa;">No saved games found</p>';
    } else {
        saves.forEach((save, index) => {
            const slot = document.createElement('div');
            slot.className = 'save-slot';
            const date = new Date(save.timestamp);
            slot.innerHTML = `
                <div class="save-slot-title">Save ${index + 1}</div>
                <div class="save-slot-info">
                    Day ${save.gameState.day} | $${Math.floor(save.gameState.money)} | ${save.gameState.rank}<br>
                    ${date.toLocaleDateString()} ${date.toLocaleTimeString()}
                </div>
            `;
            slot.addEventListener('click', () => {
                loadGame(save);
                document.getElementById('home-screen').style.display = 'none';
                document.getElementById('game-container').style.display = 'flex';
                startGameMusic();
            });
            saveSlotsDiv.appendChild(slot);
        });
    }

    saveSlotsDiv.style.display = 'flex';
}

// Home Screen Handlers
document.getElementById('new-game-btn').addEventListener('click', () => {
    document.getElementById('home-screen').style.display = 'none';
    document.getElementById('game-container').style.display = 'flex';
    startGameMusic();
});

document.getElementById('load-btn').addEventListener('click', () => {
    showLoadMenu();
});

document.getElementById('save-game-btn').addEventListener('click', saveGame);

document.getElementById('menu-btn').addEventListener('click', () => {
    document.getElementById('home-screen').style.display = 'flex';
    document.getElementById('game-container').style.display = 'none';
    document.getElementById('save-slots').style.display = 'none';
    startMenuMusic();
});

// Button listeners
document.getElementById('hire-staff-btn').addEventListener('click', showStaffHire);
document.getElementById('invest-btn').addEventListener('click', showInvestments);

musicToggle.addEventListener('click', () => {
    if (musicPlaying) {
        bgMusic.pause();
        menuMusic.pause();
        musicToggle.textContent = '🔇 Music';
        musicToggle.style.background = '#666';
        musicPlaying = false;
    } else {
        bgMusic.play().catch(e => console.log('Audio play failed:', e));
        musicToggle.textContent = '🔊 Music';
        musicToggle.style.background = '#e94560';
        musicPlaying = true;
    }
});

// Change music track button
document.getElementById('change-music').addEventListener('click', () => {
    // Swap the music sources
    const currentBgSrc = bgMusic.querySelector('source').src;
    const currentMenuSrc = menuMusic.querySelector('source').src;

    // Pause both
    const wasPlaying = musicPlaying;
    bgMusic.pause();
    menuMusic.pause();

    // Get current time to resume at same position
    const currentTime = bgMusic.currentTime;

    // Swap sources
    bgMusic.querySelector('source').src = currentMenuSrc;
    menuMusic.querySelector('source').src = currentBgSrc;
    bgMusic.load();
    menuMusic.load();

    // Resume if was playing
    if (wasPlaying) {
        bgMusic.currentTime = currentTime;
        bgMusic.play().catch(e => console.log('Music change failed:', e));
    }

    updateInfo('🎵 Music track changed!');
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
