// material
import {
  Box,
  Container,
  Typography,
  Stack,
  TextField,
  InputAdornment,
  IconButton,
  Card,
  Switch,
  FormControlLabel
} from '@mui/material';
// components
import { Form, FormikProvider, useFormik } from 'formik';
import { LoadingButton } from '@mui/lab';
import {
  randomId
} from '@mui/x-data-grid-generator';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Page from '../components/Page';
import FullFeaturedCrudGrid from '../components/MyDataGrid';
import ImagePicker from '../components/ImagePicker';
import { storage } from '../utils/localStorage';
import { http } from '../utils/http';

export default function CreateArt() {
  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      publish: false,
      spetification: [],
      w: 0,
      h: 0
    },
    onSubmit: (values, action) => {
      http.post(`http://95.163.213.222/api/v1/pictures`, {
        name: values.name,
        descr: values.description,
        info: val.map((data) => {
          return {type: data.type, value: data.value}
        }),
        pictureSize: {
          height: values.h,
          width: values.w,
        }
      }).then((value) => {
        action.setSubmitting(false)
        if (imageDidChange) {
          const formData = new FormData();

          formData.append(
            "image",
            images[0].file,
            images[0].file.name
          );
          http.post(`http://95.163.213.222/api/v1/pictures/${value.data.id}/images`, formData, true)
        }
      }).catch(()=> {
        action.setSubmitting(false)
      })
    }
  });

  const navigate = useNavigate();
  useEffect(()=>{
    const isLogin = storage.get("jwt");
    if (isLogin == null) {
      navigate('/login', { replace: true });
    }
  }, []) // <-- empty dependency array

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps, setFieldValue } = formik;

  let [val, setVal] = useState({...getFieldProps('spetification')}.value)

  const [images, setimages] = useState([]);
  const [imageDidChange, setimageDidChange] = useState(false);

  return (
    <Page title="Новая картина">
      <Container maxWidth="xl">
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Card>
              <Box sx={{ p: 1 }}>
                <Stack spacing={2}>
                  <Typography variant="h4">Добавление картины</Typography>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField
                      fullWidth
                      type="text"
                      label="Название картины"
                      {...getFieldProps('name')}
                    />
                  </Stack>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Ширина"
                      {...getFieldProps('w')}
                    />
                    <TextField
                      fullWidth
                      type="number"
                      label="Высота"
                      {...getFieldProps('h')}
                    />
                  </Stack>

                  <TextField
                    label="Описание картины"
                    multiline
                    rows={10}
                    variant="outlined"
                    {...getFieldProps('description')}
                  />
                  <FullFeaturedCrudGrid value={val} onChange={(value)=> {
                      setVal(value)
                    }
                  }/>
                  <ImagePicker images={images} onChange={(value)=> {
                    setimages(value)
                    setimageDidChange(true)
                  }}/>

                  <FormControlLabel
                    control={<Switch value="checkedA" {...getFieldProps('publish')} />}
                    label="Опубликован"
                  />

                  <LoadingButton
                    size="large"
                    type="submit"
                    variant="contained"
                    loading={isSubmitting}
                  >
                    Сохранить
                  </LoadingButton>
                </Stack>
              </Box>
            </Card>
          </Form>
        </FormikProvider>
      </Container>
    </Page>
  );
}
