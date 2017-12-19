export default (ctx) => {
  ctx.globalCompositeOperation = `destination-over`;
  ctx.fillStyle = `white`;
  ctx.beginPath();
  ctx.arc(300, 350, 230, calcDeg(0), calcDeg(360), false);
  ctx.closePath();
  ctx.save();
  ctx.globalCompositeOperation = `source-over`;
  ctx.shadowBlur = 20;
  ctx.shadowColor = `black`;
  ctx.fill();
  ctx.restore();
}

const calcDeg = deg => {
  return (Math.PI / 180) * (deg - 90);
};
