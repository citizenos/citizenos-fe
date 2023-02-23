import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { LocationService } from './location.service';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { ApiResponse } from '../interfaces/apiResponse';
import { ItemsListService } from './items-list.service';
import { Attachment } from '../interfaces/attachment';
import { ConfigService } from './config.service';

declare var google: any;
declare var gapi: any;
declare var Dropbox: any;
declare var OneDrive: any;
@Injectable({
  providedIn: 'root'
})

export class TopicAttachmentService extends ItemsListService {
  params = Object.assign({}, {
    topicId: <string | null>null,
    orderBy: <string | null>null,
    sortOrder: <string | null>null,
    offset: <number>0,
    limit: <number>8,
  });

  params$ = new BehaviorSubject(this.params);

  SOURCES = {
    upload: 'upload',
    dropbox: 'dropbox',
    onedrive: 'onedrive',
    googledrive: 'googledrive'
  };
  constructor(private Auth: AuthService, private Location: LocationService, private http: HttpClient, private config: ConfigService) {
    super();
    this.items$ = this.loadItems();
  }

  getItems(params: any) {
    return this.query(params);
  }


  query(params: { [key: string]: any }): Observable<ApiResponse> {
    let path = this.Location.getAbsoluteUrlApi(this.Auth.resolveAuthorizedPath('/topics/:topicId/attachments'), params);
    const queryParams = Object.fromEntries(Object.entries(params).filter((i) => i[1] !== null));

    return this.http.get<ApiResponse>(path, { withCredentials: true, params: queryParams, observe: 'body', responseType: 'json' }).pipe(
      map((res) => {
        return res.data;
      })
    );
  };

  save(data: any) {
    let path = this.Location.getAbsoluteUrlApi('/api/users/self/topics/:topicId/attachments', data);

    return this.http.post<ApiResponse>(path, data, {withCredentials: true, observe: 'body', responseType: 'json'}).pipe(
      map((res) => {
        return res.data;
      })
    );
  }

  update(data: any) {
    const requestObject = <any>{};
    Object.keys(data).forEach(function (key) { // Remove all object properties as we have none we care about in the server side
      if (typeof data[key] !== 'object') {
        requestObject[key] = data[key];
      }
    });
    if (!data.attachmentId) data.attachmentId = data.id;
    const path = this.Location.getAbsoluteUrlApi('/api/users/self/topics/:topicId/attachments/:attachmentId', data)

    return this.http.put<ApiResponse>(path, requestObject, {withCredentials: true, observe: 'body', responseType: 'json'}).pipe(
      map((res) => {
        return res.data;
      })
    );
  }

  delete(data: any) {
    if (!data.attachmentId) data.attachmentId = data.id;
    const path = this.Location.getAbsoluteUrlApi('/api/users/self/topics/:topicId/attachments/:attachmentId', data);

    return this.http.delete<ApiResponse>(path, {withCredentials: true, observe: 'body', responseType: 'json'}).pipe(
      map((res) => {
        return res.data;
      })
    );
  }

  googleDriveSelect() {

    let googlePickerApiLoaded = false;
    let oauthToken: any;
    const createPicker = () => {
      return new Promise((resolve) => {
        const pickerCallback = (data: any) => {
          if (data[google.picker.Response.ACTION] == google.picker.Action.PICKED) {
            const doc = data[google.picker.Response.DOCUMENTS][0];
            const attachment = {
              name: doc[google.picker.Document.NAME],
              type: doc[google.picker.Document.TYPE],
              source: this.SOURCES.googledrive,
              size: doc.sizeBytes || 0,
              link: doc[google.picker.Document.URL]
            };
            return resolve(attachment);
          }
        };
        const picker = new google.picker.PickerBuilder()
          .addView(google.picker.ViewId.DOCS)
          .setOAuthToken(oauthToken)
          .setDeveloperKey(this.config.get('attachments').googleDrive.developerKey)
          .setCallback(pickerCallback)
          .setOrigin(window.location.protocol + '//' + window.location.host)
          .setSize(600, 400)
          .build();
        picker.setVisible(true);
      });
    }
    return new Promise((resolve) => {
      const onAuthApiLoad = () => {
        gapi.auth.authorize(
          {
            'client_id': this.config.get('attachments').googleDrive.clientId,
            'scope': ['https://www.googleapis.com/auth/drive.file'],
            'immediate': false
          }, (authResult: any) => {
            if (authResult && !authResult.error && googlePickerApiLoaded) {
              oauthToken = authResult.access_token;
              googlePickerApiLoaded = true;
              return resolve(createPicker());
            }
            return resolve(null);
          });
      };

      const onPickerApiLoad = () => {
        googlePickerApiLoaded = true;
      }

      gapi.load('client', { 'callback': onAuthApiLoad });
      gapi.load('picker', { 'callback': onPickerApiLoad });
    })
      .catch((e) => {
        console.error(e);
      });
  };

  /*DROPBOX*/
  dropboxSelect() {
    Dropbox.appKey = this.config.get('attachments').dropbox.appKey;
    return new Promise((resolve, reject) => {
      return Dropbox.choose({
        success: (files: any) => {
          const attachment = {
            name: files[0].name,
            type: files[0].name.split('.').pop(),
            source: this.SOURCES.dropbox,
            size: files[0].bytes,
            link: files[0].link
          };
          return resolve(attachment);
        },
        cancel: () => {
          reject();
        },
        linkType: 'preview',
        multiselect: false
      });
    });
  };

  /* ONEDRIVE */

  oneDriveSelect() {
    console.log(this.Location.getAbsoluteUrl('/onedrive'));
    return new Promise((resolve, reject) => {
      OneDrive.open({
        clientId: this.config.get('attachments').oneDrive.clientId,
        action: 'share',
        advanced: {
          redirectUri: this.Location.getAbsoluteUrl('/onedrive')
        },
        success: (res: any) => {
          const attachment = {
            name: res.value[0].name,
            type: res.value[0].name.split('.').pop(),
            source: this.SOURCES.onedrive,
            size: res.value[0].size,
            link: res.value[0].permissions[0].link.webUrl
          };
          resolve(attachment);
        },
        cancel: () => { },
        error: (err: any) => {
          console.error(err);
        }
      });
    });
  };
}
