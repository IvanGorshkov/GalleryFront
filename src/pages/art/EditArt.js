// material
import {
  Box,
  Container,
  Typography,
  Stack,
  TextField,
  Card,
  Switch,
  FormControlLabel, Button
} from '@mui/material';
// components
import { Form, FormikProvider, useFormik } from 'formik';
import { LoadingButton } from '@mui/lab';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Page from '../../components/Page';
import FullFeaturedCrudGrid from '../../components/MyDataGrid';
import ImagePicker from '../../components/ImagePicker';
import { storage } from '../../utils/localStorage';
import { http } from '../../utils/http';
import { randomId } from '@mui/x-data-grid-generator';
import VideoPicker from '../../components/VideoPicker';

export default function EditArt() {
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
      http.post(`http://95.163.213.222/api/v1/pictures/${values.id}`, {
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
          http.post(`http://95.163.213.222/api/v1/pictures/${value.data.id}/images`, formData, true)
        }

        if (videoDidChange) {
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
          http.post(`http://95.163.213.222/api/v1/pictures/${value.data.id}/videos`, formData, true)
        }

      }).catch(()=> {
        action.setSubmitting(false)
      })
    }
  });

  const deleteHandler = (() => {
    http.delete(`http://95.163.213.222/api/v1/pictures/${values.id}`).then(()=> {
      navigate('/dashboard/arts', { replace: true })
    })
  })
  const navigate = useNavigate();
  useEffect(()=>{
    const isLogin = storage.get("jwt");
    if (isLogin == null) {
      navigate('/login', { replace: true });
      return
    }

    http.get(`http://95.163.213.222/api/v1/pictures/${location.pathname.split('/')[location.pathname.split('/').length - 1]}`).then(value => {
      formik.setFieldValue("name", value.data.name, false)
      formik.setFieldValue("id", value.data.id, false)
      formik.setFieldValue("description", value.data.descr, false)
      formik.setFieldValue("h", value.data.pictureSize.height, false)
      formik.setFieldValue("w", value.data.pictureSize.width, false)
      setShow(value.data.show)
      if( value.data.info !== undefined ){
        setVal(value.data.info.map((v) => {
          return { id: randomId(), type: v.type, value: v.value }
        }))
      }
      let index = -1
      setimages(value.data.picture.split(",").map((val) => {
        index += 1
        return {url: val, index: index}
      }))
      index = -1
      console.log(value.data.video)
      if (value.data.video !== undefined) {
        setVideo([value.data.video].map((val) => {
          index += 1
          return {url: val, index: index}
        }))
      }
    })

  }, []) // <-- empty dependency array

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps, setFieldValue } = formik;

  let [show, setShow] = useState(false)
  let [val, setVal] = useState({...getFieldProps('spetification')}.value)

  const [images, setimages] = useState([]);
  const [video, setVideo] = useState([]);
  const [imageDidChange, setimageDidChange] = useState(false);
  const [videoDidChange, setvideoDidChange] = useState(false);

  return (
    <Page title="Редактировать картину">
      <Container maxWidth="xl">
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Card>
              <Box sx={{ p: 1 }}>
                <Stack spacing={2}>
                  <Typography variant="h4">Редактировать картину</Typography>
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

                  <VideoPicker video={video} onChange={(value)=> {
                    setVideo(value)
                    setvideoDidChange(true)
                  }}/>

                  <FormControlLabel control={<Switch checked={show} onChange={(e) => {
                    setShow(e.target.checked)
                    http.post(`http://95.163.213.222/api/v1/pictures/${location.pathname.split('/')[location.pathname.split('/').length - 1]}/public`, {})
                  }}/>} label="Опубликован" />

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <LoadingButton
                      size="large"
                      type="submit"
                      variant="contained"
                      loading={isSubmitting}
                    >
                      Сохранить
                    </LoadingButton>
                    <Button
                      size="large"
                      color={"error"}
                      variant="contained"
                      onClick={deleteHandler}
                    >
                      Удалить
                    </Button>
                  </Stack>
                </Stack>
              </Box>
            </Card>
          </Form>
        </FormikProvider>
      </Container>
    </Page>
  );
}
