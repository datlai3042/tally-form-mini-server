import { OK } from '../Core/response.success.js';
import ProductService from '../services/product.service.js';
class ProductController {
    static async getProduct(res) {
        return new OK({ metadata: await ProductService.getProduct() }).send(res);
    }
}
export default ProductController;
