import { connect, ConnectedProps } from 'react-redux';
import { State } from '../../types/state';
import { SORT_TYPES, SORT_ORDERS } from '../../const';
import { MouseEvent, KeyboardEvent } from 'react';
import { store } from '../../store/store';
import { ThunkAppDispatch } from '../../types/action';
import { changeSortType, changeOrderType } from '../../store/action';

const mapStateToProps = ({sortType, orderType}: State) => ({
  sortType,
  orderType,
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;
type ConnectedComponentProps = PropsFromRedux;

function CatalogSort({sortType, orderType}: ConnectedComponentProps): JSX.Element {
  const hadleSortTypeButtonClick =(evt: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>) => {
    if(evt.currentTarget.textContent !==null) {
      (store.dispatch as ThunkAppDispatch)(changeSortType(evt.currentTarget.textContent));}
  };

  const hadleOrderTypeButtonClick =(order: string) => {
    if(order !==null) {
      (store.dispatch as ThunkAppDispatch)(changeOrderType(order));}
  };

  return (
    <div className="catalog-sort">
      <h2 className="catalog-sort__title">Сортировать:</h2>
      <div className="catalog-sort__type">
        {SORT_TYPES.map((type) => (
          <button key={type}
            className={type === sortType ? 'catalog-sort__type-button catalog-sort__type-button--active' : 'catalog-sort__type-button'}
            aria-label={type}
            {...sortType === type ? 'tabIndex={-1}' : ''}
            onClick={(evt) => {hadleSortTypeButtonClick(evt);}}
          >
            {type}
          </button>))}
      </div>
      <div className="catalog-sort__order">
        {SORT_ORDERS.map((order) => (
          <button
            key={order}
            className={orderType === order ? `catalog-sort__order-button catalog-sort__order-button--${order} catalog-sort__order-button--active` : `catalog-sort__order-button catalog-sort__order-button--${order}`}
            aria-label={order}
            {...orderType === order ? 'tabIndex={-1}' : ''}
            onClick={(evt) => {hadleOrderTypeButtonClick(order);}}
          >
          </button>
        ))}
      </div>
    </div>

  );
}

export {CatalogSort};
export default connector(CatalogSort);
