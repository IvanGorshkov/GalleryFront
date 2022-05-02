import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { useFormik, Form, FormikProvider } from 'formik';
import React from 'react';
// material
import { Stack, TextField, IconButton, InputAdornment, Typography, Link } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// component
import Iconify from '../../../components/Iconify';
import { storage } from '../../../utils/localStorage';
import { http } from '../../../utils/http';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

// ----------------------------------------------------------------------

export default function RegisterForm() {
  const navigate = useNavigate();

  useEffect(()=>{
    const isLogin = storage.get("jwt");
    console.log(isLogin)
    if (isLogin !== null) {
      navigate('/dashboard/gallery', { replace: true });
    }
  }, []) // <-- empty dependency array

  const [showPassword, setShowPassword] = useState(false);

  const RegisterSchema = Yup.object().shape({
    museum: Yup.string().required('Название музея обязтаельно'),
    login: Yup.string().required('Поле логин обязательно'),
    password: Yup.string().required('Поле пароль обязательно')
  });

  const formik = useFormik({
    initialValues: {
      museum: '',
      login: '',
      password: ''
    },
    validationSchema: RegisterSchema,
    onSubmit: (values, actions) => {

      http.post(
        'http://95.163.213.222/api/v1/users/signup',
        {
          login: values.login,
          museum: values.museum,
          password: values.password
          }
        ).then((value) => {
          console.log(value)
          if (value.status === 200) {
            storage.set("jwt", value.data.token)
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

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              type="text"
              label="Название Музея*"
              {...getFieldProps('museum')}
              error={Boolean(touched.museum && errors.museum)}
              helperText={touched.museum && errors.museum}
            />
          </Stack>

          <TextField
            fullWidth
            autoComplete="username"
            type="text"
            label="Логин*"
            {...getFieldProps('login')}
            error={Boolean(touched.login && errors.login)}
            helperText={touched.login && errors.login}
          />

          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label="Пароль*"
            {...getFieldProps('password')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}>
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
            Регистрация
          </LoadingButton>
          <Typography
            variant="body1"
            sx={{
              display: { xs: 'none', sm: 'block' },
              mt: { md: -2 }
            }}
          >
            Уже есть аккаунт? &nbsp;
            <Link underline="none" variant="subtitle2" component={RouterLink} to="/login">
              Войти
            </Link>
          </Typography>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
