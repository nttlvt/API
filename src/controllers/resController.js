import sequelize from "../models/connect.js";
import { response } from "../configs/response.js";
import initModels from "../models/init-models.js";
const model = initModels(sequelize);

const getFood = async (req, res) => {
    try {
        let data = await model.food.findAll();
        response(res, data, "Thành công", 200);
    } catch (error) {
        console.error("getFood:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

const postToggleLikeDislike = async (req, res) => {
    try {
        const { user_id, date_like, res_id } = req.body;

        const resExist = await model.restaurant.findOne({ where: { res_id } });
        if (!resExist) return res.status(400).json({ message: "Không tồn tại!" });

        const likeExist = await model.like_res.findOne({ where: { user_id, res_id } });

        if (likeExist) {
            await model.like_res.update(
                { dis_like: !likeExist.dis_like },
                { where: { like_res_id: likeExist.like_res_id } }
            );

            const data = await model.like_res.findOne({
                attributes: ["like_res_id", "date_like", "dis_like"],
                where: { like_res_id: likeExist.like_res_id },
                include: [{ model: model.restaurant, as: "re" }],
            });

            res.status(200).json({ message: likeExist.dis_like ? "Đã like" : "Đã Dislike" });
        } else {
            await model.like_res.create({ user_id, res_id, date_like });
            res.status(200).json({ message: "Đã like" });
        }
    } catch (error) {
        console.error("postToggleLikeDislike:", error);
        res.status(400).json({ message: "Xử lý không thành công" });
    }
};

const getLikesByRestaurant = async (req, res) => {
    try {
        const { res_id } = req.params;

        const resExist = await model.restaurant.findOne({ where: { res_id } });
        if (!resExist) return res.status(400).json({ message: "Không tồn tại" });

        const listLikeOfRes = await model.like_res.findAll({
            where: { res_id, dis_like: 0 },
            include: [
                {
                    model: model.user_restaurant,
                    as: "user",
                    attributes: { exclude: ["password"] },
                },
            ],
        });

        res.status(200).json({
            message: "Xử lý thành công",
            data: {
                ...resExist.dataValues,
                listLikeOfRes,
            },
        });
    } catch (error) {
        console.error("getLikesByRestaurant:", error);
        res.status(400).json({ message: "Xử lý thất bại" });
    }
};

const getLikesByUser = async (req, res) => {
    try {
        const { user_id } = req.params;

        const userExist = await model.user_restaurant.findOne({ where: { user_id } });
        if (!userExist) return res.status(400).json({ message: "User không tồn tại" });

        const likeOfUser = await model.like_res.findAll({
            where: { user_id, dis_like: 0 },
            include: [{ model: model.restaurant, as: "re" }],
        });

        res.status(200).json({
            message: "Xử lý thành công",
            data: {
                ...userExist.dataValues,
                likeOfUser,
            },
        });
    } catch (error) {
        console.error("getLikesByUser:", error);
        res.status(400).json({ message: "Xử lý không thành công" });
    }
};

const postRestaurantRating = async (req, res) => {
    try {
        const { user_id, date_rate, amount, res_id } = req.body;

        const resExist = await model.restaurant.findOne({ where: { res_id } });
        if (!resExist) return res.status(400).json({ message: "Không tồn tại" });

        const createRate = await model.rate_res.create({
            user_id,
            res_id,
            amount,
            date_rate,
        });

        const data = await model.rate_res.findOne({
            where: { rate_res_id: createRate.rate_res_id },
            include: [{ model: model.restaurant, as: "re" }],
        });

        res.status(200).json({
            message: "Xử lý thành công",
            data,
        });
    } catch (error) {
        console.error("postRestaurantRating:", error);
        res.status(400).json({ message: "Xử lý không thành công" });
    }
};

const getRestaurantRating = async (req, res) => {
    try {
        const { res_id } = req.params;

        const resExist = await model.restaurant.findOne({ where: { res_id } });
        if (!resExist) return res.status(400).json({ message: "Không tồn tại" });

        const listRateOfRes = await model.rate_res.findAll({
            where: { res_id },
            include: [
                {
                    model: model.user_restaurant,
                    as: "user",
                    attributes: { exclude: ["password"] },
                },
            ],
        });

        res.status(200).json({
            message: "getRestaurantRating",
            data: {
                ...resExist.dataValues,
                listRateOfRes,
            },
        });
    } catch (error) {
        console.error("getRestaurantRating:", error);
        res.status(400).json({ message: "Xử lý không thành công" });
    }
};

const getUserRating = async (req, res) => {
    try {
        const { user_id } = req.params;

        const userExist = await model.user_restaurant.findOne({
            attributes: { exclude: ["password"] },
            where: { user_id },
        });
        if (!userExist) return res.status(400).json({ message: "User không tồn tại" });

        const rateOfUser = await model.rate_res.findAll({
            where: { user_id },
            include: [{ model: model.restaurant, as: "re" }],
        });

        res.status(200).json({
            message: "Xử lý thành công",
            data: {
                ...userExist.dataValues,
                rateOfUser,
            },
        });
    } catch (error) {
        console.error("getUserRating:", error);
        res.status(400).json({ message: "Xử lý không thành công" });
    }
};

export {
    getFood,
    postToggleLikeDislike,
    getLikesByRestaurant,
    getLikesByUser,
    postRestaurantRating,
    getRestaurantRating,
    getUserRating,
};
