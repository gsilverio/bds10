import { Redirect, Route, Switch } from 'react-router-dom';
import Form from './Form';
import List from './List';
import PrivateRoute from 'components/PrivateRoute';
import { hasAnyRoles } from 'util/auth';

const Employee = () => {
  return (
    <Switch>
      <Route path="/admin/employees" exact>
        <List />
      </Route>
      {hasAnyRoles(['ROLE_ADMIN']) ? (
        <Route path="/admin/employees/:employeeId">
          <Form />
        </Route>
      ) : (
        <Redirect to={'/admin/employees'} exact />
      )}
    </Switch>
  );
};

export default Employee;
