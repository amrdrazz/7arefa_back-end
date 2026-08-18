const mongoose = require("mongoose");

const clashGameSchema = new mongoose.Schema({
    roomCode: {
        type: String,
        required: true,
        unique: true
    },

    players: {
        hostPlayer: String,
        guest: String
    },

    stat: {
        type: String,
    },

    rounds: [
        {
            roundNumber: Number,

            positions: [String],

            condition: {
                type: String,
            },

            choices: {
                host: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Player"
                },
                guest: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Player"
                },
            },

            winner: {
                type: String,
                enum: ["player1", "player2", "draw", null],
                default: null
            }
        }
    ],

    currentRound: {
        type: Number,
        default: 1
    },

    score: {
        host: {
            type: Number,
            default: 0
        },

        guest: {
            type: Number,
            default: 0
        }
    },

    status: {
        type: String,
        enum: ["waiting", "playing", "finished"],
        default: "waiting"
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("ClashGame", clashGameSchema);