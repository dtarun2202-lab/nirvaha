export type Family = 'Work' | 'Rest' | 'Relationships' | 'Growth';

export interface LifeStats {
    work: number;
    rest: number;
    relationships: number;
    growth: number;
    stability: number;
}

export interface TileDef {
    id: string;
    family: Family;
    name: string;
    description?: string;
    effects: Partial<LifeStats>;
}

export interface GameEvent {
    id: string;
    name: string;
    effects: Partial<LifeStats>;
}

export interface PlacedTile {
    x: number;
    y: number;
    tile: TileDef;
    turnPlaced: number;
}

export type BoardState = (PlacedTile | null)[][]; // 5x5

export interface FeedbackMessage {
    id: string;
    text: string;
    type: 'positive' | 'negative' | 'neutral' | 'event' | 'insight';
}

export const WORK_TILES: TileDef[] = [
    { id: 'w1', family: 'Work', name: 'Deep Focus', effects: { work: 12, growth: 4, rest: -6 } },
    { id: 'w2', family: 'Work', name: 'Deadline Push', effects: { work: 14, rest: -8, relationships: -4 } },
    { id: 'w3', family: 'Work', name: 'Finish Project', effects: { work: 10, growth: 6, rest: -5 } },
    { id: 'w4', family: 'Work', name: 'Admin Tasks', effects: { work: 8, rest: -3, growth: -2 } }
];

export const REST_TILES: TileDef[] = [
    { id: 'r1', family: 'Rest', name: 'Sleep Early', effects: { rest: 14, work: -4 } },
    { id: 'r2', family: 'Rest', name: 'Quiet Evening', effects: { rest: 12, relationships: 3, work: -3 } },
    { id: 'r3', family: 'Rest', name: 'Take a Walk', effects: { rest: 10, growth: 4, work: -2 } },
    { id: 'r4', family: 'Rest', name: 'Digital Detox', effects: { rest: 12, relationships: 4, growth: 2 } }
];

export const RELATIONSHIP_TILES: TileDef[] = [
    { id: 'rel1', family: 'Relationships', name: 'Family Dinner', effects: { relationships: 14, rest: 4, work: -5 } },
    { id: 'rel2', family: 'Relationships', name: 'Call a Friend', effects: { relationships: 12, rest: 3, work: -2 } },
    { id: 'rel3', family: 'Relationships', name: 'Help Someone', effects: { relationships: 10, growth: 4, rest: -3 } },
    { id: 'rel4', family: 'Relationships', name: 'Shared Time', effects: { relationships: 14, rest: 6, work: -6 } }
];

export const GROWTH_TILES: TileDef[] = [
    { id: 'g1', family: 'Growth', name: 'Read & Reflect', effects: { growth: 12, rest: 4, work: -3 } },
    { id: 'g2', family: 'Growth', name: 'Learn Skill', effects: { growth: 14, work: 4, rest: -4 } },
    { id: 'g3', family: 'Growth', name: 'Creative Practice', effects: { growth: 12, rest: 3, work: -4 } },
    { id: 'g4', family: 'Growth', name: 'Mentor Conversation', effects: { growth: 10, relationships: 6, work: -3 } }
];

export const ALL_TILES = [...WORK_TILES, ...REST_TILES, ...RELATIONSHIP_TILES, ...GROWTH_TILES];

export const GAME_EVENTS: GameEvent[] = [
    { id: 'e1', name: 'Deadline Pressure', effects: { work: 6, rest: -8 } },
    { id: 'e2', name: 'Quiet Weekend', effects: { rest: 8, growth: 3 } },
    { id: 'e3', name: 'Unexpected Expense', effects: { work: 4, stability: -6 } },
    { id: 'e4', name: 'Family Obligation', effects: { relationships: 6, work: -5 } },
    { id: 'e5', name: 'Positive Feedback', effects: { work: 5, growth: 4 } },
    { id: 'e6', name: 'New Inspiration', effects: { growth: 8, rest: -3 } },
    { id: 'e7', name: 'Poor Sleep', effects: { rest: -8, work: -6 } },
    { id: 'e8', name: 'Social Conflict', effects: { relationships: -8, stability: -4 } },
    { id: 'e9', name: 'Friend Needs Help', effects: { relationships: 8, rest: -5 } },
    { id: 'e10', name: 'Burnout Warning', effects: { work: -6, rest: -8, stability: -10 } }
];

export const INITIAL_STATS: LifeStats = {
    work: 50,
    rest: 50,
    relationships: 50,
    growth: 50,
    stability: 100
};

export const MAX_TURNS = 12;
