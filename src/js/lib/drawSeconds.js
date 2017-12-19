let ang = 0;

export default (ctx, currentSec ) => {
  ang = 0.007 * ((currentSec * 1000));
  const grd = ctx.createLinearGradient(0, 170, 360, 0);
  grd.addColorStop(0, `#00ff75`);
  grd.addColorStop(1, `#00ffff`);
  ctx.fillStyle = grd;
  ctx.beginPath();
  ctx.moveTo(300, 350);
  ctx.lineTo(300, 150);
  ctx.arc(300, 350, 250, calcDeg(0), calcDeg(ang), false);
  ctx.lineTo(300, 300);
  ctx.fill();
}

const calcDeg = deg => {
  return (Math.PI / 180) * (deg - 90);
};
