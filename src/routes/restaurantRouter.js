import express from 'express'
import { getFood, postToggleLikeDislike, getLikesByRestaurant, getLikesByUser, postRestaurantRating, getRestaurantRating, getUserRating } from '../controllers/resController.js'

const resRouter = express.Router()

resRouter.get("/get-food", getFood)
resRouter.post('/like-dislike', postToggleLikeDislike)
resRouter.get('/get-like-restaurant/:res_id', getLikesByRestaurant)
resRouter.get('/get-like-users/:user_id', getLikesByUser)

resRouter.post("/add-rate-restaurant", postRestaurantRating);

resRouter.get("/get-rate-restaurant/:res_id", getRestaurantRating);

resRouter.get("/get-rate-users/:user_id", getUserRating);

export default resRouter