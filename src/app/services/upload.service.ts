import { LocationService } from 'src/app/services/location.service';
import { HttpClient, HttpRequest, HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  constructor(private http: HttpClient, private Location: LocationService) { }

  upload(path: string, file: File, data?: any): Observable<HttpEvent<any> | any> {
    const formData: FormData = new FormData();

    formData.append('file', file);
    if (data) {
      for (const [key, value] of Object.entries(data)) {
        formData.append(key, String(value));
      }
    }

    const req = new HttpRequest('POST', path, formData, {
      withCredentials: true,
      reportProgress: true,
      responseType: 'json',
    });

    return this.http.request(req).pipe(map((res: any) => {
      if (res.type === HttpEventType.Response) {
        return res.body?.data || res.body;
      }

      return res;
    }))
  }

  download(topicId: string, attachmentId:string, userId?:string) {
    let path = this.Location.getAbsoluteUrlApi('/api/topics/:topicId/attachments/:attachmentId');

    if (userId) {
      path = this.Location.getAbsoluteUrlApi('/api/users/self/topics/:topicId/attachments/:attachmentId');
    }

    path = path.replace(':topicId', topicId).replace(':attachmentId', attachmentId);

    window.location.href = path + '?download=true';
  };
}
