const jwt = require("jsonwebtoken");
const Theatre = require("../models/theatre.model");
const Show = require("../models/show.model")


async function auth(req, res, next) {
    try {

        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                message: "Please login first"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();

    } catch (error) {

        return res.status(401).json({
            message: "Invalid token"
        });

    }
}

function authorize(...roles) {

    return (req, res, next) => {

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: "Access denied"
            });
        }

        next();
    };
}

async function showOwnerCheck(req, res, next) {
    const { showId } = req.params;

    const show = await Show.findById(showId);

    if (!show) {
        return res.status(404).json({
            message: "Show not found"
        });
    }

    const theatre = await Theatre.findById(show.theatreId);

    if (theatre.owner.toString() !== req.user.id) {
        return res.status(403).json({
            message: "Access denied"
        });
    }

    req.show = show;
    next();
}

async function theatreOwnerCheck(req, res, next) {
    try {
    
        const { theatreId } = req.params;

        const theatre = await Theatre.findById(
            theatreId
        );

        if (!theatre) {
            return res.status(404).json({
                message: "Theatre not found"
            });
        }

        if (
            theatre.owner.toString() !==
            req.user.id
        ) {
            return res.status(403).json({
                message:
                "You do not own this theatre"
            });
        }

        req.theatre = theatre;

        next();

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
}



module.exports = {
    auth,
    authorize,
    theatreOwnerCheck,  
      showOwnerCheck,
};