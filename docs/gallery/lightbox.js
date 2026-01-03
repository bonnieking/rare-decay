const images = Array.from(document.querySelectorAll('.gallery img'));
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const exifBox = document.getElementById('exif');

let index = 0;

function show(i) {
  index = i;
  const src = images[index].src;
  lightbox.hidden = false;

  // when new image finishes loading, fade it in
  lightboxImg.onload = () => {

  lightboxImg.src = src;
  lightbox.focus(); // 🔑 THIS IS THE FIX
  loadExif(src);
}

images.forEach((img, i) => {
  img.addEventListener('click', () => show(i));
});

document.getElementById('prev').onclick = () =>
  show((index - 1 + images.length) % images.length);

document.getElementById('next').onclick = () =>
  show((index + 1) % images.length);

document.addEventListener('keydown', e => {
  if (lightbox.hidden) return;
  if (e.key === 'ArrowLeft') document.getElementById('prev').click();
  if (e.key === 'ArrowRight') document.getElementById('next').click();
  if (e.key === 'Escape') lightbox.hidden = true;
});

async function loadExif(src) {
  exifBox.textContent = 'Loading metadata…';
  const response = await fetch(src);
  const buffer = await response.arrayBuffer();
  const tags = ExifReader.load(buffer);

  const fields = [
    'DateTimeOriginal',
    'Make',
    'Model',
    'LensModel'
  ];

  exifBox.innerHTML = fields
    .filter(f => tags[f])
    .map(f => `<div><strong>${f}:</strong> ${tags[f].description}</div>`)
    .join('');
}
