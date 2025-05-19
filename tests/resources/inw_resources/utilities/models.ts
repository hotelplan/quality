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
    departureDate: string | null;
    departure: string | null;
    whosComing: string | null;
    nights: string | null;
}

export type GoodToKnowItem = {
    icon: string | null;
    title: string | null;
    description: string | null;
    link: string | null;
};

export type CtaButtonProperty = {
    icon: string | null;
    title: string | null;
};

export type PillsProperty = {
    rteContent: string | null;
    linkTitle: string | null;
    link: string | null;
    ctaButtonLinkTitle: string | null;
    icon: string | null;
}