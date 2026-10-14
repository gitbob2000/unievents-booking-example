const { createApp } = require('./app');
const { createDevDependencies } = require('./dev/devDependencies');

// Safety guard: the demo login accepts everyone, so it must never run in production
if (process.env.NODE_ENV === 'production') {
  console.error('Real event and login services are not connected yet. Refusing to start.');
  process.exit(1);
}

const PORT = process.env.PORT || 3000;
createApp(createDevDependencies()).listen(PORT, () => {
  console.log(`UniEvents booking service (DEV demo wiring) on http://localhost:${PORT}`);
});