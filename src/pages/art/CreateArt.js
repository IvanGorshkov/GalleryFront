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
import Page from '../../components/Page';
import FullFeaturedCrudGrid from '../../components/MyDataGrid';
import ImagePicker from '../../components/ImagePicker';
import { storage } from '../../utils/localStorage';
import { http } from '../../utils/http';
import VideoPicker from '../../components/VideoPicker';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

export default function CreateArt() {
  const schema = Yup.object().shape({
    name: Yup.string().required('У картины должно быть название'),
    w: Yup.number()
      .min(1, 'Число должно быть положительным')
      .required('У картины должна быть ширина'),
    h: Yup.number()
      .min(1, 'Число должно быть положительным')
      .required('У картины должна быть высота'),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      publish: false,
      spetification: [
        { id: randomId(), type: "Автор", value: ""},
        { id: randomId(), type: "Год создания", value: ""},
        { id: randomId(), type: "Техника", value: ""},
        { id: randomId(), type: "Место нахождения", value: ""},
      ],
      w: 0,
      h: 0
    },
    validationSchema: schema,
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
        toast.success("Картина была создана");

        if (imageDidChange) {
          toast.info("Идёт загрузка фото");
          const formData = new FormData();

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

          http.post(`http://95.163.213.222/api/v1/pictures/${value.data.id}/images`, formData, true).then(()=> {
            toast.success("Фотографии загружены");
            navigate('/dashboard/arts', { replace: true })
          }).catch(()=>{
            toast.error("Ошибка при загрузки фотографий");
          })
        }
        if (videoDidChange) {
          toast.info("Идёт загрузка видео");
          const formData = new FormData();
          video.forEach((i) => {
            formData.append(
              "video",
              i.file,
              i.file.name
            );
            formData.append(
              "video_size",
              `${i.videoWidth} x ${i.videoHeight}`
            )
          })
          http.post(`http://95.163.213.222/api/v1/pictures/${value.data.id}/videos`, formData, true).then(()=> {
            toast.success("Видео загружено");
            navigate('/dashboard/arts', { replace: true })
          }).catch(()=>{
            toast.error("Ошибка при загрузки видео");
          })
        }
      }).catch(()=> {
        toast.error("Произошла ошибка");
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
  const [video, setVideo] = useState([]);
  const [imageDidChange, setimageDidChange] = useState(false);
  const [videoDidChange, setvideoDidChange] = useState(false);

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
                      label="Название картины*"
                      {...getFieldProps('name')}
                      error={Boolean(touched.name && errors.name)}
                      helperText={touched.name && errors.name}
                    />
                  </Stack>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Ширина (см)*"
                      {...getFieldProps('w')}
                      error={Boolean(touched.w && errors.w)}
                      helperText={touched.w && errors.w}
                    />
                    <TextField
                      fullWidth
                      type="number"
                      label="Высота (см)*"
                      {...getFieldProps('h')}
                      error={Boolean(touched.h && errors.h)}
                      helperText={touched.h && errors.h}
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

                  <VideoPicker video={video} onChange={(value)=> {
                    setVideo(value)
                    setvideoDidChange(true)
                  }}/>

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
