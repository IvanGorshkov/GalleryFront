import React, { useState } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';

export default function VideoPicker(state) {
  const changeInput = async (e) => {
    // esto es el indice que se le dará a cada imagen, a partir del indice de la ultima foto
    let indexImg = 0;
    const p1 = new Promise(
      function(resolve, reject) {
        const { files } = e.currentTarget;

        Object.keys(files).forEach((i) => {
          const file = files[i];

          const url = URL.createObjectURL(file);
          const video = document.createElement('video')
          video.src = url
          video.load()
          video.onloadedmetadata = evt => {
            return resolve([{
              index: 0,
              name: file.name,
              url,
              file,
              videoWidth: video.videoWidth,
              videoHeight: video.videoHeight
            }])
          }
        });
      });

    p1.then(value => {
      console.log(value);
      state.onChange(value);
    })
  };



  function deleteImg(indice) {
    console.log('borrar img ' + indice);
    const newImgs = state.video.filter((element) => element.index !== indice);
    console.log(newImgs);
    state.onChange(newImgs);
  }

  return (
    <div className="container-fluid">
      <br />
      {/* INPUT IMAGES */}
      <label className="btn">
        <span>Добавить видео</span>
        <input hidden type="file" multiple accept=".mp4"  onChange={changeInput} />
      </label>

      {/* VIEW IMAGES */}
      <div className="row">
        {state.video.map((vid) => (
          <div className="col-6 col-sm-4 col-lg-3 square" key={vid.index === undefined ? 0 : vid.index}>
            <div className="content_img">
              <button
                className="position-absolute btn btn-danger"
                onClick={deleteImg.bind(this, vid.index === undefined ? 0 : vid.index)}
              >
                x
              </button>
              <img
                alt="algo"
                src={vid.index === undefined ? vid : vid.url}
                data-toggle="modal"
                data-target="#ModalPreViewImg"
                className="img-responsive"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
