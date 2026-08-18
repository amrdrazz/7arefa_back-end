const mongoose = require('mongoose')
const dotenv = require("dotenv").config();
const Player = require("../models/Player.js");
const nations = require("../data/nations.js");

const API_URL = process.env.API_URL;

const toNumber = (value) => {
  if (value === "" || value === null || value === undefined) {
    return null;
  }

  const number = Number(value);

  return Number.isNaN(number) ? null : number;
};

const normalizePlayer = (player) => {
  return {
    fcId: toNumber(player.ID),
    rank: toNumber(player.Rank),

    name: player.Name,
    gender: player.GENDER,

    rating: {
      ovr: toNumber(player.OVR),
      pac: toNumber(player.PAC),
      sho: toNumber(player.SHO),
      pas: toNumber(player.PAS),
      dri: toNumber(player.DRI),
      def: toNumber(player.DEF),
      phy: toNumber(player.PHY),
    },

    position: player.Position,

    weakFoot: toNumber(player["Weak foot"]),
    skillMoves: toNumber(player["Skill moves"]),
    preferredFoot: player["Preferred foot"],

    height: player.Height,
    weight: player.Weight,
    age: toNumber(player.Age),

    alternativePositions: player["Alternative positions"] || [],

    nation: player.Nation,
    league: player.League,
    team: player.Team,

    playStyles: player["play style"] || [],

    eaUrl: player.url,
    cardUrl: player.card,
  };
};

const importPlayers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected");

    let allPlayers = [];

    for (const nation of nations) {
      try {
        console.log(`Fetching ${nation}...`);

        const response = await fetch(
          `${API_URL}/nation/${encodeURIComponent(nation)}/M`
        );

        if (!response.ok) {
          console.log(
            `Failed ${nation}: ${response.status} ${response.statusText}`
          );

          continue;
        }

        const players = await response.json();

        console.log(`${nation}: ${players.length} players`);

        allPlayers.push(...players);
      } catch (error) {
        console.error(`Error fetching ${nation}:`, error.message);
      }
    }

    console.log(`Total fetched: ${allPlayers.length}`);

    // نحول الـAPI response للـschema بتاعنا
    const normalizedPlayers = allPlayers.map(normalizePlayer);

    // إزالة الـduplicates باستخدام FC ID
    const uniquePlayers = Array.from(
      new Map(
        normalizedPlayers.map((player) => [player.fcId, player])
      ).values()
    );

    console.log(`Unique players: ${uniquePlayers.length}`);

    console.log("Starting bulkWrite...");

    const result = await Player.bulkWrite(
      uniquePlayers.map((player) => ({
        updateOne: {
          filter: { fcId: player.fcId },
          update: { $set: player },
          upsert: true,
        },
      })),
      {
        ordered: false
      }
    );

    console.log("BulkWrite finished!");

    console.log("Matched:", result.matchedCount);
    console.log("Modified:", result.modifiedCount);
    console.log("Upserted:", result.upsertedCount);

    const count = await Player.countDocuments();

    console.log("Players in DB:", count);

    console.log("Players imported successfully!");

    await mongoose.disconnect();
  } catch (error) {
    console.error("Import error:", error);

    await mongoose.disconnect();
  }
};

importPlayers();