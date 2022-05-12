import { State } from '../../types/state';
import { Guitar } from '../../types/guitar';
import { connect, ConnectedProps } from 'react-redux';
import ProductCard from '../product-card/product-card';
import CatalogFilter from '../catalog-filter/catalog-filter';
import CatalogSort from '../catalog-sort/catalog-sort';
import ModalCartAdd from '../modal-cart-add/modal-cart-add';
import ModalSuccessAdd from '../modal-success-add/modal-success-add';
import Header from '../header/header';
import Footer from '../footer/footer';
import { sortGuitarsPriceDown, sortGuitarsRatingDown, sortGuitarsPriceUp, sortGuitarsRatingUp } from '../../utils/common';
import { CARDS_PER_PAGE, END_CARD_INDEX, GUITARS_TYPES_CHECKED, START_CARD_INDEX, GUITAR_TYPE_CHECKED_FLAG, GUITAR_TYPE_CHECKED_INDEX, PAGENATION, DEFAULT_PAGES, STRINGS_QUANTITY_BY_GUITAR } from '../../const';
import { useState, SyntheticEvent, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { store } from '../../store/store';
import { updateCardsRendered, updateGuitarTypeFilter, updateStringsTypeFilter, changeOrderType, changeSortType, setMaxPriceFilter, updateMinPriceFilter } from '../../store/action';
import { ThunkAppDispatch } from '../../types/action';
import PreviousPage from './previous-page';
import NextPage from './next-page';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router';

const mapStateToProps = ({guitars, sortType, orderType, minPriceFilter, maxPriceFilter, guitarType, stringsQuantity, cardsRendered}: State) => ({
  guitars,
  sortType,
  orderType,
  minPriceFilter,
  maxPriceFilter,
  guitarType,
  stringsQuantity,
  cardsRendered,
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;
type ConnectedComponentProps = PropsFromRedux;

function CatalogPage({guitars, sortType, orderType, minPriceFilter, maxPriceFilter, guitarType, stringsQuantity, cardsRendered}: ConnectedComponentProps): JSX.Element {
  const [isActivePage, setIsActivePage] = useState<string>('1');
  const [isPreviousPage, setIsPreviousPage] = useState<boolean>(false);
  const [isNextPage, setIsNextPage] = useState<boolean>(true);
  const [guitarsFromTo, setGuitarsFromTo] = useState<number[]>([0,CARDS_PER_PAGE]);
  const [isModalCartAddVisible, setIsModalCartAddVisible] = useState<boolean>(false);
  const [isModalSuccessAddVisible, setIsModalSuccessAddVisible] = useState<boolean>(false);
  const [guitarToCart, setGuitarToCart] = useState<Guitar>(guitars[1]);
  const pageURL: number = Math.round((cardsRendered[START_CARD_INDEX])/CARDS_PER_PAGE+1);
  const navigate = useNavigate();
  const location = useLocation();

  const getSortedGuitars = () => {
    switch (sortType) {
      case 'по цене':
        return guitars.slice().sort(sortGuitarsPriceUp);
      case 'по популярности':
        return guitars.slice().sort(sortGuitarsRatingUp);
      default:
        return guitars.slice();
    }
  };

  const getSortedAndOrderedGuitars = () => {
    switch (orderType) {
      case 'down':
        switch (sortType) {
          case 'по цене':
          case '':
            return guitars.slice().sort(sortGuitarsPriceDown);
          case 'по популярности':
            return guitars.slice().sort(sortGuitarsRatingDown);}
        break;
      case 'up':
        switch (sortType) {
          case 'по цене':
          case '':
            return guitars.slice().sort(sortGuitarsPriceUp);
          case 'по популярности':
            return guitars.slice().sort(sortGuitarsRatingUp);}
        break;
      default:
        return getSortedGuitars();
    }
  };

  const filterByGuitarType = (guitar: Guitar) => {
    if(Object.values(guitarType).toString() === Object.values(GUITARS_TYPES_CHECKED).toString() || guitarType[guitar.type] === true) {
      return guitar;
    }
  };

  const filterByStringsQuantity = (guitar: Guitar) => {
    if(stringsQuantity.length === 0 || stringsQuantity.includes(guitar.stringCount)) {
      return guitar;
    }
  };

  const guitarsFilteredByTypeAndStrings = getSortedAndOrderedGuitars()?.filter(filterByGuitarType).filter(filterByStringsQuantity);
  const guitarsForRendering = guitarsFilteredByTypeAndStrings?.filter((guitar)=>(guitar.price >= minPriceFilter && guitar.price <= maxPriceFilter));

  useEffect(()=>{
    const guitarTypesforUrlSearch = Object.entries(guitarType).filter((item)=>item[GUITAR_TYPE_CHECKED_FLAG] === true).map((item)=>item[GUITAR_TYPE_CHECKED_INDEX]).join(',');
    const getPageURL = `?pageCount=catalog/page_${pageURL}&PAGENATION=${PAGENATION.length}`;
    const getTypeURL = guitarTypesforUrlSearch.length > 0 ? `&type=${guitarTypesforUrlSearch}`:'';
    const getStringsURL = stringsQuantity.length > 0 ? `&stringCount=${stringsQuantity.join(',')}`: '';
    const getSortTypeURL = sortType.length > 0 ? `&sort=${sortType}`:'';
    const getSortOrderURL = orderType.length > 0 ? `&order=${orderType}`: '';
    const getMinPriceURL = (minPriceFilter === 0 || minPriceFilter <= Math.min(...guitars.map((guitar) => guitar.price)) ) ? '' : `&minPrice=${minPriceFilter}`;
    const getMaxPriceURL = (maxPriceFilter === 0 || maxPriceFilter >= Math.max(...guitars.map((guitar) => guitar.price)))? '' : `&maxPrice=${maxPriceFilter}`;
    const getURL = `${getPageURL}${getTypeURL}${getStringsURL}${getSortTypeURL}${getSortOrderURL}${getMinPriceURL}${getMaxPriceURL}`;
    navigate({
      pathname: window.location.pathname,
      search: getURL,
    });
  },[ guitarType, stringsQuantity, sortType, orderType, cardsRendered, minPriceFilter, maxPriceFilter]);

  const getObjectFromQueryString = (urlSearch: string) => {
    const paramsEntries = new URLSearchParams(urlSearch).entries();
    const filter = Object.fromEntries(paramsEntries);
    return filter;
  };

  useEffect(() => {
    const filter = getObjectFromQueryString(location.search);
    const stringsOfTypesChecked = new Set<number>();

    if(filter['type']){
      const checkedGuitarTypes: string[] = filter['type'].split(',');
      checkedGuitarTypes.forEach((type) => STRINGS_QUANTITY_BY_GUITAR[type].forEach((string) => stringsOfTypesChecked.add(string))); // формируем сет строк по активным гитарам для проверки checkedStrings
      checkedGuitarTypes.forEach((type) => guitarType[type] !== true
        ? (store.dispatch as ThunkAppDispatch)(updateGuitarTypeFilter(type))
        : '');
    }

    if(filter['stringCount']){
      const checkedStrings: number[] = [];
      filter['stringCount'].split(',').forEach((string) => {
        if(stringsOfTypesChecked.has(+string)){
          checkedStrings.push(+string);
        }});
      (store.dispatch as ThunkAppDispatch)(updateStringsTypeFilter(checkedStrings));
    }

    if(filter['order'] && orderType !== filter['order']){
      (store.dispatch as ThunkAppDispatch)(changeOrderType(filter['order']));
    }

    if(filter['sort'] && sortType !== filter['sort']){
      (store.dispatch as ThunkAppDispatch)(changeSortType(filter['sort']));
    }

    if(filter['pageCount']){
      const pagenationURL = +filter['PAGENATION'];

      if(PAGENATION.length < pagenationURL) {
        for(let i = PAGENATION.length; i <= pagenationURL; i++){
          PAGENATION.push(i);
        }
      }

      if( filter['pageCount'] !== 'catalog/page_1'){
        const page = filter['pageCount'].slice(filter['pageCount'].search('_')+1);
        (store.dispatch as ThunkAppDispatch)(updateCardsRendered([(+page-1)*CARDS_PER_PAGE, +page*CARDS_PER_PAGE]));
        setIsActivePage(page);
        setIsPreviousPage(true);
      }
    }

    if(filter['minPrice'] !== undefined && minPriceFilter !== +filter['minPrice']){
      let value = +filter['minPrice'];
      if(filter['type'] || filter['sort']) {
        const minPriceForCheckedTypeAndString = guitarsFilteredByTypeAndStrings ? Math.min(...guitarsFilteredByTypeAndStrings.map((guitar) => guitar.price)) : Math.min(...guitars.map((guitar) => guitar.price));
        value = Math.max(value, minPriceForCheckedTypeAndString);
      }
      (store.dispatch as ThunkAppDispatch)(updateMinPriceFilter(value));
    }

    if(filter['maxPrice'] !== undefined && maxPriceFilter !== +filter['maxPrice']){
      let value = +filter['maxPrice'];
      if(filter['type'] || filter['sort']) {
        const maxPriceForCheckedTypeAndString = guitarsFilteredByTypeAndStrings ? Math.max(...guitarsFilteredByTypeAndStrings.map((guitar) => guitar.price)) : Math.max(...guitars.map((guitar) => guitar.price));
        value = Math.min(value, maxPriceForCheckedTypeAndString);
      }
      (store.dispatch as ThunkAppDispatch)(setMaxPriceFilter(value));
    }
  }, [location.search]);

  useEffect(() => {
    setIsActivePage('1');
    setIsPreviousPage(false);
    setIsNextPage(true);
    PAGENATION.splice(DEFAULT_PAGES);
    setGuitarsFromTo([START_CARD_INDEX, CARDS_PER_PAGE]);
  }, [guitarType, stringsQuantity]);

  const handlePreviousNextPageClick = (evt: SyntheticEvent<HTMLAnchorElement>) => {
    evt.preventDefault();

    if(guitarsForRendering !== undefined){
      const guitarFrom = guitarsFromTo[START_CARD_INDEX];
      const guitarTo = guitarsFromTo[END_CARD_INDEX];
      const guitarsLength = guitarsForRendering.length;
      const page = evt.currentTarget.textContent;

      if(page === 'Далее') {
        setIsPreviousPage(true);
        setGuitarsFromTo([guitarFrom+CARDS_PER_PAGE, Math.min(guitarTo+CARDS_PER_PAGE, guitarsLength)]);
        (store.dispatch as ThunkAppDispatch)(updateCardsRendered([guitarFrom+CARDS_PER_PAGE, Math.min(guitarTo+CARDS_PER_PAGE, guitarsLength)]));

        if(Math.min(guitarTo+CARDS_PER_PAGE, guitarsLength) > PAGENATION[PAGENATION.length-1]*CARDS_PER_PAGE){
          PAGENATION.push(PAGENATION.length+1);
        }

        if(guitarTo+CARDS_PER_PAGE >= guitarsLength){
          setIsNextPage(false);
        }
        setIsActivePage(`${Math.round((guitarFrom+CARDS_PER_PAGE+1)/CARDS_PER_PAGE+1)}`);
      }

      if(page === 'Назад') {
        setIsNextPage(true);
        const residualCards = cardsRendered[END_CARD_INDEX] % CARDS_PER_PAGE;

        if(residualCards === 0) {
          setGuitarsFromTo([guitarFrom-CARDS_PER_PAGE, guitarTo-CARDS_PER_PAGE]);
          (store.dispatch as ThunkAppDispatch)(updateCardsRendered([guitarFrom-CARDS_PER_PAGE, guitarTo-CARDS_PER_PAGE]));
        } else {
          setGuitarsFromTo([guitarFrom-CARDS_PER_PAGE, guitarTo-residualCards]);
          (store.dispatch as ThunkAppDispatch)(updateCardsRendered([guitarFrom-CARDS_PER_PAGE, guitarTo-residualCards]));
        }

        setIsActivePage(`${Math.round((guitarFrom-CARDS_PER_PAGE)/CARDS_PER_PAGE+1)}`);

        if(guitarFrom-CARDS_PER_PAGE === 0){
          setIsPreviousPage(false);
        }
      }
    }
  };

  const handlePageClick = (evt: SyntheticEvent<HTMLAnchorElement>) => {
    evt.preventDefault();

    if(guitarsForRendering !== undefined){
      const guitarsLength = guitarsForRendering.length;
      const page = evt.currentTarget.textContent;

      if(page !== null) {
        setGuitarsFromTo([(+page-1)*CARDS_PER_PAGE, Math.min(+page*CARDS_PER_PAGE, guitarsLength)]);
        (store.dispatch as ThunkAppDispatch)(updateCardsRendered([(+page-1)*CARDS_PER_PAGE, Math.min(+page*CARDS_PER_PAGE, guitarsLength)]));
      }

      if(Number(page) === 1) {
        setIsPreviousPage(false);
      } else {
        setIsPreviousPage(true);
      }

      if(guitarsLength > CARDS_PER_PAGE && Number(page)*CARDS_PER_PAGE < guitarsLength) {
        setIsNextPage(true);
      } else {
        setIsNextPage(false);
      }
    }
  };

  // useEffect(() => {

  // });

  return(
    <>
      <div className="wrapper">
        <Header />
        <main className="page-content">
          <div className="container">
            <h1 className="page-content__title title title--bigger" data-testid="Каталог-гитар">Каталог гитар</h1>
            <ul className="breadcrumbs page-content__breadcrumbs">
              <li className="breadcrumbs__item"><a className="link" href="./main.html">Главная</a>
              </li>
              <li className="breadcrumbs__item"><Link className="link" to="#">Каталог</Link>
              </li>
            </ul>
            <div className="catalog">
              <CatalogFilter guitarsFilteredByTypeAndStrings={(guitarsFilteredByTypeAndStrings && guitarsFilteredByTypeAndStrings.length >0) ? guitarsFilteredByTypeAndStrings : guitars} />
              <CatalogSort />
              <div className="cards catalog__cards">
                {guitarsForRendering?.slice(cardsRendered[START_CARD_INDEX],cardsRendered[END_CARD_INDEX]).map((guitar) => (
                  <ProductCard key={guitar.id} guitar={guitar} setIsModalCartAddVisible={setIsModalCartAddVisible} setGuitarToCart={setGuitarToCart}/>
                ))}
              </div>
              <div className="pagination page-content__pagination">
                <ul className="pagination__list">
                  {isPreviousPage? <PreviousPage pageURL={pageURL.toString()} onClick={handlePreviousNextPageClick}/> : '' }
                  {PAGENATION.map((page) => (
                    guitarsForRendering && ((page-1)*CARDS_PER_PAGE < guitarsForRendering.length)
                      ?
                      <li key={page}
                        className={`pagination__page ${ isActivePage === page.toString() ? 'pagination__page--active' : ''}`}
                      >
                        <Link className="link pagination__page-link" to={`catalog/page_${page}`} onClick={(evt) => {
                          setIsActivePage(page.toString());
                          handlePageClick(evt);
                        }}
                        >{page}
                        </Link>
                      </li>
                      :''))}
                  {isNextPage && guitarsForRendering !== undefined && guitarsForRendering?.length > CARDS_PER_PAGE
                    ? <NextPage pageURL={pageURL.toString()} onClick={handlePreviousNextPageClick} />
                    : '' }
                </ul>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
      {isModalCartAddVisible && <ModalCartAdd product={guitarToCart} setIsModalSuccessAddVisible={setIsModalSuccessAddVisible} setIsModalCartAddVisible={setIsModalCartAddVisible}/>}
      {isModalSuccessAddVisible && <ModalSuccessAdd setIsModalSuccessAddVisible={setIsModalSuccessAddVisible}/>}
    </>
  );
}

export {CatalogPage};
export default connector(CatalogPage);
