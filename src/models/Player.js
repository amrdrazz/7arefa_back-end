const mongoose = require('mongoose')

const playerSchema = new mongoose.Schema(
  {
    fcId: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },

    rank: Number,
    name: String,
    gender: String,

    rating: {
      ovr: Number,
      pac: Number,
      sho: Number,
      pas: Number,
      dri: Number,
      def: Number,
      phy: Number,
    },

    position: String,
    weakFoot: Number,
    skillMoves: Number,
    preferredFoot: String,

    height: String,
    weight: String,
    age: Number,

    alternativePositions: [String],

    nation: String,
    league: String,
    team: String,

    playStyles: [String],

    eaUrl: String,
    cardUrl: String,

    // هنضيفها بعدين
    career: [
      {
        team: String,
        league: String,
        from: Number,
        to: Number,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Player", playerSchema);