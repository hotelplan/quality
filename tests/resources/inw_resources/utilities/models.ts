export interface BoundingBox {
    x: number;
    y: number;
    width: number;
    height: number;
}
export interface SearchValues {
    departure: string | null;
    arrival: string | null;
    whosComing: string | null;
    nights: string | null;
}

export interface ResortSearchValues {
    departure: string | null;
    whosComing: string | null;
    nights: string | null;
}