'use strict';
const { DataTypes } = require('sequelize');
// const { Articles } = require('.');

module.exports = (sequelize) => {
  return sequelize.define('Articles', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    content: { 
      type: DataTypes.JSON, 
      allowNull: false,
    },
    tags: {
      type: DataTypes.JSON, 
    },
    coverImage: {
      type: DataTypes.STRING,
    },
    publishedAt: {
      type: DataTypes.DATE,
    },
    //TODO : add hook to slugify based on the title pay attention unicity  
  });
};