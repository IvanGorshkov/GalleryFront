// material
import {
  Box,
  Container,
  Typography,
  Stack,
  TextField,
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
import NotificationsPopover from '../layouts/dashboard/NotificationsPopover';
import { toast } from 'react-toastify';

export default function Gallery() {
  const formik = useFormik({
    initialValues: {
      id: 0,
      name: '',
      description: '',
      show: false,
      spetification: []
    },
    onSubmit: (values, action) => {
      http.post(`http://95.163.213.222/api/v1/museums/${values.id}`, {
        name: values.name,
        descr: values.description,
        info: val.map((data) => {
          return {type: data.type, value: data.value}
        })
      }).then(() => {
        action.setSubmitting(false)
        toast.success("Изменения сохранены");
        if (imageDidChange) {
          const formData = new FormData();
          toast.info("Идёт загрузка фото");

          console.log(images[0])

          images.forEach((i) => {
            if (i.file === undefined) {
              return
            }
            formData.append(
              "image",
              i.file,
              i.file.name
            );
          })

          http.post(`http://95.163.213.222/api/v1/museums/${values.id}/images`, formData, true).then(() => {
            toast.success("Фотографии обнавлены");
          })
        }
      })
    }
  });

  const navigate = useNavigate();
  useEffect(()=>{
      http.get("http://95.163.213.222/api/v1/museums").then(value => {
        formik.setFieldValue("name", value.data.name, false)
        formik.setFieldValue("id", value.data.id, false)
        formik.setFieldValue("description", value.data.descr, false)
        setShow(value.data.show === 1)
        if(value.data.info !== undefined ){
          setVal(value.data.info.map((v) => {
            return { id: randomId(), type: v.type, value: v.value }
          }))
        }

        let index = -1
        setimages(value.data.picture.split(",").map((val) => {
          index += 1
          return {url: val, index: index}
        }))
      }).catch(() => {
        storage.del("jwt");
        navigate('/login', { replace: true });
      })
    const isLogin = storage.get("jwt");
    if (isLogin == null) {
      navigate('/login', { replace: true });
    }
  }, []) // <-- empty dependency array

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps, setFieldValue } = formik;

  let [val, setVal] = useState({...getFieldProps('spetification')}.value)
  let [show, setShow] = useState(false)

  const [images, setimages] = useState([]);
  const [imageDidChange, setimageDidChange] = useState(false);

  return (
    <Page title="Галерея">
      <Container maxWidth="xl">
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Card>
              <Box sx={{ p: 1 }}>
                <Stack spacing={2}>
                  <Typography variant="h4">Настройки музея</Typography>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField
                      fullWidth
                      type="text"
                      label="Название музея"
                      {...getFieldProps('name')}
                    />
                  </Stack>
                  <TextField
                    label="О музее"
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

                  <FormControlLabel control={<Switch checked={show} onChange={(e) => {
                    http.post(`http://95.163.213.222/api/v1/museums/${values.id}/public`, {}).then(() => {
                      if (e.target.checked === true) {
                        toast.success("Галерея доступа зрителям");
                      } else  {
                        toast.success("Галерея стала недоступной для зрителей");
                      }
                    }).catch(()=> {
                      toast.error("Неизвестная ошибка");
                    })
                    setShow(e.target.checked)
                  }}/>} label="Доступна для зрителей" />

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
