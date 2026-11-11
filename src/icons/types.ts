/** Path data for one icon. Vendors can pass their own object of this shape wherever an icon is accepted. */
export interface IconPath {
    d: string;
    fillRule?: 'evenodd' | 'nonzero';
    /** Paint with currentColor as a stroke instead of a fill (outline shapes). */
    stroke?: { width: number };
}

export interface IconData {
    viewBox: string;
    paths: IconPath[];
}
