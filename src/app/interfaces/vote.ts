export interface Vote {
  authType: string,
  autoClose: boolean | null,
  createdAt: string,
  delegationIsAllowed: boolean,
  description: string | null,
  downloads?: any,
  endsAt?: string | null,
  id: string,
  maxChoices: number,
  minChoices: number,
  options: {
    rows: any[]
  } | any,
  reminderSent: string | null | Date,
  reminderTime: string | null | Date,
  type: string,
  votersCount: number
}
