import Order from "./db/models/Order.js";
import OrderStatusLog from "./db/models/OrderStatusLog.js";
import { Op, Sequelize } from "sequelize";

export default {
  async findAllOrdersByCarrier(idCarrier) {
    return Order.findAll({
      where: {
        idCarrier: idCarrier,
        carrierTrackingCode: {
          [Op.ne]: "",
          [Op.not]: null,
        },
        [Op.or]: [
          { idStatus: { [Op.in]: [3, 4, 6, 7] } },
          {
            idOrder: {
              [Op.in]: OrderStatusLog.findAll({
                attributes: ["idOrder"],
                where: {
                  idStatus: [8, 10],
                  createdAt: {
                    [Op.gt]: Sequelize.literal(
                      "DATE_SUB(NOW(), INTERVAL 2 DAY)"
                    ),
                  },
                },
                raw: true,
              }),
            },
          },
        ],
      },
      limit: 10,
      raw: true,
    });
  },
};
