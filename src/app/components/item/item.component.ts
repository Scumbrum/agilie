import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IGIF } from '../../models/api.model';
import { DatePipe, NgOptimizedImage } from '@angular/common';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-item',
  standalone: true,
  imports: [
    NgOptimizedImage,
    DatePipe,
    LoaderComponent
  ],
  templateUrl: './item.component.html',
  styleUrl: './item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemComponent implements OnChanges {
  @Input({ required: true }) item!: IGIF;
  public isLoading = true;

  public ngOnChanges(changes: SimpleChanges): void {
    this.isLoading = true;
  }
}
