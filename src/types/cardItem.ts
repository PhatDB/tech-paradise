export interface CardLink {
    text: string;
    href: string;
}

export interface CardSubItem {
    name: string;
    items?: string[];
    image: string;
    href: string;
}

export interface CardItem {
    title: string;
    link?: CardLink;
    items: CardSubItem[];
}
