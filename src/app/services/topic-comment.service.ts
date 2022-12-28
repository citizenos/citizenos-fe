import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TopicCommentService {
  private COMMENT_TYPES = {
    pro: 'pro',
    con: 'con',
    poi: 'poi',
    reply: 'reply'
  };

  private COMMENT_SUBJECT_MAXLENGTH = 128;

  private COMMENT_TYPES_MAXLENGTH = {
      pro: 2048,
      con: 2048,
      poi: 500,
      reply: 2048
  };

  private COMMENT_REPORT_TYPES = {
      abuse: 'abuse', // is abusive or insulting
      obscene: 'obscene', // contains obscene language
      spam: 'spam', // contains spam or is unrelated to topic
      hate: 'hate', // contains hate speech
      netiquette: 'netiquette', // infringes (n)etiquette
      duplicate: 'duplicate' // duplicate
  };

  private COMMENT_ORDER_BY = {
  //    rating: 'rating', removed 23.12.2022
      popularity: 'popularity',
      date: 'date'
  };
  count = {
    total: 0
  };
  constructor() { }
}
