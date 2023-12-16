import history from 'util/history';
import './styles.css';
import { useForm, Controller } from 'react-hook-form';
import { Employee } from 'types/employee';
import { Department } from 'types/department';
import { requestBackend } from 'util/requests';
import { AxiosRequestConfig } from 'axios';
import { toast } from 'react-toastify';
import Select from 'react-select';
import { useEffect, useState } from 'react';

const Form = () => {
  const [selectDepartment, setSelectDepartment] = useState<Department[]>([]);
  const handleCancel = () => {
    history.push('/admin/employees');
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<Employee>();

  useEffect(() => {
    const config: AxiosRequestConfig = {
      method: 'GET',
      url: `/departments`,
      withCredentials: true,
    };

    requestBackend(config).then((response) => {
      setSelectDepartment(response.data);
    });
  }, []);

  const onSubmit = (formData: Employee) => {
    const config: AxiosRequestConfig = {
      method: 'POST',
      url: '/employees',
      data: formData,
      withCredentials: true,
    };
    requestBackend(config)
      .then(() => {
        toast.info('Cadastrado');
        history.push('/admin/employees');
      })
      .catch(() => {
        toast.error('Erro ao cadastrar produto');
        console.log(formData);
      });
  };

  return (
    <div className="employee-crud-container">
      <div className="base-card employee-crud-form-card">
        <h1 className="employee-crud-form-title">INFORME OS DADOS</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row employee-crud-inputs-container">
            <div className="col employee-crud-inputs-left-container">
              <div className="margin-bottom-30">
                <input
                  {...register('name', {
                    required: 'Campo obrigatório',
                  })}
                  type="text"
                  className={`form-control base-input ${
                    errors.name ? 'is-invalid' : ''
                  }`}
                  name="name"
                  placeholder="Nome do funcionário"
                  data-testid="name"
                />
                <div className="invalid-feedback d-block">
                  {errors.name?.message}
                </div>
              </div>

              <div className="margin-bottom-30">
                <input
                  {...register('email', {
                    required: 'Campo obrigatório',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email inválido',
                    },
                  })}
                  placeholder="Email"
                  type="email"
                  className={`form-control base-input ${
                    errors.name ? 'is-invalid' : ''
                  }`}
                  name="email"
                  data-testid="email"
                />
                <div className="invalid-feedback d-block is-invalid">
                  {errors.email?.message}
                </div>
              </div>
              <div className="product-bottom-30">
                <label htmlFor="department" className="d-none">
                  Departamento
                </label>
                <Controller
                  name="department"
                  rules={{
                    required: true,
                  }}
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={selectDepartment}
                      classNamePrefix="product-crud-select"
                      isMulti
                      getOptionLabel={(department: Department) =>
                        department.name
                      }
                      getOptionValue={(department: Department) =>
                        String(department.id)
                      }
                      inputId="department"
                      placeholder="Departamento"
                    />
                  )}
                />
                {errors.department && (
                  <div className="invalid-feedback d-block is-invalid">
                    Campo obrigatório
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="employee-crud-buttons-container">
            <button
              className="btn btn-outline-danger employee-crud-button"
              onClick={handleCancel}
            >
              CANCELAR
            </button>
            <button className="btn btn-primary employee-crud-button text-white">
              SALVAR
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;
