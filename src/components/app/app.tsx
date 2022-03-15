import { Switch, Route, Router as BrowserRouter } from 'react-router-dom';
import CatalogPage from '../catalog-page/catalog-page';
import { AppRoute } from '../../const';
import NotFoundScreen from '../not-found-screen/not-found-screen';
import browserHistory from '../../browser-history';
import {connect, ConnectedProps} from 'react-redux';
import {State} from '../../types/state';
import GuitarPage from '../guitar-page/guitar-page';

const mapStateToProps = ({guitars}: State) => ({
  guitars,
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;
type ConnectedComponentProps = PropsFromRedux;

function App(props: ConnectedComponentProps): JSX.Element {

  return (
    <BrowserRouter history={browserHistory}>
      <Switch>
        <Route exact path={AppRoute.Catalog}>
          <CatalogPage />
        </Route>
        <Route exact path={AppRoute.Guitar}>
          <GuitarPage />;
        </Route>
        <Route>
          <NotFoundScreen />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export {App};
export default connector(App);
