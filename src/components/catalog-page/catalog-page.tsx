import Logo from '../logo/logo';
import { State } from '../../types/state';
import { connect, ConnectedProps } from 'react-redux';
import ProductCard from '../product-card/product-card';
import CatalogFilter from '../catalog-filter/catalog-filter';
import CatalogSort from '../catalog-sort/catalog-sort';
import Header from '../header/header';
import Footer from '../footer/footer';
import { sortGuitarsPriceDown, sortGuitarsRatingDown, sortGuitarsPriceUp, sortGuitarsRatingUp } from '../../utils/common';

const mapStateToProps = ({guitars, sortType, orderType}: State) => ({
  guitars,
  sortType,
  orderType,
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;
type ConnectedComponentProps = PropsFromRedux;

function CatalogPage({guitars, sortType, orderType}: ConnectedComponentProps): JSX.Element {
  const getSortedGuitars = () => {
    switch (sortType) {
      case 'по цене':
        return guitars.sort(sortGuitarsPriceUp);
      case 'по популярности':
        return guitars.sort(sortGuitarsRatingUp);
      default:
        return guitars;
    }
  };
  const getSortedAndOrderedGuitars = () => {
    switch (orderType) {
      case 'down':
        switch (sortType) {
          case 'по цене':
          case '':
            return guitars.sort(sortGuitarsPriceDown);
          case 'по популярности':
            return guitars.sort(sortGuitarsRatingDown);}
        break;
      case 'up':
        switch (sortType) {
          case 'по цене':
          case '':
            return guitars.sort(sortGuitarsPriceUp);
          case 'по популярности':
            return guitars.sort(sortGuitarsRatingUp);}
        break;
      default:
        return getSortedGuitars();
    }
  };

  return(
    <>
      <Logo />
      <div className="wrapper">
        <Header />
        <main className="page-content">
          <div className="container">
            <h1 className="page-content__title title title--bigger">Каталог гитар</h1>
            <ul className="breadcrumbs page-content__breadcrumbs">
              <li className="breadcrumbs__item"><a className="link" href="./main.html">Главная</a>
              </li>
              <li className="breadcrumbs__item"><a className="link">Каталог</a>
              </li>
            </ul>
            <div className="catalog">
              <CatalogFilter />
              <CatalogSort />
              <div className="cards catalog__cards">
                {getSortedAndOrderedGuitars()?.slice(0,9).map((guitar) => (
                  <ProductCard key={guitar.id} guitar={guitar} />
                ))}
              </div>
              <div className="pagination page-content__pagination">
                <ul className="pagination__list">
                  <li className="pagination__page pagination__page--active"><a className="link pagination__page-link" href="1">1</a>
                  </li>
                  <li className="pagination__page"><a className="link pagination__page-link" href="2">2</a>
                  </li>
                  <li className="pagination__page"><a className="link pagination__page-link" href="3">3</a>
                  </li>
                  <li className="pagination__page pagination__page--next" id="next"><a className="link pagination__page-link" href="2">Далее</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>

  );
}

export {CatalogPage};
export default connector(CatalogPage);
