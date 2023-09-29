const express = require("express")
const videoRoute = require("./video.route")
const shareRoute = require("./share.route")

const router = express.Router();

const defaultRouter = [
    {
        path: "/recordings",
        route: videoRoute,
    },
    {
        path: "/share",
        route: shareRoute,
    },
]

defaultRouter.forEach((route) => {
    router.use(route.path, route.route)
})

module.exports = router