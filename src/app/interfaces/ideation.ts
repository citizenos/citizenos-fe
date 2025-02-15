export interface Ideation {
  id: string;
  question: string;
  creator?: {
    id: string;
    name: string;
    imageUrl: string;
    email: string;
  };
  folders: {
    count: number;
  };
  creatorId: string;
  deadline: null | string;
  createdAt: Date;
  updatedAt: Date;
  ideas: {
    count: number;
  };
  disableReplies: boolean;
  allowAnonymous: boolean;
  template: string | null;
  demographicsConfig: Record<string, { required: boolean; value: string }> | null;
}
