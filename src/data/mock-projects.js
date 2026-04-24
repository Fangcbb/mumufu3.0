export const projects = [
  {
    title: 'Objects',
    description: 'Still life and product studies',
    images: [
      { src: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1400&q=80', alt: 'Objects study 01', orientation: 'portrait' },
      { src: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1600&q=80', alt: 'Objects study 02', orientation: 'landscape' },
      { src: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1400&q=80', alt: 'Objects study 03', orientation: 'square' },
      { src: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=1400&q=80', alt: 'Objects study 04', orientation: 'portrait' },
      { src: 'https://images.unsplash.com/photo-1475180098004-ca77a66827be?auto=format&fit=crop&w=1600&q=80', alt: 'Objects study 05', orientation: 'landscape' },
      { src: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1400&q=80', alt: 'Objects study 06', orientation: 'portrait' }
    ]
  },
  {
    title: 'Fabric',
    description: 'Material, motion and texture narratives',
    images: [
      { src: 'https://images.unsplash.com/photo-1479065476818-424362c3a854?auto=format&fit=crop&w=1400&q=80', alt: 'Fabric frame 01', orientation: 'landscape' },
      { src: 'https://images.unsplash.com/photo-1465406325903-9d93ee82f613?auto=format&fit=crop&w=1400&q=80', alt: 'Fabric frame 02', orientation: 'portrait' },
      { src: 'https://images.unsplash.com/photo-1484519332611-516457305ff6?auto=format&fit=crop&w=1400&q=80', alt: 'Fabric frame 03', orientation: 'portrait' },
      { src: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1600&q=80', alt: 'Fabric frame 04', orientation: 'landscape' },
      { src: 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&w=1400&q=80', alt: 'Fabric frame 05', orientation: 'square' }
    ]
  },
  {
    title: 'People',
    description: 'Portrait and campaign direction',
    images: [
      { src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1400&q=80', alt: 'Portrait series 01', orientation: 'portrait' },
      { src: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1400&q=80', alt: 'Portrait series 02', orientation: 'portrait' },
      { src: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=1400&q=80', alt: 'Portrait series 03', orientation: 'landscape' },
      { src: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=1400&q=80', alt: 'Portrait series 04', orientation: 'portrait' },
      { src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1400&q=80', alt: 'Portrait series 05', orientation: 'portrait' },
      { src: 'https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=1600&q=80', alt: 'Portrait series 06', orientation: 'landscape' }
    ]
  }
];

export const projectsWithCount = projects.map((project) => ({
  ...project,
  count: project.images.length
}));

export const allImages = projectsWithCount.flatMap((project, projectIndex) =>
  project.images.map((image, imageIndex) => ({
    ...image,
    projectTitle: project.title,
    globalIndex: `${String(projectIndex + 1).padStart(2, '0')}-${String(imageIndex + 1).padStart(2, '0')}`
  }))
);
