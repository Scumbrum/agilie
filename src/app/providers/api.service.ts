import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { IGIF, IPaginatorData } from '../models/api.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private readonly httpService = inject(HttpClient);

  public searchGifs(q: string, offset: number, limit: number): Observable<IPaginatorData<IGIF[]>> {
    let httpParams = new HttpParams(
      { fromObject: {
          q,
          offset,
          limit
        }
      }
    );

    if (!q) {
      return this.httpService.get<IPaginatorData<IGIF[]>>(`${environment.API_BASE}/trending`,{ params: httpParams })
    }

    return this.httpService.get<IPaginatorData<IGIF[]>>(`${environment.API_BASE}/search`,{ params: httpParams })
  }
}
