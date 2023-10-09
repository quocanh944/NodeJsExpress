import path from 'path';

const configureViewEngine = (app) => {
  app.set('views', path.join(path.dirname(import.meta.url), 'views'));
  app.set('view engine', 'ejs');
};

export default configureViewEngine;
