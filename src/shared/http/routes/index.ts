import { Router } from 'express';
import productsRouter from '@modules/products/routes/products.routes';

const routes = Router();

routes.get('/', (request, response) => {
  return response.json({ message: 'Hello DEV!' });
});

routes.use('/products', productsRouter);

export default routes;
