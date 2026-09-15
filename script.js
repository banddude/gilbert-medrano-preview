const mediaBase = './public/media/';

const heroProjects = [
  { title: '87XLUE — I’ll See What’s Up', type: 'Music', src: '87xlue-01.jpg' },
  { title: 'PANDA', type: 'Music', src: 'panda-02.jpg' },
  { title: 'Harlay — ShoeStrings', type: 'Music', src: 'shoestrings-03.jpg' },
  { title: 'Harlay — No Puedo', type: 'Music', src: 'no-puedo-02.jpg' },
  { title: 'Dead City — Jimothy', type: 'Music', src: 'dead-city-03.jpg' },
  { title: 'Scalp Shacklerot', type: 'Music', src: 'scalp-shacklerot-01.jpg' },
  { title: 'Protect My Peace', type: 'Music', src: 'protect-my-peace-02.jpg' },
];

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const heroReel = document.querySelector('#hero-reel');
const heroTitle = document.querySelector('#hero-title');
const heroType = document.querySelector('#hero-type');
const heroIndex = document.querySelector('#hero-index');
const heroSegmentEnds = [1.45, 2.90, 4.35, 5.80, 7.25, 8.70, 11.55];
let lastHeroIndex = -1;

function syncHeroMeta() {
  if (!heroReel) return;
  const t = heroReel.currentTime || 0;
  const index = Math.min(heroSegmentEnds.findIndex((end) => t < end), heroProjects.length - 1);
  const safeIndex = index < 0 ? heroProjects.length - 1 : index;
  if (safeIndex !== lastHeroIndex) {
    const item = heroProjects[safeIndex];
    heroTitle.textContent = item.title;
    heroType.textContent = item.type;
    heroIndex.textContent = `${String(safeIndex + 1).padStart(2, '0')} / ${String(heroProjects.length).padStart(2, '0')}`;
    lastHeroIndex = safeIndex;
  }
}

if (heroReel) {
  if (reducedMotion) {
    heroReel.pause();
    heroReel.removeAttribute('autoplay');
  } else {
    heroReel.addEventListener('timeupdate', syncHeroMeta);
    heroReel.addEventListener('seeked', syncHeroMeta);
    heroReel.addEventListener('loadedmetadata', syncHeroMeta);
    heroReel.play().catch(() => {});
  }
}

document.querySelectorAll('.project-media[data-frames]').forEach((media) => {
  const image = media.querySelector('img');
  const frames = media.dataset.frames.split(',');
  let frameIndex = 0;
  let timer = null;

  const advance = () => {
    frameIndex = (frameIndex + 1) % frames.length;
    image.src = mediaBase + frames[frameIndex];
  };

  media.closest('.project-link').addEventListener('mouseenter', () => {
    if (reducedMotion) return;
    advance();
    timer = window.setInterval(advance, 520);
  });

  media.closest('.project-link').addEventListener('mouseleave', () => {
    if (timer) window.clearInterval(timer);
    timer = null;
    frameIndex = 0;
    image.src = mediaBase + frames[0];
  });
});

const viewer = document.querySelector('#project-viewer');
const viewerTitle = document.querySelector('#viewer-title');
const viewerIndex = document.querySelector('#viewer-index');
const viewerType = document.querySelector('#viewer-type');
const viewerFrames = document.querySelector('#viewer-frames');
const viewerClose = document.querySelector('.viewer-close');

function openProject(link) {
  const caption = link.querySelector('.project-caption');
  const parts = caption.querySelectorAll(':scope > span');
  const title = caption.querySelector('h2').textContent;
  const frames = link.querySelector('.project-media').dataset.frames.split(',');

  viewerTitle.textContent = title;
  viewerIndex.textContent = parts[0].textContent;
  viewerType.textContent = parts[1].textContent;
  const frameNodes = frames.map((frame, index) => {
    const image = document.createElement('img');
    image.src = mediaBase + frame;
    image.alt = `Frame ${index + 1} from ${title}`;
    image.loading = index === 0 ? 'eager' : 'lazy';
    return image;
  });

  viewerFrames.replaceChildren(...frameNodes);
  viewer.showModal();
  viewer.scrollTop = 0;
}

document.querySelectorAll('.project-link').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    openProject(link);
  });
});

viewerClose.addEventListener('click', () => viewer.close());
viewer.addEventListener('click', (event) => {
  if (event.target === viewer) viewer.close();
});
viewer.addEventListener('close', () => {
  viewerFrames.replaceChildren();
});

document.querySelector('#year').textContent = new Date().getFullYear();
