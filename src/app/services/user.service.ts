import { ApiResponse } from 'src/app/interfaces/apiResponse';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { LocationService } from './location.service';
import { UploadService } from './upload.service';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  private USER_CONNECTION_IDS_TO_AUTH_METHOD_MAP = {
    esteid: ['mobiilId', 'idCard', 'smartId'], // TODO: We should fix it properly on API/FE side - mapping of PID to auth methods
    smartid: ['mobiilId', 'idCard', 'smartId'], // TODO: We should fix it properly on API/FE side - mapping of PID to auth methods
    google: 'google',
    facebook: 'facebook',
    citizenos: 'citizenos'
  };

  constructor(private http: HttpClient, private Location: LocationService, private Upload: UploadService) { }

  update(name?: string, email?: string, password?: string, company?: string, imageUrl?: string, preferences?: string, language?: string, termsVersion?: string, newPassword?: string) {
    const path = this.Location.getAbsoluteUrlApi('/api/users/self');
    const userData:any = {
      name: null,
      password: null,
      email: email,
      company: company,
      imageUrl: imageUrl,
      language: language,
      preferences: preferences,
      termsVersion: termsVersion,
      newPassword: newPassword
    };

    if (name) {
      userData.name = name;
    }

    if (password) {
      userData.password = password;
    }

    if (!termsVersion) {
      delete userData.termsVersion;
    }

    if (!newPassword) {
      userData.newPassword = newPassword;
    }

    return this.http.put(path, userData, {withCredentials: true, observe: 'body', responseType: 'json' });
  };

  updateLanguage(language :string) {
    const path = this.Location.getAbsoluteUrlApi('/api/users/self');

    return this.http.put(path, { language: language }, {withCredentials: true, observe: 'body', responseType: 'json' });
  };

  updateTermsVersion(termsVersion:string) {
    const path = this.Location.getAbsoluteUrlApi('/api/users/self');

    return this.http.put(path, { termsVersion: termsVersion }, {withCredentials: true, observe: 'body', responseType: 'json' });
  };

  deleteUser() {
    const path = this.Location.getAbsoluteUrlApi('/api/users/self');

    return this.http.delete(path, {withCredentials: true, observe: 'body', responseType: 'json' });
  };

  consentsCreate(partnerId: string) {
    const path = this.Location.getAbsoluteUrlApi('/api/users/self/consents');

    return this.http.post(path, { partnerId: partnerId });
  };

  listUserConnections(userId: string) {
    const path = this.Location.getAbsoluteUrlApi('/api/users/:userId/userconnections', { userId: userId });

    return this.http.get<ApiResponse>(path, {withCredentials: true, observe: 'body', responseType: 'json' }).pipe(
      map((res) => res.data)
    )
  };

  addUserConnection(userId: string, connection: string, token?: string, cert?: string, redirectSuccess?: string) {
    const path = this.Location.getAbsoluteUrlApi('/api/users/:userId/userconnections/:connection', { userId: userId, connection: connection });

    return this.http.post<ApiResponse>(path, { token: token, cert: cert, redirectSuccess: redirectSuccess }).pipe(
      map((res) => res.data)
    );
  }

  uploadUserImage(file: File) {
    const path = this.Location.getAbsoluteUrlApi('/api/users/self/upload');

    return this.Upload.upload(path, file);
  };

}
