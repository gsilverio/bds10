import './styles.css';

import Pagination from 'components/Pagination';
import EmployeeCard from 'components/EmployeeCard';
import { Link } from 'react-router-dom';
import { requestBackend } from 'util/requests';
import { AxiosRequestConfig } from 'axios';
import { useEffect, useState } from 'react';
import { Employee } from 'types/employee';
import { SpringPage } from 'types/vendor/spring';
import { hasAnyRoles, isAuthenticated } from 'util/auth';

const List = () => {
  const [page, setPage] = useState<SpringPage<Employee>>();

  useEffect(() => {
    handlePageChange(0);
  }, []);
  const handlePageChange = (pageNumber: number) => {
    const config: AxiosRequestConfig = {
      method: 'GET',
      url: '/employees',
      withCredentials: true,
      params: {
        page: pageNumber,
        size: 6,
      },
    };
    requestBackend(config).then((response) => {
      setPage(response.data);
    });
  };

  return (
    <>
      {hasAnyRoles(['ROLE_ADMIN']) && (
        <Link to="/admin/employees/create">
          <button className="btn btn-primary text-white btn-crud-add">
            ADICIONAR
          </button>
        </Link>
      )}

      {page?.content.map((employee) => {
        return (
          <div key={employee.id}>
            <EmployeeCard employee={employee} />
          </div>
        );
      })}

      <Pagination
        forcePage={0}
        pageCount={page ? page.totalPages : 1}
        range={3}
        onChange={handlePageChange}
      />
    </>
  );
};

export default List;
