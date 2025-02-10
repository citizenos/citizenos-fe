/**
 * @note Deprecated
 */
export interface InviteData {
  invite: any;
  currentUrl?: string;
}

export interface InviteDialogData {
  imageUrl: string | null;
  title: string | null;
  intro: string | null;
  description: string | null;
  creator: {
    imageUrl: string | undefined;
    name: string;
  } | null;
  user: {
    email: string;
    isRegistered: boolean;
  } | null;
  level: string | null;
  visibility: string;
  publicAccess: {
    title: string;
    link: string[];
  } | null;
  type: 'join' | 'invite';
  view: 'topic' | 'group';
}

export interface ReportData {
  topic: any;
}
