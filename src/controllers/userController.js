import sequelize from "./../models/connect.js";
import initModels from "../models/init-models.js";

const model = initModels(sequelize);

const order = async (req, res) => {
    try {
        const { food_id } = req.params;
        const { user_id, amount, code, arr_sub_id } = req.body;

        const arr_sub_id_str = JSON.stringify(arr_sub_id);
        console.log("Request body:", req.body);

        const foodExist = await model.food.findOne({ where: { food_id } });
        if (!foodExist) {
            return res.status(400).json({ message: "Món ăn không tồn tại" });
        }

        const orderCreate = await model.order_restaurant.create({
            user_id,
            food_id: foodExist.food_id,
            amount,
            code,
            arr_sub_id: arr_sub_id_str,
        });

        const data = await model.order_restaurant.findOne({
            attributes: {
                exclude: ["user_id", "food_id"],
            },
            where: { orders_id: orderCreate.orders_id },
            include: [
                {
                    model: model.food,
                    as: "food",
                },
            ],
        });

        res.status(200).json({
            message: "Xử lý thành công",
            data,
        });
    } catch (error) {
        console.error("Order Error:", error);
        res.status(500).json({ message: "Xử lý không thành công" });
    }
};
export { order };