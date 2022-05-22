export type EntityRecognitionResult = {
    nomn: string;
    accs: string;
    enriched_nomn?: string;
    enriched_accs?: string;
    subject: string[];
    tags: string;
};
