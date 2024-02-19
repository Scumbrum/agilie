import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ItemComponent } from './components/item/item.component';
import { BehaviorSubject, combineLatest, debounceTime, EMPTY, Observable, startWith, switchMap } from 'rxjs';
import { ApiService } from './providers/api.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { IGIF, IPaginatorData } from './models/api.model';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { LoaderComponent } from './components/loader/loader.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PaginatorComponent } from './components/paginator/paginator.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    ItemComponent,
    AsyncPipe,
    ReactiveFormsModule,
    LoaderComponent,
    PaginatorComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  public gifs?: IPaginatorData<IGIF[]>;
  private readonly apiService = inject(ApiService);
  private readonly destroyRef = inject(DestroyRef);
  public isLoading = signal(false);
  public pageSize = 15;
  public currentPage = 1;
  public pageChanged$ = new BehaviorSubject<number>(1);
  private prevSearch?: string;
  private prevPage?: number;

  public query = new FormControl('');

  private switcher(value: string | null, page: number): Observable<IPaginatorData<IGIF[]>> {
    if (value === this.prevSearch && page === this.prevPage) {
      return EMPTY;
    }

    this.isLoading.set(true);

    if (value !== this.prevSearch) {
      this.currentPage = 1;
      this.prevSearch = value!;
    } else {
      this.currentPage = page;
    }

    this.prevPage = page;

    return this.apiService.searchGifs(value!, (this.currentPage - 1) * this.pageSize, this.pageSize);
  }

  private listenSearch(): void {
    const listenerQuery$ = this.query.valueChanges
      .pipe(
        debounceTime(300),
        takeUntilDestroyed(this.destroyRef),
        startWith(this.query.value)
      )

    const listenerPage$ = this.pageChanged$.pipe(debounceTime(300));

    combineLatest([
      listenerQuery$,
      listenerPage$
    ])
      .pipe(
        switchMap(([value, page]) => this.switcher(value, page))
      ).subscribe({
        error: (error) => {
          alert(error.message);
          this.isLoading.set(false);
          this.listenSearch();
        },
        next: (value) => {
          this.gifs = value;
          this.isLoading.set(false);
        }
      });
  }

  public get pageCount(): number {
    if (!this.gifs) return 0;
    return Math.ceil(this.gifs.pagination.total_count / this.pageSize);
  }

  public changePage(page: number): void {
    this.pageChanged$.next(page);
  }

  public ngOnInit(): void {
    this.listenSearch();
  }
}
