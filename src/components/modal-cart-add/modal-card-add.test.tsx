// import { render, screen } from '@testing-library/react';
// import { configureMockStore } from '@jedmao/redux-mock-store';
// import { BrowserRouter } from 'react-router-dom';
// import { Provider } from 'react-redux';
// import ModalCartAdd from './modal-cart-add';
import { createMemoryHistory } from 'history';
import { AppRoute } from '../../const';
// import { makeFakeGuitar } from '../../utils/mocks';
// import React from 'react';

// const mockStore = configureMockStore();
// const store = mockStore({});
const history = createMemoryHistory();

describe('Component: ModalCartAdd', () => {
  beforeEach(() => {
    history.push(AppRoute.Catalog);
  });

  // it('should render correctly', () => {
  //   const fakeGuitarId = 1;
  //   const fakeGuitar = makeFakeGuitar(fakeGuitarId);
  //   const reference = { current: null };
  //   Object.defineProperty(reference, 'current', {
  //     get: jest.fn(() => null),
  //     set: jest.fn(() => null),
  //   });
  //   const useReferenceSpy = jest.spyOn(React, 'useRef').mockReturnValue(reference);
  //   render(
  //     <Provider store={store}>
  //       <BrowserRouter>
  //         <ModalCartAdd refCartAdd={useReferenceSpy} product={fakeGuitar} setIsModalCartAddVisible={jest.fn()} setIsComponentVisible={jest.fn()} setIsModalSuccessAddVisible={(jest.fn())} />
  //       </BrowserRouter>
  //     </Provider>,
  //   );

  //   expect(screen.getByText(/Добавить товар в корзину/i)).toBeInTheDocument();
  // });
});
