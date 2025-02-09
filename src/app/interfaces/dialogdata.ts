/**
 * @note Deprecated
 */
export interface InviteData {
  invite: any;
  currentUrl?: string;
}

export interface InviteDialogData {
  imageUrl: string | undefined;
  title: string;
  intro: string | undefined;
  description: string | undefined;
  creator: {
    imageUrl: string | undefined;
    name: string;
  };
  user: {
    email: string;
    isRegistered: boolean;
  };
  level: string;
  visibility: string;
  currentUrl: string;
  publicAccess: {
    title: string;
    link: string[];
  } | null;
}

export interface ReportData {
  topic: any;
}
