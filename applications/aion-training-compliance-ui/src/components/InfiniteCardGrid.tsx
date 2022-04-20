import * as React from 'react';
import {
  AutoSizer,
  Index,
  IndexRange,
  InfiniteLoader,
  List,
  ListRowProps,
  WindowScroller
  } from 'react-virtualized';
import { calcuteCardRows, calcuteTopAndSkip } from 'helpers/infiniteCardGrid';
import { CardGrid } from './CardGrid';
import { GhostInfoCard } from './GhostInfoCard';
import { OffsetCard } from './OffsetCard';

type InjectChildProps<T> = {
  item: Readonly<T>;
};

type Props<T> = {
  items: Readonly<T[]>;
  totalCount: number;
  fetchItems: (top: number, skip: number, id?: string) => Promise<T[]>;
  children: (props: InjectChildProps<T>) => React.ReactNode;
  cardSize?: number;
  secondaryTitle?: boolean;
  subtitle?: boolean;
};

export class InfiniteCardGrid<T> extends React.Component<Props<T>> {
  isRowLoaded = (itemsPerRow: number) => ({ index }: Index) => !!this.props.items[index * itemsPerRow];

  rowRenderer = (itemsPerRow: number) => ({ key, index, style }: ListRowProps) => {
    const { totalCount, items, children, secondaryTitle, subtitle } = this.props;
    const cards: React.ReactNode[] = [];
    const fromIndex = index * itemsPerRow;
    const toIndex = Math.min(fromIndex + itemsPerRow, totalCount);
    const remainingCardsPerRow = fromIndex + itemsPerRow - toIndex;

    for (let i = fromIndex; i < toIndex; i++) {
      if (items[i]) {
        cards.push(children({ item: items[i] }));
      } else {
        cards.push(<GhostInfoCard key={i} subtitle={subtitle} secondaryTitle={secondaryTitle} />);
      }
    }

    if (itemsPerRow !== remainingCardsPerRow) {
      for (let i = 0; i < remainingCardsPerRow; i++) {
        cards.push(<OffsetCard key={i + 1 * totalCount} secondaryTitle={secondaryTitle} subtitle={subtitle} />);
      }
    }

    return (
      <CardGrid key={key} style={style}>
        {cards}
      </CardGrid>
    );
  };

  loadMoreItems = (itemsPerRow: number) => ({ startIndex, stopIndex }: IndexRange) => {
    const { top, skip } = calcuteTopAndSkip(itemsPerRow, startIndex, stopIndex);
    return this.props.fetchItems(top, skip);
  };

  render() {
    const { totalCount, cardSize, subtitle, secondaryTitle } = this.props;

    return (
      <AutoSizer style={{ height: 'auto' }}>
        {({ width }) => {
          const { itemsPerRow, rowCount } = calcuteCardRows(width, cardSize || 350, totalCount || 100);

          return (
            <InfiniteLoader
              isRowLoaded={this.isRowLoaded(itemsPerRow)}
              loadMoreRows={this.loadMoreItems(itemsPerRow)}
              rowCount={rowCount + 1}
              threshold={1}
            >
              {({ onRowsRendered, registerChild }) => (
                <WindowScroller>
                  {({ height, isScrolling, onChildScroll, scrollTop }) => (
                    <List
                      style={{ outline: 'none' }}
                      autoHeight
                      height={height}
                      width={width}
                      isScrolling={isScrolling}
                      onScroll={onChildScroll}
                      scrollTop={scrollTop}
                      onRowsRendered={onRowsRendered}
                      ref={registerChild}
                      rowCount={rowCount}
                      rowHeight={subtitle && secondaryTitle ? 155 : subtitle ? 140 : 115}
                      rowRenderer={this.rowRenderer(itemsPerRow)}
                    />
                  )}
                </WindowScroller>
              )}
            </InfiniteLoader>
          );
        }}
      </AutoSizer>
    );
  }
}
