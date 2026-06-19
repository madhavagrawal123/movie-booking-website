const Threatre = require("../models/theatre.model");
const Screen = require("../models/screen.model");
const Show = require("../models/show.model");
const ShowSeat = require("../models/availablityseat.model");
const mongoose = require("mongoose");

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
    try {
        const { theatreId } = req.params;   
        const theatre = await Threatre.findById(theatreId);
        if (!theatre) {
            return res.status(404).json({ message: "Theatre not found" });
        }
        if (theatre.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: "Access denied" });
        }
         await Threatre.findByIdAndDelete(theatreId);

        res.status(200).json({
            message: "Theatre deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
}

 
async function createScreen(req, res) {
    try {      
        console.log("Controller running");
console.log(req.theatre);  
       const {
        
        screenName,
        rows,
        seatsPerRow
    } = req.body;
    const { theatreId } = req.params;
    console.log(req.body);
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
    try {
        const { screenId } = req.params;
        const screen = await Screen.findById(screenId);
        if(!screen) {
            return res.status(404).json({
                message: "Screen not found"
            });
        }
        const screendel = await Screen.findByIdAndDelete(screenId);


        res.status(200).json({
            message: "Screen deleted successfully",
            screendel
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}




async function createShow(req, res) {

    try {
       console.log(req.body.movieId);
        const { theatreId, screenId } = req.params;

        const {
            movieId,
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
        console.log("BODY:", req.body);
console.log("PARAMS:", req.params);
        const { showId } = req.params;
        const { movieId, date, time } = req.body;
        const show = await Show.findById(showId);
        if(!show) {
            return res.status(404).json({
                message: "Show not found"
            });
        }
        show.tmdbMovieId = movieId || show.tmdbMovieId;
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
    try {
        const { showId } = req.params;
        const show = await Show.findById(showId);
        if(!show) {
            return res.status(404).json({
                message: "Show not found"
            });
        }
          await ShowSeat.deleteMany({showId})

        const showdel = await Show.findByIdAndDelete(showId);
      
        res.status(200).json({
            message: "Show deleted successfully",
            showdel
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}



module.exports = {
    createTheatre,
    updateTheatre,
    deleteTheatre,
    createScreen,
    updateScreen,
    deleteScreen,
    createShow,
    updateShow,
    deleteShow

};  

