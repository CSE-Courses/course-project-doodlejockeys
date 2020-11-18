import React, { Component } from "react";

bannerImage = document.getElementById('bannerImg');
imgData = getBase64Image(bannerImage);
localStorage.setItem("imgData", imgData);

function getBase64Image(img) {
  var canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;

  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);

  var dataURL = canvas.toDataURL("image/png");

  return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}




// class SaveImage extends Component{
//   saveCanvas() {
//     const canvasSave = document.getElementById('canvas');
//     const d = canvasSave.toDataURL('image/png');
//     const w = window.open('about:blank', 'image from canvas');
//     w.document.write("<img src='"+d+"' alt='from canvas'/>");
//     console.log('Saved!');
//   }
// }
// export default SaveImage;