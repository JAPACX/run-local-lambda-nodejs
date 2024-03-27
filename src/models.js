import dao from "./dao.js";

export default {
  async findAllOrdersByCarrier(idCarrier) {
    return dao.findAllOrdersByCarrier(idCarrier);
  },
};
