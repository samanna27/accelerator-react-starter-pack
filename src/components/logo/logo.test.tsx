import {render, screen} from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Logo from './logo';

describe('Component: Logo', () => {
  it('should render correctly', () => {
    render(
      <BrowserRouter>
        <Logo />
      </BrowserRouter>);

    expect(screen.getByTestId('icon-arrow-up')).toBeInTheDocument();
  });

  // it('should redirect to root url when user clicked to link', () => {
  //   history.push('/fake');
  //   render(
  //     <Router history={history}>
  //       <Switch>
  //         <Route path="/" exact>
  //           <h1>This is main page</h1>
  //         </Route>
  //         <Route>
  //           <Logo />
  //         </Route>
  //       </Switch>
  //     </Router>);

  //   expect(screen.queryByText(/This is main page/i)).not.toBeInTheDocument();
  //   userEvent.click(screen.getByRole('link'));
  //   expect(screen.queryByText(/This is main page/i)).toBeInTheDocument();
  // });
});
