import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgFor } from '@angular/common';

interface PageItem {
  type: 'page' | 'dotes',
  value?: number;
}

interface PageIteration {
  pointsLeft: number,
  endedDirection: number[],
  pages: PageItem[]
}

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [ NgFor ],
  templateUrl: './paginator.component.html',
  styleUrls: [ './paginator.component.scss' ]
})
export class PaginatorComponent {

  @Input() maxItems = 5;

  @Input() pagesCount = 0;

  @Input() currentPage = 1;

  @Output('pageSelect') pageEmitter: EventEmitter<number> = new EventEmitter<number>();

  public get pages(): PageItem[] {
    if(this.pagesCount === 0) return [];

    let pages: PageItem[] = [];

    pages.push({ type: 'page', value: this.currentPage });

    let radius = 1;
    let pointsLeft = Math.min( this.maxItems, this.pagesCount ) - 1;
    let currentDirection = 1;
    let currentIndex = 0;
    let endedDirection: number[] = [];

    while (pointsLeft !== 0) {
      const {
        pages: newPages,
        pointsLeft: newPointsLeft,
        endedDirection: newEndedDirections
      } = this.pageIteration(currentDirection, radius, endedDirection, pages, pointsLeft);

      pages = newPages;
      pointsLeft = newPointsLeft;
      endedDirection = newEndedDirections;

      currentDirection *= -1;
      currentIndex++;

      if( currentIndex % 2 === 0 ) {
        radius++;
      }

      if(pointsLeft === 0) {
        return pages;
      }
    }

    return pages
  }

  private isPageInBound(currentPage: number): boolean {
    return currentPage <= this.pagesCount && currentPage > 0;
  }

  private isPageOutOfBound(currentPage: number): boolean {
    return currentPage > 1 && currentPage < this.pagesCount;
  }

  private isPageOnBound(currentPage: number): boolean {
    return currentPage === this.pagesCount || currentPage === 1;
  }

  private getDisplayedPageNumber(isEnded: boolean, currentDirection: number, currentPage: number): number {
    if(isEnded && this.isPageInBound(currentPage)) {
      return currentDirection > 0 ? this.pagesCount : 1;
    }

    return currentPage;
  }

  private getCurrentPageItem(isEndedDirection:  boolean, isLeft: boolean, currentPage: number): PageItem | undefined {

    const shownPage = isLeft && this.isPageInBound(currentPage);

    const boundPage = isEndedDirection || this.isPageOnBound(currentPage);

    const outOfBoundPage = !isEndedDirection && this.isPageOutOfBound(currentPage);

    if ( shownPage || boundPage ) {
      return { type: 'page', value: currentPage };
    } else if( outOfBoundPage ) {
      return { type: 'dotes' };
    }

    return;
  }

  private pageIteration(currentDirection: number, radius: number, endedDirection: number[], pages: PageItem[], pointsLeft: number): PageIteration {
    const newPages = [ ...pages ];

    const newEndedDirections = [ ...endedDirection ];

    const boundReached = newPages.filter(page => page.value === 1 || page.value === this.pagesCount);

    const currentPage = this.currentPage + currentDirection * radius

    const isEnded = endedDirection.includes(currentDirection);

    const pushMethod = currentDirection > 0 ? newPages.push.bind(newPages) : newPages.unshift.bind(newPages);

    const displayedPage = this.getDisplayedPageNumber(isEnded, currentDirection, currentPage);

    const pageItem = this.getCurrentPageItem(
      isEnded,
      pointsLeft > 2 - boundReached.length,
      displayedPage
    )

    if (pageItem) pushMethod(pageItem);

    if (pageItem && pageItem.type === 'page' ) {

      pointsLeft--;

    } else if(pageItem) {

      newEndedDirections.push(currentDirection);
    }

    return {
      pointsLeft,
      endedDirection: newEndedDirections,
      pages: newPages
    }
  }

  public onPageSelect(page: PageItem): void {
    if (page.type === 'dotes') return;

    this.pageEmitter.emit(page.value);
  }

  public selectNext(direction: number): void {
    if( this.currentPage + direction < 1 || this.currentPage + direction > this.pagesCount ) return;

    this.pageEmitter.emit(this.currentPage + direction);
  }
}
