import { 
    BoardState, LifeStats, PlacedTile, TileDef, GameEvent, 
    GAME_EVENTS, ALL_TILES, FeedbackMessage, Family 
} from './TempleData';

export const CORE_X = 2; // 0-indexed center of 5x5
export const CORE_Y = 2;

// Utility to clamp stats between 0 and 100
const clamp = (val: number) => Math.max(0, Math.min(100, val));

export const getNeighbors = (board: BoardState, x: number, y: number): PlacedTile[] => {
    const neighbors: PlacedTile[] = [];
    const dirs = [[0, -1], [0, 1], [-1, 0], [1, 0]]; // Up, Down, Left, Right
    
    for (const [dx, dy] of dirs) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx >= 0 && nx < 5 && ny >= 0 && ny < 5) {
            const tile = board[ny][nx];
            if (tile) neighbors.push(tile);
        }
    }
    return neighbors;
};

const getInnerRingTiles = (board: BoardState): PlacedTile[] => {
    return getNeighbors(board, CORE_X, CORE_Y);
};

const isInnerRing = (x: number, y: number) => {
    return (Math.abs(x - CORE_X) + Math.abs(y - CORE_Y)) === 1;
};

const isCorner = (x: number, y: number) => {
    return (x === 0 && y === 0) || (x === 4 && y === 0) || (x === 0 && y === 4) || (x === 4 && y === 4);
};

const isEdge = (x: number, y: number) => {
    if (isCorner(x, y)) return false; // Corners are separate
    return x === 0 || x === 4 || y === 0 || y === 4;
};

// Returns random options for the turn
export const generateTurnOptions = (): TileDef[] => {
    const shuffled = [...ALL_TILES].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
};

// Process an entire turn: place tile, apply effects, run event, check bounds.
export const processTurn = (
    currentStats: LifeStats, 
    board: BoardState, 
    x: number, 
    y: number, 
    selectedTile: TileDef, 
    turnNumber: number
): { 
    newStats: LifeStats, 
    newBoard: BoardState, 
    event: GameEvent | null,
    feedback: FeedbackMessage[]
} => {
    const feedback: FeedbackMessage[] = [];
    
    // 1. Deep clone stats and board
    const newStats = { ...currentStats };
    const newBoard = board.map(row => [...row]);
    
    // 2. Place tile
    const newPlacement: PlacedTile = { x, y, tile: selectedTile, turnPlaced: turnNumber };
    newBoard[y][x] = newPlacement;
    
    feedback.push({ 
        id: `placed-${turnNumber}`, 
        text: `Placed ${selectedTile.name}.`, 
        type: 'neutral' 
    });

    // 3. Apply Base Effects with Position Modifiers
    let multiplier = 1;
    if (isInnerRing(x, y)) {
        multiplier = 1.2; // +20%
    } else if (isCorner(x, y)) {
        multiplier = 1.2; // Both positive and negative magnified
    } else if (isEdge(x, y)) {
        multiplier = 0.9; // -10%
    }

    const keys: (keyof LifeStats)[] = ['work', 'rest', 'relationships', 'growth', 'stability'];
    keys.forEach(k => {
        if (selectedTile.effects[k] !== undefined) {
            let change = selectedTile.effects[k] as number;
            // For corners, magnify both. For inner ring, only boost positives? 
            // Prompt: "Inner ring -> Stronger positive effects (+20% boost)"
            if (isInnerRing(x, y) && change > 0) change *= 1.2;
            else if (isEdge(x, y)) change *= 0.9;
            else if (isCorner(x, y)) change *= 1.2;
            
            change = Math.round(change);
            newStats[k] += change;
        }
    });

    // 4. Adjacency Logic
    const neighbors = getNeighbors(newBoard, x, y);
    const sameFamilyCount = neighbors.filter(n => n.tile.family === selectedTile.family).length;
    
    if (sameFamilyCount === 1) { // Exactly 1 adjacent (total 2 connected)
        const familyStatMap: Record<Family, keyof LifeStats> = {
            'Work': 'work', 'Rest': 'rest', 'Relationships': 'relationships', 'Growth': 'growth'
        };
        const statKey = familyStatMap[selectedTile.family];
        newStats[statKey] += 2;
        feedback.push({ id: `adj-same-${turnNumber}`, text: `Synergy: Adjacent ${selectedTile.family} tiles (+2 ${statKey}).`, type: 'positive' });
    }

    // Complementary rules
    const hasWork = selectedTile.family === 'Work' || neighbors.some(n => n.tile.family === 'Work');
    const hasRest = selectedTile.family === 'Rest' || neighbors.some(n => n.tile.family === 'Rest');
    if (hasWork && hasRest && (selectedTile.family === 'Work' || selectedTile.family === 'Rest')) {
        newStats.stability += 5;
        feedback.push({ id: `comp-wr-${turnNumber}`, text: `Harmony: Work balanced with Rest (+5 Stability).`, type: 'positive' });
    }

    const hasRel = selectedTile.family === 'Relationships' || neighbors.some(n => n.tile.family === 'Relationships');
    const hasGrowth = selectedTile.family === 'Growth' || neighbors.some(n => n.tile.family === 'Growth');
    if (hasRel && hasGrowth && (selectedTile.family === 'Relationships' || selectedTile.family === 'Growth')) {
        newStats.relationships += 3;
        newStats.growth += 3;
        feedback.push({ id: `comp-rg-${turnNumber}`, text: `Harmony: Relationships and Growth thrive together (+3 both).`, type: 'positive' });
    }

    // DFS to find connected components of same family to detect overload (3+)
    const connectedCount = countConnected(newBoard, x, y, selectedTile.family);
    if (connectedCount >= 3) {
        newStats.stability -= 8;
        if (selectedTile.family === 'Work') {
            newStats.rest -= 5;
            feedback.push({ id: `overload-work-${turnNumber}`, text: `Overload: Too much Work connected! (-5 Rest, -8 Stability)`, type: 'negative' });
        } else {
            feedback.push({ id: `overload-${turnNumber}`, text: `Overload: Too much ${selectedTile.family} grouped together (-8 Stability).`, type: 'negative' });
        }
    }

    // 5. Inner Ring / Core Rules
    if (isInnerRing(x, y)) {
        const innerTiles = getInnerRingTiles(newBoard);
        
        // Check for 4 unique families
        const familiesInRing = new Set(innerTiles.map(t => t.tile.family));
        if (familiesInRing.size === 4 && innerTiles.length === 4) {
            newStats.stability += 15;
            feedback.push({ id: `core-perfect-${turnNumber}`, text: `Perfect Core Balance! All 4 aspects surround the center. (+15 Stability)`, type: 'positive' });
        }

        // Check for 3+ same family in inner ring
        const familyCounts: Record<string, number> = {};
        innerTiles.forEach(t => {
            familyCounts[t.tile.family] = (familyCounts[t.tile.family] || 0) + 1;
        });
        Object.keys(familyCounts).forEach(f => {
            if (familyCounts[f] >= 3) {
                newStats.stability -= 10;
                feedback.push({ id: `core-imbalance-${turnNumber}`, text: `Core Imbalance: The center is overwhelmed by ${f} (-10 Stability).`, type: 'negative' });
            }
        });

        // Check opposites
        const top = newBoard[1][2];
        const bottom = newBoard[3][2];
        const left = newBoard[2][1];
        const right = newBoard[2][3];

        const checkOpposite = (t1: PlacedTile|null, t2: PlacedTile|null) => {
            if (!t1 || !t2) return;
            const f1 = t1.tile.family;
            const f2 = t2.tile.family;
            if ((f1 === 'Work' && f2 === 'Rest') || (f1 === 'Rest' && f2 === 'Work')) {
                // only award once per pairing to avoid spam, we'll just award it if the current tile triggered it
                if (t1 === newPlacement || t2 === newPlacement) {
                    newStats.stability += 10;
                    feedback.push({ id: `opp-wr-${turnNumber}`, text: `Core Symmetry: Work opposite Rest (+10 Stability).`, type: 'positive' });
                }
            }
            if ((f1 === 'Relationships' && f2 === 'Growth') || (f1 === 'Growth' && f2 === 'Relationships')) {
                if (t1 === newPlacement || t2 === newPlacement) {
                    newStats.relationships += 5;
                    newStats.growth += 5;
                    feedback.push({ id: `opp-rg-${turnNumber}`, text: `Core Symmetry: Relationships opposite Growth (+5 both).`, type: 'positive' });
                }
            }
        };

        checkOpposite(top, bottom);
        checkOpposite(left, right);
    }

    // 6. Trigger Event
    const event = GAME_EVENTS[Math.floor(Math.random() * GAME_EVENTS.length)];
    keys.forEach(k => {
        if (event.effects[k] !== undefined) {
            newStats[k] += event.effects[k] as number;
        }
    });
    feedback.push({ 
        id: `event-${turnNumber}`, 
        text: `Event: ${event.name}`, 
        type: 'event' 
    });

    // 7. Clamp and validate
    keys.forEach(k => newStats[k] = clamp(newStats[k]));

    // Insight generator
    const insight = generateInsight(newStats, connectedCount, selectedTile.family);
    if (insight) {
        feedback.push({ id: `insight-${turnNumber}`, text: insight, type: 'insight' });
    }

    return { newStats, newBoard, event, feedback };
};

const countConnected = (board: BoardState, startX: number, startY: number, family: Family): number => {
    const visited = new Set<string>();
    let count = 0;

    const dfs = (x: number, y: number) => {
        if (x < 0 || x >= 5 || y < 0 || y >= 5) return;
        const key = `${x},${y}`;
        if (visited.has(key)) return;
        
        const tile = board[y][x];
        if (!tile || tile.tile.family !== family) return;

        visited.add(key);
        count++;

        dfs(x+1, y);
        dfs(x-1, y);
        dfs(x, y+1);
        dfs(x, y-1);
    };

    dfs(startX, startY);
    return count;
};

const generateInsight = (stats: LifeStats, overloadCount: number, lastFamily: Family): string => {
    if (stats.stability < 30) return "Warning: Stability is critically low. Seek balance immediately.";
    if (overloadCount >= 3) return `Too many ${lastFamily} tiles are creating strain on your life.`;
    if (stats.work > 80 && stats.rest < 40) return "Work is thriving, but rest is becoming dangerously fragile.";
    if (stats.relationships < 40 && stats.growth > 70) return "You are growing rapidly, but don't forget those around you.";
    
    const allStats = [stats.work, stats.rest, stats.relationships, stats.growth];
    const min = Math.min(...allStats);
    const max = Math.max(...allStats);
    
    if (max - min < 15) return "Your life is currently in beautiful harmony.";
    
    return "Every choice shifts the delicate balance of the temple.";
};

export const checkGameState = (stats: LifeStats, turn: number) => {
    if (stats.work <= 0 || stats.rest <= 0 || stats.relationships <= 0 || stats.growth <= 0) {
        return 'LOSE_STAT';
    }
    if (stats.stability <= 0) {
        return 'LOSE_STABILITY';
    }
    
    const allStats = [stats.work, stats.rest, stats.relationships, stats.growth];
    const max = Math.max(...allStats);
    const min = Math.min(...allStats);
    if (max - min >= 80) { // Extreme imbalance
        return 'LOSE_IMBALANCE';
    }

    if (turn >= 12) {
        return 'WIN';
    }

    return 'PLAYING';
};
