import React, { useState } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';

export default function ImagePicker(state) {
  const changeInput = (e) => {
    // esto es el indice que se le dará a cada imagen, a partir del indice de la ultima foto
    let indexImg;

    // aquí evaluamos si ya hay imagenes antes de este input, para saber en dónde debe empezar el index del proximo array
    if (state.images.length > 0) {
      indexImg = state.images[state.images.length - 1].index + 1;
    } else {
      indexImg = 0;
    }

    const newImgsToState = readmultifiles(e, indexImg);
    const newImgsState = [...state.images, ...newImgsToState];
    state.onChange(newImgsState);

    console.log(newImgsState);
  };

  function readmultifiles(e, indexInicial) {
    const { files } = e.currentTarget;

    // el array con las imagenes nuevas
    const arrayImages = [];

    Object.keys(files).forEach((i) => {
      const file = files[i];

      const url = URL.createObjectURL(file);

      // console.log(file);
      arrayImages.push({
        index: indexInicial,
        name: file.name,
        url,
        file
      });

      indexInicial++;
    });

    // despues de haber concluido el ciclo retornamos las nuevas imagenes
    return arrayImages;
  }

  function deleteImg(indice) {
    console.log('borrar img ' + indice);
    const newImgs = state.images.filter((element) => element.index !== indice);
    console.log(newImgs);
    state.onChange(newImgs);
  }

  return (
    <div className="container-fluid">
      <br />
      {/* INPUT IMAGES */}
      <label className="btn">
        <span>Добавить фото</span>
        <input hidden type="file" multiple accept=".jpg, .jpeg, .png"  onChange={changeInput} />
      </label>

      {/* VIEW IMAGES */}
      <div className="row">
        {state.images.map((imagen) => (
          <div className="col-6 col-sm-4 col-lg-3 square" key={imagen.index === undefined ? 0 : imagen.index}>
            <div className="content_img">
              <button
                className="position-absolute btn btn-danger"
                onClick={deleteImg.bind(this, imagen.index === undefined ? 0 : imagen.index)}
              >
                x
              </button>
              <img
                alt="algo"
                src={imagen.index === undefined ? imagen : imagen.url}
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
