import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import {
  Link,
  Stack,
  Checkbox,
  TextField,
  IconButton,
  InputAdornment,
  FormControlLabel
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// component
import Iconify from '../../../components/Iconify';
import { http } from '../../../utils/http';
import { storage } from '../../../utils/localStorage';
import { randomId } from '@mui/x-data-grid-generator';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  useEffect(()=>{
    const isLogin = storage.get("jwt");
    if (isLogin !== null) {
      navigate('/dashboard/gallery', { replace: true });
    }
  }, []) // <-- empty dependency array
  const LoginSchema = Yup.object().shape({
    login: Yup.string().required('Поле логин обязательно'),
    password: Yup.string().required('Поле пароль обязательно')
  });

  const formik = useFormik({
    initialValues: {
      login: '',
      password: ''
    },
    validationSchema: LoginSchema,
    onSubmit: (values, actions) => {
      http.post("http://95.163.213.222/api/v1/users/login", {
        login: values.login,
        password: values.password
      }).then((value) => {
        console.log(value)
        if (value.status === 200) {
          storage.set("jwt", value.data.token)
          storage.set("login", value.data.login)
          navigate('/dashboard/gallery', { replace: true });
        } else {
          throw new Error()
        }
      }).catch((error) => {
        console.log(error)
        actions.setSubmitting(false);
      });
    }
  });

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            autoComplete="username"
            type="text"
            label="Логин"
            {...getFieldProps('login')}
            error={Boolean(touched.login && errors.login)}
            helperText={touched.login && errors.login}
          />

          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label="Пароль"
            {...getFieldProps('password')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPassword} edge="end">
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              )
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />
          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Войти
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
