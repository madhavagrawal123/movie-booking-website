const Threatre = require("../models/theatre.model");
const Screen = require("../models/screen.model");
const Show = require("../models/show.model");
const ShowSeat = require("../models/availablityseat.model");
const mongoose = require("mongoose");


async function getMyTheatres(req, res) {
    try {
        const theatres = await Threatre.find({
            owner: req.user.id
        });

        res.status(200).json(theatres);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}
async function getTheatreById(req, res) {
    try {

        const { theatreId } = req.params;

        const theatre = await Threatre.findById(theatreId);

        if (!theatre) {
            return res.status(404).json({
                message: "Theatre not found"
            });
        }

        const screens = await Screen.find({ theatreId });

        res.status(200).json({
            theatre,
            screens
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
}
async function getScreens(req, res) {
  try {
    const { theatreId } = req.params;

    const screens = await Screen.find({
        theatreId
    });

    res.json(screens);}
    catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}
async function getShows(req, res) {
    try{
    const { screenId } = req.params;    

    const shows = await Show.find({
        screenId
    });
    if (!screen) {
    return res.status(404).json({
        message: "Screen not found"
    });
}

if (screen.theatre.owner.toString() !== req.user.id) {
    return res.status(403).json({
        message: "Access denied"
    });
}
    res.json(shows);
} catch(error){
     res.status(500).json({
            message: error.message
        });
}
}

async function createTheatre(req, res) {
    try {
        const { name, city, address } = req.body;
        if (!name || !city || !address) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const duplicateTheatre = await Threatre.findOne({name,city,address});
        if(duplicateTheatre) {
            return res.status(400).json({ message: "Theatre already exists" });
        }
        const theatre = await Threatre.create({
            name,
            city,
            address,
            owner: req.user.id
        });
        res.status(201).json({
            message: "Theatre created successfully",
            theatre
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }

}
async function updateTheatre(req, res) {
    try {
        const { theatreId } = req.params;
        const { name, city, address } = req.body;
        const theatre = await Threatre.findById(theatreId);
        if (!theatre) {
            return res.status(404).json({ message: "Theatre not found" });
        }
        if (theatre.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: "Access denied" });
        }
        theatre.name = name || theatre.name;
        theatre.city = city || theatre.city;
        theatre.address = address || theatre.address;
        await theatre.save();
        res.status(200).json({
            message: "Theatre updated successfully",
            theatre
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}
async function deleteTheatre(req, res) {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const { theatreId } = req.params;

        const theatre = await Threatre.findById(theatreId).session(session);

        if (!theatre) {
            await session.abortTransaction();
            session.endSession();

            return res.status(404).json({
                message: "Theatre not found"
            });
        }

        if (theatre.owner.toString() !== req.user.id) {
            await session.abortTransaction();
            session.endSession();

            return res.status(403).json({
                message: "Access denied"
            });
        }

        // Get all screens
        const screens = await Screen.find({
            theatre: theatreId
        }).session(session);

        const screenIds = screens.map(screen => screen._id);

        // Get all shows
        const shows = await Show.find({
            screen: { $in: screenIds }
        }).session(session);

        const showIds = shows.map(show => show._id);

        // Delete ShowSeats
        await ShowSeat.deleteMany({
            show: { $in: showIds }
        }).session(session);

        // Delete Shows
        await Show.deleteMany({
            screen: { $in: screenIds }
        }).session(session);

        // Delete Screens
        await Screen.deleteMany({
            theatre: theatreId
        }).session(session);

        // Delete Theatre
        await Threatre.findByIdAndDelete(theatreId).session(session);

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({
            message: "Theatre and all related data deleted successfully"
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        res.status(500).json({
            message: error.message
        });
    }
}

 
async function createScreen(req, res) {
    try {      
         
       const {
        
        screenName,
        rows,
        seatsPerRow
    } = req.body;
    const { theatreId } = req.params;
    const existingScreen = await Screen.findOne({
    theatreId,
    screenName,
});

if (existingScreen) {
    return res.status(400).json({
        message: "Screen already exists in this theatre",
    });
}
    if (!screenName || !rows || !seatsPerRow) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }
    const seats = [];
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < seatsPerRow; j++) {
            seats.push({
                seatNumber: `${String.fromCharCode(65 + i)}${j + 1}`,
                type: "NORMAL"
            });
        }}
        const screen = await Screen.create({
            theatreId,
            screenName,
            rows,
            seatsPerRow,
            seats
        });
        res.status(201).json({
            message: "Screen created successfully",
            screen
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
        


    
}
async function updateScreen(req, res) {
    try {
        const { screenId } = req.params;
        const { screenName, rows, seatsPerRow } = req.body;
        const screen = await Screen.findById(screenId);
        if(!screen) {
            return res.status(404).json({
                message: "Screen not found"
            });
        };

   
      screen.screenName = screenName || screen.screenName;
      screen.rows = rows || screen.rows;
      screen.seatsPerRow = seatsPerRow || screen.seatsPerRow;   
        await screen.save();
        res.status(200).json({
            message: "Screen updated successfully",
            screen
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}
async function deleteScreen(req, res) {
    const session = await mongoose.startSession();

    try {
        const { screenId } = req.params;

        await session.withTransaction(async () => {

            const screen = await Screen.findById(screenId).session(session);

            if (!screen) {
                throw new Error("Screen not found");
            }

            // Get all shows of this screen
            const shows = await Show.find({
                screen: screenId
            }).session(session);

            const showIds = shows.map(show => show._id);

            // Delete all ShowSeats
            await ShowSeat.deleteMany({
                show: { $in: showIds }
            }).session(session);

            // Delete all Shows
            await Show.deleteMany({
                screen: screenId
            }).session(session);

            // Delete Screen
            await Screen.findByIdAndDelete(screenId).session(session);
        });

        res.status(200).json({
            message: "Screen and all related data deleted successfully"
        });

    } catch (error) {

        if (error.message === "Screen not found") {
            return res.status(404).json({
                message: error.message
            });
        }

        res.status(500).json({
            message: error.message
        });

    } finally {
        session.endSession();
    }
}




async function createShow(req, res) {

    try {
       console.log(req.body.movieId);
        const { theatreId, screenId } = req.params;

       const {
    movieId,
    movieTitle,
    posterPath,
    backdropPath,
    date,
    time
} = req.body;
       
        const screen = await Screen.findOne({
            _id: screenId,
            theatreId
        });

        if (!screen) {
            return res.status(404).json({
                message:
                "Screen not found in this theatre"
            });
        }


      const show = await Show.create({
    tmdbMovieId: movieId,
    movieTitle,
    posterPath,
    backdropPath,
    theatreId,
    screenId,
    showDate: date,
    showTime: time
});

        const seats = screen.seats.map(
            seat => ({
                showId: show._id,
                seatNumber: seat.seatNumber,
                status: "available"
            })
        );

        await ShowSeat.insertMany(seats);

        res.status(201).json({
            message:
            "Show created successfully",
            show
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
}
async function updateShow(req, res) {
    try{
       
        const { showId } = req.params;
       const {
    movieId,
    movieTitle,
    posterPath,
    backdropPath,
    date,
    time
} = req.body;
        const show = await Show.findById(showId);
        if(!show) {
            return res.status(404).json({
                message: "Show not found"
            });
        }
        show.tmdbMovieId = movieId || show.tmdbMovieId;
show.movieTitle = movieTitle || show.movieTitle;
show.posterPath = posterPath || show.posterPath;
show.backdropPath = backdropPath || show.backdropPath;
show.showDate = date || show.showDate;
show.showTime = time || show.showTime;
        await show.save();
        res.status(200).json({
            message: "Show updated successfully",
            show
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}
async function deleteShow(req, res) {
    const session = await mongoose.startSession();

    try {
        const { showId } = req.params;

        await session.withTransaction(async () => {

            const show = await Show.findById(showId).session(session);

            if (!show) {
                throw new Error("Show not found");
            }

            // Delete all seats for this show
            await ShowSeat.deleteMany({
                show: showId
            }).session(session);

            // Delete the show
            await Show.findByIdAndDelete(showId).session(session);
        });

        res.status(200).json({
            message: "Show and all related data deleted successfully"
        });

    } catch (error) {

        if (error.message === "Show not found") {
            return res.status(404).json({
                message: error.message
            });
        }

        res.status(500).json({
            message: error.message
        });

    } finally {
        session.endSession();
    }
}
const getScreenById = async (req, res) => {
    try {
        const { screenId } = req.params;

        const screen = await Screen.findById(screenId)
            .populate("theatreId");

        if (!screen) {
            return res.status(404).json({
                success: false,
                message: "Screen not found"
            });
        }

        res.status(200).json({
            success: true,
            screen
        });

    } catch (error) {
        console.error("Error fetching screen:", error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
module.exports = {
    getMyTheatres,
    getScreens,
    getShows,
    createTheatre,
    updateTheatre,
    deleteTheatre,
    createScreen,
    updateScreen,
    deleteScreen,
    createShow,
    updateShow,
    deleteShow,
    getTheatreById,
    getScreenById

};  

