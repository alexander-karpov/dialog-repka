export type FioIntent = Readonly<
    | {
          firstName?: string;
          lastName: string;
      }
    | {
          firstName: string;
          lastName?: string;
      }
>;
